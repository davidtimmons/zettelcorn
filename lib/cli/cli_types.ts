import { CommandsTypes } from "./deps.ts";

export type TCACObject = any;

export interface TCLIInit {
  readonly appVersion: string;
  readonly appName: string;
  readonly renameFiles: CommandsTypes.TCommand;
}

export interface TCLIRenameFilesOptions {
  r?: boolean;
  recursive?: boolean;
}
