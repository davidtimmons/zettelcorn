import {
  assert,
  assertEquals,
  assertStringContains,
  equal,
} from "../../deps.ts";
import * as RenameFiles from "../../../lib/commands/rename_files/rename_files.ts";
const { _buildFileQueue, _read, _write } = RenameFiles.__private__;

Deno.test("should read a text file at a path", async (): Promise<void> => {
  let actual = await _read("test/test_data/test.md");
  assertStringContains(actual, "This is a markdown file");

  actual = await _read("");
  assertStringContains(actual, "");
});

Deno.test(
  "should build a non-recursive list of files with YAML objects",
  async (): Promise<void> => {
    const results = await _buildFileQueue(
      {
        dashed: false,
        directory: "test/test_data",
        pattern: "",
        recursive: false,
        verbose: false,
      },
    );
    const md = results[0];

    assertEquals(results.length, 1);
    assertEquals(md.fileName, "test.md");
    assert(md.path.length > 0);
    assert(equal(md.yaml, {
      title: "My Test Data",
      id: "123",
      keywords: "Deno,123,true",
      dictionary: "string=Deno,number=123,bool=true",
    }));
  },
);

Deno.test(
  "should build a recursive list of files with YAML objects",
  async (): Promise<void> => {
    const results = await _buildFileQueue(
      {
        dashed: false,
        directory: "test/test_data",
        pattern: "",
        recursive: true,
        verbose: false,
      },
    );
    const deepMd = results[0];

    assertEquals(results.length, 2);
    assertEquals(deepMd.fileName, "test_deep.md");
    assert(deepMd.path.length > 0);
    assert(
      equal(
        deepMd.yaml,
        { title: "Deeper test data", id: "456", extra: "My extra key" },
      ),
    );
  },
);

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
