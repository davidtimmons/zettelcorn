import { Asserts, Utilities as $ } from "DepsTest";
import { ParsersUtilities as T$ } from "Utilities";
const { assertEquals } = Asserts;

Deno.test({ name: "suite :: UTILITIES/PARSERS/TITLE", ignore: true, fn() {} });

Deno.test("findH1Title() should find the H1 Markdown title in a document", () => {
  assertEquals(T$.findH1Title(""), "");
  assertEquals(T$.findH1Title("## Hello World"), "");
  assertEquals(T$.findH1Title("   # Hello World"), "");

  assertEquals(
    T$.findH1Title($.formatWithEOL([
      "# This is an H1 title.",
      "This is some text.",
      "Another #thing down here.",
    ])),
    "# This is an H1 title.",
  );

  assertEquals(
    T$.findH1Title($.formatWithEOL([
      "#   ",
      "This is some text.",
      "     # This is another H1 title.    ",
      "Another #thing down here.",
    ])),
    "# This is another H1 title.",
  );
});

Deno.test("removeTitleDelimiter() should strip the title delimiter", () => {
  assertEquals(T$.removeTitleDelimiter(""), "");
  assertEquals(T$.removeTitleDelimiter("#"), "");
  assertEquals(T$.removeTitleDelimiter("# Hello World"), "Hello World");
  assertEquals(T$.removeTitleDelimiter("   # HI!!   "), "HI!!");
});

Deno.test("findTitle() should get the formatted document title", () => {
  assertEquals(T$.findTitle(""), "");
  assertEquals(T$.findTitle("#     Hello World   "), "Hello World");
});
