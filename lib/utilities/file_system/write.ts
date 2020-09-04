/**
 * Utilities for writing data to the file system.
 * @protected
 * @module utilities/file_system/write
 * @see module:utilities/file_system/mod
 * @see module:utilities/mod
 */

import { UIUtilities as UI$ } from "../mod.ts";
import { TReadResult, doesFileOrDirectoryExist } from "./read.ts";

/// TYPES ///

interface TWriteFile<T> {
  (options: T, file: TReadResult): Promise<void>;
}

type TWriteOptions<T> = T & {
  silent?: boolean;
  verbose?: boolean;
  startWorkMsg?: string;
  endWorkMsg?: string;
};

/// LOGIC ///

export async function writeQueuedFiles<T>(
  write: TWriteFile<T>,
  options: TWriteOptions<T>,
  fileQueue: TReadResult[],
): Promise<void> {
  const startWorkMsg = options.startWorkMsg ?? "Modified files:";
  const endWorkMsg = options.endWorkMsg ??
    `Processed ${fileQueue.length} files.`;

  if (options.verbose) {
    UI$.notifyUser(startWorkMsg, {
      padTop: true,
      padBottom: false,
      style: UI$.TUIStyles.BOLD,
    });
  }

  // Resolve all writes first so UI success message does not appear early.
  const promises = fileQueue.map((file) => {
    return write(options, file);
  });

  await Promise
    .all(promises)
    .then(() => {
      if (options.silent) return;
      UI$.notifyUser(endWorkMsg, {
        padTop: true,
        padBottom: true,
        style: UI$.TUIStyles.BOLD,
      });
    });
}

export async function removeDirectory(dirPath: string) {
  const doesExist = await doesFileOrDirectoryExist(dirPath);
  if (doesExist) {
    await Deno.remove(dirPath, { recursive: true });
    return true;
  } else {
    return false;
  }
}
