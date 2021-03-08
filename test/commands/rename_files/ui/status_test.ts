import { assert, Commands, unimplemented } from "../../../deps.ts";
import { Status } from "../../../../lib/commands/rename_files/mod.ts";
const TExitCodes = Commands.TExitCodes;

const CONSOLE_LOG = console.log;
const MENU_OPTIONS = Object.freeze({
  dashed: false,
  directory: "/test/test_data",
  markdown: false,
  pattern: "",
  recursive: false,
  silent: false,
  skip: false,
  verbose: false,
});

function runAfter() {
  console.log = CONSOLE_LOG;
}

Deno.test(
  { name: "suite :: COMMANDS/RENAME_FILES/UI/STATUS", ignore: true, fn() {} },
);

Deno.test({
  name: "confirmChange() should confirm file rename with the user",
  ignore: true,
  async fn() {
    // TODO: Research best way to simulate input to stdin.
    const userResponse = await Status.confirmChange({
      oldFileName: "My Title.txt",
      newFileName: "123-title.md",
      pattern: "{id}-{title}.md",
    });
    unimplemented();
  },
});

Deno.test("notifyUserOfExit() should notify when pattern is invalid", () => {
  console.log = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.indexOf("valid pattern must include") >= 0);
  };

  Status.notifyUserOfExit({
    ...MENU_OPTIONS,
    exitCode: TExitCodes.INVALID_PATTERN,
  });

  runAfter();
});

Deno.test("notifyUserOfExit() should notify when frontmatter not found", () => {
  console.log = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.indexOf("contain YAML frontmatter") >= 0);
  };

  Status.notifyUserOfExit({
    ...MENU_OPTIONS,
    exitCode: TExitCodes.NO_FRONTMATTER_FOUND,
  });

  runAfter();
});

Deno.test("notifyUserOfExit() should notify when exiting unexpectedly", () => {
  console.log = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.indexOf("unexpected error") >= 0);
    assert(message.indexOf("This is the error") === -1);
  };

  Status.notifyUserOfExit({
    ...MENU_OPTIONS,
    exitCode: TExitCodes.UNKNOWN_ERROR,
  });

  console.log = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.indexOf("unexpected error") >= 0);
    assert(message.indexOf("This is the error") >= 0);
    assert(message.indexOf("Hello Error") >= 0);
  };

  Status.notifyUserOfExit({
    ...MENU_OPTIONS,
    exitCode: TExitCodes.UNKNOWN_ERROR,
    error: new Error("Hello Error"),
  });

  runAfter();
});
