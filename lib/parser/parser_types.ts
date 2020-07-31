interface TParse {
  (options: TParseOptions): TParseResult;
}

interface TParseOptions {}

interface TParseResult {
  readonly message: string;
  readonly status: TParserStatus;
}

interface TRead {
  (options: TReadOptions): TReadResult[];
}

interface TReadOptions {}

interface TReadResult {
  readonly message: string;
  readonly status: TParserStatus;
}

interface TWrite {
  (options: TWriteOptions): TWriteResult;
}

interface TWriteOptions {}

interface TWriteResult {
  readonly message: string;
  readonly status: TParserStatus;
}

enum TParserStatus {
  OK,
  Error,
}

export {
  TParse,
  TParseOptions,
  TParseResult,
  TParserStatus,
  TRead,
  TReadOptions,
  TReadResult,
  TWrite,
  TWriteOptions,
  TWriteResult,
};
