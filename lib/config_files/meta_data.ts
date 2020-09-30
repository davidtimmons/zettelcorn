/**
 * Meta data concerning the configuration files and where to expect them on the local system.
 * @protected
 * @module config_files/meta_data
 * @see module:config_files/mod
 */

import { Utilities as $ } from "./deps.ts";

/// TYPES ///

interface TTokens {
  [token: string]: {
    id: string;
    create: Function;
  };
}

interface TData {
  fileCount: number;
  localDirectory: string;
  tokens: TTokens;
}

/// LOGIC ///

export const data: TData = {
  fileCount: 2, // Number of files to be copied to the local hard drive.
  localDirectory: ".zettelcorn",
  tokens: {
    "{id}": {
      id: "id",
      create: $.getTimestamp,
    },
  },
};
