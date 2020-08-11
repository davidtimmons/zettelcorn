import { FS, Path } from "../deps.ts";
import * as $ from "../utilities.ts";
import * as Y$ from "../parsers/yaml_frontmatter.ts";

/// TYPES ///

export interface TRunOptions {
  readonly [key: string]: any;
  readonly directory: string;
  readonly recursive: boolean;
  readonly yamlTransformation?: Function;
}

export interface TReadResult {
  readonly fileName: string;
  readonly path: string;
  readonly yaml: object;
}

/// LOGIC ///

export async function buildFileFrontmatterQueue(
  options: TRunOptions,
): Promise<TReadResult[]> {
  // TODO: Use a generator to avoid walking all files until user confirms intent.
  const walkDirectory: string = Deno.realPathSync(options.directory);
  const walkResults: TReadResult[] = [];
  const yamlTransformation = options.yamlTransformation || $.identity;

  for await (const entity of FS.walk(walkDirectory)) {
    const { path, name, isDirectory } = entity;

    if (isDirectory) continue;
    const thisPath = Deno.realPathSync(path);
    const inStartingDirectory = walkDirectory === Path.dirname(thisPath);

    if (options.recursive || inStartingDirectory) {
      const fileYAML = Y$.parseFrontmatter(await read(thisPath));
      const hasYAML = Object.keys(fileYAML).length > 0;

      if (hasYAML) {
        walkResults.push({
          fileName: name,
          path: thisPath,
          yaml: yamlTransformation(fileYAML),
        });
      }
    }
  }
  return walkResults;
}

export async function read(path: string): Promise<string> {
  if (path.length === 0) return "";
  const contents = await Deno.readTextFile(path);
  return contents;
}
