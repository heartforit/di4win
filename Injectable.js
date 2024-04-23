"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Injectable(input) {
    return function some(target, context) {
        if (!target.prototype.__diMeta)
            target.prototype.__diMeta = {};
        if (!input)
            input = { lazy: false, singleton: true, requires: [] };
        if (input.lazy === true) {
            target.prototype.__diMeta.lazy = true;
        }
        else {
            target.prototype.__diMeta.lazy = false;
        }
        if (input.singleton === false) {
            target.prototype.__diMeta.singleton = false;
        }
        else {
            target.prototype.__diMeta.singleton = true;
        }
        if (input.id) {
            target.prototype.__diMeta.id = input.id;
        }
        if (input.requires) {
            target.prototype.__diMeta.requires = input.requires;
        }
    };
}
exports.default = Injectable;
