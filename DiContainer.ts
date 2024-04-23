import path from "node:path"
import {DiContainerLifeCycle} from "./interfaces/DiContainerLifeCycle";
import {parseArgs} from "./ReflectionUtil";
import EventEmitter from "node:events";
import {DiContainerOptions} from "./interfaces/DiContainerOptions";
import {DiContainerDependencyDescriptor} from "./interfaces/DiContainerDependencyDescriptor";
import {DependencyResolveStrategyKind} from "./enums/DependencyResolveStrategyKind";
import {DiContainerEvents} from "./enums/DiContainerEvents";
import {DiContainerLogLevels} from "./enums/DiContainerLogLevels";
import {DiContainerInitConfig} from "./interfaces/DiContainerInitConfig";
import {DiInjectableOptions} from "./interfaces/DiInjectableOptions";
import {DiContainerLogMessage} from "./interfaces/DiContainerLogMessage";

export class DiContainer extends EventEmitter {
    private readonly _options: DiContainerOptions;
    private readonly _context: Map<string, any> = new Map<string, any>;
    private readonly _setupScripts: Map<string, any> = new Map<string, any>;
    private readonly _diDependencies: Map<string, DiContainerDependencyDescriptor> = new Map()
    private _store: { [key: string]: any } = {};
    private _containerInitialised: boolean = false;

    get containerInitialised(): boolean {
        return this._containerInitialised;
    }

    constructor(options: Partial<DiContainerOptions>) {
        super();

        if(typeof options !== "object") {
            throw new Error("invalid options object was provided")
        }

        this._options = Object.assign({
            dependencyResolveStrategy: DependencyResolveStrategyKind.FAIL,
            debug: false,
            parseArgs,
            emitDependencies: false,
            fileResolver: () => {throw new Error("file resolver must be defined")},
            idNameTransformer: this._firstLetterToLowerCase
        }, options) as DiContainerOptions;
    }

    private _firstLetterToLowerCase(id: string) {
        return id.charAt(0).toLowerCase() + id.slice(1);
    }

    public getStore() {
        return Object.assign({}, this._store);
    }

    private register(id: string, anyValue: any) {
        this._context.set(id, anyValue)
        return this;
    }

    async get(path: string) {
        let item = this._context.get(path);
        if (!item) {
            throw new Error(`item with path: ${path} was not found`)
        }

        if (typeof item === "function" && item.name === "lazyInit") {
            item = await item()
        }

        if (typeof item === "function" && item.name === "nonSingleton") {
            return await item()
        }

        return this._context.get(path)
    }

    has(path: string) {
        return this._context.has(path)
    }

    private emitLog(level: DiContainerLogLevels, message: string) {
        this.emit(DiContainerEvents.ON_LOG, {level, message, callstack: new Error().stack} as DiContainerLogMessage)
    }

