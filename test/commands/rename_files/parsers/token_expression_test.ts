import { assertEquals } from "../../../deps.ts";
import * as TokenExp from "../../../../lib/commands/rename_files/parsers/token_expression.ts";
const { TBracketIdentity } = TokenExp.__private__;

Deno.test("should identify bracket and non-bracket characters", (): void => {
  assertEquals(TokenExp.identifyCharacter("{"), TBracketIdentity.LeftBracket);
  assertEquals(TokenExp.identifyCharacter("}"), TBracketIdentity.RightBracket);
  assertEquals(TokenExp.identifyCharacter("a"), TBracketIdentity.Other);
  assertEquals(TokenExp.identifyCharacter(""), TBracketIdentity.Other);
});

Deno.test("should generate an interpolated string", (): void => {
  assertEquals(
    TokenExp.generateInterpolatedString("x", "{id}-{title}-words.md"),
    "`${x['id']}-${x['title']}-words.md`",
  );

  assertEquals(
    TokenExp.generateInterpolatedString("x", "words-{id}-{title}"),
    "`words-${x['id']}-${x['title']}`",
  );

  assertEquals(
    TokenExp.generateInterpolatedString("x", "words-{-words.md"),
    "`words--words.md`",
  );

  assertEquals(
    TokenExp.generateInterpolatedString("x", "words-}-words.md"),
    "`words--words.md`",
  );
});
