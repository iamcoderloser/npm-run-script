const vscode = require('vscode')
module.exports = class {
  provideHover(document, position, token) {             
    // 获取当前鼠标位置的JSON Key
    const jsonKeyRange = document.getWordRangeAtPosition(position, /(?<=")([^"]*)(?="\s*:)/);
    if (!jsonKeyRange) {
      return;
    }
  const textRange = document.getWordRangeAtPosition(position, /.+/);


    // 获取 JSON 键的文本
    const jsonKey = document.getText(jsonKeyRange);

    const packageJson = JSON.parse(document.getText())
    const {scripts} = packageJson
    const text = document.getText(textRange)
    if (scripts[jsonKey]) {
      const cmds = [
        `[$(keybindings-add)${'添加/修改注释'}](command:npm-run-script.update-comment?${encodeURIComponent(JSON.stringify({key:jsonKey,rang:jsonKeyRange}))})`
        ]
    
        // 根据 JSON 键返回相应的 Hover 内容
        const addComments = new vscode.MarkdownString(cmds.join(" "),true)
        addComments.isTrusted = true;
        return new vscode.Hover(addComments);
    }

    return ''
  }
}