import { assert, assertThrows } from "../deps.ts";
import * as CLI from "../../lib/cli/cli.ts";
const { _tryParse } = CLI.__private__;

Deno.test("should display help with no command given", (): void => {
  // setup
  const originalConsoleLog = console.log;

  // test
  console.log = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.length > 0);
    assert(message.indexOf("zettlecorn <command> [options]") > 0);
  };

  CLI.init({
    appName: "zettlecorn",
    appVersion: "0.0.0",
    renameFiles: async (_options: object) => Promise.resolve({ status: 0 }),
  });

  // cleanup
  console.log = originalConsoleLog;
});

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
  console.error = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.length > 0);
    assert(message.indexOf("try --help") !== -1);
  };
  _tryParse(cacObject);

  // cleanup
  console.error = originalConsoleError;
});
