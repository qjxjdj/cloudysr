import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function indexController(fastify: FastifyInstance) {
    fastify.get("/", defaultResponse);
    fastify.get("/favicon.ico", defaultResponse);
}

async function defaultResponse(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    reply
    .type("image/x-icon")
    .code(200)
    .send("")
}