export interface TCommandModule {
  run: TCommand;
}

export interface TCommand {
  (options: TCommandOptions): Promise<TCommandResult>;
}

export interface TCommandOptions {}

export interface TCommandResult {
  readonly message: string;
  readonly status: TCommandStatus;
}

export interface TRead {
  (options: TReadOptions): TReadResult[];
}

export interface TReadOptions {}

export interface TReadResult {
  readonly message: string;
  readonly status: TCommandStatus;
}

export interface TWrite {
  (options: TWriteOptions): TWriteResult;
}

export interface TWriteOptions {}

export interface TWriteResult {
  readonly message: string;
  readonly status: TCommandStatus;
}

export enum TCommandStatus {
  OK,
  Error,
}
