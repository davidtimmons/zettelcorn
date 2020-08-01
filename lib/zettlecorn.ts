import Env from "../env.ts";
import { init } from "./cli/cli.ts";

init({
  appVersion: Env.ZETTLECORN_VERSION,
  appName: Env.ZETTLECORN_APP_NAME,
  renameFiles: (options) => ({ status: 0, message: "" }), // TODO
});
