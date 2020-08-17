import { assertEquals } from "../../deps.ts";
import { ParsersUtilities as TE$ } from "../../../lib/utilities/mod.ts";

Deno.test("should determine if a pattern contains a token", () => {
  assertEquals(TE$.hasTokenExp(""), false);
  assertEquals(TE$.hasTokenExp("{"), false);
  assertEquals(TE$.hasTokenExp("}"), false);
  assertEquals(TE$.hasTokenExp("}{"), false);
  assertEquals(TE$.hasTokenExp("abc}def{ghi"), false);
  assertEquals(TE$.hasTokenExp("abc}defghi"), false);
  assertEquals(TE$.hasTokenExp("abcdef{ghi"), false);
  assertEquals(TE$.hasTokenExp("abc{def}ghi"), true);
});

Deno.test("should identify bracket and non-bracket characters", () => {
  assertEquals(TE$.identifyBracket("{"), TE$.TTokenExpBracket.LeftBracket);
  assertEquals(TE$.identifyBracket("}"), TE$.TTokenExpBracket.RightBracket);
  assertEquals(TE$.identifyBracket("a"), TE$.TTokenExpBracket.Other);
  assertEquals(TE$.identifyBracket(""), TE$.TTokenExpBracket.Other);
});

Deno.test("should generate an interpolated string", () => {
  assertEquals(
    TE$.generateTemplateStrFromTokenExp("x", "{id}-{title}-words.md"),
    "`${x['id']}-${x['title']}-words.md`",
  );

  assertEquals(
    TE$.generateTemplateStrFromTokenExp("x", "words-{id}-{title}"),
    "`words-${x['id']}-${x['title']}`",
  );

  assertEquals(
    TE$.generateTemplateStrFromTokenExp("x", "words-{-words.md"),
    "`words--words.md`",
  );

  assertEquals(
    TE$.generateTemplateStrFromTokenExp("x", "words-}-words.md"),
    "`words--words.md`",
  );
});

Deno.test("should generate a getter for a token expression", () => {
  const data = { id: 123 };
  const get = TE$.generateGetterFromTokenExp("this-{id}.md");
  assertEquals(get(data), "this-123.md");
});
