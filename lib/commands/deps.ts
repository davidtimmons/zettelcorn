/**
 * External dependencies for the commands module. All code in this module that needs an
 * external dependency will reference this file.
 * @protected
 * @module commands/deps
 */

export * as Colors from "https://deno.land/std@0.65.0/fmt/colors.ts";
export * as Path from "https://deno.land/std@0.65.0/path/mod.ts";
export { Types as CLITypes } from "../cli/mod.ts";
export * as Utilities from "../utilities/mod.ts";
