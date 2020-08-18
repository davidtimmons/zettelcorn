import {
  assertEquals,
  assertThrows,
  Path,
  Utilities as $,
} from "../../deps.ts";
import * as InjectKeywords from "../../../lib/commands/inject_keywords/inject_keywords.ts";
const { _yamlTransformation } = InjectKeywords.__private__;

Deno.test("should add keywords to a YAML object", () => {
  // setup
  const menuOptions = {
    directory: "",
    heuristic: false,
    markdown: false,
    merge: false,
    recursive: false,
    verbose: false,
  };
  const transformOptions = {
    extension: "",
    fileContent: "",
    fileYAML: {},
    isDirectory: false,
    name: "",
    path: "",
  };

  // test
  const actual01 = _yamlTransformation(menuOptions, { ...transformOptions });
  assertEquals(actual01, { keywords: [] });

  const actual02 = _yamlTransformation(menuOptions, {
    ...transformOptions,
    fileContent: "#hello #world",
    fileYAML: { keywords: ["hello", "world"] },
  });
  assertEquals(actual02, { keywords: ["hello", "world"] });

  const actual03 = _yamlTransformation(menuOptions, {
    ...transformOptions,
    fileContent: "#hello #world",
    fileYAML: { keywords: ["foo"] },
  });
  assertEquals(actual03, { keywords: ["hello", "world"] });

  const actual04 = _yamlTransformation({
    ...menuOptions,
    merge: true,
  }, {
    ...transformOptions,
    fileContent: "#hello #world",
    fileYAML: { keywords: ["foo"] },
  });
  assertEquals(actual04, { keywords: ["hello", "world", "foo"] });

  const shouldThrow = () =>
    _yamlTransformation({
      ...menuOptions,
      merge: true,
    }, {
      ...transformOptions,
      fileContent: "#hi",
      fileYAML: { keywords: 42 },
    });
  assertThrows(shouldThrow);
});

Deno.test("should find all keywords and inject them into files", async () => {
  // setup
  const basePath = "./test/test_data/injecting/keywords";
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
    directory: basePath,
    heuristic: false,
    merge: true,
    markdown: false,
    recursive: false,
    silent: true,
    verbose: false,
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
