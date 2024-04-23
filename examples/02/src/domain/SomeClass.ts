import {Injectable} from "../../../../index";

@Injectable({id: "someClass", requires: ["someClassRequired"]})
export default class SomeClass {

    constructor() {
    }

    public sayHello(){
        console.log("Hello world")
    }
}