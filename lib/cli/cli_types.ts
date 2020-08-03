import { CommandsTypes } from "./deps.ts";

type TCACObject = any;

interface TCLIInit {
  readonly appVersion: string;
  readonly appName: string;
  readonly renameFiles: CommandsTypes.TCommand;
}

interface TCLIRenameFilesOptions {
  r?: boolean;
  recursive?: boolean;
}

export {
  TCACObject,
  TCLIInit,
  TCLIRenameFilesOptions,
};
