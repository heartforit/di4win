import {Injectable} from "../../../../Injectable";

@Injectable({lazy: true})
export class SomeClassLazy {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world")
    }
}