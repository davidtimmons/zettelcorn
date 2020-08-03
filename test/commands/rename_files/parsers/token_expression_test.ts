import { assertEquals } from "../../../deps.ts";
import {
  __private__,
  generateInterpolatedString,
  identifyCharacter,
} from "../../../../lib/commands/rename_files/parsers/token_expression.ts";
const { TBracketIdentity } = __private__;

Deno.test("should identify bracket and non-bracket characters", (): void => {
  assertEquals(identifyCharacter("{"), TBracketIdentity.LeftBracket);
  assertEquals(identifyCharacter("}"), TBracketIdentity.RightBracket);
  assertEquals(identifyCharacter("a"), TBracketIdentity.Other);
  assertEquals(identifyCharacter(""), TBracketIdentity.Other);
});

Deno.test("should generate an interpolated string", (): void => {
  let goal: string = "";
  goal = "`${x['id']}-${x['title']}-words.md`";
  assertEquals(generateInterpolatedString("x", "{id}-{title}-words.md"), goal);

  goal = "`words-${x['id']}-${x['title']}`";
  assertEquals(generateInterpolatedString("x", "words-{id}-{title}"), goal);

  goal = "`words--words.md`";
  assertEquals(generateInterpolatedString("x", "words-{-words.md"), goal);

  goal = "`words--words.md`";
  assertEquals(generateInterpolatedString("x", "words-}-words.md"), goal);
});
