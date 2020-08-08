# Zettelcorn

CLI utilities for managing your Zettelkasten.

- [x] Compatible with Linux
- [ ] Not tested in macOS but _should_ work
- [ ] Not tested in Windows but _may_ work

![Zettelcorn](./media/promo.png)
<!-- ![Zettelcorn](https://raw.githubusercontent.com/davidtimmons/zettelcorn/master/media/promo.png) -->

## Install

1. Install Deno by following [the steps on the official website](https://deno.land/#installation).
2. Open a terminal window.
3. Run the Zettelcorn CLI script.

```
$> deno run --unstable --allow-read --allow-write
https://raw.githubusercontent.com/davidtimmons/zettelcorn/master/lib/zettlecorn.ts
```

After running Zettelcorn, Deno will cache all its dependencies. You will need to include a `--reload` flag whenever you want Deno to update your cache to use the latest Zettelcorn version.

### Deno Flags

+ `--unstable` - Zettelcorn uses the Deno standard library which is not yet completely stable.
+ `--allow-read` - Zettelcorn reads zettel files from your file system.
+ `--allow-write` - Zettelcorn renames files but always with your permission.
+ `--reload` - Updates the Deno cache to use the latest version of Zettelcorn.

### Linux

Consider creating an alias in your `.bashrc` (or equivalent) configuration file to make running Zettelcorn easier.

```bash
alias zettelcorn="deno run --unstable --allow-read --allow-write
https://raw.githubusercontent.com/davidtimmons/zettelcorn/master/lib/zettlecorn.ts"
```
```
$> zettelcorn
```

### Precaution

Zettelcorn modifies files in your Zettelkasten. While Zettelcorn is well-tested, be sure to back up your files before using it. The only undo is the one you provide!

## Documentation

### `zettelcorn`

_Alias:_ `zettelcorn -h`, `zettelcorn --help`

Display the help menu.

### `rename.files [options] <path> <pattern>`

Rename files containing YAML frontmatter.

#### Notes

+ All files that do not contain frontmatter are skipped.
+ It will fail if the YAML keys used in the pattern are not found in every file that contains frontmatter.

#### API

+ `path` - The directory to search for zettels
+ `pattern` - The pattern to use when renaming files
+ _[options]:_
  + `-d, --dashed` - Substitute dashes for spaces in the file name
  + `-r, --recursive` - Run command on a directory and all its sub-directories
  + `-v, --verbose` - List all paths that changed along with each new value
  + `-h, --help` - Display the help message for this command

#### Example

Suppose you have this zettel saved in your Zettelkasten.


```
my-zettel.md
```
```
---
id: 12345
title: Alien had an estimated $11M USD budget
keywords:
  - Alien
  - movie
  - budget
---
The film Alien debuted in 1979 with an estimated budget of $11,000,000 USD.
In 2020, that same amount would be worth roughly $39,000,000 USD.
```

Running `rename.files` with the following command would change the file name for all zettels saved in and under that directory.

```
$> zettelcorn -drv ./my-directory Movies-{id}-{title}-{keywords}.md
```

The example zettel would get a new name.

```
Movies-12345-Alien-had-an-estimated-$11M-USD-budget-Alien,movie,budget.md
```

## Contribute

Is there a feature you want that Zettelcorn doesn't have? [Suggestions](https://github.com/davidtimmons/zettelcorn/issues) and [contributions](https://github.com/davidtimmons/zettelcorn/pulls) are welcome!

## Credits

The illustration above is from [unDraw](https://undraw.co/).

## License

Licensed under the MIT license.
