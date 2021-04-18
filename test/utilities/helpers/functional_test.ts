import { Asserts } from "DepsTest";
import { HelpersUtilities as H$ } from "Utilities";
const { assertEquals, assertThrows } = Asserts;
const assert: any = Asserts.assert;

Deno.test({
  name: "suite :: UTILITIES/HELPERS/FUNCTIONAL",
  ignore: true,
  fn() {},
});

Deno.test("composeFunctions() should compose functions", () => {
  const addOne = (x: number) => x + 1;

  let actual01 = H$.composeFunctions()
    .apply(addOne)
    .apply(addOne)
    .applyIf(true, addOne)
    .applyIf(false, addOne);

  assertThrows(() => actual01.result);
  assertEquals(actual01.compose(0), 3);

  let actual02 = H$.composeFunctions(0)
    .apply(addOne)
    .apply(addOne)
    .applyIf(true, addOne)
    .applyIf(false, addOne);

  assertEquals(actual02.result, 3);
  assertEquals(actual02.compose(0), 3);
});

Deno.test("composeFunctions() should not calculate the result if there was no argument", () => {
  const getValue = (obj: any) => obj.key1.key2;

  let actual = H$.composeFunctions()
    .apply(getValue)
    .apply(getValue)
    .compose;

  assert(typeof actual, "function");
});

Deno.test("identity() should return the argument identity", () => {
  assert(H$.identity("hello"), "hello");
});

Deno.test("doIf() should return either function depending on the condition", () => {
  const mayPass = (x: number) => {
    assertEquals(x, 42);
  };
  const willPass = () => {
    assert(true);
  };
  const willFail = () => {
    assert(false);
  };

  H$.doIf(true, willPass, willFail)();
  H$.doIf(false, willFail, willPass)();
  H$.doIf(true, mayPass, willFail)(42);
});

Deno.test("doOnlyIf() should return a single function depending on the condition", () => {
  const mayPass = (x: number) => {
    assertEquals(x, 42);
  };
  const willPass = () => {
    assert(true);
  };
  const willFail = () => {
    assert(false);
  };

  H$.doOnlyIf(true, willPass)();
  H$.doOnlyIf(false, willFail)();
  H$.doOnlyIf(true, mayPass)(42);
});

Deno.test("isObjectLiteral() should check if the argument is an object", () => {
  [
    [{}, true, "object literal"],
    [[], false, "array"],
    [null, false, "null"],
    [5, false, "number"],
    ["peach", false, "string"],
    [true, false, "boolean"],
    [undefined, false, "undefined"],
  ].forEach((test) => {
    const actual = H$.isObjectLiteral(test[0]);
    assertEquals(actual, test[1], test[2] as string);
  });
});

Deno.test("isEmpty() should check if the argument is empty", () => {
  [
    [null, true, "null"],
    [undefined, true, "undefined"],
    ["", true, "empty string"],
    [NaN, true, "NaN"],
    [[], true, "empty array"],
    [{}, true, "empty object"],
    ["peach", false, "string is not empty"],
    [[1, 2, 3], false, "array is not empty"],
    [{ hello: "world" }, false, "object is not empty"],
  ].forEach((test) => {
    const actual = H$.isEmpty(test[0]);
    assertEquals(actual, test[1], test[2] as string);
  });
});
