/**
 * External dependencies needed for testing. All code in this module that needs an
 * external dependency for supporting a test will reference this file.
 * @protected
 * @module config_files/deps
 */

export * from "https://deno.land/std@0.71.0/testing/asserts.ts";
export * as FS from "https://deno.land/std@0.71.0/fs/mod.ts";
export * as Path from "https://deno.land/std@0.71.0/path/mod.ts";
export * as Commands from "../lib/commands/mod.ts";
export * as ConfigFiles from "../lib/config_files/mod.ts";
export * as Utilities from "../lib/utilities/mod.ts";
