"use strict";

const Generator = require("yeoman-generator");
const pluralize = require("pluralize");
const _ = require("lodash");
const path = require("path");

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option("babel"); // This method adds support for a `--babel` flag
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your model name",
        default: this.appname, // Default to current folder name
      },
    ]);
    this.config.save();
  }

  writing() {
    const srcDir = this.config.get("srcDir") || "src";
    const apiDir = this.config.get("apiDir") || "api";
    const modelName = _.startCase(this.answers.name).replace(" ", "");
    const camel = _.camelCase(modelName);
    const camels = pluralize(camel);
    const modelNames = pluralize(modelName);
    const filepath = function (filename) {
      return path.join("backend", srcDir, apiDir, camels, filename);
    };

    this.fs.copyTpl(
      this.templatePath("controller.js"),
      this.destinationPath(filepath(`${camel}.controller.js`)),
      { name: modelName, camelName: camel }
    );

    this.fs.copyTpl(
      this.templatePath("index.js"),
      this.destinationPath(filepath("index.js")),
      {
        name: modelName,
        camelName: camel,
        camelNames: camels,
        names: modelNames,
      }
    );

    this.fs.copyTpl(
      this.templatePath("model.js"),
      this.destinationPath(filepath(`${camel}.model.js`)),
      { name: modelName, camelName: camel }
    );

    this.fs.copyTpl(
      this.templatePath("service.js"),
      this.destinationPath(filepath(`${camel}.service.js`)),
      { name: modelName, camelName: camel }
    );

    this.fs.copyTpl(
      this.templatePath("test.js"),
      this.destinationPath(filepath(`${camel}.test.js`)),
      { name: modelName, camelName: camel }
    );

    this.fs.copyTpl(
      this.templatePath("validation.js"),
      this.destinationPath(filepath(`${camel}.validation.js`)),
      { name: modelName, camelName: camel }
    );
  }
};
