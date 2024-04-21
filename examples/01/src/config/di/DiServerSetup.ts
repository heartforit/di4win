import http from "node:http";
import express from "express";
import {Logger} from "winston";

export default async function (
    logger: Logger
) {

    const app = express();
    const server = http.createServer(app);
    app.enable("trust proxy")
    app.set("etag", process.env.NODE_ENV !== "prod");
    app.disable("x-powered-by")

    app.get("*", (req, res) => {
        res.send("this is an example application to show the functionality of the di container")
    });

    return server;
}