/*:
    @module-configuration:
        {
            "packageName": "maid",
            "fileName": "task.js",
            "moduleName": "task",
            "authorName": "Richeve S. Bebedor",
            "authorEMail": "richeve.bebedor@gmail.com",
            "repository": "git@github.com:volkovasystems/maid.git",
            "isGlobal": true
        }
    @end-module-configuration

    @module-documentation:
    @end-module-documentation

    @include:
        {
            "execute-factory.js": "executeFactory",
        }
    @end-include
*/
var task = function task( callback, doAsWork, validator ){
    /*:
        @meta-configuration:
            {
                "callback:required": "Callback",
                "doAsWork:optional": "boolean",
                "validator:optional": "Validator"
            }
        @end-meta-configuration
    */

    var taskEngineContainer = { };

    var self = this;
    Object.defineProperty( taskEngineContainer, "execute", {
        "enumerable": false,
        "writable": false,
        "configurable": false,
        "value": executeFactory.apply( self, Array.prototype.slice.call( arguments ) )
    } );

    return taskEngineContainer
};

var executeFactory = require( "./execute-factory.js" );
( module || { } ).exports = task;