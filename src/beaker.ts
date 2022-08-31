#!/usr/bin/env ts-node

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
  .description("Generates an application client given an application spec")
  .argument("<string>", "path to json application spec file")
  .argument("<string>", "path where generated client should be written")
  .action((specPath, srcPath) => {

    if (srcPath.slice(-1) !== path.sep) srcPath += path.sep;

    if (!fs.lstatSync(srcPath).isDirectory()) {
      throw Error("Path argument must be a directory");
    }

    if (!fs.lstatSync(specPath).isFile()) {
      throw Error("Path to spec must be a file");
    }

    console.log(srcPath)

    generateApplicationClient(
      JSON.parse(fs.readFileSync(specPath).toString()),
      srcPath
    );
  });

program.parse()