import { Asserts, Utilities as $ } from "DepsTest";
import { ParsersUtilities as Y$ } from "Utilities";
const { assertEquals, equal } = Asserts;
const assert: any = Asserts.assert;

Deno.test(
  {
    name: "suite :: UTILITIES/PARSERS/YAML_FRONTMATTER",
    ignore: true,
    fn() {},
  },
);

Deno.test("getDelimiterPositions() should get frontmatter delimiter positions", () => {
  assertEquals(Y$.getDelimiterPositions(""), [-1, -1]);
  assertEquals(Y$.getDelimiterPositions("---"), [0, -1]);
  assertEquals(Y$.getDelimiterPositions("--- ---"), [0, 4]);
});

Deno.test("hasFrontmatter() should determine if a file has frontmatter", () => {
  [
    [Y$.hasFrontmatter("--- hello world ---"), true],
    [Y$.hasFrontmatter("------"), true],
    [Y$.hasFrontmatter("---"), false],
    [Y$.hasFrontmatter(""), false],
  ].forEach((actual) => {
    assertEquals(actual[0], actual[1]);
  });
});

Deno.test("parseYAML() should parse YAML content", () => {
  assert(equal(Y$.parseYAML("hello: world"), { hello: "world" }));
});

Deno.test("extractFrontmatter() should extract Markdown frontmatter", () => {
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

Deno.test("parseFrontmatter() should parse YAML from Markdown frontmatter", () => {
  let actual = Y$.parseFrontmatter("---id: 123---");
  assertEquals(actual, { id: 123 });

  actual = Y$.parseFrontmatter('---id: 123\ntitle: "My Title"---');
  assertEquals(actual, { id: 123, title: "My Title" });

  actual = Y$.parseFrontmatter("");
  assertEquals(actual, {});
});

Deno.test("convertYAMLtoText() should convert a YAML object to text", () => {
  assertEquals(
    Y$.convertYAMLtoText({
      id: 123,
      title: "My Title",
      keywords: ["alpha", "numeric", "!!"],
    }),
    [
      "id: 123",
      "title: My Title",
      "keywords:",
      "  - alpha",
      "  - numeric",
      "  - '!!'",
      "",
    ].join("\n"),
  );
});

Deno.test("convertYAMLtoFrontmatter() should convert a YAML object to frontmatter", () => {
  assertEquals(
    Y$.convertYAMLtoFrontmatter({
      id: 123,
      title: "My Title",
      keywords: ["alpha", "numeric", "!!"],
    }),
    $.formatWithEOL([
      "---",
      "id: 123",
      "title: My Title",
      "keywords:",
      "  - alpha",
      "  - numeric",
      "  - '!!'",
      "---",
    ]),
  );
});

Deno.test("removeFrontmatter() should remove YAML frontmatter from a file", () => {
  assertEquals(Y$.removeFrontmatter("--- ---\r\nHello world"), "Hello world");
  assertEquals(
    Y$.removeFrontmatter("\r\n---Hello world"),
    "\r\n---Hello world",
  );
});

Deno.test("prependFrontmatter() should prepend frontmatter to a file", () => {
  const yaml = { id: 123, title: "Hello World" };
  const fileContent = "---\r\nidentifier: 456\r\n---\r\nMy Zettel\r\n";
  const actual = Y$.prependFrontmatter(fileContent, yaml);
  const test = $.formatWithEOL([
    "---",
    "id: 123",
    "title: Hello World",
    "---",
    "My Zettel",
    "",
  ]);

  assertEquals(actual, test);
});
