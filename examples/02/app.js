"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoggingService_1 = require("../01/src/config/di/LoggingService");
const DiContainer_1 = __importDefault(require("../../DiContainer"));
const glob_1 = require("glob");
(async () => {
    const DEBUG_DI_CONTAINER = true;
    const exampleConfig = {
        store: {
            "key": "value"
        },
        options: {
            searchPaths: [{
                    "path": "src/domain/**/*.js",
                    "options": {
                        "ignore": "**/index.js"
                    }
                }]
        },
        items: []
    };
    const diContainer = new DiContainer_1.default({
        dependencyResolveStrategy: 0,
        fileResolver: async (path, options) => {
            return (0, glob_1.glob)(path, options);
        },
        debug: DEBUG_DI_CONTAINER,
        emitDependencies: false
    });
    if (DEBUG_DI_CONTAINER) {
        diContainer.on("onLog", (logObject) => {
            LoggingService_1.logger.debug(logObject.message);
        });
    }
    await diContainer.init(exampleConfig);
    const someClass = await diContainer.get("someClass");
    someClass.sayHello();
})();
