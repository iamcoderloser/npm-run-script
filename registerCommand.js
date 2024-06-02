const vscode = require('vscode')
const { getPackageJson, savePackageJson } = require('./packageJsonHelper.js')
const TreeDataProvider = require('./TreeDataProvider.js')
  
let disposables = []
let rootPath = ''

let disposable = vscode.commands.registerCommand('npm-run-script.refresh', function () {
  vscode.window.registerTreeDataProvider('npmrunscript', new TreeDataProvider(rootPath,2))
});

disposables.push(disposable)
disposable = vscode.commands.registerCommand('npm-run-script.refresh-scm', function () {
  vscode.window.registerTreeDataProvider('npmrunscript-scm', new TreeDataProvider(rootPath, 3))
});

disposables.push(disposable)


disposable = vscode.commands.registerCommand('npm-run-script.update-comment', function (args) {
  // The code you place here will be executed every time your command is executed

  const label = args.key ? args.key : args.command.arguments[0]
  
  if(!label) return
  const packageJson = getPackageJson(rootPath)
  const { scripts, scriptsWithComment } = packageJson
  const value = scriptsWithComment ?  scriptsWithComment[label]?.desc || '' : '' 

  vscode.window.showInputBox({ placeHolder:'请输入script注释',value}).then(res => {
    
    
    if (scriptsWithComment) {
      scriptsWithComment[label] = {
        cmd: scripts[label],
        desc:res.trim()
      }
    } else {
      packageJson.scriptsWithComment = {
        [label]: {
          cmd: scripts[label],
          desc:res.trim()
        }
      }
    }
    savePackageJson(rootPath, packageJson)
    
    vscode.commands.executeCommand('npm-run-script.refresh','npm-run-script.refresh-scm')

  });
});

disposables.push(disposable)

disposable = vscode.commands.registerCommand('npm-run-script.runscript', function (...args) {
  // The code you place here will be executed every time your command is executed
  const [ label = '', script = '' ] = args
  runScriptInCmd(label,script)
});

disposables.push(disposable)


function runScriptInCmd(label,script) {
  let isSingle = vscode.workspace.getConfiguration('npm run script').get('terminal.single')
  let terminal = vscode.window.terminals.find(terminal => {
    return isSingle ? terminal.name.indexOf('npm run') !== -1 : terminal.name === 'npm run ' + label
  })
  if (!terminal) {
    terminal = vscode.window.createTerminal('npm run ' + label)
  }
  terminal.sendText(script)
}





module.exports = {
  subscriptions(context,rt) {
    context.subscriptions.push(...disposables)
    rootPath = rt
  },
  disposeAll() {
    disposables.forEach(disposable => {
      disposable.dispose()
    })
    disposables()
  }
}