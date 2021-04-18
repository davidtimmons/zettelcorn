import { Asserts } from "../../deps.ts";
import {
  FileSystemUtilities as FS$,
  HelpersUtilities as H$,
} from "../../../lib/utilities/mod.ts";
const { assertEquals } = Asserts;

Deno.test({
  name: "suite :: UTILITIES/HELPERS/GENERIC",
  ignore: true,
  fn() {},
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

Deno.test("dasherize() should replace spaces with dashes", (): void => {
  let actual = H$.dasherize("hello world and hi there");
  assertEquals(actual, "hello-world-and-hi-there");

  actual = H$.dasherize("");
  assertEquals(actual, "");
});

Deno.test("proxyPrintOnAccess() should inject pretty print into a dictionary object", () => {
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

Deno.test("findFirstExample() should find the first example", () => {
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
