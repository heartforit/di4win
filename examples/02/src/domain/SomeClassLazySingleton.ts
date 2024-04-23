import {Injectable} from "../../../../index";

@Injectable({singleton: true, lazy: true})
export default class SomeClassLazySingleton {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world")
    }
}