# Zettelcorn

CLI utilities for managing your Zettelkasten.

- [x] Compatible with Linux
- [x] Compatible with Windows
- [ ] Not tested in macOS but [_should_ work](https://github.com/davidtimmons/zettelcorn/issues/1)

![Zettelcorn](./media/promo.png)

## [⬑](#zettelcorn) Table of Contents

1. [Install](#-install)
2. [Documentation](#-documentation)
3. [Contribute](#-contribute)
4. [Credits](#-credits)
5. [License](#-license)

## [🠕](#-table-of-contents) Install

1. Install Deno by following [the steps on the official website](https://deno.land/#installation).
2. Open a terminal window.
3. Run the Zettelcorn CLI script.

```bash
$> deno run --unstable --allow-read --allow-write
https://raw.githubusercontent.com/davidtimmons/zettelcorn/master/lib/zettlecorn.ts
```

After running Zettelcorn, Deno will cache all its dependencies. You will need to include a
`--reload` flag whenever you want Deno to update your cache to use the latest Zettelcorn version.

### Deno Flags

- `--unstable` - Zettelcorn uses the Deno standard library which is not yet completely stable.
- `--allow-read` - Zettelcorn reads zettel files from your file system.
- `--allow-write` - Zettelcorn renames files but always with your permission.
- `--reload` - Updates the Deno cache to use the latest version of Zettelcorn.

### Linux

Consider creating an alias in your `.bashrc` (or equivalent) configuration file to make
running Zettelcorn easier.

```bash
alias zettelcorn="deno run --unstable --allow-read --allow-write https://raw.githubusercontent.com/davidtimmons/zettelcorn/master/lib/zettlecorn.ts"
```

```bash
$> zettelcorn
```

### Windows

Consider adding a function to your PowerShell profile to make running Zettelcorn easier.
To do so, first create a profile that will load scripts when opening PowerShell.

```powershell
$> Set-ExecutionPolicy -Scope CurrentUser Unrestricted
$> New-Item $profile -Type File -Force
$> notepad $profile
```

Then, paste a `zettelcorn` function into the profile open in Notepad.

```powershell
function zettelcorn {
  deno.exe run --unstable --allow-read --allow-write https://raw.githubusercontent.com/davidtimmons/zettelcorn/master/lib/zettlecorn.ts @args
}
```

Finally, run `zettelcorn` from a PowerShell prompt.

```powershell
$> zettelcorn
```

### Precaution

Zettelcorn modifies files in your Zettelkasten. While Zettelcorn is well-tested, be sure to back up
your files before using it. The only undo is the one you provide!

## [🠕](#-table-of-contents) Documentation

1. [`zettelcorn`](#-zettelcorn)
1. [`inject.id`](#-injectid-options-path)
1. [`inject.keywords`](#-injectkeywords-options-path)
1. [`inject.title`](#-injecttitle-options-path)
1. [`rename.files`](#-renamefiles-options-path-pattern)

### [🠔](#-documentation) `zettelcorn`

_Alias:_ `zettelcorn -h`, `zettelcorn --help`

Display the help menu.

### [🠔](#-documentation) `inject.id [options] <path>`

Inject the detected ID into an "id" key inside the YAML frontmatter.

#### Notes

- The script attempts to detect the zettel ID using a regular expression. The default approach is to search for the first number with 14 digits, for example `12345698765432`.
- YAML frontmatter will be injected into the file if it does not exist.
- An "id" key will be added to the frontmatter if it does not exist.
- If an ID is found it will be injected into "id".
- If an ID is found but one already exists in "id", it will be overwritten.

#### API

- `path` - The directory to search for zettels
- [options]:
  - `-x, --regex [pattern]` - Detect the ID using a regular expression (default: `\d{14}`)
  - `-s, --skip` - Skip files that contain an "id" frontmatter key
  - `-r, --recursive` - Run command on a directory and all its sub-directories
  - `-m, --markdown` - Only modify Markdown files by looking for the *.md extension
  - `-b, --verbose` - List all files where IDs were injected
  - `-h, --help` - Display the help message for this command

#### Example

Suppose you have this zettel saved in your Zettelkasten.

```text
my-zettel.md
```

```text
# 12345698765432 Alien debuted in 1979 with a multi-million USD budget

The film Alien debuted in 1979 with an estimated budget of $11,000,000 USD.
In 2020, that same amount would be worth roughly $39,000,000 USD.
```

Running `inject.id` with the following command would inject frontmatter and the found ID
into it for all zettels saved in and under that directory.

```bash
$> zettelcorn inject.id -rb ./my-directory
```

The example zettel would now look like this.

```text
---
id: 12345698765432
---
# 12345698765432 Alien debuted in 1979 with a multi-million USD budget

The film Alien debuted in 1979 with an estimated budget of $11,000,000 USD.
In 2020, that same amount would be worth roughly $39,000,000 USD.
```

### [🠔](#-documentation) `inject.keywords [options] <path>`

Inject topic tags into a "keywords" list inside the YAML frontmatter.

#### Notes

- Topic tags are defined as a hash followed by a word, for example `#foo` or `#foo-bar-baz`.
- YAML frontmatter will be injected into the file if it does not exist.
- A "keywords" key will be added to the frontmatter if it does not exist.
- Found topic tags will be injected into "keywords".

##### Default

- If topic tags are found but "keywords" already exists, it will be overwritten.

##### Merge Option

- If "keywords" exists and already contains a list, topic tags will be merged into the existing list.
- If "keywords" exists but is not a list, the script will fail.

#### API

- `path` - The directory to search for zettels
- [options]:
  - `-u, --heuristic` - Attempt to detect lines dedicated to listing topic tags
  - `-g, --merge` - Merge found topic tags into frontmatter "keywords" instead of overwriting them
  - `-s, --skip` - Skip files that contain a "keywords" frontmatter key
  - `-r, --recursive` - Run command on a directory and all its sub-directories
  - `-m, --markdown` - Only modify Markdown files by looking for the *.md extension
  - `-b, --verbose` - List all files where keywords were injected
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

Running `inject.keywords` with the following command would inject frontmatter and found topic tags
into it for all zettels saved in and under that directory.

```bash
$> zettelcorn inject.keywords -rb ./my-directory
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

#### Example (Using the Heuristic Option)

The `--heuristic` option looks for rows in a zettel that end with at least two topic tags.
If the heuristic fails to find anything, Zettelcorn will fall back to searching for _anything_
in the document that appears to be a topic tag.

This is an example zettel.

```text
#history #social-media

The hashtag (i.e. #hashtag) came into popular usage with social media platforms. #win
```

Using the `--heuristic` option results in this updated zettel.

```text
---
keywords:
  - history
  - social-media
---
#history #social-media

The hashtag (i.e. #hashtag) came into popular usage with social media platforms. #win
```

Without the `--heuristic` option, the zettel would instead look like this.

```text
---
keywords:
  - history
  - social-media
  - hashtag
  - win
---
#history #social-media

The hashtag (i.e. #hashtag) came into popular usage with social media platforms. #win
```

### [🠔](#-documentation) `inject.title [options] <path>`

Inject the detected title into a "title" key inside the YAML frontmatter.

#### Notes

- The script attempts to detect the H1 title using Markdown syntax, for example `# My Title`.
- YAML frontmatter will be injected into the file if it does not exist.
- A "title" key will be added to the frontmatter if it does not exist.
- If a title is found it will be injected into "title".
- If a title is found but one already exists in "title", it will be overwritten.

#### API

- `path` - The directory to search for zettels
- [options]:
  - `-s, --skip` - Skip files that contain a "title" frontmatter key
  - `-r, --recursive` - Run command on a directory and all its sub-directories
  - `-m, --markdown` - Only modify Markdown files by looking for the *.md extension
  - `-b, --verbose` - List all files where titles were injected
  - `-h, --help` - Display the help message for this command

#### Example

Suppose you have this zettel saved in your Zettelkasten.

```text
my-zettel.md
```

```text
# Alien debuted in 1979 with a multi-million USD budget

The film Alien debuted in 1979 with an estimated budget of $11,000,000 USD.
In 2020, that same amount would be worth roughly $39,000,000 USD.
```

Running `inject.title` with the following command would inject frontmatter and the found title
into it for all zettels saved in and under that directory.

```bash
$> zettelcorn inject.title -rb ./my-directory
```

The example zettel would now look like this.

```text
---
title: Alien debuted in 1979 with a multi-million USD budget
---
# Alien debuted in 1979 with a multi-million USD budget

The film Alien debuted in 1979 with an estimated budget of $11,000,000 USD.
In 2020, that same amount would be worth roughly $39,000,000 USD.
```

### [🠔](#-documentation) `rename.files [options] <path> <pattern>`

Rename files containing YAML frontmatter.

#### Notes

- All files that do not contain frontmatter are skipped.
- It will fail if YAML keys used in the pattern are not found in every file containing frontmatter.

#### API

- `path` - The directory to search for zettels
- `pattern` - The pattern to use when renaming files
- [options]:
  - `-d, --dashed` - Substitute dashes for spaces in the file name
  - `-r, --recursive` - Run command on a directory and all its sub-directories
  - `-m, --markdown` - Only modify Markdown files by looking for the *.md extension
  - `-b, --verbose` - List all paths that changed along with each new value
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

Running `rename.files` with the following command would change the file name for all zettels
saved in and under that directory.

```bash
$> zettelcorn rename.files -drb ./my-directory Movies-{id}-{title}-{keywords}.md
```

The example zettel would get a new name.

```text
Movies-12345-Alien-had-an-estimated-$11M-USD-budget-Alien,movie,budget.md
```

## [🠕](#-table-of-contents) Contribute

Is there a feature you want that Zettelcorn doesn't have?
[Suggestions](https://github.com/davidtimmons/zettelcorn/issues) and
[contributions](https://github.com/davidtimmons/zettelcorn/pulls) are welcome!

## [🠕](#-table-of-contents) Credits

The illustration above is from [unDraw](https://undraw.co/).

## [🠕](#-table-of-contents) License

Licensed under the MIT license.
