/**
 * Utilities for writing data to the file system.
 * @protected
 * @module utilities/file_system/write
 * @see module:utilities/file_system/mod
 * @see module:utilities/mod
 */

import { UIUtilities as UI$ } from "../mod.ts";
import { doesFileOrDirectoryExist, TReadResult } from "./read.ts";

/// TYPES ///

export enum TWriteStatusCodes {
  OK,
  EMPTY_WRITE_QUEUE,
  WRITE_ERROR,
}

export interface TWriteResult {
  readonly status: TWriteStatusCodes;
  readonly error?: Error;
}

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
): Promise<TWriteResult> {
  const fileCount = fileQueue.length;
  const startWorkMsg = options.startWorkMsg ?? "Modified files:";
  const endWorkMsg = options.endWorkMsg ??
    `Processed ${fileCount} files.`;

  // End early when there are no files to write.
  if (fileQueue.length === 0) {
    return {
      status: TWriteStatusCodes.EMPTY_WRITE_QUEUE,
      error: Error("The write queue is empty."),
    };
  }

  // Optionally notify the user that writing files has begun.
  if (options.verbose) {
    UI$.notifyUser(startWorkMsg, {
      padTop: true,
      padBottom: false,
      style: UI$.TUIStyles.BOLD,
    });
  }

  // Write files in batches to prevent large queues from freezing the process.
  // Writing files all at once will hang the CLI on large file queues (~>500).
  const batchSize = 100;
  let i = 0;
  let j = 100;

  do {
    const fileBatch = fileQueue.slice(i, j);
    const writeResult = await _writeQueuedFileBatch(write, options, fileBatch);

    if (writeResult.error) {
      return writeResult;
    }

    i = j;
    j += batchSize;
  } while (j < fileCount);

  // Optionally notify the user all files have successfully been written.
  // Resolve all writes first so UI success message does not appear early.
  if (!options.silent) {
    UI$.notifyUser(endWorkMsg, {
      padTop: true,
      padBottom: true,
      style: UI$.TUIStyles.BOLD,
    });
  }

  return { status: TWriteStatusCodes.OK };
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

async function _writeQueuedFileBatch<T>(
  write: TWriteFile<T>,
  options: TWriteOptions<T>,
  fileQueue: TReadResult[],
): Promise<TWriteResult> {
  const promises = fileQueue.map((file) => {
    return write(options, file);
  });

  return await Promise
    .all(promises)
    .then(() => {
      return { status: TWriteStatusCodes.OK };
    })
    .catch((error) => {
      return {
        status: TWriteStatusCodes.WRITE_ERROR,
        error,
      };
    });
}
