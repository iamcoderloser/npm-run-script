const fs = require('fs')
const path = require('path')

exports.getPackageJson = (rootPath) => {
  const packagePath = path.resolve(rootPath,'package.json')
  if (!pathExists(packagePath)) return null
  return JSON.parse(fs.readFileSync(packagePath))
}

exports.savePackageJson = (rootPath,json) => {
  const packagePath = path.resolve(rootPath,'package.json')
  if (!pathExists(packagePath)) return -1
  try {
    fs.writeFileSync(packagePath, JSON.stringify(json, null, '\t'))  
  } catch (e) {
    return -2
  }
  return 0
}

function pathExists(p) {
  try {
    fs.accessSync(p);
  } catch (err) {
    return false;
  }
  return true;
}