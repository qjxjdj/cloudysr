import { MessageType, PartialMessage } from "@protobuf-ts/runtime";
import { PacketIds } from "../../resources/ids";
import { Logger } from "../utils/log";
import { Client } from "./client";
import { DataPacket } from "./packet";

type Route<T extends object> = {
    type: MessageType<T>,
    handlers: PacketHandler<T>[];
};

export type PacketHandler<T extends object> = (context: PacketContext<T>) => Promise<void> | void;

export class PacketContext<T extends object>{
    constructor(readonly request: PartialMessage<T>, readonly client: Client){}

    public send<T extends object>(type: MessageType<T>, message: PartialMessage<T>){
        this.client.sendPacket(type, message);
    }
}

export class RouteManager{
    public readonly routes: Map<string, Route<any>> = new Map<string, Route<any>>();
    public on<T extends object>(type: MessageType<T>, handler: PacketHandler<T>): void{
        const route = this.routes.get(type.typeName);
        if(route){
            route.handlers.push(handler)
        }else{
            this.routes.set(type.typeName, {
                type: type,
                handlers: [ handler ]
            })
        }
    }

    public handle(client: Client, packet: DataPacket){
        const route = this.routes.get("proto." + PacketIds[packet.id]); //fast workaround
        if(!route){
            Logger.warn("Unable to process packet" + PacketIds[packet.id] ?? "unknown");
            return;
        }
        Logger.log("Handling packet with ID: " + PacketIds[packet.id]);
        route.handlers.forEach(handler => {
            handler(new PacketContext(route.type.fromBinary(packet.data), client));
        });
    }
}