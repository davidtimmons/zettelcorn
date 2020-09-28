/**
 * Module-level interface for all implemented CLI features. Client code uses the command wrapper
 * as a dynamic dispatch.
 * @protected
 * @interface ICommandModule
 * @module commands/command
 * @see module:commands/mod
 * @see module:zettelcorn
 */

import type * as T from "./types.ts";

export default function command(commandModule: T.TCommandModule): T.TCommand {
  return async (options: T.TRunOptions): T.TRunResult =>
    await commandModule.run(options);
}

export {
  command,
};
