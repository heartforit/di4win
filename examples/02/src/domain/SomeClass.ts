import {Injectable} from "../../../../index";

@Injectable({id: "someClass", requires: ["someClassRequired"]})
export class SomeClass {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world")
    }
}