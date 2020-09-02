/**
 * Utilities for reading and transforming data from the file system.
 * @protected
 * @module utilities/file_system/read
 * @see module:utilities/file_system/mod
 * @see module:utilities/mod
 */

import { FS, Path } from "../deps.ts";
import { HelpersUtilities as H$, ParsersUtilities as P$ } from "../mod.ts";

/// TYPES ///

export interface TRunOptions {
  readonly [key: string]: any;
  readonly directory: string;
  readonly getFileContent?: boolean;
  readonly recursive: boolean;
  readonly requireMarkdown?: boolean;
  readonly requireMeta?: boolean;
  readonly requireYaml?: boolean;
  readonly metaTransformation?: TTransform;
  readonly yamlTransformation?: TTransformYAML;
}

export interface TReadResult {
  readonly fileContent: string;
  readonly fileName: string;
  readonly meta: any;
  readonly path: string;
  readonly yaml: { [key: string]: any };
}

export interface TTransformOptions {
  readonly extension: string;
  readonly fileContent: string;
  readonly isDirectory: boolean;
  readonly name: string;
  readonly path: string;
  readonly fileYAML: { [key: string]: any };
}

interface TTransform {
  (options: TTransformOptions): any;
}

interface TTransformYAML {
  (options: TTransformOptions): { [key: string]: any };
}

/// LOGIC ///

export async function buildFileQueue(
  options: TRunOptions,
): Promise<TReadResult[]> {
  // TODO: Use a generator to avoid walking all files until user confirms intent.
  // TODO: Explore using byte arrays to work with textual file content.
  const walkDirectory: string = Deno.realPathSync(options.directory);
  const walkResults: TReadResult[] = [];

  const metaTransformation: TTransform = options.metaTransformation ||
    (() => null);
  const yamlTransformation: TTransformYAML = options.yamlTransformation ||
    (({ fileYAML }) => fileYAML);

  for await (const entity of FS.walk(walkDirectory)) {
    const { path, name, isDirectory } = entity;
    const extension = Path.extname(path);

    if (isDirectory) continue;
    if (options.requireMarkdown && extension !== ".md") continue;

    const thisPath = Deno.realPathSync(path);
    const inStartingDirectory = walkDirectory === Path.dirname(thisPath);

    if (options.recursive || inStartingDirectory) {
      const fileContent = await readTextFile(thisPath);
      const fileYAML = P$.parseFrontmatter(fileContent);

      const transformationOptions: TTransformOptions = {
        extension,
        fileContent,
        fileYAML,
        isDirectory,
        name,
        path,
      };

      const walkResult = {
        fileContent: options.getFileContent ? fileContent : "",
        fileName: name,
        path: thisPath,
        meta: metaTransformation(transformationOptions),
        yaml: yamlTransformation(transformationOptions),
      };

      const noRequirements = !(options.requireMeta || options.requireYaml);
      const hasMeta = !H$.isEmpty(walkResult.meta);
      const hasYAML = !H$.isEmpty(walkResult.yaml);

      if (noRequirements) {
        walkResults.push(walkResult);
      } else if (options.requireMeta && hasMeta) {
        walkResults.push(walkResult);
      } else if (options.requireYaml && hasYAML) {
        walkResults.push(walkResult);
      }
    }
  }
  return walkResults;
}

export async function readTextFile(path: string): Promise<string> {
  if (path.length === 0) return "";
  const contents = await Deno.readTextFile(path);
  return contents;
}
