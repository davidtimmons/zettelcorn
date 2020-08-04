export enum TStatus {
  OK,
  ERROR,
}

export interface TCommandModule {
  run: TCommand;
}

export interface TCommand {
  (options: TCommandOptions): Promise<TCommandResult>;
}

export interface TCommandOptions {}

export interface TCommandResult {
  readonly status: TStatus;
}
