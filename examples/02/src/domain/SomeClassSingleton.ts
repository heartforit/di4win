import {Injectable} from "../../../../index";

@Injectable({singleton: true})
export class SomeClassSingleton {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world")
    }
}