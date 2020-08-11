import {
  assert,
  assertEquals,
  assertStringContains,
  equal,
} from "../../deps.ts";
import * as RenameFiles from "../../../lib/commands/rename_files/rename_files.ts";
const { _write } = RenameFiles.__private__;

Deno.test("should rename a file", async (): Promise<void> => {
  // setup
  const beforePath = Deno.realPathSync("./test/test_data/test.md");
  assert(beforePath.length > 0);

  // test
  await _write({
    applyPattern: (_x: any) => "hello.md",
    dashed: true,
    directory: "./test/",
    pattern: "hello-",
    recursive: false,
    verbose: false,
  }, {
    fileName: "test.md",
    path: "./test/test_data/test.md",
    yaml: {},
  });

  const afterPath = Deno.realPathSync("./test/test_data/hello.md");
  assert(afterPath.length > 0);

  // cleanup
  Deno.renameSync(afterPath, beforePath);
});
