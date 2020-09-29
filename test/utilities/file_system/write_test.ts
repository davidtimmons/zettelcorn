import { assertEquals, assertStringContains } from "../../deps.ts";
import { FileSystemUtilities as FS$ } from "../../../lib/utilities/mod.ts";

Deno.test({name: "suite :: UTILITIES/FILE_SYSTEM/WRITE", ignore: true, fn() {}});

Deno.test("writeQueuedFiles() should print a message when starting and finishing writes", async () => {
  // setup
  const originalConsoleLog = console.log;
  const write = async (_x: unknown, _y: unknown) => {};
  const options = { verbose: true, silent: false };

  // test
  let callCount = 0;
  console.log = (msg) => {
    if (callCount === 0) {
      assertStringContains(msg as string, "Modified files:");
    }
    if (callCount === 1) {
      assertStringContains(msg as string, "Processed 0 files.");
    }
    if (callCount > 1) {
      throw new Error("Log called too many times in this test.");
    }
    callCount += 1;
  };
  await FS$.writeQueuedFiles(write, options, []);

  // cleanup
  console.log = originalConsoleLog;
});

Deno.test("writeQueuedFiles() should wait for all queued files to be written", async () => {
  // setup
  const originalConsoleLog = console.log;
  let callCount = 0;
  console.log = () => {
    callCount += 1;
  };

  const options = { verbose: true, silent: false };
  const filler = {
    fileContent: "",
    fileName: "",
    meta: "",
    path: "",
    yaml: {},
  };

  // test
  let writeCount = 0;
  const write = async (_x: unknown, _y: unknown) => {
    assertEquals(callCount, 1);
    writeCount += 1;
  };

  await FS$.writeQueuedFiles(write, options, [filler, filler, filler, filler]);
  assertEquals(callCount, 2);
  assertEquals(writeCount, 4);

  // cleanup
  console.log = originalConsoleLog;
});
