import { Asserts, Path } from "DepsTest";
import { RenameFiles } from "CommandRenameFiles";
const assert: any = Asserts.assert;
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

  // resetFileNames
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

Deno.test("run() should not freeze when renaming many files", async () => {
  // setup - tests 500 files
  const timeLimit = 5_000;
  const basePath = "./test/test_data/bulk";
  const fileNames: [string, string][] = [];

  for (const dirEntry of Deno.readDirSync(basePath)) {
    const originalName = dirEntry.name;
    const newName = originalName.slice(0, -3) + "-hello.md";
    fileNames.push([newName, originalName]);
  }

  const resetFileNames = (fileNames: [string, string][]) => {
    fileNames.forEach(([newName, originalName]) => {
      try {
        const newPath = Deno.realPathSync(Path.join(basePath, newName));
        const oldPath = Path.join(basePath, originalName);
        Deno.renameSync(newPath, oldPath);
      } catch (_error) {
        // Clean up everything there is to clean up rather than failing.
      }
    });
  };

  // The "setTimeout" "fail" function stops the "run" process but does not always fail the test.
  // Additionally, setTimeout must always be cleared or Deno sporadically complains.
  // Performance timing together with setTimeout creates a consistent timeout test.
  const fail = () => {
    throw Error("The process has frozen.");
  };
  const fiveSecondTimer = setTimeout(fail, timeLimit);

  // modify files
  const startTimer = performance.now();
  const { status } = await RenameFiles.run({
    ...MENU_OPTIONS,
    dashed: true,
    directory: basePath,
    pattern: "{id}-hello.md",
  });
  const endTimer = performance.now();

  // cleanup
  resetFileNames(fileNames);

  // test
  clearTimeout(fiveSecondTimer);
  if (endTimer - startTimer >= timeLimit) {
    fail();
  }
});
