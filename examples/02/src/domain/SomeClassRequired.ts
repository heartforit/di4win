import {Injectable} from "../../../../Injectable";

@Injectable({id: "someClassRequired"})
export class SomeClassRequired {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world from SomeClassRequired")
    }
}