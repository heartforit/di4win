import {Injectable} from "../../../../index";

@Injectable({singleton: false})
export default class SomeClassNonSingleton {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world")
    }
}