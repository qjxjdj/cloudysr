import fastify from "fastify";
import { readFileSync } from "fs";
import path from "path";
import { Logger } from "../utils/log";
import accountController from "./controllers/accountController";
import dispatchController from "./controllers/dispatchController";
import hkrpgController from "./controllers/hkrpgController";
import indexController from "./controllers/indexController";

export class HttpServer{

    readonly http;

    constructor(){
        const certPath = path.join(__dirname, "..", "..", "resources", "cert");
        this.http = fastify(
            {
                http2: true,
                https: {
                    allowHTTP1: true,
                    key: readFileSync(path.join(certPath, '.key')),
                    cert: readFileSync(path.join(certPath, '.cert'))
                }
            }
        );
        this.http.register(dispatchController);
        this.http.register(indexController);
        this.http.register(hkrpgController);
        this.http.register(accountController);

        this.http.setErrorHandler(function (error, request, reply) {
            console.log(error)
        })
        this.http.listen({
            port: 443,
        });
        Logger.log("Dispatch initialized.");
    }
}