    async init(config: DiContainerInitConfig) {
        if (this._containerInitialised) throw new Error("container is already initialised")

        if (config.store) {
            if(typeof config.store !== "object") throw new Error("store must be type of object")
            this._store = Object.freeze(config.store)
        }

        if (config.options && config.options.searchPaths && Array.isArray(config.options.searchPaths)) {
            await this.resolveDependencyClasses(config.options.searchPaths);
        }

        const idsFromConfig = new Set<string>()
        // overwrite resolved dependencies from static config
        if (config.items) {
            for (const _item of config.items) {
                if (!_item.id || typeof _item.id !== "string") {
                    throw new Error("invalid id was provided")
                }

                const _id = this._options.idNameTransformer(_item.id)

                idsFromConfig.add(_id)

                if (!_item.setup) {
                    throw new Error(`no setup was provided for id: ${_item.id}`)
                }

                if (_item.singleton === undefined || _item.singleton === null) {
                    _item.singleton = true;
                }

                if (_item.lazy === undefined || _item.lazy === null) {
                    _item.lazy = false;
                }

                switch (this._options.dependencyResolveStrategy) {
                case DependencyResolveStrategyKind.FAIL:
                    if (this._diDependencies.has(_id)) {
                        throw new Error(`id should be unique: Duplicate was found: ${_id}`)
                    }
                    break;
                case DependencyResolveStrategyKind.OMIT:
                    if (this._diDependencies.has(_id)) {
                        if (this._options.debug) {
                            this.emitLog(DiContainerLogLevels.DEBUG, `id: '${_id}' will be omitted`)
                        }
                        continue;
                    }
                    break;
                case DependencyResolveStrategyKind.OVERWRITE:
                    if (this._diDependencies.has(_id)) {
                        if (this._options.debug) {
                            this.emitLog(DiContainerLogLevels.DEBUG, `id: '${_id}' will be overwritten`)
                        }
                    }
                }

                // load all custom setup scripts
                if (_item.setup) {
                    if (typeof _item.setup !== "string") {
                        throw new Error(`setup param must be string. Input was ${_item.setup}`)
                    }

                    let _namedImport = "default"
                    let _fileToImport = _item.setup
                    if (_item.setup.includes("#")) {
                        const split = _item.setup.split("#")
                        if (split.length !== 2) {
                            throw new Error("invalid named import notation given. Only one # is allowed")
                        }
                        _fileToImport = split[0]
                        _namedImport = split[1]
                    }
                    const _resolvedPath = path.resolve(_fileToImport)
                    const _import = await import(_resolvedPath)

                    if (_namedImport === "*") {
                        this.register(_id, _import)
                    } else {
                        if (!_import[_namedImport]) {
                            throw new Error(`file path '${_resolvedPath}' does not export '${_namedImport}'. Input for setup was: '${_item.setup}'`)
                        }

                        if (typeof _import[_namedImport] === "function") {
                            this._setupScripts.set(_item.setup, _import[_namedImport])
                        } else {
                            this.register(_id, _import[_namedImport])
                        }
                    }
                }

                this._diDependencies.set(_id, _item)
            }
        }


        this.register("diContainer", this)
        // setup loop to ensure required statements are resolved correctly
        for (const _item of this._diDependencies.values()) {
            await this.initClass(_item.id);
        }

        if (this._options.emitDependencies) {
            const diDependenciesWithoutConfig = new Map<string, DiContainerDependencyDescriptor>()
            for (const _item of this._diDependencies.values()) {
                if (!idsFromConfig.has(_item.id)) {
                    diDependenciesWithoutConfig.set(_item.id, _item)
                }
            }

            this.emit(DiContainerEvents.DEPENDENCIES_RESOVLED, this._diDependencies.values())
            this.emit(DiContainerEvents.DEPENDENCIES_RESOVLED_WIHTOUT_CONFIG, diDependenciesWithoutConfig)
        }

        await this.containerStartedHandleEvents()

        // after usage clean up memory
        this._setupScripts.clear();
        this._diDependencies.clear();

        this._containerInitialised = true;
    }

    private async containerStartedHandleEvents() {
        if (this._containerInitialised) throw new Error("container is already initialised")

        for (const anyDependency of this._context.values()) {
            if (anyDependency instanceof DiContainerLifeCycle) {
                if (this._options.debug) {
                    this.emitLog(DiContainerLogLevels.DEBUG, "call onContainerReady")
                }
                await anyDependency.onContainerReady(this);
            }
        }
        this.emit(DiContainerEvents.ON_CONTAINER_READY, this)
    }

    public async shutdown() {
        if (!this._containerInitialised) throw new Error("container is not initialised")
        for (const anyDependency of this._context.values()) {
            if (anyDependency instanceof DiContainerLifeCycle) {
                if (this._options.debug) {
                    this.emitLog(DiContainerLogLevels.DEBUG, "call onContainerShutdown")
                }
                await anyDependency.onContainerShutdown(this);
            }
        }
        this.emit(DiContainerEvents.ON_CONTAINER_SHUTDOWN, this)

        this._context.clear();
        this._containerInitialised = false;
    }

