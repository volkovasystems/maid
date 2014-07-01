/*:
    @module-configuration:
        {
            "packageName": "maid",
            "fileName": "task.js",
            "moduleName": "task",
            "authorName": "Richeve S. Bebedor",
            "authorEMail": "richeve.bebedor@gmail.com",
            "repository": "git@github.com:volkovasystems/maid.git"
        }
    @end-module-configuration

    @module-documentation:
    @end-module-documentation

    @include:
        {
            "chore.js": "chore",
            "work.js": "work"
        }
    @end-include
*/
var executeFactory = function executeFactory( callback, doAsWork, validator ){
    /*:
        @meta-configuration:
            {
                "callback:required": "Callback",
                "doAsWork:optional": "boolean",
                "validator:optional": "Validator"
            }
        @end-meta-configuration
    */

    return function execute( commandList ){
        /*:
        */
    };
};

var work = require( "./work/work.js" );
var chore = require( "./chore/chore.js" );
( module || { } ).exports = executeFactory;