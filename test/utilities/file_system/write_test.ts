import { Asserts } from "../../deps.ts";
import { FileSystemUtilities as FS$ } from "../../../lib/utilities/mod.ts";
const { assertEquals, assertStringIncludes } = Asserts;

const EMPTY_FILE = {
  fileContent: "",
  fileName: "",
  meta: "",
  path: "",
  yaml: {},
};

Deno.test(
  { name: "suite :: UTILITIES/FILE_SYSTEM/WRITE", ignore: true, fn() {} },
);

Deno.test("writeQueuedFiles() should return a result status", async () => {
  // setup
  const options = { silent: true };
  const writeSuccess = async (_x: unknown, _y: unknown) => {};
  const writeFailure = async (_x: unknown, _y: unknown) => {
    throw Error("Surprise!");
  };

  // test
  let result: FS$.TWriteResult;
  result = await FS$.writeQueuedFiles(writeSuccess, options, [EMPTY_FILE]);
  assertEquals(result.status, FS$.TWriteStatusCodes.OK);
  assertEquals(result.error, undefined);

  result = await FS$.writeQueuedFiles(writeFailure, options, [EMPTY_FILE]);
  assertEquals(result.status, FS$.TWriteStatusCodes.WRITE_ERROR);
  assertEquals(result.error?.message, "Surprise!");

  result = await FS$.writeQueuedFiles(writeFailure, options, []);
  assertEquals(result.status, FS$.TWriteStatusCodes.EMPTY_WRITE_QUEUE);
  assertStringIncludes(result.error?.message || "", "empty");
});

Deno.test("writeQueuedFiles() should print a message when starting and finishing writes", async () => {
  // setup
  const originalConsoleLog = console.log;
  const write = async (_x: unknown, _y: unknown) => {};
  const options = { verbose: true, silent: false };

  // test
  let callCount = 0;
  console.log = (msg) => {
    if (callCount === 0) {
      assertStringIncludes(msg as string, "Modified files:");
    }
    if (callCount === 1) {
      assertStringIncludes(msg as string, "Processed 0 files.");
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
  const options = { verbose: true, silent: false };
  const originalConsoleLog = console.log;
  let callCount = 0;
  console.log = () => {
    callCount += 1;
  };

  // test
  let writeCount = 0;
  const write = async (_x: unknown, _y: unknown) => {
    assertEquals(callCount, 1);
    writeCount += 1;
  };

  await FS$.writeQueuedFiles(write, options, [
    EMPTY_FILE,
    EMPTY_FILE,
    EMPTY_FILE,
    EMPTY_FILE,
  ]);
  assertEquals(callCount, 2);
  assertEquals(writeCount, 4);

  // cleanup
  console.log = originalConsoleLog;
});

Deno.test("writeQueuedFiles() should handle a large file queue", async () => {
  // setup
  const options = { silent: true };
  const write = async (_x: unknown, _y: unknown) => {};
  const fileQueue = [];
  for (let i = 0, len = 5000; i < len; i++) {
    fileQueue.push(Object.assign({}, EMPTY_FILE));
  }

  // test
  let writeResult: FS$.TWriteResult;
  writeResult = await FS$.writeQueuedFiles(write, options, fileQueue);
  assertEquals(writeResult.status, FS$.TWriteStatusCodes.OK);
});
