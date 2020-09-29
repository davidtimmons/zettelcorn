import {
  assertEquals,
  assertThrows,
  Path,
  Utilities as $,
} from "../../deps.ts";
import * as InjectKeywords from "../../../lib/commands/inject_keywords/inject_keywords.ts";
const { _yamlTransformation } = InjectKeywords.__private__;

const MENU_OPTIONS = Object.freeze({
  directory: "",
  heuristic: false,
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
    name: "suite :: COMMANDS/INJECT_KEYWORDS/INJECT_KEYWORDS",
    ignore: true,
    fn() {},
  },
);

Deno.test("_yamlTransformation() should inject topic tags into a YAML object", () => {
  const actual01 = _yamlTransformation(MENU_OPTIONS, { ...TRANSFORM_OPTIONS });
  assertEquals(actual01, { keywords: [] });

  const actual02 = _yamlTransformation(MENU_OPTIONS, {
    ...TRANSFORM_OPTIONS,
    fileContent: "#hello #world",
    fileYAML: { keywords: ["hello", "world"] },
  });
  assertEquals(actual02, { keywords: ["hello", "world"] });

  const actual03 = _yamlTransformation(MENU_OPTIONS, {
    ...TRANSFORM_OPTIONS,
    fileContent: "#hello #world",
    fileYAML: { keywords: ["foo"] },
  });
  assertEquals(actual03, { keywords: ["hello", "world"] });

  const shouldThrow = () =>
    _yamlTransformation({
      ...MENU_OPTIONS,
      merge: true,
    }, {
      ...TRANSFORM_OPTIONS,
      fileContent: "#hi",
      fileYAML: { keywords: 42 },
    });
  assertThrows(shouldThrow);
});

Deno.test("_yamlTransformation() should handle menu options when injecting topic tags", () => {
  const actual01 = _yamlTransformation({
    ...MENU_OPTIONS,
    skip: true,
  }, {
    ...TRANSFORM_OPTIONS,
    fileContent: "#hello #world",
    fileYAML: { keywords: ["foo"] },
  });
  assertEquals(actual01, { keywords: ["foo"] }, "skip");

  const actual02 = _yamlTransformation({
    ...MENU_OPTIONS,
    merge: true,
  }, {
    ...TRANSFORM_OPTIONS,
    fileContent: "#hello #world",
    fileYAML: { keywords: ["foo"] },
  });
  assertEquals(actual02, { keywords: ["hello", "world", "foo"] }, "merge");
});

Deno.test("run() should find all keywords and inject them into files", async () => {
  // setup
  const basePath = "./test/test_data/inject/keywords";
  const test01Path = Deno.realPathSync(Path.join(basePath, "test01.md"));
  const test02Path = Deno.realPathSync(Path.join(basePath, "test02.md"));
  const test01Content = Deno.readTextFileSync(test01Path);
  const test02Content = Deno.readTextFileSync(test02Path);

  // test before
  const test01YAML = $.parseFrontmatter(test01Content);
  const test02YAML = $.parseFrontmatter(test02Content);
  assertEquals(test01YAML.keywords, ["foo"]);
  assertEquals(test02YAML.keywords, undefined);

  // modify files
  await InjectKeywords.run({
    ...MENU_OPTIONS,
    directory: basePath,
    merge: true,
    silent: true,
  });

  const test01NewContent = Deno.readTextFileSync(test01Path);
  const test02NewContent = Deno.readTextFileSync(test02Path);
  Deno.writeTextFileSync(test01Path, test01Content);
  Deno.writeTextFileSync(test02Path, test02Content);

  // test after
  const test01NewYAML = $.parseFrontmatter(test01NewContent);
  const test02NewYAML = $.parseFrontmatter(test02NewContent);
  assertEquals(test01NewYAML.keywords, ["hello", "world", "foo"]);
  assertEquals(
    test02NewYAML.keywords,
    ["hello", "world", "another", "thing", "down", "here"],
  );
});
