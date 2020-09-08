/**
 * Types for the CLI module.
 * @protected
 * @module cli/types
 * @see module:cli/mod
 */

import {
  InitTypes,
  InjectIdTypes,
  InjectKeywordsTypes,
  InjectTitleTypes,
  NewZettelTypes,
  RenameFilesTypes,
} from "./deps.ts";

export type TCLIFlags = any; // cacjs library object

export interface TCLIInit {
  readonly appName: string;
  readonly appVersion: string;
  readonly init?: InitTypes.TInitRun;
  readonly injectId?: InjectIdTypes.TInjectIdRun;
  readonly injectKeywords?: InjectKeywordsTypes.TInjectKeywordsRun;
  readonly injectTitle?: InjectTitleTypes.TInjectTitleRun;
  readonly newZettel?: NewZettelTypes.TNewZettelRun;
  readonly renameFiles?: RenameFilesTypes.TRenameFilesRun;
}

export interface TCLIStandardOptions {
  directory: string;
  markdown: boolean;
  recursive: boolean;
  silent: boolean;
  verbose: boolean;
}
