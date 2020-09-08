import { assert, ConfigFiles, Commands } from "../../../deps.ts";
import { Status } from "../../../../lib/commands/init/mod.ts";
const TExitCodes = Commands.Types.TExitCodes;

const CONSOLE_LOG = console.log;
const MENU_OPTIONS = Object.freeze({
  directory: "",
  force: false,
  markdown: false,
  recursive: false,
  silent: false,
  verbose: false,
});

function runAfter() {
  console.log = CONSOLE_LOG;
}

Deno.test({ name: "suite :: COMMANDS/INIT/UI/STATUS", ignore: true, fn() {} });

Deno.test("notifyUserOfExit() should notify when directory not found", () => {
  console.log = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.indexOf("directory you entered does not exist") >= 0);
  };

  Status.notifyUserOfExit({
    ...MENU_OPTIONS,
    exitCode: TExitCodes.NO_DIRECTORY_FOUND,
    configDirectory: ConfigFiles.MetaData.localDirectory,
  });

  runAfter();
});

Deno.test("notifyUserOfExit() should notify when directory already exists", () => {
  console.log = (...args: any[]): void => {
    const message: string = args[0];
    assert(message.indexOf("configuration directory already exists") >= 0);
  };

  Status.notifyUserOfExit({
    ...MENU_OPTIONS,
    exitCode: TExitCodes.INVALID_DIRECTORY,
    configDirectory: ConfigFiles.MetaData.localDirectory,
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
    configDirectory: ConfigFiles.MetaData.localDirectory,
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
    configDirectory: ConfigFiles.MetaData.localDirectory,
  });

  runAfter();
});
