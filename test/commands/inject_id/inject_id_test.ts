import { assertEquals, Path, Utilities as $ } from "../../deps.ts";
import { InjectId } from "../../../lib/commands/inject_id/mod.ts";
const { _yamlTransformation } = InjectId.__private__;

Deno.test("should add an ID to a YAML object", () => {
  const filler = {
    extension: "",
    fileContent: "",
    fileYAML: {},
    isDirectory: false,
    name: "",
    path: "",
  };
  const re = /\d{14}/;

  assertEquals(_yamlTransformation(re, { ...filler }), { id: null });

  assertEquals(
    _yamlTransformation(re, {
      ...filler,
      fileContent: "12345678987654",
    }),
    { id: 12345678987654 },
  );

  assertEquals(
    _yamlTransformation(re, {
      ...filler,
      fileContent: "12345678987654",
      fileYAML: { id: 123 },
    }),
    { id: 12345678987654 },
  );

  assertEquals(
    _yamlTransformation(re, {
      ...filler,
      fileContent: "",
      fileYAML: { id: 123 },
    }),
    { id: 123 },
  );

  assertEquals(
    _yamlTransformation(re, {
      ...filler,
      fileContent: "---\r\nid: 12345678987654\r\n---\r\n98765432123456",
    }),
    { id: 98765432123456 },
  );
});

Deno.test("should inject IDs into all files", async () => {
  // setup
  const basePath = "./test/test_data/injecting/id";
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
    directory: basePath,
    regex: /\d{14}/,
    markdown: false,
    recursive: false,
    silent: true,
    verbose: false,
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
