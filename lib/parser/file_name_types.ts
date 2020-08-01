import {
  TParseOptions,
  TParseResult,
  TReadOptions,
  TReadResult,
  TWriteOptions,
  TWriteResult,
} from "./parser_types.ts";

interface TFileNameParseOptions extends TParseOptions {
  readonly path: string;
  readonly pattern: string;
  readonly recursive: boolean;
}

interface TFileNameParseResult extends TParseResult {}

interface TFileNameReadOptions extends TReadOptions {
  readonly dir: string;
  readonly recursive: boolean;
}

interface TFileNameReadResult extends TReadResult {
  readonly fileName: string;
  readonly path: string;
  readonly yaml: object;
}

interface TFileNameWriteOptions extends TWriteOptions {
  readonly fileName: string;
  readonly path: string;
  readonly transform: (fileName: string) => string;
}

interface TFileNameWriteResult extends TWriteResult {}

export {
  TFileNameParseOptions,
  TFileNameParseResult,
  TFileNameReadOptions,
  TFileNameReadResult,
  TFileNameWriteOptions,
  TFileNameWriteResult,
};
