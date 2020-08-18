import {
  InjectIdFlags,
  InjectKeywordsFlags,
  InjectTitleFlags,
  RenameFilesFlags,
} from "./deps.ts";

export type TCLIFlags = any; // cacjs library object

export interface TCLIInit {
  readonly appVersion: string;
  readonly appName: string;
  readonly injectId?: InjectIdFlags.TInjectIdRun;
  readonly injectKeywords?: InjectKeywordsFlags.TInjectKeywordsRun;
  readonly injectTitle?: InjectTitleFlags.TInjectTitleRun;
  readonly renameFiles?: RenameFilesFlags.TRenameFilesRun;
}

export interface TCLIStandardOptions {
  r?: boolean;
  recursive: boolean;
  m?: boolean;
  markdown: boolean;
  b?: boolean;
  verbose: boolean;
}
