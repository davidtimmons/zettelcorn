import { assert, assertEquals, Utilities as $ } from "../../deps.ts";
import { NewZettel } from "../../../lib/commands/new_zettel/mod.ts";

const MENU_OPTIONS = Object.freeze({
  default: false,
  directory: "",
  force: false,
  markdown: false,
  recursive: false,
  silent: true,
  total: 1,
  verbose: false,
});

function runBefore(): string {
  const basePath = Deno.realPathSync("./test/test_data/write");
  return Deno.makeTempDirSync({
    dir: basePath,
    prefix: "NewZettelTest_run()_",
  });
}

async function runAfter(dir: string) {
  await $.removeDirectory(dir);
}

Deno.test(
  { name: "suite :: COMMANDS/NEW_ZETTEL/NEW_ZETTEL", ignore: true, fn() {} },
);

Deno.test("run() should write new zettel files to a directory", async () => {
  // setup
  const writePath = runBefore();

  // test
  const start = new Set(Deno.readDirSync(writePath));
  assertEquals(start.size, 0);

  await NewZettel.run({
    ...MENU_OPTIONS,
    directory: writePath,
    total: 3,
  });

  const finish = new Set(Deno.readDirSync(writePath));
  assertEquals(finish.size, 3);
  finish.forEach((file) => {
    assert(file.isFile);
  });

  // cleanup
  await runAfter(writePath);
});
