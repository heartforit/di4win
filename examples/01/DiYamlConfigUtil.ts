import yaml from "yaml";
import fs from "node:fs";
import path from "node:path";
import merge from "deepmerge";
import {DiContainerDependencyDescriptor} from "../../interfaces/DiContainerDependencyDescriptor";
import {DiContainerInitConfig} from "../../interfaces/DiContainerInitConfig";

export class DiYamlConfigUtil {
    loadAndParseConfigSync(pathToFile: string) {
        let config = yaml.parse(fs.readFileSync(path.resolve(pathToFile), "utf-8")) as DiContainerInitConfig & {extends: string | string[]}
        if (config.extends) {
            config = this._extend(config, String(pathToFile))
        }

        return config
    }

    private _extend(config: any, filePath: string) {
        if (config.extends) {
            if (typeof config.extends !== "string" && !(config.extends instanceof Array)) {
                throw new Error("invalid format given for extend")
            }
            let __extends = []
            if (typeof config.extends === "string") __extends.push(config.extends)
            if (config.extends instanceof Array) __extends = config.extends

            for (const _path of __extends) {
                const _pathResolved = path.resolve(`${path.dirname(filePath)}/${_path}`).replace(/\\/g, "/")
                config = merge(this.loadAndParseConfigSync(_pathResolved), config)
            }
        }

        return config;
    }

    dumpConfigToPathSync(config: Map<string, DiContainerDependencyDescriptor>, pathToFile: string): any {
        const obj = <{
            items: any[]
        }>{
            items: []
        }
        for(const entry of config.values()){
            const entryClean = {
                id: entry.id,
                setup: entry.setup,
                singleton: entry.singleton,
                lazy: entry.lazy,
                args: [],
                requires: entry.requires,
            }
            obj.items.push(entryClean as any)
        }

        fs.writeFileSync(pathToFile, yaml.stringify(obj))
    }
}