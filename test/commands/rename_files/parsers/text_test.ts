import { assertEquals } from "../../../deps.ts";
import * as Text from "../../../../lib/commands/rename_files/parsers/text.ts";

Deno.test("should replace spaces with dashes", (): void => {
  let actual = Text.dasherize("hello world and hi there");
  assertEquals(actual, "hello-world-and-hi-there");

  actual = Text.dasherize("");
  assertEquals(actual, "");
});
