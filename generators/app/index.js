"use strict";

var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option("input", { type: Boolean }); // This method adds support for a `--no-input` flag
    this.log("--no-input", this.options["no-input"]);
    this.noInput = this.options["no-input"] || true;
    this.log("===noInput====", this.noInput);
  }

  async prompting() {
    if (!this.noInput) {
      this.answers = await this.prompt([
        {
          type: "input",
          name: "name",
          message: "Your project name",
          default: "awesome-project", // Default to current folder name
        },
        {
          type: "confirm",
          name: "cool",
          message: "Would you like to enable the Cool feature?",
          default: true,
        },
      ]);
      // this.config.save();
    }
  }

  writing() {
    const coolFeature = this.answers?.cool || true;
    this.log("cool feature", coolFeature); // user answer `cool` used
    const projectName = this.answers?.name || "awesome-project";
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(projectName),
      { project_slug: projectName },
      {},
      { globOptions: { dot: true } } //https://github.com/SBoudrias/mem-fs-editor/issues/86
    );
  }
};
