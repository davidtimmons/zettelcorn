import { assertEquals } from "../../deps.ts";
import { ParsersUtilities as TE$ } from "../../../lib/utilities/mod.ts";

Deno.test({
  name: "suite :: UTILITIES/PARSERS/TOKEN_EXPRESSION",
  ignore: true,
  fn() {},
});

Deno.test("hasTokenExp() should determine if a pattern contains a token", () => {
  assertEquals(TE$.hasTokenExp(""), false);
  assertEquals(TE$.hasTokenExp("{"), false);
  assertEquals(TE$.hasTokenExp("}"), false);
  assertEquals(TE$.hasTokenExp("}{"), false);
  assertEquals(TE$.hasTokenExp("abc}def{ghi"), false);
  assertEquals(TE$.hasTokenExp("abc}defghi"), false);
  assertEquals(TE$.hasTokenExp("abcdef{ghi"), false);
  assertEquals(TE$.hasTokenExp("abc{def}ghi"), true);
});

Deno.test("extractTokens() should find all tokens within a string", () => {
  const tokenList = {
    "{id}": { id: "id", pattern: 123 },
    "{test}": { id: "test", pattern: 456 },
    "{hello}": { id: "hello", pattern: "world" },
    "{world}": { id: "world", pattern: null },
  };

  assertEquals(TE$.extractTokens(tokenList, ""), {});
  assertEquals(TE$.extractTokens(tokenList, "{deno}"), {});
  assertEquals(TE$.extractTokens(tokenList, "{id}"), {
    "{id}": { id: "id", pattern: 123 },
  });
  assertEquals(TE$.extractTokens(tokenList, "{hello}"), {
    "{hello}": { id: "hello", pattern: "world" },
  });
  assertEquals(TE$.extractTokens(tokenList, " {id}\n-{test} "), {
    "{id}": { id: "id", pattern: 123 },
    "{test}": { id: "test", pattern: 456 },
  });
});

Deno.test("identifyBracket() should identify bracket and non-bracket characters", () => {
  assertEquals(TE$.identifyBracket("{"), TE$.TTokenExpBracket.LeftBracket);
  assertEquals(TE$.identifyBracket("}"), TE$.TTokenExpBracket.RightBracket);
  assertEquals(TE$.identifyBracket("a"), TE$.TTokenExpBracket.Other);
  assertEquals(TE$.identifyBracket(""), TE$.TTokenExpBracket.Other);
});

Deno.test("generateTemplateStrFromTokenExp() should generate an interpolated string", () => {
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

Deno.test("generateGetterFromTokenExp() should generate a getter for a token expression", () => {
  const data = { id: 123 };
  const get = TE$.generateGetterFromTokenExp("this-{id}.md");
  assertEquals(get(data), "this-123.md");
});
