import {DiContainerDependencyDescriptor} from "./DiContainerDependencyDescriptor";

export interface DiContainerInitConfig {
    store: any,
    options?: {
        searchPaths?: string | string[]
    }
    items: DiContainerDependencyDescriptor[]
}