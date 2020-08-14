import { assertEquals, Path, Utilities as $ } from "../../deps.ts";
import * as T$ from "../../../lib/utilities/parsers/tags.ts";

Deno.test("should find topic tags in a document using a heuristic", () => {
  const document = $.formatWithEOL([
    "#topic #tag #row",
    "Hello world!",
    "Another #thing down here.",
  ]);

  assertEquals(T$.findHeuristicTags(document), ["#topic", "#tag", "#row"]);
});

Deno.test("should find all topic tags if the heuristic fails", () => {
  const document = $.formatWithEOL([
    "#topic",
    "Hello world!",
    "Another #thing down here.",
  ]);

  assertEquals(T$.findHeuristicTags(document), ["#topic", "#thing"]);
});

Deno.test("should find all tags", () => {
  [
    ["", 0, []],
    [
      "#hello ##world #foo-bar_baz05 # something",
      3,
      ["#hello", "##world", "#foo-bar_baz05"],
    ],
  ].forEach((test) => {
    const tags = T$.findAllTags(test[0] as string);
    assertEquals(tags.length, test[1]);
    assertEquals(tags, test[2]);
  });
});

Deno.test("should strip tag delimiters", () => {
  const tagsRaw = T$.findAllTags("#hello ##world #foo-bar_baz05 # something");
  const tags = T$.stripTagDelimiters(tagsRaw);
  assertEquals(tags.length, 3);
  assertEquals(tags, ["hello", "world", "foo-bar_baz05"]);
});

Deno.test("should find all keywords", () => {
  const kw = T$.findKeywords(
    false,
    "#hello ##world \r\n#foo-bar_baz05 # something",
  );
  assertEquals(kw.length, 3);
  assertEquals(kw, ["hello", "world", "foo-bar_baz05"]);
});

Deno.test("should remove empty tags and those with only punctuation", () => {
  // setup
  const basePath = "./test/test_data/filtering";
  const filePath = Deno.realPathSync(Path.join(basePath, "test_tags.md"));
  const testTags = T$.findAllTags(Deno.readTextFileSync(filePath));

  // test
  assertEquals(
    testTags,
    [
      "#test",
      "#tags",
      "#a-z",
      "#nü",
      "#topic-foo",
      "#topic-bar",
      "#42,",
      "#43,",
      "#44",
      "#5.",
    ],
  );
});

Deno.test("should roughly detect a row of topic tags", () => {
  // setup
  const basePath = "./test/test_data/filtering";
  const filePath = Deno.realPathSync(Path.join(basePath, "test_tags.md"));
  const testTagRows = T$.detectTagRows(Deno.readTextFileSync(filePath));

  // test
  assertEquals(testTagRows, [
    "#test #tags #, #&-^$* #a-z #nü",
    "Maybe we have another line of topic tags: #topic-foo #topic-bar",
  ]);
});
