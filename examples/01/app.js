"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DiService_1 = require("./DiService");
(async () => {
    await DiService_1.diService.init();
    const server = await DiService_1.diService.diContainer.get("server");
    const store = DiService_1.diService.diContainer.getStore();
    const logger = await DiService_1.diService.diContainer.get("logger");
    server.listen(store.server.http.port, () => {
        logger.debug(`listening on *:${store.server.http.port}`);
    });
})();
