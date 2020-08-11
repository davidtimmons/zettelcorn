import { assert, assertEquals, equal } from "../../deps.ts";
import * as Y$ from "../../../lib/utilities/parsers/yaml_frontmatter.ts";

Deno.test("should parse YAML content", (): void => {
  assert(equal(Y$.parseYAML("hello: world"), { hello: "world" }));
});

Deno.test("should extract Markdown frontmatter", (): void => {
  let actual = Y$.extractFrontmatter("---id: 123---");
  assertEquals(actual, "id: 123");

  actual = Y$.extractFrontmatter("---id: 123");
  assertEquals(actual, "");

  actual = Y$.extractFrontmatter("id: 123---");
  assertEquals(actual, "");

  actual = Y$.extractFrontmatter("-id: 123---");
  assertEquals(actual, "");

  actual = Y$.extractFrontmatter("---id: 123--");
  assertEquals(actual, "");

  actual = Y$.extractFrontmatter("");
  assertEquals(actual, "");

  actual = Y$.extractFrontmatter("id: 123");
  assertEquals(actual, "");
});

Deno.test("should parse YAML from Markdown frontmatter", (): void => {
  let actual = Y$.parseFrontmatter("---id: 123---");
  assert(equal(actual, { id: 123 }));

  actual = Y$.parseFrontmatter('---id: 123\ntitle: "My Title"---');
  assert(equal(actual, { id: 123, title: "My Title" }));

  actual = Y$.parseFrontmatter("");
  assert(equal(actual, {}));
});
