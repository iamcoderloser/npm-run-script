// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

const disposes = require('./registerCommand.js')
const provides = require('./registerProvider.js')


const workspaceFolders =
  vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
    ? vscode.workspace.workspaceFolders
		: undefined;
// 判断是否是单项目，还是workspace
const rootPath = workspaceFolders ? workspaceFolders.length == 1 ? workspaceFolders[0].uri.fsPath : workspaceFolders.map(wf => wf.uri.fsPath) : undefined;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "npm-run-script" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	
	/*
	let disposable = vscode.commands.registerCommand('npm-run-script.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from npm-run-script!');
	});

	context.subscriptions.push(disposable);
	*/
	disposes.subscriptions(context,rootPath)

	provides(rootPath)
}

// This method is called when your extension is deactivated
function deactivate() {
	disposes.disposeAll()
}

module.exports = {
	activate,
	deactivate
}
