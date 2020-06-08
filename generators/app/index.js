"use strict";

var Generator = require("yeoman-generator");

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
        message: "Your project name",
        default: this.appname, // Default to current folder name
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?",
      },
    ]);
    // this.config.save()
  }

  writing() {
    this.log("cool feature", this.answers.cool); // user answer `cool` used
    const projectName = this.answers.name;
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(projectName),
      { project_slug: projectName },
      {},
      { globOptions: { dot: true } } //https://github.com/SBoudrias/mem-fs-editor/issues/86
    );
  }
};
