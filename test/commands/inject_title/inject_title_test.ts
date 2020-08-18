import { assertEquals, Path, Utilities as $ } from "../../deps.ts";
import { InjectTitle } from "../../../lib/commands/inject_title/mod.ts";
const { _yamlTransformation } = InjectTitle.__private__;

Deno.test("should add a title to a YAML object", () => {
  const filler = {
    extension: "",
    fileContent: "",
    fileYAML: {},
    isDirectory: false,
    name: "",
    path: "",
  };

  assertEquals(_yamlTransformation({ ...filler }), { title: "" });

  assertEquals(
    _yamlTransformation({
      ...filler,
      fileContent: "# Hello World",
    }),
    { title: "Hello World" },
  );

  assertEquals(
    _yamlTransformation({
      ...filler,
      fileContent: "Hello World",
      fileYAML: { title: "Foo Bar Baz" },
    }),
    { title: "Foo Bar Baz" },
  );

  assertEquals(
    _yamlTransformation({
      ...filler,
      fileContent: "# Hello World",
      fileYAML: { title: "Foo Bar Baz" },
    }),
    { title: "Hello World" },
  );
});

Deno.test("should inject titles into all files", async () => {
  // setup
  const basePath = "./test/test_data/injecting/title";
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
    directory: basePath,
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
  assertEquals(test01NewYAML.title, "Hello World 01");
  assertEquals(test02NewYAML.title, "Hello World 02");
});
