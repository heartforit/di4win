<div align="center">

  <h1><code>Di4win</code></h1>
  <strong>
      Di4win (spoken di-for-win) is yet another simple to use straight forward and classic dependency injection container.
      Its core idea is simple, straightforward, dependency free and extensible.
  </strong>

</div>


**Introduction:**

By its nature it helps to increase **code quality**, **maintainability** and **performance (reduce memory usage**).

**Problem:**
* Code is hard to replace if the code base grows over certain levels / class numbers
* Imports start to get a mess and refactoring and reading codes takes more and more time (boilerplate)
* Specific parts of the software have to wait for others, manuel synchronisation gets unreadable and hard testable 
* Constructors and functions should wait for async processes, before be initialised (no async constructors in nodejs)
* Patterns like factory and singleton get repeated over and over again
* Testing specific aspects of the software gets challenging over time, because more and more mock code is needed to define simple instances
* Overall complexity by direct links reduces chances to decommission part of the software

**Motivation:**
* ****I wanted a solution which comes without tons of dependencies****
* I want the code to hold as less state as possible to reduce possible side effects and unwanted mutations
* I want the code to be more memory efficient
* I want to create a flexible, easy to use, fast to learn library which supports
powerful customisation and uses proven design patterns like singleton and factory, as well as laziness
* I want to have life cycle events when important things happen
* I want config files to allow overrides
* I want to have the chance to deal with edge-cases (legacy code)
* I want config files with build in (key,value) store to be easy to be accessible without second solution
* I want to have the flexibility to change parts of the code with custom implementations which fit the project
* (optional) I want to have config files for different environments

**When should I use this library?**

:question: You want a dependency free (fat-free), "type-safe", tested and easy to learn library

:question: You are searching for a solution to make dependencies:
  * replaceable
  * testable 
  * automatically initialised

:question: You are looking for a solution to run synchronous constructors which depend on asynchronous 
code

:question: You have implicit dependencies

:question: You want to work with edge-cases like dependencies, which export objects or run commonjs code

:question: You want to use configuration files with (key,value) nature to be easy accessible for you at runtime 

:question: You want to have the flexibility to change parts of the code with custom implementations:

For example, you want to load config files which are encrypted somehow etc.
* You don't like to write the same code over and over again to create some instances
* You need to listen for important life cycles event for example when the container is ready to be used
or shutdown (async support)

**When should I not use this library?**
* You don't need this project because you are running a small project
* You are running your software in the browser (but usage is possible was well)


**Features**

:heavy_plus_sign: Load dependencies with config (file optional) (to overrule, load edge-cases or commonjs files)

:heavy_plus_sign: Includes simple build-in (key,value) store (immutable at runtime)

:heavy_plus_sign: Includes events for startup and shutdown of the container (with async support)

:heavy_plus_sign: Includes events for all major interactions

:heavy_plus_sign: Define implicit require relationships (means wait for a other dependency to be ready)

:heavy_plus_sign: Multi-environment support (default, production or whatever)

:heavy_plus_sign: Auto-loader for dependencies with annotation based system (typescript only)

:heavy_plus_sign: Allow control for dependency at class level with param annotation (id, singleton, lazy, requires)

:heavy_plus_sign: Dump dynamically loaded dependencies to file system (for legacy support or faster start up times)

:heavy_plus_sign: Replace following aspects of the implementation with custom implementation:

  * Define how function arguments get parsed (to automatically resolve dependencies by argument names)
  * Define how the file system should be scanned (glob etc.)
  * Define how dependencies should be named in the container (match coding standards of your project)

:heavy_plus_sign: Debug mode to follow the resolving in cases of errors and conflicts

:heavy_plus_sign: Define custom resolve strategy for conflicts
  * Currently supported: omit, fail, overwrite

**Available conflict resolve strategies**

* [Dependency resolve strategies](./enums/DependencyResolveStrategyKind.ts)

**Available events**

* [DI Container Events](./enums/DiContainerEvents.ts)

**Available log levels**

* [DI Container log levels](./enums/DiContainerLogLevels.ts)

**Examples**

* [Example one](./examples/01)
  * Contains an example with custom static file support with yaml and multi environment setup
* [Example two](./examples/02)
  * Contains an example with custom injection with annotations

For more details watch the example or test folder 