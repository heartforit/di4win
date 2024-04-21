const FN_ARGS = /^\s*[^\(]*\(\s*([^\)]*)\)/m;
const FN_ARG_SPLIT = /,/;
const FN_ARG = /^\s*(_?)(.+?)\1\s*$/;
const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;

function parseArgs(fn: Function) : string[] {

    const fnText = fn.toString().replace(STRIP_COMMENTS, "");
    const argDecl = fnText.match(FN_ARGS);
    if(!argDecl) return []
    const args: string[] = []
    for (const arg of argDecl[1].split(FN_ARG_SPLIT)) {
        arg.replace(FN_ARG, function (all: string, underscore: string, name: string){
            args.push(name)
        } as any);
    }

    return args
}



export {parseArgs}