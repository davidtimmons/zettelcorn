import { assertEquals, Path, Utilities as $ } from "../../deps.ts";
import { InjectTitle } from "../../../lib/commands/inject_title/mod.ts";
const { _yamlTransformation } = InjectTitle.__private__;

const MENU_OPTIONS = Object.freeze({
  directory: "",
  markdown: false,
  merge: false,
  recursive: false,
  silent: true,
  skip: false,
  verbose: false,
});

const TRANSFORM_OPTIONS = Object.freeze({
  extension: "",
  fileContent: "",
  fileYAML: Object.freeze({}),
  isDirectory: false,
  name: "",
  path: "",
});

Deno.test(
  {
    name: "suite :: COMMANDS/INJECT_TITLE/INJECT_TITLE",
    ignore: true,
    fn() {},
  },
);

Deno.test("_yamlTransformation() should inject a title into a YAML object", () => {
  const actual01 = _yamlTransformation(MENU_OPTIONS, { ...TRANSFORM_OPTIONS });
  assertEquals(actual01, { title: "" });

  const actual02 = _yamlTransformation(MENU_OPTIONS, {
    ...TRANSFORM_OPTIONS,
    fileContent: "# Hello World",
  });
  assertEquals(actual02, { title: "Hello World" });

  const actual03 = _yamlTransformation(MENU_OPTIONS, {
    ...TRANSFORM_OPTIONS,
    fileContent: "Hello World",
    fileYAML: { title: "Foo Bar Baz" },
  });
  assertEquals(actual03, { title: "Foo Bar Baz" });

  const actual04 = _yamlTransformation(MENU_OPTIONS, {
    ...TRANSFORM_OPTIONS,
    fileContent: "# Hello World",
    fileYAML: { title: "Foo Bar Baz" },
  });
  assertEquals(actual04, { title: "Hello World" });
});

Deno.test("_yamlTransformation() should handle menu options when injecting a title", () => {
  const actual = _yamlTransformation({
    ...MENU_OPTIONS,
    skip: true,
  }, {
    ...TRANSFORM_OPTIONS,
    fileContent: "# Hello World",
    fileYAML: { title: "Foo Bar Baz" },
  });
  assertEquals(actual, { title: "Foo Bar Baz" }, "skip: true");
});

Deno.test("run() should inject titles into all files", async () => {
  // setup
  const basePath = "./test/test_data/inject/title";
  const test01Path = Deno.realPathSync(Path.join(basePath, "test01.md"));
  const test02Path = Deno.realPathSync(Path.join(basePath, "test02.md"));
  const test01Content = Deno.readTextFileSync(test01Path);
  const test02Content = Deno.readTextFileSync(test02Path);

  // test before
  const test01YAML = $.parseFrontmatter(test01Content);
  const test02YAML = $.parseFrontmatter(test02Content);
  assertEquals(test01YAML.title, "My Test");
  assertEquals(test02YAML.title, undefined);

  // modify files
  await InjectTitle.run({
    ...MENU_OPTIONS,
    directory: basePath,
    silent: true,
  });

  const test01NewContent = Deno.readTextFileSync(test01Path);
  const test02NewContent = Deno.readTextFileSync(test02Path);
  Deno.writeTextFileSync(test01Path, test01Content);
  Deno.writeTextFileSync(test02Path, test02Content);

  // test after
  const test01NewYAML = $.parseFrontmatter(test01NewContent);
  const test02NewYAML = $.parseFrontmatter(test02NewContent);
  assertEquals(test01NewYAML.title, "Hello World 01");
  assertEquals(test02NewYAML.title, "Hello World 02");
});