    private async resolveDependencyClasses(_searchPaths: any[]) {
        for (const _searchPathPattern of _searchPaths) {
            const _classes = await this._options.fileResolver(_searchPathPattern.path, _searchPathPattern.options)
            for (const _classPath of _classes) {
                if (!_classPath.endsWith(".js") && !_classPath.endsWith(".cjs")) continue;
                const _classLoaded = await import(path.resolve(_classPath))
                for (const namedExport of Object.keys(_classLoaded)) {
                    if (_classLoaded[namedExport].prototype && typeof _classLoaded[namedExport].prototype.__diMeta === "object") {
                        const injectableOptions = _classLoaded[namedExport].prototype.__diMeta as DiInjectableOptions
                        const setupName = [_classPath, namedExport].join("#")
                        const _id = injectableOptions.id || this._options.idNameTransformer(path.basename(_classPath).replace(".js", "").replace(".cjs", ""))

                        switch (this._options.dependencyResolveStrategy) {
                        case DependencyResolveStrategyKind.FAIL:
                            if (this._diDependencies.has(_id)) {
                                const _dep = this._diDependencies.get(_id);
                                if (_dep) {
                                    const _classLoadedAlready = this._setupScripts.get(_dep.setup)
                                    // some classes export the same class as named export and also as default export
                                    // this leads to errors since annotation decorator mutated the prototype of the class
                                    // already. To overcome this issue we compare identity of the classes
                                    if (_classLoadedAlready !== _classLoaded[namedExport]) {
                                        throw new Error(`id should be unique: Duplicate was found: ${_id}`);
                                    } else {
                                        // since we don't overwrite the class which is already loaded
                                        // we just go on, because it is not an error as those. Importing the same class
                                        // with named import is possible, so we can not do something about it here!
                                        // It is already a good practise to not use default exports a less possible,
                                        // but we can't bet on that here!
                                        // If we don't continue here, we have the same dependency twice in setup scripts
                                        // bucket which does not make sense, because it will not be used!
                                        continue;
                                    }
                                } else {
                                    throw new Error(`id should be unique: Duplicate was found: ${_id}`);
                                }
                            }
                            break;
                        case DependencyResolveStrategyKind.OMIT:
                            if (this._diDependencies.has(_id)) {
                                if (this._options.debug) {
                                    this.emitLog(DiContainerLogLevels.DEBUG, `id: '${_id}' will be omitted`)
                                }
                                continue;
                            }
                            break;
                        case DependencyResolveStrategyKind.OVERWRITE:
                            if (this._diDependencies.has(_id)) {
                                if (this._options.debug) {
                                    this.emitLog(DiContainerLogLevels.DEBUG, `id: '${_id}' will be overwritten`)
                                }
                            }
                            break;
                        }

                        this._diDependencies.set(_id, {
                            id: _id,
                            singleton: injectableOptions.singleton,
                            lazy: injectableOptions.lazy,
                            setup: setupName,
                            requires: injectableOptions.requires || []
                        } as DiContainerDependencyDescriptor)

                        this._setupScripts.set(setupName, _classLoaded[namedExport])
                    }
                }
            }
        }
    }

    private async initClass(id: string): Promise<any> {
        if (this._options.debug) {
            this.emitLog(DiContainerLogLevels.DEBUG, `call initClass with id '${id}'`)
        }

        if (this.has(id)) return this.get(id)

        const _item = this._diDependencies.get(id)
        if (!_item) {
            throw new Error(`dependency with id: '${id}' could not be found`)
        }

        if (_item.requires && _item.requires.length > 0) {
            for (const _require of _item.requires) {
                if (!this.has(_require)) {
                    if (this._options.debug) {
                        this.emitLog(DiContainerLogLevels.DEBUG, `call initClass from require context with id '${_require}'`)
                    }
                    await this.initClass(_require)
                }
            }
        }

        const setupAction = this._setupScripts.get(_item.setup)
        if (!setupAction || typeof setupAction !== "function") {
            throw new Error("no valid function was provided")
        }

        if (!_item.args || (Array.isArray(_item.args) && _item.args.length === 0)) {
            const argRequires = this._options.parseArgs(setupAction)
            const _args = []
            for (const _name of argRequires) {
                if (!this.has(_name)) {
                    if (this._options.debug) {
                        this.emitLog(DiContainerLogLevels.DEBUG, `call initClass from argRequires context with id '${_name}'`)
                    }
                    await this.initClass(_name)
                }

                _args.push(await this.get(_name))
            }

            _item.args = _args
        }

        const _that = this;
        if (_item.lazy) {
            if (this._options.debug) {
                if (!_item.singleton) {
                    this.emitLog(DiContainerLogLevels.DEBUG, `item with id '${_item.id}' will be initialised lazy and NOT as singleton`)
                } else {
                    this.emitLog(DiContainerLogLevels.DEBUG, `item with id '${_item.id}' will be initialised lazy and as singleton`)
                }
            }
            this.register(_item.id, async function lazyInit() {
                if (_item.singleton) {
                    const instance = await _that.createInstanceOf(setupAction, _item.args)
                    _that.register(_item.id, instance)
                    return instance;
                } else {
                    return async function nonSingleton() {
                        return await _that.createInstanceOf(setupAction, _item.args)
                    }
                }
            })
        } else {
            if (_item.singleton) {
                if (this._options.debug) {
                    this.emitLog(DiContainerLogLevels.DEBUG, `item with id '${_item.id}' will be initialised NOT lazy and as singleton`)
                }
                const instance = await this.createInstanceOf(setupAction, _item.args)
                this.register(_item.id, instance)
            } else {
                if (this._options.debug) {
                    this.emitLog(DiContainerLogLevels.DEBUG, `item with id '${_item.id}' will be initialised NOT lazy, NOT singleton, but as instant`)
                }
                this.register(_item.id, async function nonSingleton() {
                    return await _that.createInstanceOf(setupAction, _item.args)
                })
            }
        }
    }

    private async createInstanceOf(func: Function, args: any) {
        if (func.constructor && func.constructor.name === "AsyncFunction") {
            return await func(...args)
        } else if (func.prototype && func.prototype.constructor) {
            return new func.prototype.constructor(...args);
        } else {
            return func(...args)
        }
    }
}


export default DiContainer