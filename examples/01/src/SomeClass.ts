import {Injectable} from "../../../index";

@Injectable()
export default class SomeClass {


    constructor(commonJsLegacyClass: any) {
        // default constructor needed because javascript does random stuff
        // if a class contains only static methods and no constructor
    }

}