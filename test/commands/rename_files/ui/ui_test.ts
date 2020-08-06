import { assert, unimplemented } from "../../../deps.ts";
import * as UI from "../../../../lib/commands/rename_files/ui/ui.ts";
const { _paint } = UI.__private__;

Deno.test({
  name: "should confirm the file rename with the user",
  ignore: true,
  async fn() {
    // TODO: Research best way to simulate input to stdin.
    const userResponse = await UI.confirmChange({
      oldFileName: "My Title.txt",
      newFileName: "123-title.md",
      pattern: "{id}-{title}.md",
    });
    unimplemented();
  },
});

Deno.test("should notify the user when exiting", (): void => {
  // setup
  const originalConsoleLog = console.log;

  // test
  console.log = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.length > 0);
    assert(message.indexOf("No files were changed.") > 0);
  };

  UI.notifyUserOfExit({ directory: "/test" });

  // cleanup
  console.log = originalConsoleLog;
});

Deno.test("should notify the user of change", (): void => {
  // setup
  const originalConsoleLog = console.log;

  // test
  console.log = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.length > 0);
    assert(message.indexOf("old") >= 0);
    assert(message.indexOf("new") > 0);
  };

  UI.notifyUserOfChange("old", "new");

  // cleanup
  console.log = originalConsoleLog;
});

Deno.test("should formatted log text", (): void => {
  // setup
  const originalConsoleLog = console.log;

  // test
  console.log = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.length > 0);
    assert(message.indexOf("hello world") >= 0);
  };

  UI.log("hello world", {
    padBottom: true,
    padTop: true,
    style: UI.TUIStyles.BOLD,
  });

  // cleanup
  console.log = originalConsoleLog;
});

Deno.test("should return a text style function", (): void => {
  assert(_paint(UI.TUIStyles.BOLD)("hello world"), "hello world");
  assert(_paint(UI.TUIStyles.CYAN)("hello world"), "hello world");
  assert(_paint(UI.TUIStyles.GREEN)("hello world"), "hello world");
  assert(_paint(UI.TUIStyles.YELLOW)("hello world"), "hello world");
  assert(_paint()("hello world"), "hello world");
});
