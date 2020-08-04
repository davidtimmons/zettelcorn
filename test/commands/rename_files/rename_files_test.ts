import {
  assert,
  assertEquals,
  assertStringContains,
  equal,
} from "../../deps.ts";
import * as RenameFiles from "../../../lib/commands/rename_files/rename_files.ts";
const { _buildFileQueue } = RenameFiles.__private__;

Deno.test("should read a text file at a path", async (): Promise<void> => {
  let actual = await RenameFiles.read("test/test_data/test.md");
  assertStringContains(actual, "This is a markdown file");

  actual = await RenameFiles.read("");
  assertStringContains(actual, "");
});

Deno.test(
  "should build a non-recursive list of files with YAML objects",
  async (): Promise<void> => {
    const results = await _buildFileQueue(
      { directory: "test/test_data", recursive: false, pattern: "" },
    );
    const md = results[0];

    assertEquals(results.length, 1);
    assertEquals(md.fileName, "test.md");
    assert(md.path.length > 0);
    assertEquals(md.status, 0);
    assert(equal(md.yaml, { title: "My Test Data", id: 123 }));
  },
);

Deno.test(
  "should build a recursive list of files with YAML objects",
  async (): Promise<void> => {
    const results = await _buildFileQueue(
      { directory: "test/test_data", recursive: true, pattern: "" },
    );
    const deepMd = results[0];

    assertEquals(results.length, 2);
    assertEquals(deepMd.fileName, "test_deep.md");
    assert(deepMd.path.length > 0);
    assertEquals(deepMd.status, 0);
    assert(
      equal(
        deepMd.yaml,
        { title: "Deeper test data", id: 456, extra: "My extra key" },
      ),
    );
  },
);
