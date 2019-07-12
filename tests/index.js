var helplers = require("yeoman-test");
var assert = require("yeoman-assert");
var path = require("path");

describe("expressjs-rest:app", function() {
  it("generate a project", function() {
    return helplers
      .run(path.join(__dirname, "../generators/app"))
      .withOptions({ foo: "bar" })
      .withArguments(["name-x"])
      .withPrompts({ name: "test" })
      .withLocalConfig({ lang: "en" })
      .then(function() {
        assert.file("test/README.md");
      });
  });
});
