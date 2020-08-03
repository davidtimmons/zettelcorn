import {
  TCommand,
  TCommandModule,
  TCommandOptions,
  TCommandResult,
} from "./commands_types.ts";

export default function command(commandModule: TCommandModule): TCommand {
  return async (options: TCommandOptions): TCommandResult =>
    await commandModule.run(options);
}

export {
  command,
};
