import http from "http";
import {diService} from "./DiService";
import winston from "winston";
import SomeClass from "./src/SomeClass";

// Can be used to test different config setups
// process.env.NODE_ENV = "prod";

(async  () => {
    await diService.init();
    const server = <http.Server>await diService.diContainer.get("server");
    const store = diService.diContainer.getStore()
    const logger = <winston.Logger>await diService.diContainer.get("logger");

    server.listen(store.server.http.port, () => {
        logger.debug(`listening on *:${store.server.http.port}`);
    });

    const someClass = <SomeClass>await diService.diContainer.get("someClass");
    console.log(someClass)
    const CommonJsLegacyClass : any = await diService.diContainer.get("CommonJsLegacyClass");
    console.log(CommonJsLegacyClass)
})()