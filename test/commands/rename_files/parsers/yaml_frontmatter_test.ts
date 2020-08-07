import { assert, assertEquals, equal } from "../../../deps.ts";
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

Deno.test("should inject pretty print into a dictionary object", (): void => {
  const actual = YAMLFrontmatter.proxyPrintOnAccess({
    number: 42,
    boolean: true,
    array: ["hello", "world"],
    null: null,
    map: {
      a: 1,
      b: "peach",
      c: true,
      d: {
        e: 2,
        f: 3,
        g: {
          h: 4,
          i: 5,
        },
      },
    },
  });

  assertEquals(actual.number, "42");
  assertEquals(actual.boolean, "true");
  assertEquals(actual.array, "hello,world");
  assertEquals(actual.null, "null");
  assertEquals(actual.map, "a=1,b=peach,c=true,e=2,f=3,h=4,i=5");
});
