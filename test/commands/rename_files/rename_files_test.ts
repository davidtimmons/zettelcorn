import { assert, assertEquals, equal } from "../../deps.ts";
import * as RenameFiles from "../../../lib/commands/rename_files/rename_files.ts";
const { _walkFiles } = RenameFiles.__private__;

Deno.test(
  "should build a non-recursive list of file paths",
  async (): Promise<void> => {
    const results = await _walkFiles(
      { path: "test/test_data", recursive: false, pattern: "" },
    );
    const md = results[1];

    assertEquals(results.length, 2);
    assertEquals(md.fileName, "test.md");
    assertEquals(md.message, "");
    assert(md.path.length > 0);
    assertEquals(md.status, 0);
    assert(equal(md.yaml, {}));
  },
);

Deno.test(
  "should build a recursive list of file paths",
  async (): Promise<void> => {
    const results = await _walkFiles(
      { path: "test/test_data", recursive: true, pattern: "" },
    );
    const deepMd = results[0];

    assertEquals(results.length, 3);
    assertEquals(deepMd.fileName, "test_deep.md");
    assertEquals(deepMd.message, "");
    assert(deepMd.path.length > 0);
    assertEquals(deepMd.status, 0);
    assert(equal(deepMd.yaml, {}));
  },
);
