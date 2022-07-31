import fastify from "fastify";
import { readFileSync } from "fs";
import path from "path";
import { Logger } from "../utils/log";
import accountController from "./controllers/accountController";
import dispatchController from "./controllers/dispatchController";
import hkrpgController from "./controllers/hkrpgController";
import indexController from "./controllers/indexController";

export class HttpServer{

    readonly https;

    constructor(){
        const certPath = path.join(__dirname, "..", "..", "resources", "cert");
        this.https = fastify(
            {
                http2: true,
                https: {
                    allowHTTP1: true,
                    key: readFileSync(path.join(certPath, '.key')),
                    cert: readFileSync(path.join(certPath, '.cert'))
                }
            }
        );
        this.https.register(dispatchController);
        this.https.register(indexController);
        this.https.register(hkrpgController);
        this.https.register(accountController);
        this.https.setErrorHandler(function (error, request, reply) {
            console.log(error)
        })

        this.https.listen({
            port: 443,
        });
        
        Logger.log("Dispatch initialized.");
    }
}

