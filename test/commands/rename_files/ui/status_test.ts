import { assert, unimplemented, Utilities as $ } from "../../../deps.ts";
import { Status } from "../../../../lib/commands/rename_files/mod.ts";

const MENU_OPTIONS = Object.freeze({
  dashed: false,
  directory: "",
  markdown: false,
  pattern: "",
  recursive: false,
  silent: true,
  skip: false,
  verbose: false,
});

Deno.test({
  name: "should confirm the file rename with the user",
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

Deno.test("should notify the user when exiting", () => {
  // setup
  const originalConsoleLog = console.log;

  // test
  console.log = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.length > 0);
    assert(message.indexOf("No files were changed.") > 0);
  };

  Status.notifyUserOfExit({
    ...MENU_OPTIONS,
    directory: "/test",
    silent: false,
  });

  // cleanup
  console.log = originalConsoleLog;
});
