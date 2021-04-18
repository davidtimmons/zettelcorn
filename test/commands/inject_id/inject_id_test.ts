import { Asserts, Path, Utilities as $ } from "DepsTest";
import { InjectId } from "CommandInjectId";
const { assertEquals } = Asserts;
const { _yamlTransformation } = InjectId.__private__;

const MENU_OPTIONS = Object.freeze({
  directory: "",
  markdown: false,
  merge: false,
  recursive: false,
  regex: /\d{14}/,
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
  { name: "suite :: COMMANDS/INJECT_ID/INJECT_ID", ignore: true, fn() {} },
);

Deno.test("_yamlTransformation() should inject an ID into a YAML object", () => {
  const actual01 = _yamlTransformation(MENU_OPTIONS, { ...TRANSFORM_OPTIONS });
  assertEquals(actual01, { id: null });

  const actual02 = _yamlTransformation(MENU_OPTIONS, {
    ...TRANSFORM_OPTIONS,
    fileContent: "12345678987654",
  });
  assertEquals(actual02, { id: 12345678987654 });

  const actual03 = _yamlTransformation(MENU_OPTIONS, {
    ...TRANSFORM_OPTIONS,
    fileContent: "12345678987654",
    fileYAML: { id: 123 },
  });
  assertEquals(actual03, { id: 12345678987654 });

  const actual04 = _yamlTransformation(MENU_OPTIONS, {
    ...TRANSFORM_OPTIONS,
    fileContent: "",
    fileYAML: { id: 123 },
  });
  assertEquals(actual04, { id: 123 });

  const actual05 = _yamlTransformation(MENU_OPTIONS, {
    ...TRANSFORM_OPTIONS,
    fileContent: "---\r\nid: 12345678987654\r\n---\r\n98765432123456",
  });
  assertEquals(actual05, { id: 98765432123456 });
});

Deno.test("_yamlTransformation() should handle menu options when injecting an ID", () => {
  const actual = _yamlTransformation({
    ...MENU_OPTIONS,
    skip: true,
  }, {
    ...TRANSFORM_OPTIONS,
    fileContent: "12345678987654",
    fileYAML: { id: 123 },
  });
  assertEquals(actual, { id: 123 }, "skip: true");
});

Deno.test("run() should inject IDs into all files", async () => {
  // setup
  const basePath = "./test/test_data/inject/id";
  const test01Path = Deno.realPathSync(Path.join(basePath, "test01.md"));
  const test02Path = Deno.realPathSync(Path.join(basePath, "test02.md"));
  const test03Path = Deno.realPathSync(Path.join(basePath, "test03.md"));
  const test01Content = Deno.readTextFileSync(test01Path);
  const test02Content = Deno.readTextFileSync(test02Path);
  const test03Content = Deno.readTextFileSync(test03Path);

  // test before
  const test01YAML = $.parseFrontmatter(test01Content);
  const test02YAML = $.parseFrontmatter(test02Content);
  const test03YAML = $.parseFrontmatter(test03Content);
  assertEquals(test01YAML.id, 78987654321234);
  assertEquals(test02YAML, {});
  assertEquals(test03YAML, {});

  // modify files
  await InjectId.run({
    ...MENU_OPTIONS,
    directory: basePath,
    silent: true,
  });

  const test01NewContent = Deno.readTextFileSync(test01Path);
  const test02NewContent = Deno.readTextFileSync(test02Path);
  const test03NewContent = Deno.readTextFileSync(test03Path);
  Deno.writeTextFileSync(test01Path, test01Content);
  Deno.writeTextFileSync(test02Path, test02Content);
  Deno.writeTextFileSync(test03Path, test03Content);

  // test after
  const test01NewYAML = $.parseFrontmatter(test01NewContent);
  const test02NewYAML = $.parseFrontmatter(test02NewContent);
  const test03NewYAML = $.parseFrontmatter(test03NewContent);
  assertEquals(test01NewYAML.id, 45678987654321);
  assertEquals(test02NewYAML.id, 12345678987654);
  assertEquals(test03NewYAML.id, null);
});
