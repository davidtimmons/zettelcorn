/**
 * Default template used to create new zettels.
 * @protected
 * @module config_files/local/zettel
 * @see module:config_files/mod
 */

import { Utilities as $ } from "../deps.ts";

export const fileName = "{id}.md.zettel";
export const fileExt = ".zettel";
export const fileData = $.formatWithEOL(`
---
title:
id: {id}
keywords:
---



---
Links:

- [[{id}]]

---
References:
`.trimLeft());
