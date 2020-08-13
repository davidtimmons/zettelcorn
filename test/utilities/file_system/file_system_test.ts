import { assert, assertEquals, assertStringContains } from "../../deps.ts";
import * as FS$ from "../../../lib/utilities/file_system/file_system.ts";

Deno.test("should read a text file at a path", async () => {
  let actual = await FS$.read("test/test_data/filtering/test.md");
  assertStringContains(actual, "This is a markdown file");

  actual = await FS$.read("");
  assertStringContains(actual, "");
});

Deno.test("should build a non-recursive list of files", async () => {
  const results = await FS$.buildFileQueue({
    directory: "test/test_data/filtering",
    recursive: false,
  });

  assertEquals(results.length, 2);

  const js = results[0];
  assertEquals(js.fileName, "test.js");

  const md = results[1];
  assertEquals(md.fileName, "test.md");
  assert(md.path.length > 0);
  assertEquals(md.yaml, {
    title: "My Test Data",
    id: 123,
    keywords: ["Deno", 123, true],
    dictionary: { string: "Deno", number: 123, bool: true },
  });
});

Deno.test("should build a recursive list of files with YAML objects only", async () => {
  const results = await FS$.buildFileQueue({
    directory: "test/test_data/recursion",
    recursive: true,
    requireYaml: true,
  });

  const deepMd = results[0];
  assertEquals(results.length, 3);
  assertEquals(deepMd.fileName, "test_deep.md");
  assert(deepMd.path.length > 0);
  assertEquals(deepMd.yaml, {
    title: "Deeper test data",
    id: 456,
    extra: "My extra key",
  });
});

Deno.test("should build a recursive list of Markdown files", async () => {
  const results01 = await FS$.buildFileQueue({
    directory: "test/test_data/recursion",
    recursive: true,
    requireMarkdown: true,
  });

  assertEquals(results01.length, 2);

  const results02 = await FS$.buildFileQueue({
    directory: "test/test_data/recursion",
    recursive: true,
    requireMarkdown: false,
  });

  assertEquals(results02.length, 3);
});

Deno.test("should collect files with custom meta data", async () => {
  const results01 = await FS$.buildFileQueue({
    directory: "test/test_data/filtering",
    recursive: false,
    metaTransformation: ({ name }) => name,
  });

  assertEquals(results01.length, 2);
  results01.forEach((result01) => assert(result01.meta.length > 0));

  const results02 = await FS$.buildFileQueue({
    directory: "test/test_data/filtering",
    recursive: false,
    requireMeta: true,
    metaTransformation: ({ extension }) => {
      if (extension === ".md") return true;
    },
  });

  assertEquals(results02.length, 1);
  assertEquals(results02[0].meta, true);
});
