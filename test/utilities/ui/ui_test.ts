import { assert } from "../../deps.ts";
import * as UI$ from "../../../lib/utilities/ui/ui.ts";
const { _paint } = UI$.__private__;

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

  UI$.notifyUserOfChange("old", "new");

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

  UI$.log("hello world", {
    padBottom: true,
    padTop: true,
    style: UI$.TUIStyles.BOLD,
  });

  // cleanup
  console.log = originalConsoleLog;
});

Deno.test("should return a text style function", (): void => {
  assert(_paint(UI$.TUIStyles.BOLD)("hello world"), "hello world");
  assert(_paint(UI$.TUIStyles.CYAN)("hello world"), "hello world");
  assert(_paint(UI$.TUIStyles.GREEN)("hello world"), "hello world");
  assert(_paint(UI$.TUIStyles.YELLOW)("hello world"), "hello world");
  assert(_paint()("hello world"), "hello world");
});
