import {
  assert,
  assertEquals,
  assertStringContains,
  equal,
} from "../../deps.ts";
import * as FS$ from "../../../lib/utilities/file_system/file_system.ts";

Deno.test("should read a text file at a path", async (): Promise<void> => {
  let actual = await FS$.read("test/test_data/test.md");
  assertStringContains(actual, "This is a markdown file");

  actual = await FS$.read("");
  assertStringContains(actual, "");
});

Deno.test(
  "should build a non-recursive list of files with YAML objects",
  async (): Promise<void> => {
    const results = await FS$.buildFileFrontmatterQueue(
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
      id: 123,
      keywords: ["Deno", 123, true],
      dictionary: { string: "Deno", number: 123, bool: true },
    }));
  },
);

Deno.test(
  "should build a recursive list of files with YAML objects",
  async (): Promise<void> => {
    const results = await FS$.buildFileFrontmatterQueue(
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
    assert(equal(deepMd.yaml, {
      title: "Deeper test data",
      id: 456,
      extra: "My extra key",
    }));
  },
);
