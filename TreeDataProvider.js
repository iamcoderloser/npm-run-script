const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { getPackageJson } = require('./packageJsonHelper.js')

module.exports = class NodeDependenciesProvider {
  constructor(workspaceRoot, sourceType = 1) {  // sourceType 1 全部  2 explorer 3 scm
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
    // 如果element存在，表示当前节点是点击子项目，需要获取子项目下的script
    if (element) {
      const rootPath = element.rootPath
      const packageJsonPath = path.join(rootPath, 'package.json');
      if (this.pathExists(packageJsonPath)) {
        return Promise.resolve(this.getScriptsPackageJson(rootPath));
      } else {
        vscode.window.showInformationMessage('Workspace has no package.json');
        return Promise.resolve([]);
      }
      
    }
    // 如果是单项目，保持原有逻辑
    if (typeof this.workspaceRoot === 'string') {
      const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
      if (this.pathExists(packageJsonPath)) {
        return Promise.resolve(this.getScriptsPackageJson(packageJsonPath));
      } else {
        vscode.window.showInformationMessage('Workspace has no package.json');
        return Promise.resolve([]);
      }
    } else {
      return Promise.resolve(this.createProjectRootItem(this.workspaceRoot))
    }

  }

  createProjectRootItem(rootPath) {
    return rootPath.map(rt => {
      return new ProjectRootItem(rt,vscode.TreeItemCollapsibleState.Collapsed)
    })
  }

  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
  getScriptsPackageJson(packageJsonPath) {
    if (this.pathExists(packageJsonPath)) {
        const dirname = packageJsonPath.endsWith('package.json') ? path.dirname(packageJsonPath) : packageJsonPath
        const packageJson = getPackageJson(dirname)
        const { scripts, scriptsWithComment = {} } = packageJson
        return Object.keys(scripts).filter(key => this.sourceType === 1 ? true : this.sourceType === 2 ? !key.startsWith('scm:') : key.startsWith('scm:')).map(key => {
          return new Dependency(
            key,
            scripts[key],
            vscode.TreeItemCollapsibleState.None,
            scriptsWithComment[key]?.desc,
            dirname
          );
        })
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

class ProjectRootItem extends vscode.TreeItem {
  constructor(rootPath,collapsibleState) {
    super(path.basename(rootPath), collapsibleState);
    this.rootPath = rootPath
    this.contextValue = "folder"
  }
}

class Dependency extends vscode.TreeItem {
  constructor(label, script, collapsibleState, comment,rootPath) {
    super(label, collapsibleState);
    this.tooltip = `${comment || ''}\n ${script}`.trim();
    this.description = script;
    this.rootPath = rootPath
    this.iconPath = {
      light: path.join(__dirname, 'resources', 'imgs', 'quick-fill.png'),
      dark: path.join(__dirname, 'resources', 'imgs', 'quick-fill.png')
    }
    this.command = {
      command: 'npm-run-script.runscript',
      arguments: [label, script]
    };
  }
}