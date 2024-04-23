import {DiContainerEvents} from "../../enums/DiContainerEvents";
import {logger} from "../01/src/config/di/LoggingService";
import DiContainer from "../../DiContainer";
import {DependencyResolveStrategyKind} from "../../enums/DependencyResolveStrategyKind";
import {glob} from "glob";
import {DiContainerInitConfig} from "../../interfaces/DiContainerInitConfig";
import {DiContainerDependencyDescriptor} from "../../interfaces/DiContainerDependencyDescriptor";
import SomeClass from "./src/domain/SomeClass";

(async () => {
    // basic usage
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
        } as any,
        items: [] as DiContainerDependencyDescriptor[]
        /*
        items: [{
            id: "logger",
            singleton: true, // default value can be removed
            lazy: false, // default value can be removed
            setup: "src/some/path.js"
        }] as DiContainerDependencyDescriptor[]
        */
        /*
        // content for src/some/path.js
        // notice: diContainer: DiContainer is always defined and can be used to access the di container
        // and its functions
        export default async function (diContainer: DiContainer) {
          const anyOtherDependency = await diContainer.get("anyOtherDependency")
          const anyOtherDependency : WithType = <WithType>await diContainer.get("someTyped")
          const keyValueData = diContainer.getStore().key
        }
        */
    } as DiContainerInitConfig

    const diContainer = new DiContainer({
        dependencyResolveStrategy: DependencyResolveStrategyKind.FAIL,
        fileResolver: async (path: string, options: any) => {
            // third party library
            return glob(path, options)
        },
        debug: DEBUG_DI_CONTAINER,
        emitDependencies: false
    });

    if (DEBUG_DI_CONTAINER) {
        diContainer.on(DiContainerEvents.ON_LOG, (logObject: any) => {
            logger.debug(logObject.message)
        })
    }

    await diContainer.init(exampleConfig)
    // starts with lower case first letter
    // for more info look into "idNameTransformer" option for DiContainer
    const someClass = <SomeClass>await diContainer.get("someClass")
    someClass.sayHello();
})();