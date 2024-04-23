import {Injectable} from "../../../../index";

@Injectable({singleton: true})
export default class SomeClassSingleton {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world")
    }
}