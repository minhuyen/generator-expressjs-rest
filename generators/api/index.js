"use strict";

var Generator = require("yeoman-generator");
var _ = require("lodash");
var path = require('path');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option("babel"); // This method adds support for a `--babel` flag
  }

  async prompting() {
    var srcDir = this.config.get('srcDir') || 'src';
    var apiDir = this.config.get('apiDir') || 'api';
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your model name",
        default: this.appname // Default to current folder name
      }
    ]);
    this.config.save()
  }

  writing() {
    const modelName = this.answers.name;
    const camel = _.camelCase(modelName);
    var filepath = function (filename) {
      return path.join(props.dir, props.kebab, filename);
    };

    this.fs.copyTpl(
      this.templatePath(filepath('controller.js')),
      this.destinationPath(filepath(`${camel}.controller.js`)),
      { name: modelName }
    );

    this.fs.copyTpl(
      this.templatePath(filepath('index.js')),
      this.destinationPath(filepath('index.js')),
      { name: modelName }
    );

    this.fs.copyTpl(
      this.templatePath(filepath('model.js')),
      this.destinationPath(filepath(`${camel}.model.js`)),
      { name: modelName }
    );

    this.fs.copyTpl(
      this.templatePath(filepath('service.js')),
      this.destinationPath(filepath(`${camel}.service.js`)),
      { name: modelName }
    );

    this.fs.copyTpl(
      this.templatePath(filepath('test.js')),
      this.destinationPath(filepath(`${camel}.test.js`)),
      { name: modelName }
    );

    this.fs.copyTpl(
      this.templatePath(filepath('validation.js')),
      this.destinationPath(filepath(`${camel}.validation.js`)),
      { name: modelName }
    );
  }
};
