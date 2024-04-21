import DiContainer from "../../DiContainer";
import {DiYamlConfigUtil} from "./DiYamlConfigUtil";
import {glob} from "glob";
import {DependencyResolveStrategyKind} from "../../enums/DependencyResolveStrategyKind";
import {DiContainerEvents} from "../../enums/DiContainerEvents";
import {logger} from "./src/config/di/LoggingService";

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "default"
}


const DEBUG_DI_CONTAINER = false;

export class DiService {

    private readonly _diContainer: DiContainer;

    constructor() {
        this._diContainer = new DiContainer({
            dependencyResolveStrategy: DependencyResolveStrategyKind.FAIL,
            fileResolver: async (path: string, options: any) => {
                return glob(path, options)
            },
            debug: DEBUG_DI_CONTAINER,
            emitDependencies: false
        });

        if(DEBUG_DI_CONTAINER){
            this._diContainer.on(DiContainerEvents.ON_LOG, (logLevel: string, message: string) => {
                logger.debug(message)
            })
        }
    }

    public async init() {
        await this._diContainer.init(new DiYamlConfigUtil().loadAndParseConfigSync(`./config/${process.env.NODE_ENV}/di-container.yml`));
    }

    public async dump(){
        //dumpPath: `./config/${process.env.NODE_ENV}/di-container-items-generated.yml`,
    }

    get diContainer(): DiContainer {
        return this._diContainer;
    }
}

const diService = new DiService();
export {diService}