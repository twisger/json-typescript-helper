#!/usr/bin/env node

const { tsquery } = require('@phenomnomnominal/tsquery');
const watch = require('node-watch');
const fs = require('fs')
const path = require('path')

let source = process.argv[2]
let root = '.'
if (source) {
  root = path.join('.', source)
}

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(filename => {
    const fullPath = path.join(dir, filename)
    const isDirectory = fs.statSync(fullPath).isDirectory()
    const isPackage = !!fullPath.match('^node_modules')
    if (isPackage) {
      return
    }
    isDirectory ? walkDir(fullPath, callback) : callback(fullPath)
  })
}

const generateHelperCode = (input) => {
  const ast = tsquery.ast(input);
  const nodes = tsquery(ast, 'InterfaceDeclaration');
  const interfaceList = nodes.map(item => {
    if (item.heritageClauses) {
      const parentName = item.heritageClauses[0].getText().replace('extends ', '')
      return {keys: item.members.map(member => member.name.escapedText), isHeritage: true, parentName: parentName, name: item.name.escapedText}
    } else {
      return {keys:item.members.map(member => member.name.escapedText), name: item.name.escapedText}
    }
  });
  const interfaceListDump = interfaceList.map(item => {
    let keys = item.keys
    if (item.isHeritage) {
      const parentKeys = interfaceList.filter(parent => parent.name === item.parentName)[0].keys
      keys = Array.from(new Set([...item.keys, ...parentKeys]))
    }
    const string = `${item.name}: ["${keys.join('", "')}"]`
    return string
  })
  const output = 
`import { pick } from 'lodash';

const map: { [index: string]: string[] } = {
  ${interfaceListDump.join(', \n  ')}
};
export default (data: any, key: string) => {
  if (Array.isArray(data)) {
    return data.map((item) => pick(item, map[key]));
  } else {
    return pick(data, map[key]);
  }
};`
  return output
}

const resolveFile = (name) => {
  if (name.match(/types\.ts$/)) {
    const fullPath = path.join('.', name)
    const input = fs.readFile(fullPath, 'utf-8', (err, input) => {
      const output = generateHelperCode(input)
      fs.writeFile(path.join('.', name.replace('.ts', '.helper.ts')), output, (err) => {
        if (err) {
          throw err
        } else {
          console.log(`generate help code by ${fullPath}`)
        }
      })
    })
  }
}

walkDir(root, (filepath) => {
  resolveFile(filepath)
})

watch(root, { recursive: true }, function(evt, name) {
  resolveFile(name)
});

