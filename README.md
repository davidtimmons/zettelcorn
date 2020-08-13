# Zettelcorn

CLI utilities for managing your Zettelkasten.

- [x] Compatible with Linux
- [ ] Not tested in macOS but _should_ work
- [ ] Not tested in Windows but _may_ work

![Zettelcorn](./media/promo.png)
<!-- ![Zettelcorn](https://raw.githubusercontent.com/davidtimmons/zettelcorn/master/media/promo.png) -->

## [⬑](#zettelcorn) Table of Contents

1. [Install](#-install)
2. [Documentation](#-documentation)
3. [Contribute](#-contribute)
4. [Credits](#-credits)
5. [License](#-license)

## [▲](#-table-of-contents) Install

1. Install Deno by following [the steps on the official website](https://deno.land/#installation).
2. Open a terminal window.
3. Run the Zettelcorn CLI script.

```bash
$> deno run --unstable --allow-read --allow-write
https://raw.githubusercontent.com/davidtimmons/zettelcorn/master/lib/zettlecorn.ts
```

After running Zettelcorn, Deno will cache all its dependencies. You will need to include a `--reload` flag whenever you want Deno to update your cache to use the latest Zettelcorn version.

### Deno Flags

- `--unstable` - Zettelcorn uses the Deno standard library which is not yet completely stable.
- `--allow-read` - Zettelcorn reads zettel files from your file system.
- `--allow-write` - Zettelcorn renames files but always with your permission.
- `--reload` - Updates the Deno cache to use the latest version of Zettelcorn.

### Linux

Consider creating an alias in your `.bashrc` (or equivalent) configuration file to make running Zettelcorn easier.

```bash
alias zettelcorn="deno run --unstable --allow-read --allow-write
https://raw.githubusercontent.com/davidtimmons/zettelcorn/master/lib/zettlecorn.ts"
```

```bash
$> zettelcorn
```

### Precaution

Zettelcorn modifies files in your Zettelkasten. While Zettelcorn is well-tested, be sure to back up your files before using it. The only undo is the one you provide!

## [▲](#-table-of-contents) Documentation

1. [`zettelcorn`](#-zettelcorn)
2. [`inject.keywords`](#-injectkeywords-options-path)
3. [`rename.files`](#-renamefiles-options-path-pattern)

### [◄](#-documentation) `zettelcorn`

_Alias:_ `zettelcorn -h`, `zettelcorn --help`

Display the help menu.

### [◄](#-documentation) `inject.keywords [options] <path>`

Inject topic tags into a "keywords" list inside the YAML frontmatter.

#### Notes

- Topic tags are defined as a hash followed by a word, for example `#foo` or `#foo-bar-baz`.
- If a topic tag is found and no frontmatter exists, frontmatter is first injected into the file.
- Topic tags are injected into "keywords" inside the frontmatter.
- If "keywords" exists and already contains a list, topic tags are merged into the existing list.
- If "keywords" exists but is not a list, the script will fail.

#### API

- `path` - The directory to search for zettels
- _[options]:_
  - `-r, --recursive` - Run command on a directory and all its sub-directories
  - `-v, --verbose` - List all files where keywords were injected
  - `-h, --help` - Display the help message for this command

#### Example

Suppose you have this zettel saved in your Zettelkasten.

```text
my-zettel.md
```

```text
#Alien #movie #budget ##1979

The film Alien debuted in 1979 with an estimated budget of $11,000,000 USD.
In 2020, that same amount would be worth roughly $39,000,000 USD.
```

Running `inject.keywords` with the following command would inject frontmatter and found topic tags into it for all zettels saved in and under that directory.

```bash
$> zettelcorn inject.keywords -rv ./my-directory
```

The example zettel would now look like this.

```text
---
keywords:
  - 1979
  - Alien
  - movie
  - budget
---
##1979 #Alien #movie #budget

The film Alien debuted in 1979 with an estimated budget of $11,000,000 USD.
In 2020, that same amount would be worth roughly $39,000,000 USD.
```

### [◄](#-documentation) `rename.files [options] <path> <pattern>`

Rename files containing YAML frontmatter.

#### Notes

- All files that do not contain frontmatter are skipped.
- It will fail if the YAML keys used in the pattern are not found in every file that contains frontmatter.

#### API

- `path` - The directory to search for zettels
- `pattern` - The pattern to use when renaming files
- _[options]:_
  - `-d, --dashed` - Substitute dashes for spaces in the file name
  - `-r, --recursive` - Run command on a directory and all its sub-directories
  - `-v, --verbose` - List all paths that changed along with each new value
  - `-h, --help` - Display the help message for this command

#### Example

Suppose you have this zettel saved in your Zettelkasten.

```text
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

```bash
$> zettelcorn rename.files -drv ./my-directory Movies-{id}-{title}-{keywords}.md
```

The example zettel would get a new name.

```text
Movies-12345-Alien-had-an-estimated-$11M-USD-budget-Alien,movie,budget.md
```

## [▲](#-table-of-contents) Contribute

Is there a feature you want that Zettelcorn doesn't have? [Suggestions](https://github.com/davidtimmons/zettelcorn/issues) and [contributions](https://github.com/davidtimmons/zettelcorn/pulls) are welcome!

## [▲](#-table-of-contents) Credits

The illustration above is from [unDraw](https://undraw.co/).

## [▲](#-table-of-contents) License

Licensed under the MIT license.
