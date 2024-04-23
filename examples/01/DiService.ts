import DiContainer from "../../DiContainer";
import {DiYamlConfigUtil} from "./DiYamlConfigUtil";
import {glob} from "glob";
import {DependencyResolveStrategyKind} from "../../enums/DependencyResolveStrategyKind";
import {DiContainerEvents} from "../../enums/DiContainerEvents";
import {logger} from "./src/config/di/LoggingService";
import {DiContainerLogMessage} from "../../interfaces/DiContainerLogMessage";
import {DiContainerLogLevels} from "../../enums/DiContainerLogLevels";

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "default"
}


const DEBUG_DI_CONTAINER = true;

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
            this._diContainer.on(DiContainerEvents.ON_LOG, (logObject: DiContainerLogMessage) => {
                switch (logObject.level){
                    case DiContainerLogLevels.INFO:
                        logger.info(logObject.message);
                        break
                    case DiContainerLogLevels.WARN:
                        logger.warn(logObject.message);
                        break
                    case DiContainerLogLevels.ERROR:
                        logger.error(logObject.message);
                        break
                    case DiContainerLogLevels.DEBUG:
                        logger.debug(logObject.message);
                        break
                    default:
                        logger.debug(logObject.message);
                        break;
                }
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