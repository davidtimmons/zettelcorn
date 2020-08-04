import { unimplemented } from "../../../deps.ts";
import * as UI from "../../../../lib/commands/rename_files/ui/ui.ts";

Deno.test({
  name: "should confirm the file rename with the user",
  ignore: true,
  async fn() {
    // TODO: Research best way to simulate input to stdin.
    const userResponse = await UI.confirmChange({
      oldFileName: "My Title.txt",
      newFileName: "123-title.md",
      pattern: "{id}-{title}.md",
    });
    unimplemented();
  },
});
