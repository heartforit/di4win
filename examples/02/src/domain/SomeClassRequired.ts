import {Injectable} from "../../../../index";

@Injectable({id: "someClassRequired"})
export default class SomeClassRequired {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world from SomeClassRequired")
    }
}