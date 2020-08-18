export type TCLIFlags = any; // cacjs library object

export interface TCLIInit {
  readonly appVersion: string;
  readonly appName: string;
  readonly injectId?: Function;
  readonly injectKeywords?: Function;
  readonly injectTitle?: Function;
  readonly renameFiles?: Function;
}

export interface TCLIStandardOptions {
  r?: boolean;
  recursive: boolean;
  m?: boolean;
  markdown: boolean;
  b?: boolean;
  verbose: boolean;
}
