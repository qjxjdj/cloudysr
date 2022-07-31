import { FastifyInstance, FastifyRequest } from "fastify";
import { Logger } from "../../utils/log";

type DataUploadRequest = FastifyRequest<{
    Body: Log[];
}>

type Log = {
    uploadContent: {
        LogStr: string;
        LogType: string;
        StackTrace: string;
    }
}

export default async function hkrpgController(fastify: FastifyInstance) {
    fastify.post("/hkrpg_global/combo/granter/api/compareProtocolVersion", async (request, reply) => {
        reply.code(200).send(JSON.stringify({
            "retcode": 0,
            "message": "OK",
            "data": {
                "modified": true,
                "protocol": {
                    "id": 0,
                    "app_id": 11,
                    "language": "en",
                    "user_proto": "",
                    "priv_proto": "",
                    "major": 1,
                    "minimum": 2,
                    "create_time": "0",
                    "teenager_proto": "",
                    "third_proto": ""
                }
            }
        }));
    });

    fastify.get("/combo/box/api/config/sdk/combo", async (request, reply) => {
        reply.code(200).send(JSON.stringify({
            "data": null,
            "message": "RetCode_NoConfig",
            "retcode": 7
        }
        ));
    });

    fastify.get("/admin/mi18n/plat_oversea/m2020030410/m2020030410-version.json", async (request, reply) => {
        reply.code(200).send(JSON.stringify({
            version: 65
        }));
    });

    fastify.get("/hkrpg_global/combo/granter/api/getConfig", async (request, reply) => {
        reply.code(200).send(JSON.stringify({
            "retcode": 0,
            "message": "OK",
            "data": {
                "protocol": true,
                "qr_enabled": false,
                "log_level": "INFO",
                "announce_url": "https://sdk.hoyoverse.com/hkrpg/announcement/index.html?sdk_presentation_style=fullscreen&sdk_screen_transparent=true&auth_appid=announcement&authkey_ver=1&sign_type=2#/",
                "push_alias_type": 0,
                "disable_ysdk_guard": false,
                "enable_announce_pic_popup": true
            }
        }));
    });

    fastify.get("/hkrpg_global/mdk/shield/api/loadConfig", async (request, reply) => {
        reply.code(200).send(JSON.stringify({
            "retcode": 0,
            "message": "OK",
            "data": {
                "id": 24,
                "game_key": "hkrpg_global",
                "client": "PC",
                "identity": "I_IDENTITY",
                "guest": false,
                "ignore_versions": "",
                "scene": "S_NORMAL",
                "name": "崩坏RPG",
                "disable_regist": false,
                "enable_email_captcha": false,
                "thirdparty": [],
                "disable_mmt": false,
                "server_guest": true,
                "thirdparty_ignore": {
                    "fb": "",
                    "tw": ""
                },
                "enable_ps_bind_account": false,
                "thirdparty_login_configs": {}
            }
        }));
    })
    fastify.post("/hkrpg/dataUpload", async (request: DataUploadRequest, reply) => {
        for(const log of request.body){
            switch(log.uploadContent.LogType){
                case "Warning":
                    Logger.warn(log.uploadContent.LogStr + "\n\nStacktrace: " + log.uploadContent.StackTrace);
                    break;
                case "Error":
                    Logger.error(log.uploadContent.LogStr + "\n\nStacktrace: " + log.uploadContent.StackTrace);
                    break;
                default:
                    Logger.log(log.uploadContent.LogStr + "\n\nStacktrace: " + log.uploadContent.StackTrace);
                    break;
            }
        }
        reply.code(200).send(JSON.stringify({ code: 0 }));
    });
}
