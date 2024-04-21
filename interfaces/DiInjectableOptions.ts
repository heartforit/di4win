export interface DiInjectableOptions {
    /**
     *  "id" which should be used to export dependency into the container
     *  could also help to solve name conflicts
     */
    id?: string,
    /**
     * "lazy" means that instance will only be created when instance
     *  will be read from container for example with ```await get("id")```
     */
    lazy?: boolean,
    /**
     *  "singleton"  means there is only exact one instance of this kind maintained in the container
     */
    singleton?: boolean,
    /**
     *   "requires" list of ids which should exist in container before this dependency should be initiated
     *   this could mean indirect dependencies or wait for something to happen
     *   IMPORTANT: dependencies which where declared here will not be injected into the constructor
     *   To do so, constructor should define list of arguments which match id names from container
     */
    requires?: string[]
}