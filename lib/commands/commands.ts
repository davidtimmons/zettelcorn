import * as T from "./types.ts";

export default function command(commandModule: T.TCommandModule): T.TCommand {
  return async (options: T.TCommandOptions): T.TCommandResult =>
    await commandModule.run(options);
}

export {
  command,
};
