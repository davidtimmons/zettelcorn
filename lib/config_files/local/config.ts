/**
 * Configuration file used to set Zettelcorn default behavior.
 * @protected
 * @module config_files/local/config
 * @see module:config_files/mod
 */

import { Utilities as $ } from "../deps.ts";
import { fileName as ZettelFileName } from "./zettel.ts";

export const fileName = "zettelcorn_config.yaml";
export const fileExt = ".yaml";
export const fileData = $.formatWithEOL(`
# ZETTELCORN CONFIGURATION
# Visit https://github.com/davidtimmons/zettelcorn to read more about this file.

# Create custom template files that match your Zettelkasten workflow. There must be a "default" key
# and a default template. Any other template is optional.

zettel_templates:
  default: "${ZettelFileName}"            # Default file template used to create a new zettel
  # alt: "{id}.md.alt.zettel"          # Any number of alternate specialized templates may also be used
`.trimLeft());
