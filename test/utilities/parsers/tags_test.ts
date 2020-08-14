import { assertEquals, Path } from "../../deps.ts";
import * as T$ from "../../../lib/utilities/parsers/tags.ts";

Deno.test("should find all tags", () => {
  [
    ["", 0, []],
    [
      "#hello ##world #foo-bar_baz05 # something",
      3,
      ["#hello", "##world", "#foo-bar_baz05"],
    ],
  ].forEach((test) => {
    const tags = T$.findTags(test[0] as string);
    assertEquals(tags.length, test[1]);
    assertEquals(tags, test[2]);
  });
});

Deno.test("should strip tag delimiters", () => {
  const tagsRaw = T$.findTags("#hello ##world #foo-bar_baz05 # something");
  const tags = T$.stripTagDelimiters(tagsRaw);
  assertEquals(tags.length, 3);
  assertEquals(tags, ["hello", "world", "foo-bar_baz05"]);
});

Deno.test("should find all keywords", () => {
  const kw = T$.findKeywords("#hello ##world \r\n#foo-bar_baz05 # something");
  assertEquals(kw.length, 3);
  assertEquals(kw, ["hello", "world", "foo-bar_baz05"]);
});

Deno.test("should remove empty tags and those with only punctuation", () => {
  // setup
  const basePath = "./test/test_data/filtering";
  const filePath = Deno.realPathSync(Path.join(basePath, "test_tags.md"));
  const testTags = T$.findTags(Deno.readTextFileSync(filePath));

  // test
  assertEquals(testTags, ["#test", "#tags", "#a-z", "#5."]);
});
