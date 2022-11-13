#!/usr/bin/env -S npx tsx
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const _1 = require(".");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
//const pjson = require('../package.json'); // eslint-disable-line
const program = new commander_1.Command();
program
    .name('beaker')
    .description('Utilities for working with beaker applications');
program
    .command('generate')
    .description('Generates an application client given an application spec')
    .arguments('<path-to-spec> <path-to-write>')
    .option('-l, --local', 'whether or not to use local import')
    .action((specPath, srcPath, options) => {
    if (srcPath.slice(-1) !== path.sep)
        srcPath += path.sep;
    if (!fs.lstatSync(srcPath).isDirectory()) {
        throw Error('Path argument must be a directory');
    }
    if (!fs.lstatSync(specPath).isFile()) {
        throw Error('Path to spec must be a file');
    }
    let jsonObj = JSON.parse(fs.readFileSync(specPath).toString());
    if (!('contract' in jsonObj)) {
        jsonObj = { hints: {}, source: {}, schema: {}, contract: jsonObj };
    }
    const outputFile = (0, _1.generateApplicationClient)(jsonObj, options.local ? '../../src/' : undefined);
    const name = jsonObj.contract.name;
    const file_name = `${name.toLowerCase()}_client.ts`;
    fs.writeFileSync(srcPath + file_name, outputFile);
    console.log(`Wrote client to: ${srcPath + file_name}`);
});
program.parse();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVha2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2JlYWtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLHlDQUFvQztBQUNwQyx3QkFBOEM7QUFFOUMsdUNBQXlCO0FBQ3pCLDJDQUE2QjtBQUU3QixrRUFBa0U7QUFDbEUsTUFBTSxPQUFPLEdBQUcsSUFBSSxtQkFBTyxFQUFFLENBQUM7QUFFOUIsT0FBTztLQUNKLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDZCxXQUFXLENBQUMsZ0RBQWdELENBQUMsQ0FBQztBQUVqRSxPQUFPO0tBQ0osT0FBTyxDQUFDLFVBQVUsQ0FBQztLQUNuQixXQUFXLENBQUMsMkRBQTJELENBQUM7S0FDeEUsU0FBUyxDQUFDLGdDQUFnQyxDQUFDO0tBQzNDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsb0NBQW9DLENBQUM7S0FDM0QsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUNyQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRztRQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDO0lBRXhELElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO1FBQ3hDLE1BQU0sS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7S0FDbEQ7SUFFRCxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUNwQyxNQUFNLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0tBQzVDO0lBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDL0QsSUFBSSxDQUFDLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxFQUFFO1FBQzVCLE9BQU8sR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQztLQUNwRTtJQUVELE1BQU0sVUFBVSxHQUFHLElBQUEsNEJBQXlCLEVBQzFDLE9BQU8sRUFDUCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FDekMsQ0FBQztJQUNGLE1BQU0sSUFBSSxHQUFXLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQzNDLE1BQU0sU0FBUyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUM7SUFFcEQsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRWxELE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLE9BQU8sR0FBRyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0FBQ3pELENBQUMsQ0FBQyxDQUFDO0FBRUwsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDIn0=