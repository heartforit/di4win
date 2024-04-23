import {Injectable} from "../../../../index";

@Injectable({lazy: true})
export class SomeClassLazy {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world")
    }
}