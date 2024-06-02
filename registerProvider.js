const vscode = require('vscode')
const TreeDataProvider = require('./TreeDataProvider.js')
const HoverProvider = require('./HoverProvider.js')

module.exports = (rootPath) => { 
  vscode.window.registerTreeDataProvider('npmrunscript', new TreeDataProvider(rootPath,2))
  vscode.window.registerTreeDataProvider('npmrunscript-scm', new TreeDataProvider(rootPath,3))
  vscode.languages.registerHoverProvider({ scheme: 'file', language: 'json' },new HoverProvider())
}
