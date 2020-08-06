import { assert, assertEquals, assertThrows } from "../deps.ts";
import * as $ from "../../lib/utilities/utilities.ts";

Deno.test("should compose functions", (): void => {
  const addOne = (x: number) => x + 1;

  let actual01 = $.composeFunctions()
    .apply(addOne)
    .apply(addOne)
    .applyIf(true, addOne)
    .applyIf(false, addOne);

  assertThrows(() => actual01.result);
  assertEquals(actual01.compose(0), 3);

  let actual02 = $.composeFunctions(0)
    .apply(addOne)
    .apply(addOne)
    .applyIf(true, addOne)
    .applyIf(false, addOne);

  assertEquals(actual02.result, 3);
  assertEquals(actual02.compose(0), 3);
});

Deno.test("should not calculate the result if there was no argument", (): void => {
  const getValue = (obj: any) => obj.key1.key2;

  let actual = $.composeFunctions()
    .apply(getValue)
    .apply(getValue)
    .compose;

  assert(typeof actual, "function");
});

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
