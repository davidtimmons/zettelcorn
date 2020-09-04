import { assertEquals, Path, Utilities as $ } from "../../deps.ts";
import { Init, Zettel } from "../../../lib/commands/init/mod.ts";

const MENU_OPTIONS = Object.freeze({
  directory: "",
  force: false,
  markdown: false,
  recursive: false,
  silent: true,
  verbose: false,
});

const runBefore = runAfter;

async function runAfter(dir: string) {
  await $.removeDirectory(dir);
}

Deno.test({ name: "suite :: COMMANDS/INIT/INIT", ignore: true, fn() {} });

Deno.test("run() should copy configuration files to a .zettelcorn directory", async () => {
  // setup
  const basePath = Deno.realPathSync("./test/test_data/");
  const configDirectory = Path.join(basePath, ".zettelcorn");
  await runBefore(configDirectory);

  // test
  const goalPaths = [
    configDirectory,
    Path.join(configDirectory, Zettel.fileName),
  ];

  await Init.run({
    ...MENU_OPTIONS,
    directory: basePath,
  });

  goalPaths.forEach(async (path) => {
    const actual = await $.doesFileOrDirectoryExist(path);
    assertEquals(actual, true);
  });

  // cleanup
  await runAfter(configDirectory);
});

Deno.test("run() should overwrite existing configuration files in a .zettelcorn directory", async () => {
  // setup
  const basePath = Deno.realPathSync("./test/test_data/");
  const configDirectory = Path.join(basePath, ".zettelcorn");
  await runBefore(configDirectory);

  const falsePath = Path.join(configDirectory, "hello-world.md");
  Deno.mkdirSync(configDirectory);
  Deno.writeTextFileSync(falsePath, "hello world");

  // test
  const goalPaths = [
    configDirectory,
    Path.join(configDirectory, Zettel.fileName),
  ];

  for (let i = 0, len = 3; i < len; i++) {
    await Init.run({
      ...MENU_OPTIONS,
      directory: basePath,
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
  await runAfter(configDirectory);
});
