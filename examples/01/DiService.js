"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.diService = exports.DiService = void 0;
const DiContainer_1 = __importDefault(require("../../DiContainer"));
const DiYamlConfigUtil_1 = require("./DiYamlConfigUtil");
const glob_1 = require("glob");
const LoggingService_1 = require("./src/config/di/LoggingService");
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "default";
}
const DEBUG_DI_CONTAINER = false;
class DiService {
    constructor() {
        this._diContainer = new DiContainer_1.default({
            dependencyResolveStrategy: 0,
            fileResolver: async (path, options) => {
                return (0, glob_1.glob)(path, options);
            },
            debug: DEBUG_DI_CONTAINER,
            emitDependencies: false
        });
        if (DEBUG_DI_CONTAINER) {
            this._diContainer.on("onLog", (logLevel, message) => {
                LoggingService_1.logger.debug(message);
            });
        }
    }
    async init() {
        await this._diContainer.init(new DiYamlConfigUtil_1.DiYamlConfigUtil().loadAndParseConfigSync(`./config/${process.env.NODE_ENV}/di-container.yml`));
    }
    async dump() {
    }
    get diContainer() {
        return this._diContainer;
    }
}
exports.DiService = DiService;
const diService = new DiService();
exports.diService = diService;
