import { TParse } from "./deps.ts";

type TCACObject = any;

interface TCLIInit {
  readonly appVersion: string;
  readonly appName: string;
  readonly renameFiles: TParse;
}

export {
  TCACObject,
  TCLIInit,
};
