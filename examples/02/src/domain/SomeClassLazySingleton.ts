import {Injectable} from "../../../../index";

@Injectable({singleton: true, lazy: true})
export class SomeClassLazySingleton {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world")
    }
}