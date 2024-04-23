"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiYamlConfigUtil = void 0;
const yaml_1 = __importDefault(require("yaml"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const deepmerge_1 = __importDefault(require("deepmerge"));
class DiYamlConfigUtil {
    loadAndParseConfigSync(pathToFile) {
        let config = yaml_1.default.parse(node_fs_1.default.readFileSync(node_path_1.default.resolve(pathToFile), "utf-8"));
        if (config.extends) {
            config = this._extend(config, String(pathToFile));
        }
        return config;
    }
    _extend(config, filePath) {
        if (config.extends) {
            if (typeof config.extends !== "string" && !(config.extends instanceof Array)) {
                throw new Error("invalid format given for extend");
            }
            let __extends = [];
            if (typeof config.extends === "string")
                __extends.push(config.extends);
            if (config.extends instanceof Array)
                __extends = config.extends;
            for (const _path of __extends) {
                const _pathResolved = node_path_1.default.resolve(`${node_path_1.default.dirname(filePath)}/${_path}`).replace(/\\/g, "/");
                config = (0, deepmerge_1.default)(this.loadAndParseConfigSync(_pathResolved), config);
            }
        }
        return config;
    }
    dumpConfigToPathSync(config, pathToFile) {
        const obj = {
            items: []
        };
        for (const entry of config.values()) {
            const entryClean = {
                id: entry.id,
                setup: entry.setup,
                singleton: entry.singleton,
                lazy: entry.lazy,
                args: [],
                requires: entry.requires,
            };
            obj.items.push(entryClean);
        }
        node_fs_1.default.writeFileSync(pathToFile, yaml_1.default.stringify(obj));
    }
}
exports.DiYamlConfigUtil = DiYamlConfigUtil;
