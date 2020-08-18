export enum TStatus {
  OK,
  ERROR,
}

export interface TCommandModule {
  run: TCommand;
}

export interface TCommand {
  (options: any): TRunResult;
}

export interface TRunOptions {
  readonly directory: string;
  readonly silent?: boolean;
}

export type TRunResult = Promise<{
  readonly status: TStatus;
}>;
