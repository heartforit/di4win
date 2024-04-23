import {DiContainerLogLevels} from "../enums/DiContainerLogLevels";

export interface DiContainerLogMessage {
    level: DiContainerLogLevels,
    message: string,
    callstack: string | undefined
}