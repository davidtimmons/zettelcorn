import { assert, Path } from "../../deps.ts";
import { RenameFiles } from "../../../lib/commands/rename_files/mod.ts";
const { _write } = RenameFiles.__private__;

Deno.test("should rename a file", async () => {
  // setup
  const basePath = "./test/test_data/filtering/";
  const oldPath = Path.join.apply(null, [basePath, "test.md"]);
  const newPath = Path.join.apply(null, [basePath, "hello.md"]);

  // test
  const oldPathReal = Deno.realPathSync(oldPath);
  assert(oldPathReal.length > 0);

  await _write({
    applyPattern: (_x: any) => "hello.md",
    dashed: true,
    directory: basePath,
    markdown: false,
    pattern: "hello-",
    recursive: false,
    verbose: false,
  }, {
    fileName: "test.md",
    path: oldPath,
    yaml: {},
  });

  const newPathReal = Deno.realPathSync(newPath);
  assert(newPathReal.length > 0);

  // cleanup
  Deno.renameSync(newPathReal, oldPathReal);
});

Deno.test("should rename all files", async () => {
  // setup
  const basePath = "./test/test_data/recursion/deeper";

  // test before
  const oldPath01 = Deno.realPathSync(Path.join(basePath, "test_deep.md"));
  const oldPath02 = Deno.realPathSync(Path.join(basePath, "test_text.txt"));

  // modify files
  await RenameFiles.run({
    dashed: true,
    directory: basePath,
    markdown: false,
    pattern: "{id}-hello.md",
    recursive: false,
    silent: true,
    verbose: false,
  });

  // test after
  const newPath01 = Deno.realPathSync(Path.join(basePath, "456-hello.md"));
  const newPath02 = Deno.realPathSync(Path.join(basePath, "1849-hello.md"));
  Deno.renameSync(newPath01, oldPath01);
  Deno.renameSync(newPath02, oldPath02);
});
