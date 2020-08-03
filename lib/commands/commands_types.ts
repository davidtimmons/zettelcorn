interface TCommandModule {
  run: TCommand;
}

interface TCommand {
  (options: TCommandOptions): TCommandResult;
}

interface TCommandOptions {}

interface TCommandResult {
  readonly message: string;
  readonly status: TCommandStatus;
}

interface TRead {
  (options: TReadOptions): TReadResult[];
}

interface TReadOptions {}

interface TReadResult {
  readonly message: string;
  readonly status: TCommandStatus;
}

interface TWrite {
  (options: TWriteOptions): TWriteResult;
}

interface TWriteOptions {}

interface TWriteResult {
  readonly message: string;
  readonly status: TCommandStatus;
}

enum TCommandStatus {
  OK,
  Error,
}

export {
  TCommand,
  TCommandModule,
  TCommandOptions,
  TCommandResult,
  TCommandStatus,
  TRead,
  TReadOptions,
  TReadResult,
  TWrite,
  TWriteOptions,
  TWriteResult,
};
