import {Injectable} from "../../../../index";

@Injectable({lazy: true})
export default class SomeClassLazy {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world")
    }
}