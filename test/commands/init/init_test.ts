import { Asserts, ConfigFiles, Path, Utilities as $ } from "DepsTest";
import { Init } from "CommandInit";
const { assertEquals } = Asserts;

const MENU_OPTIONS = Object.freeze({
  directory: "",
  force: false,
  markdown: false,
  recursive: false,
  silent: true,
  verbose: false,
});

function runBefore(): string {
  const basePath = Deno.realPathSync("./test/test_data/write");
  return Deno.makeTempDirSync({
    dir: basePath,
    prefix: "InitTest_run()_",
  });
}

async function runAfter(dir: string) {
  await $.removeDirectory(dir);
}

Deno.test({ name: "suite :: COMMANDS/INIT/INIT", ignore: true, fn() {} });

Deno.test("run() should copy configuration files to a .zettelcorn directory", async () => {
  // setup
  const writePath = runBefore();
  const configDirectory = Path.join(writePath, ".zettelcorn");

  // test
  const goalPaths = [
    configDirectory,
    Path.join(configDirectory, ConfigFiles.Zettel.fileName),
    Path.join(configDirectory, ConfigFiles.ZcConfig.fileName),
  ];

  await Init.run({
    ...MENU_OPTIONS,
    directory: writePath,
  });

  goalPaths.forEach(async (path) => {
    const actual = await $.doesFileOrDirectoryExist(path);
    assertEquals(actual, true);
  });

  // cleanup
  await runAfter(writePath);
});

Deno.test("run() should overwrite existing configuration files in a .zettelcorn directory", async () => {
  // setup
  const writePath = runBefore();
  const configDirectory = Path.join(writePath, ".zettelcorn");

  const falsePath = Path.join(configDirectory, "hello-world.md");
  Deno.mkdirSync(configDirectory);
  Deno.writeTextFileSync(falsePath, "hello world");

  // test
  const goalPaths = [
    configDirectory,
    Path.join(configDirectory, ConfigFiles.Zettel.fileName),
  ];

  for (let i = 0, len = 3; i < len; i++) {
    await Init.run({
      ...MENU_OPTIONS,
      directory: writePath,
      force: true,
    });
  }

  goalPaths.forEach(async (path) => {
    const actual = await $.doesFileOrDirectoryExist(path);
    assertEquals(actual, true);
  });

  const falsePathExists = await $.doesFileOrDirectoryExist(falsePath);
  assertEquals(falsePathExists, false);

  // cleanup
  await runAfter(writePath);
});
