import { assertEquals, assertThrows, Utilities as $ } from "../../deps.ts";
import * as InjectKeywords from "../../../lib/commands/inject_keywords/inject_keywords.ts";
const { _yamlTransformation } = InjectKeywords.__private__;

Deno.test("should add keywords to a YAML object", () => {
  const filler = {
    extension: "",
    fileContent: "",
    fileYAML: {},
    isDirectory: false,
    name: "",
    path: "",
  };

  assertEquals(_yamlTransformation({ ...filler }), {});
  assertEquals(
    _yamlTransformation({
      ...filler,
      fileContent: "#hello #world",
      fileYAML: { keywords: ["hello", "world"] },
    }),
    { keywords: ["hello", "world"] },
  );
  assertEquals(
    _yamlTransformation({
      ...filler,
      fileContent: "#hello #world",
      fileYAML: { keywords: ["foo"] },
    }),
    { keywords: ["hello", "world", "foo"] },
  );
  assertThrows(() =>
    _yamlTransformation(
      { ...filler, fileContent: "#hi", fileYAML: { keywords: 42 } },
    )
  );
});
