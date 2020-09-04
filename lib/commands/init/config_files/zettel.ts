/**
 * Default template used to create new zettels.
 * @protected
 * @module commands/init/config_files/zettel
 * @see module:commands/init/mod
 */

import { Utilities as $ } from "../deps.ts";

export const fileName = "{id}.md.zettel";
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
