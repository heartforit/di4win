import {Injectable} from "../../../../Injectable";

@Injectable({singleton: true})
export class SomeClassSingleton {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world")
    }
}