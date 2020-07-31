import { assert, assertThrows } from "../deps.ts";
import { __private__ } from "../../lib/cli/flags.ts";
const { _tryParse } = __private__;

Deno.test("should throw on an unexpected error", (): void => {
  assertThrows((): void => {
    _tryParse({});
  });
});

Deno.test("should display a helpful error message", (): void => {
  // setup
  const originalConsoleError = console.error;
  let cacError = new Error();
  cacError.name = "CACError";
  const cacObject = {
    parse: () => {
      throw cacError;
    },
  };

  // test
  console.error = (...args: any[]) => {
    const message: string = args[0];
    assert(message.length > 0);
    assert(message.indexOf("try --help") !== -1);
  };
  _tryParse(cacObject);

  // cleanup
  console.error = originalConsoleError;
});
