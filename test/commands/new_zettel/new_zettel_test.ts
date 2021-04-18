import { Asserts, Utilities as $ } from "../../deps.ts";
import { NewZettel } from "../../../lib/commands/new_zettel/mod.ts";
const { assertEquals } = Asserts;
const assert: any = Asserts.assert;

const MENU_OPTIONS = Object.freeze({
  default: false,
  directory: "",
  force: false,
  markdown: false,
  recursive: false,
  silent: true,
  template: "default",
  total: 1,
  verbose: false,
  zettelcornConfigDirectory: "test/test_data/.zettelcorn",
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

Deno.test("_getZettelTemplate() should get the correct zettel template", async () => {
  const [fileName01, fileData01, isLocal01] = await NewZettel.__private__
    ._getZettelTemplate(MENU_OPTIONS);

  assertEquals(fileName01, "{id}.md.zettel");
  assert(fileData01.length > 0);
  assertEquals(isLocal01, true);

  const [fileName02, fileData02, isLocal02] = await NewZettel
    .__private__._getZettelTemplate({
      ...MENU_OPTIONS,
      default: false,
      template: "alt",
    });

  assertEquals(fileName02, "{id}-alt.md.alt.zettel");
  assert(fileData02.length > 0);
  assertEquals(isLocal02, true);
});

Deno.test("run() should write new zettel files to a directory", async () => {
  // setup
  const writePath = runBefore();

  // test
  const start = new Set(Deno.readDirSync(writePath));
  assertEquals(start.size, 0);

  await NewZettel.run({
    ...MENU_OPTIONS,
    default: true,
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

Deno.test("run() should write a new zettel file based on a selected template", async () => {
  // setup
  const writePath = runBefore();

  // test
  const start = new Set(Deno.readDirSync(writePath));
  assertEquals(start.size, 0);

  await NewZettel.run({
    ...MENU_OPTIONS,
    directory: writePath,
    template: "alt",
  });

  const finish = new Set(Deno.readDirSync(writePath));
  assertEquals(finish.size, 1);
  finish.forEach((file) => {
    assert(file.isFile);
  });

  // cleanup
  await runAfter(writePath);
});
