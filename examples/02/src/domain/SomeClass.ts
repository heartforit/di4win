import {Injectable} from "../../../../Injectable";

@Injectable({id: "someClass", requires: ["someClassRequired"]})
export class SomeClass {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world")
    }
}