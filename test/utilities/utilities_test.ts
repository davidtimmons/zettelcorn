import { assert, assertEquals } from "../deps.ts";
import * as $ from "../../lib/utilities/utilities.ts";

Deno.test("should return the argument identity", () => {
  assert($.identity("hello"), "hello");
});

Deno.test("should return either function depending on the condition", () => {
  const mayPass = (x: number) => {
    assertEquals(x, 42);
  };
  const willPass = () => {
    assert(true);
  };
  const willFail = () => {
    assert(false);
  };

  $.doIf(true, willPass, willFail)();
  $.doIf(false, willFail, willPass)();
  $.doIf(true, mayPass, willFail)(42);
});

Deno.test("should return a single function depending on the condition", () => {
  const mayPass = (x: number) => {
    assertEquals(x, 42);
  };
  const willPass = () => {
    assert(true);
  };
  const willFail = () => {
    assert(false);
  };

  $.doOnlyIf(true, willPass)();
  $.doOnlyIf(false, willFail)();
  $.doOnlyIf(true, mayPass)(42);
});
