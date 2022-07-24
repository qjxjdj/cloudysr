import { HttpServer } from "./https/http";
import { NetworkManager } from "./network/network";
import { Logger } from "./utils/log";

new HttpServer();
new NetworkManager();

Logger.log("CloudyPS | Build: HSR-ALPHA | " + new Date().toLocaleString());
Logger.log("Finished. Made with love by timing");