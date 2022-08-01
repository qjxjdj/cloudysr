import { GetAuthkeyCsReq, GetAuthkeyScRsp, GetBasicInfoCsReq, GetBasicInfoScRsp, PlayerKeepAliveNotify, PlayerLogoutCsReq, SyncTimeCsReq, SyncTimeScRsp } from "../../resources/autogenerated/cs.player";
import { GetSpringRecoverDataCsReq, GetSpringRecoverDataScRsp, HealPoolInfo, SpringRecoverConfig } from "../../resources/autogenerated/cs.scene";
import { PacketContext, RouteManager } from "../network/route";
import { Logger } from "../utils/log";

export class PlayerHandler{
    constructor(routeManager: RouteManager){
        routeManager.on(GetSpringRecoverDataCsReq, this.GetSpringRecoverDataCsReq);
        routeManager.on(GetBasicInfoCsReq, this.GetBasicInfoCsReq);
        routeManager.on(SyncTimeCsReq, this.SyncTimeCsReq);
        routeManager.on(PlayerKeepAliveNotify, this.PlayerKeepAliveNotify);
        routeManager.on(PlayerLogoutCsReq, this.PlayerLogoutCsReq);
        routeManager.on(GetAuthkeyCsReq, this.GetAuthkeyCsReq);
    }

    public GetAuthkeyCsReq(context: PacketContext<GetAuthkeyCsReq>){
        const rsp = GetAuthkeyScRsp.create();
        rsp.retcode = 0;
        context.send(GetAuthkeyScRsp, rsp);
    }

    public PlayerLogoutCsReq(context: PacketContext<PlayerLogoutCsReq>){
        const address = context.client.address;
        context.client.clientManager.remove(address);
        Logger.log("Disconnect connection from " + address.address + ":" + address.port);
    }

    public PlayerKeepAliveNotify(context: PacketContext<PlayerKeepAliveNotify>){
        context.send(PlayerKeepAliveNotify, context.request);
    }

    private GetBasicInfoCsReq(context: PacketContext<GetBasicInfoCsReq>){
        const rsp = GetBasicInfoScRsp.create();
        rsp.retcode = 0;
        rsp.weekCocoonFinishedCount = 0;
        rsp.curDay = 1;
        rsp.exchangeTimes = 20000;
        rsp.nextRecoverTime = 20000;
        context.send(GetBasicInfoScRsp, rsp);
    }
    
    public GetSpringRecoverDataCsReq(context: PacketContext<GetSpringRecoverDataCsReq>){
        const rsp = GetSpringRecoverDataScRsp.create();
        rsp.retcode = 0;
        rsp.springRecoverConfig = SpringRecoverConfig.create({
            autoRecoverHp: true,
            avatarPresetHpList: [],
            defaultHp: 100
        });

        rsp.healPoolInfo = HealPoolInfo.create({
            healPool: 10000,
            refreshTime: 20000
        });

        context.send(GetSpringRecoverDataScRsp, rsp);
    }

    public SyncTimeCsReq(context: PacketContext<SyncTimeCsReq>){
        const rsp = SyncTimeScRsp.create();
        rsp.retcode = 0;
        rsp.clientTimeMs = context.request.clientTimeMs!;
        rsp.serverTimeMs = BigInt(Date.now());
        context.send(SyncTimeScRsp, rsp);
    }

}