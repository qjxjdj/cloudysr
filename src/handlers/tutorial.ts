import { GetTutorialCsReq, GetTutorialGuideCsReq, GetTutorialGuideScRsp, GetTutorialScRsp, Tutorial, TutorialGuide, UnlockTutorialCsReq } from "../../resources/autogenerated/cs.tutorial";
import { PacketContext, RouteManager } from "../network/route";

export class TutorialHandler{
    constructor(routeManager: RouteManager){
        routeManager.on(GetTutorialCsReq, this.GetTutorialCsReq);
        routeManager.on(GetTutorialGuideCsReq, this.GetTutorialGuideCsReq);
        routeManager.on(UnlockTutorialCsReq, this.UnlockTutorialCsReq);
    }

    public UnlockTutorialCsReq(context: PacketContext<UnlockTutorialCsReq>){
        const rsp = GetTutorialScRsp.create();
        rsp.retcode = 0;
        rsp.tutorialList = [];
        context.send(GetTutorialScRsp, rsp);
    }

    public GetTutorialGuideCsReq(context: PacketContext<GetTutorialGuideCsReq>){
        const rsp = GetTutorialGuideScRsp.create();
        rsp.retcode = 0;
        rsp.tutorialGuideList = [
            TutorialGuide.create({
                id: 5005,
                status: 0
            }),
            TutorialGuide.create({
                id: 5006,
                status: 0,

            }),
        ];
        context.send(GetTutorialGuideScRsp, rsp);
    }
    
    public GetTutorialCsReq(context: PacketContext<GetTutorialCsReq>){
        const rsp = GetTutorialScRsp.create();
        rsp.retcode = 0;
        rsp.tutorialList = [
            Tutorial.create({
                id: 5005,
                status: 0
            }),
            Tutorial.create({
                id: 5006,
                status: 0
            })
        ]
        context.send(GetTutorialScRsp, rsp);
    }
}