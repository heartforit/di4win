import DiContainer from "../DiContainer";

export abstract class DiContainerLifeCycle {
    abstract onContainerReady(diContainer: Readonly<DiContainer>) : Promise<void> | void;
    abstract onContainerShutdown(diContainer: Readonly<DiContainer>) : Promise<void> | void;
}