import { Asserts, Path, Utilities as $ } from "DepsTest";
import { ParsersUtilities as T$ } from "Utilities";
const { assertEquals } = Asserts;

Deno.test({ name: "suite :: UTILITIES/PARSERS/TAGS", ignore: true, fn() {} });

Deno.test("findHeuristicTags() should find topic tags in a document using a heuristic", () => {
  const document = $.formatWithEOL([
    "#topic #tag #row",
    "Hello world!",
    "Another #thing down here.",
  ]);

  assertEquals(T$.findHeuristicTags(document), ["#topic", "#tag", "#row"]);
});

Deno.test("findHeuristicTags() should find all topic tags if the heuristic fails", () => {
  const document = $.formatWithEOL([
    "#topic",
    "Hello world!",
    "Another #thing down here.",
  ]);

  assertEquals(T$.findHeuristicTags(document), ["#topic", "#thing"]);
});

Deno.test("findAllTags() should find all tags", () => {
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

Deno.test("removeTagDelimiters() should strip tag delimiters", () => {
  const tagsRaw = T$.findAllTags("#hello ##world #foo-bar_baz05 # something");
  const tags = T$.removeTagDelimiters(tagsRaw);
  assertEquals(tags.length, 3);
  assertEquals(tags, ["hello", "world", "foo-bar_baz05"]);
});

Deno.test("findKeywords() should find all keywords", () => {
  const kw = T$.findKeywords(
    false,
    "#hello ##world \r\n#foo-bar_baz05 # something",
  );
  assertEquals(kw.length, 3);
  assertEquals(kw, ["hello", "world", "foo-bar_baz05"]);
});

Deno.test("findAllTags() should exclude empty tags and those with only punctuation", () => {
  // setup
  const basePath = "./test/test_data/filter";
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

Deno.test("detectTagRows() should roughly detect a row of topic tags", () => {
  // setup
  const basePath = "./test/test_data/filter";
  const filePath = Deno.realPathSync(Path.join(basePath, "test_tags.md"));
  const testTagRows = T$.detectTagRows(Deno.readTextFileSync(filePath));

  // test
  assertEquals(testTagRows, [
    "#test #tags #, #&-^$* #a-z #nü",
    "Maybe we have another line of topic tags: #topic-foo #topic-bar",
  ]);
});
