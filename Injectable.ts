import {DiInjectableOptions} from "./interfaces/DiInjectableOptions";


export default function Injectable(input: DiInjectableOptions | null | undefined | void) {
    return function some(target: any, context: any) {
        if(!target.prototype.__diMeta) target.prototype.__diMeta = {} as DiInjectableOptions
        if(!input) input = {lazy: false, singleton: true, requires: []} as DiInjectableOptions

        if(input.lazy === true){
            target.prototype.__diMeta.lazy = true
        } else {
            target.prototype.__diMeta.lazy = false
        }
        if(input.singleton === false){
            target.prototype.__diMeta.singleton = false
        } else {
            target.prototype.__diMeta.singleton = true
        }
        if(input.id){
            target.prototype.__diMeta.id = input.id
        }
        if(input.requires){
            target.prototype.__diMeta.requires = input.requires
        }

    };
}