"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const express_1 = __importDefault(require("express"));
async function default_1(logger) {
    const app = (0, express_1.default)();
    const server = node_http_1.default.createServer(app);
    app.enable("trust proxy");
    app.set("etag", process.env.NODE_ENV !== "prod");
    app.disable("x-powered-by");
    app.get("*", (req, res) => {
        res.send("this is an example application to show the functionality of the di container");
    });
    return server;
}
exports.default = default_1;
