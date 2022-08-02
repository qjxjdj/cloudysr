import Denque from "denque";
import { createSocket, RemoteInfo } from "dgram";
import { ActivityHandler } from "../handlers/activity";
import { AuthHandler } from "../handlers/auth";
import { ChallengeHandler } from "../handlers/challenge";
import { ExpeditionHandler } from "../handlers/expedition";
import { GachaHandler } from "../handlers/gacha";
import { AvatarHandler } from "../handlers/avatar";
import { InventoryHandler } from "../handlers/inventory";
import { MailHandler } from "../handlers/mail";
import { MissionHandler } from "../handlers/mission";
import { NpcHandler } from "../handlers/npc";
import { PlayerHandler } from "../handlers/player";
import { PrestigeHandler } from "../handlers/prestige";
import { RewardHandler } from "../handlers/reward";
import { RogueHandler } from "../handlers/rogue";
import { SceneHandler } from "../handlers/scene";
import { ShopHandler } from "../handlers/shop";
import { Logger } from "../utils/log";
import { MT19937_64 } from "../utils/mt";
import { ClientManager } from "./client";
import { Connect, Disconnect, Establish, HandshakePacket } from "./packet";
import { RouteManager } from "./route";

interface UdpData{
    data: Buffer,
    address: AddressInfo
}

export interface AddressInfo{
    address: string,
    port: number
}

export class NetworkManager{
    
    readonly socket;

    public recvQueue: Denque<UdpData> = new Denque<UdpData>();
    public readonly clientManager = new ClientManager(this);
    public readonly routeManager = new RouteManager();

    readonly sharedBuffer: Buffer;

    readonly random: MT19937_64 = new MT19937_64();

    constructor(){
        this.sharedBuffer = Buffer.alloc(0x20000);
        this.socket = createSocket('udp4');
        this.socket.on('message', this.onReceived.bind(this));
        this.socket.on('listening', () => {
            this.scheduleQueue();
            Logger.log("Network initialized.");
        });

        this.socket.bind(23301);
        this.registeringRoutes();
        setInterval(() => {
            this.clientManager.clients.forEach((client) => {
                if(client.kcp.isDeadLink()){
                    this.clientManager.remove(client.address);
                }else{
                    client.kcp.update(Date.now());
                }
            });
        }, 10)
    }

    public registeringRoutes(){
        new ActivityHandler(this.routeManager);
        new RogueHandler(this.routeManager);
        new AuthHandler(this.routeManager);
        new ChallengeHandler(this.routeManager);
        new ExpeditionHandler(this.routeManager);
        new AvatarHandler(this.routeManager);
        new InventoryHandler(this.routeManager)
        new MailHandler(this.routeManager);
        new MissionHandler(this.routeManager);
        new NpcHandler(this.routeManager);
        new PlayerHandler(this.routeManager);
        new PrestigeHandler(this.routeManager);
        new RewardHandler(this.routeManager);
        new SceneHandler(this.routeManager);
        new ShopHandler(this.routeManager);
        new GachaHandler(this.routeManager);
    }

    onReceived(message: Buffer, remoteInfo: RemoteInfo){
        this.recvQueue.push({
            data: message,
            address: {
                address: remoteInfo.address,
                port: remoteInfo.port
            }
        })
    }

    scheduleQueue(){
        while(this.recvQueue.length > 0){
            const { data, address } = this.recvQueue.shift()!;
            const handshake = HandshakePacket.decode(data);
            if(handshake instanceof Connect){
                Logger.log("Received connection from " + address.address + ":" + address.port);
                this.clientManager.add(address, 0x96969696, 0x42424242);
                this.send(new Establish(0x96969696, 0x42424242).encode(), address);
            }else{
                const client = this.clientManager.get(address);
                if(!client){
                    this.send(new Disconnect().encode(), address);
                }else{
                    const read = client.kcp.input(data);
                    if(read < 0){
                        Logger.log("Error reading from client " + address.address + ":" + address.port);
                        return;
                    }
                    for(const packet of client.recv())
                    {
                        this.routeManager.handle(client, packet);
                    }
                }
            }
        }
        setImmediate(this.scheduleQueue.bind(this));
    }

    send(data: Buffer, address: AddressInfo){
        this.socket.send(data, address.port, address.address);
    }
}