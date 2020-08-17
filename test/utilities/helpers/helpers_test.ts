import { assert, assertEquals, assertThrows } from "../../deps.ts";
import * as FS$ from "../../../lib/utilities/file_system/file_system.ts";
import * as H$ from "../../../lib/utilities/helpers/helpers.ts";

Deno.test("should compose functions", () => {
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

Deno.test("should not calculate the result if there was no argument", () => {
  const getValue = (obj: any) => obj.key1.key2;

  let actual = H$.composeFunctions()
    .apply(getValue)
    .apply(getValue)
    .compose;

  assert(typeof actual, "function");
});

Deno.test("should return the argument identity", () => {
  assert(H$.identity("hello"), "hello");
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

  H$.doIf(true, willPass, willFail)();
  H$.doIf(false, willFail, willPass)();
  H$.doIf(true, mayPass, willFail)(42);
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

  H$.doOnlyIf(true, willPass)();
  H$.doOnlyIf(false, willFail)();
  H$.doOnlyIf(true, mayPass)(42);
});

Deno.test("should check if the argument is an object", () => {
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

Deno.test("should check if the argument is empty", () => {
  [
    [null, true, "null"],
    [undefined, true, "undefined"],
    ["", true, "empty string"],
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

Deno.test("should replace spaces with dashes", (): void => {
  let actual = H$.dasherize("hello world and hi there");
  assertEquals(actual, "hello-world-and-hi-there");

  actual = H$.dasherize("");
  assertEquals(actual, "");
});

Deno.test("should inject pretty print into a dictionary object", () => {
  const actual = H$.proxyPrintOnAccess({
    number: 42,
    boolean: true,
    array: ["hello", "world"],
    null: null,
    map: {
      a: 1,
      b: "peach",
      c: true,
      d: {
        e: 2,
        f: 3,
        g: {
          h: 4,
          i: 5,
        },
      },
    },
  });

  assertEquals(actual.number, "42");
  assertEquals(actual.boolean, "true");
  assertEquals(actual.array, "hello,world");
  assertEquals(actual.null, "null");
  assertEquals(actual.map, "a=1,b=peach,c=true,e=2,f=3,h=4,i=5");
});

Deno.test("should find the first example", () => {
  const filler: FS$.TReadResult = {
    fileContent: "",
    fileName: "",
    meta: false,
    path: "",
    yaml: {},
  };

  const list: FS$.TReadResult[] = [
    {} as FS$.TReadResult,
    { ...filler, fileName: "match", meta: true },
    { ...filler, fileName: "no match" },
  ];

  const test = (arg: FS$.TReadResult) => arg.fileName === "match";
  const firstExample = H$.findFirstExample(list, test);
  assertEquals(firstExample?.meta, true);
});
