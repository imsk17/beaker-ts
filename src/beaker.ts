#!/usr/bin/env node

import { Command } from "commander";
import { generateApplicationClient, AppSpec } from ".";

import fs from "fs";
import path from "path";

const pjson = require("../package.json")

const program = new Command();

program
  .name("beaker")
  .description("Utilities for working with beaker applications")
  .version(pjson['version']);

program
  .command("generate")
  .argument("<string>", "path to json application spec file")
  .option("--src", "path where generated client should be written", "src/")
  .action((spec, options) => {
    let srcPath = options.src;
    if (srcPath.slice(-1) !== path.sep) srcPath += path.sep;
    if (!fs.lstatSync(srcPath).isDirectory()) {
      throw Error("Path argument must be a directory");
    }

    if (!fs.lstatSync(spec).isFile()) {
      throw Error("Path to spec must be a file");
    }

    generateApplicationClient(
      JSON.parse(fs.readFileSync(spec).toString()),
      srcPath
    );
  });
