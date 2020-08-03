import {
  TCommand,
  TCommandModule,
  TCommandOptions,
  TCommandResult,
} from "./commands_types.ts";

export default function command(commandModule: TCommandModule): TCommand {
  return (options: TCommandOptions): TCommandResult =>
    commandModule.run(options);
}

export {
  command,
};
