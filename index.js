#!/usr/bin/env node

const { tsquery } = require("@phenomnomnominal/tsquery");
const watch = require("node-watch");
const fs = require("fs");
const path = require("path");

let source = process.argv[2];
let root = ".";
if (source) {
  root = path.join(".", source);
}

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(filename => {
    const fullPath = path.join(dir, filename);
    const isDirectory = fs.statSync(fullPath).isDirectory();
    const isPackage = !!fullPath.match("^node_modules");
    if (isPackage) {
      return;
    }
    isDirectory ? walkDir(fullPath, callback) : callback(fullPath);
  });
};

const generateHelperCode = (input) => {
  const ast = tsquery.ast(input);
  let nodes = tsquery(ast, "InterfaceDeclaration");
  //filter all signature not PropertySignature(code: 157)
  nodes.forEach(node => {
    node.members = node.members.filter(member => member.kind === 157);
  });
  const interfaceList = nodes.map(item => {
    if (item.heritageClauses) {
      const parentName = item.heritageClauses[0].getText().replace("extends ", "");
      return {keys: item.members.map(member => member.name.escapedText), isHeritage: true, parentName: parentName, name: item.name.escapedText};
    } else {
      return {keys: item.members.map(member => member.name.escapedText), name: item.name.escapedText};
    }
  });
  /* resolve multiple extend */
  interfaceList.forEach(item => {

  })
  */
  const interfaceListDump = interfaceList.map(item => {
    let keys = item.keys;
    if (item.isHeritage) {
      const parent = interfaceList.filter(parent => parent.name === item.parentName)[0];
      const parentKeys = parent ? parent.keys : [];
      keys = Array.from(new Set([...item.keys, ...parentKeys]));
    }
    return {code: `${item.name}: ['${keys.join("', '")}']`, keys: keys};
  });
  // must filter empty in last step to support extends type
  const resultList = interfaceListDump.filter(item => item.keys.length > 0).map(item => item.code);
  const output =
`import { pick } from 'lodash';

export const keyMap: { [index: string]: string[] } = {
  ${resultList.join(",\n  ") + ","}
};
export default (data: any, key: string) => {
  if (Array.isArray(data)) {
    return data.map((item) => pick(item, keyMap[key]));
  } else {
    return pick(data, keyMap[key]);
  }
};
`;
  return output;
};

const resolveFile = (name) => {
  if (name.match(/types\.ts$/)) {
    const fullPath = path.join(".", name);
    fs.readFile(fullPath, "utf-8", (err, input) => {
      const output = generateHelperCode(input);
      fs.writeFile(path.join(".", name.replace(".ts", ".helper.ts")), output, (err) => {
        if (err) {
          throw err;
        } else {
          console.log(`generate help code by ${fullPath}`);
        }
      });
    });
  }
};

walkDir(root, (filepath) => {
  resolveFile(filepath);
});

watch(root, { recursive: true }, function(evt, name) {
  resolveFile(name);
});
