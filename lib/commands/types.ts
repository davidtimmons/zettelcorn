export enum TStatus {
  OK,
  ERROR,
}

export interface TCommandModule {
  run: TCommand;
}

export interface TCommand {
  (options: any): Promise<TRunResult>;
}

export interface TRunOptions {}

export interface TRunResult {
  readonly status: TStatus;
}
