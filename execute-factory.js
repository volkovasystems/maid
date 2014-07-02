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

	/*:
		@local-function-documentation:
			This will check the command list execution if the cached result length matches that of the total requested commands to be executed.
			If an error occurs, it will stop the execution by returning true.
			If the command list results is already met, then it will stop the execution by returning true also.
			Note that, it will always return the current result list whenever the state of the execution.
			Also note that, this will only be used on multiple command execution.
		@end-local-function-documentation
	*/
	var checkCommandListExecution = function checkCommandListExecution( commandListCache, commandListLength, commandID, resultList ){
		/*:
			@meta-configuration:
				{
					"commandListCache:required": "Set",
					"commandListLength:required": "number",
					"commandID:required": "string",
					"resultList:required": "Set"
				}
			@end-meta-configuration
		*/

		//Cache the result.
		if( !( commandID in commandListCache ) ){
			commandListCache[ commandID ] = resultList;
		}

		//Gather the current results into a single array without the error.
		var commandListResults = [ ];
		for( var commandID in commandListCache ){
			var index = parseInt( commandID.split( ":" )[ 1 ] );
			commandListResults[ index ] = commandListCache[ commandID ].slice( 1 );
		}

		//If there's an error in the first index of result then return immediately.
		if( resultList[ 0 ] !== null ){
			callback( resultList[ 0 ], commandListResults );
			return true;
		}

		//If the command list cache is full based on command list length then return immediately.
		if( Object.keys( commandListCache ).length == commandListLength ){
			callback( null, commandListResults );
			return true;
		}

		//Else return false.
		return false;
	};

	/*:
		@local-function-documentation:
			This will check if the commandListData index and length already matches.
			It will return true if it is and false otherwise.
		@end-local-function-documentation
	*/
	var checkCommandListData = function checkCommandListData( commandListData ){
		/*:
			@meta-configuration:
				{
					"commandListData:required": "object"
				}
			@end-meta-configuration
		*/

		return commandListData.index == commandListData.length;
	};

	/*:
		@local-function-documentation:
			This will be the constructed function for handling the command list.
		@end-local-function-documentation
	*/
	var execute = function execute( commandList ){
		/*:
			@meta-configuration:
				{
					"commandList:required": "List"
				}
			@end-meta-configuration
		*/

		//This is for single command execution.
		if( commandList.length == 1 ){
			var command = commandList[ 0 ];
			if( doAsWork ){
				work( command, callback, validator );
			}else{
				chore( command, callback );
			}
		}else{
			//This is for multiple command execution.

			//The command list cache is for every session of command list caching results and determinant if the command list is already executed.
			var commandListCache = { };

			//Switch to specific task engine.
			var taskEngine;
			if( doAsWork ){
				taskEngine = work;
			}else{
				taskEngine = chore;
			}

			//Stores the index and length so that we can get the same scope on asynchronous environment.
			var commandListData = {
				"index": 0,
				"length": commandList.length
			};

			//Loop through each command by executing the task engine.
			for( ; commandListData.index < commandListData.length; commandListData.index++ ){
				//We have to always check if the index and length is already equal to stop the loop.
				if( checkCommandListData( commandListData ) ) return;

				//We need to use the basic hashed of the command with the index so that we can refer to it as command ID.
				var command = commandList[ commandListData.index ];
				var commandHash = btoa( command );
				var commandID = [ commandHash, ":", commandListData.index ].join( "" );

				if( checkCommandListData( commandListData ) ) return;

				taskEngine( command,
					function onResult( ){
						if( checkCommandListData( commandListData ) ) return;

						//Get the result and try to calculate the remaining commands to be executed.
						var resultList = Array.prototype.slice.call( arguments );
						var isFinished = checkCommandListExecution( commandListCache, commandListData.length, commandID, resultList );

						//If isFinished is true, equalize the index and length to stop the loop.
						if( isFinished ){
							commandListData.index = commandListData.length;
						}
					}, validator );
			}
		}
	};

	return execute;
};

var work = require( "./work/work.js" );
var chore = require( "./chore/chore.js" );
( module || { } ).exports = executeFactory;