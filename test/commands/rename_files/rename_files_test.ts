import { assert, Path } from "../../deps.ts";
import { RenameFiles } from "../../../lib/commands/rename_files/mod.ts";
const { _write } = RenameFiles.__private__;

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

Deno.test(
  {
    name: "suite :: COMMANDS/RENAME_FILES/RENAME_FILES",
    ignore: true,
    fn() {},
  },
);

Deno.test("_write() should rename a file", async () => {
  // setup
  const basePath = "./test/test_data/filter/";
  const oldPath = Path.join.apply(null, [basePath, "test.md"]);
  const newPath = Path.join.apply(null, [basePath, "hello.md"]);

  // test
  const oldPathReal = Deno.realPathSync(oldPath);
  assert(oldPathReal.length > 0);

  await _write({
    applyPattern: (_x: any) => "hello.md",
    ...MENU_OPTIONS,
    dashed: true,
    directory: basePath,
    pattern: "hello-",
  }, {
    fileContent: "",
    fileName: "test.md",
    meta: {},
    path: oldPath,
    yaml: {},
  });

  const newPathReal = Deno.realPathSync(newPath);
  assert(newPathReal.length > 0);

  // cleanup
  Deno.renameSync(newPathReal, oldPathReal);
});

Deno.test("run() should rename all files", async () => {
  // setup
  const basePath = "./test/test_data/recursion/deeper";

  // test before
  const oldPath01 = Deno.realPathSync(Path.join(basePath, "test_deep.md"));
  const oldPath02 = Deno.realPathSync(Path.join(basePath, "test_text.txt"));

  // modify files
  await RenameFiles.run({
    ...MENU_OPTIONS,
    dashed: true,
    directory: basePath,
    pattern: "{id}-hello.md",
  });

  // test after
  const newPath01 = Deno.realPathSync(Path.join(basePath, "456-hello.md"));
  const newPath02 = Deno.realPathSync(Path.join(basePath, "1849-hello.md"));
  Deno.renameSync(newPath01, oldPath01);
  Deno.renameSync(newPath02, oldPath02);
});
