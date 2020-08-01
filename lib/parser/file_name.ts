import { TParserStatus } from "./parser_types.ts";
import {
  TFileNameParseOptions,
  TFileNameParseResult,
  TFileNameReadOptions,
  TFileNameReadResult,
  TFileNameWriteOptions,
  TFileNameWriteResult,
} from "./file_name_types.ts";
import { generateInterpolatedString } from "./token.ts";

function parse(options: TFileNameParseOptions): TFileNameParseResult {
  // path, pattern, recursive
  const transform = Function(
    "yaml",
    "return " + generateInterpolatedString("yaml", options.pattern),
  );
  return { message: "", status: TParserStatus.OK };
}

// function read(options: TFileNameReadOptions): TFileNameReadResult[] {
// }

// function write(options: TFileNameWriteOptions): TFileNameWriteResult {
// }
