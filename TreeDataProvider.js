const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const {getPackageJson} = require('./packageJsonHelper.js')

module.exports = class NodeDependenciesProvider  {
  constructor(workspaceRoot,sourceType = 1) {  // sourceType 1 全部  2 explorer 3 scm
    this.workspaceRoot = workspaceRoot
    this.sourceType = sourceType
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No script in empty workspace');
      return Promise.resolve([]);
    }
    if (element) {
      return Promise.resolve([]);
    }
    const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
    if (this.pathExists(packageJsonPath)) {
      return Promise.resolve(this.getScriptsPackageJson(packageJsonPath));
    } else {
      vscode.window.showInformationMessage('Workspace has no package.json');
      return Promise.resolve([]);
    }
  }

  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
   getScriptsPackageJson(packageJsonPath) {
    if (this.pathExists(packageJsonPath)) {
      const packageJson = getPackageJson(this.workspaceRoot)
      const { scripts , scriptsWithComment = {}} = packageJson
      return Object.keys(scripts).filter(key => this.sourceType === 1 ? true : this.sourceType === 2 ? !key.startsWith('scm:') : key.startsWith('scm:')).map(key => {
        return new Dependency(
          key,
          scripts[key],
          vscode.TreeItemCollapsibleState.None,
          scriptsWithComment[key]?.desc
        );
      })
    } else {
      return [];
    }
  }

 pathExists(p) {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }
}

class Dependency extends vscode.TreeItem {
  constructor(label,script,collapsibleState,comment) {
    super(label, collapsibleState);
    this.tooltip = `${comment}\n ${script}`.trim();
    this.description = script;
    this.iconPath = {
      light: path.join(__dirname, 'resources', 'imgs', 'quick-fill.png'),
      dark: path.join(__dirname, 'resources', 'imgs', 'quick-fill.png')
    }
    this.command = {
      command: 'npm-run-script.runscript',
      arguments:[label,script]
    };
  }
}