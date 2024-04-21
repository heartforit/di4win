import {DependencyResolveStrategyKind} from "../enums/DependencyResolveStrategyKind";

export interface DiContainerOptions {
    dependencyResolveStrategy: DependencyResolveStrategyKind,
    fileResolver: (pattern: string, options: any) => Promise<string[]>,
    parseArgs: (fn: Function) => string[],
    debug: boolean,
    emitDependencies: boolean,
    idNameTransformer: (id: string) => string;
}