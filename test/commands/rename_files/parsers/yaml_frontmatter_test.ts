import {
  assert,
  assertEquals,
  assertStringContains,
  equal,
} from "../../../deps.ts";
import * as YAMLFrontmatter from "../../../../lib/commands/rename_files/parsers/yaml_frontmatter.ts";

Deno.test("should parse YAML content", (): void => {
  assert(equal(YAMLFrontmatter.parseYAML("hello: world"), { hello: "world" }));
});

Deno.test("should extract Markdown frontmatter", (): void => {
  let actual = YAMLFrontmatter.extractFrontmatter("---id: 123---");
  assertEquals(actual, "id: 123");

  actual = YAMLFrontmatter.extractFrontmatter("---id: 123");
  assertEquals(actual, "");

  actual = YAMLFrontmatter.extractFrontmatter("id: 123---");
  assertEquals(actual, "");

  actual = YAMLFrontmatter.extractFrontmatter("-id: 123---");
  assertEquals(actual, "");

  actual = YAMLFrontmatter.extractFrontmatter("---id: 123--");
  assertEquals(actual, "");

  actual = YAMLFrontmatter.extractFrontmatter("");
  assertEquals(actual, "");

  actual = YAMLFrontmatter.extractFrontmatter("id: 123");
  assertEquals(actual, "");
});

Deno.test("should parse YAML from Markdown frontmatter", (): void => {
  let actual = YAMLFrontmatter.parseFrontmatter("---id: 123---");
  assert(equal(actual, { id: 123 }));

  actual = YAMLFrontmatter.parseFrontmatter('---id: 123\ntitle: "My Title"---');
  assert(equal(actual, { id: 123, title: "My Title" }));

  actual = YAMLFrontmatter.parseFrontmatter("");
  assert(equal(actual, {}));
});
