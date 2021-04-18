import { Asserts } from "../../deps.ts";
import { UIUtilities as UI$ } from "../../../lib/utilities/mod.ts";
const { _paint } = UI$.__private__;
const { unimplemented } = Asserts;
const assert: any = Asserts.assert;

Deno.test({ name: "suite :: UTILITIES/UI/CONSOLE", ignore: true, fn() {} });

Deno.test("notifyUserOfChange() should notify the user of change", (): void => {
  // setup
  const originalConsoleLog = console.log;

  // test
  console.log = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.length > 0);
    assert(message.indexOf("old") >= 0);
    assert(message.indexOf("new") > 0);
  };

  UI$.notifyUserOfChange("old", "new");

  // cleanup
  console.log = originalConsoleLog;
});

Deno.test({
  name: "promptUser() should read text from the user",
  ignore: true,
  async fn() {
    // TODO: Research best way to simulate input to stdin.
    const input = await UI$.promptUser("output");
    unimplemented();
  },
});

Deno.test("notifyUser() should formatted log text", (): void => {
  // setup
  const originalConsoleLog = console.log;

  // test
  console.log = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.length > 0);
    assert(message.indexOf("hello world") >= 0);
  };

  UI$.notifyUser("hello world", {
    padBottom: true,
    padTop: true,
    style: UI$.TUIStyles.BOLD,
  });

  // cleanup
  console.log = originalConsoleLog;
});

Deno.test("_paint() should return a text style function", (): void => {
  assert(_paint(UI$.TUIStyles.BOLD)("hello world"), "hello world");
  assert(_paint(UI$.TUIStyles.CYAN)("hello world"), "hello world");
  assert(_paint(UI$.TUIStyles.GREEN)("hello world"), "hello world");
  assert(_paint(UI$.TUIStyles.YELLOW)("hello world"), "hello world");
  assert(_paint()("hello world"), "hello world");
});
