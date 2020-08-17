import {
  assertEquals,
  assertThrows,
  Path,
  Utilities as $,
} from "../../deps.ts";
import * as InjectKeywords from "../../../lib/commands/inject_keywords/inject_keywords.ts";
const { _metaTransformation, _yamlTransformation } = InjectKeywords.__private__;

Deno.test("should find topic tags in a document", () => {
  // setup
  const document = $.formatWithEOL([
    "#topic #tag #row",
    "Hello world!",
    "Another #thing down here.",
  ]);
  const options: $.TTransformationOptions = {
    extension: "",
    fileContent: document,
    fileYAML: {},
    isDirectory: false,
    name: "",
    path: "",
  };

  // test
  assertEquals(_metaTransformation(true, options), ["#topic", "#tag", "#row"]);
  assertEquals(
    _metaTransformation(false, options),
    ["#topic", "#tag", "#row", "#thing"],
  );
});

Deno.test("should add keywords to a YAML object", () => {
  const yt = _yamlTransformation.bind(null, false);
  const filler = {
    extension: "",
    fileContent: "",
    fileYAML: {},
    isDirectory: false,
    name: "",
    path: "",
  };

  assertEquals(yt({ ...filler }), { keywords: [] });

  assertEquals(
    yt({
      ...filler,
      fileContent: "#hello #world",
      fileYAML: { keywords: ["hello", "world"] },
    }),
    { keywords: ["hello", "world"] },
  );

  assertEquals(
    yt({
      ...filler,
      fileContent: "#hello #world",
      fileYAML: { keywords: ["foo"] },
    }),
    { keywords: ["hello", "world", "foo"] },
  );

  assertThrows(() =>
    yt({ ...filler, fileContent: "#hi", fileYAML: { keywords: 42 } })
  );
});

Deno.test("should inject keywords into all files", async () => {
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
  assertEquals(test02NewYAML.keywords, ["hello", "world"]);
});