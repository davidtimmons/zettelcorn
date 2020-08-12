import { assert } from "../../deps.ts";
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

Deno.test("should rename all files", async (): Promise<void> => {
  // setup
  const beforePath01 = Deno.realPathSync(
    "test/test_data/recursion_test_data/test_deep.md",
  );
  const beforePath02 = Deno.realPathSync(
    "test/test_data/recursion_test_data/test_text.txt",
  );
  assert(beforePath01.length > 0);
  assert(beforePath02.length > 0);

  // test
  await RenameFiles.run({
    dashed: true,
    directory: "./test/test_data/recursion_test_data/",
    pattern: "{id}-hello.md",
    recursive: false,
    silent: true,
    verbose: false,
  });

  const afterPath01 = Deno.realPathSync(
    "test/test_data/recursion_test_data/456-hello.md",
  );
  const afterPath02 = Deno.realPathSync(
    "test/test_data/recursion_test_data/1849-hello.md",
  );
  assert(afterPath01.length > 0);
  assert(afterPath02.length > 0);

  // cleanup
  Deno.renameSync(afterPath01, beforePath01);
  Deno.renameSync(afterPath02, beforePath02);
});
