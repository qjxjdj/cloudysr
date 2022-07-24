import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function accountController(fastify: FastifyInstance) {
    fastify.post("/account/risky/api/check", async (request, reply) => {
        reply.code(200).send(JSON.stringify({
            retcode: 0,
            message: "OK",
            data: {
                "id": "",
                "action": "ACTION_NONE",
                "geetest": null
            }
        }));
    });

    fastify.get("/hkrpg_global/combo/granter/login/beforeVerify", async (request, reply) => {
        reply.code(200).send(JSON.stringify({
            retcode: 0,
            message: "OK",
            data: {
                is_heartbeat_required: false,
                is_realname_required: false,
                is_guardian_required: false
            }
        }));
    });
    
    fastify.post("/hkrpg_global/combo/granter/login/v2/login", async (request, reply) => {
        reply.code(200).send(JSON.stringify({
            retcode: 0,
            message: "OK",
            data: {
                combo_id: 1,
                open_id: 1,
                combo_token: "580729acc024f02927c94ab18a88bf171c40e0fc",
                data: {
                    guest: false
                },
                heartbeat: false,
                account_type: 1
            }
        }));
    });

    fastify.post("/hkrpg_global/mdk/shield/api/login", getSimpleAccountResponse);
    fastify.post("/hkrpg_global/mdk/shield/api/verify", getSimpleAccountResponse);

    fastify.get("/hkrpg_global/mdk/agreement/api/getAgreementInfos", async (request, reply) => {
        reply.code(200).send(JSON.stringify({
            marketing_agreements: []
        }));
    });
}

async function getSimpleAccountResponse(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    reply.code(200).send(JSON.stringify({
        retcode: 0,
        message: "OK",
        data: {
            account: {
                uid: "1",
                name: "Cloudy | ✧",
                email: "Cloudy | ✧",
                mobile: "",
                is_email_verify: 0,
                realname: "",
                identity_card: "",
                token: "",
                safe_mobile: "",
                facebook_name: "",
                google_name: "",
                twitter_name: "",
                game_center_name: "",
                apple_name: "",
                sony_name: "",
                tap_name: "",
                country: "VN",
                reactivate_ticket: "",
                area_code: "**"
            }
        },
        device_grant_required: false,
        safe_moblie_required: false,
        realperson_required: false,
        reactivate_required: false,
        realname_operation: ""
    }));
}