# Zettelcorn

CLI utilities for managing your Zettelkasten knowledge base.

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

### Deno Compatibility

Zettelcorn was last tested with Deno `1.7.5`.

### Deno Flags

- `--unstable` - Zettelcorn uses the Deno standard library which is not yet completely stable.
- `--allow-read` - Zettelcorn reads zettel files from your file system.
- `--allow-write` - Zettelcorn modifies and writes files but always with your permission.
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

### Caution

Zettelcorn modifies files in your Zettelkasten. While Zettelcorn is well-tested, be sure to back up
your files before using it. The only undo is the one you provide!

## [🠕](#-table-of-contents) Documentation

1. [`zettelcorn`](#-zettelcorn)
1. [`init`](#-init-options-directory)
1. [`inject.id`](#-injectid-options-directory)
1. [`inject.keywords`](#-injectkeywords-options-directory)
1. [`inject.title`](#-injecttitle-options-directory)
1. [`new.zettel`](#-newzettel-options-directory)
1. [`rename.files`](#-renamefiles-options-directory-pattern)

### [🠔](#-documentation) `zettelcorn`

_Alias:_ `zettelcorn -h`, `zettelcorn --help`

Display the help menu.

### [🠔](#-documentation) `init [options] [directory]`

Initializes a Zettelcorn project directory with configuration files.

This is an optional command as most features available through the Zettelcorn CLI application
will work as expected _without_ any local configuration files.

#### API

- `[directory]` - The directory where a `.zettelcorn` directory will be created (default: `.`)
- `[options]`:
  - `--force` - Overwrite any existing Zettelcorn configuration files with default values
  - `--silent` - Run command with no console output and automatic yes to prompts
  - `--verbose` - List all configuration files that were created
  - `-h, --help` - Display the help message for this command

#### Notes

Suppose you are at the path `/home/ripley/zettelkasten` in your terminal. Running `zettelcorn init`
will create the following directory and files at that location:

```text
.zettelcorn
|— {id}.md.zettel
|— zettelcorn_config.yaml
```

##### Configuration directory: `.zettelcorn`

All Zettelcorn configuration files will be written to and read from this directory. You may wish
to keep this directory under version control.

##### Configuration file: `{id}.md.zettel`

_See:_ [`new.zettel`](#-newzettel-options-directory)

- This is a template file for generating a new zettel.
- The content of this file can modified as desired.
- The file name can be modified as desired up to the `.zettel` extension.
- Tokens such as `{id}` are automatically replaced when creating a new zettel from this template.
- `{id}` is the only recognized token for now.

##### Configuration file: `zettelcorn_config.yaml`

- This file contains optional configuration settings for Zettelcorn.
- `zettel_templates`:
  - Create custom template files that match your Zettelkasten workflow.
  - There must be a "default" key and a default template.
  - Any other template is optional.
  - Follow these steps to use additional custom templates:
    1. Create a new key in the YAML configuration file, e.g. `alt`.
    1. Create a new file with a compound file extension that matches the YAML key and ends with `.zettel`, e.g. `.alt.zettel`.
    1. Provide this key to the appropriate Zettelcorn command, e.g. [`new.zettel --template alt`](#-newzettel-options-directory).

### [🠔](#-documentation) `inject.id [options] <directory>`

Inject the detected ID into an "id" key inside the YAML frontmatter.

#### API

- `directory` - The directory to search for zettels
- `[options]`:
  - `--regex [pattern]` - Detect the ID using a regular expression (default: `\d{14}`)
  - `--skip` - Skip files that contain an "id" frontmatter key
  - `--markdown` - Only modify Markdown files by looking for the *.md extension
  - `--recursive` - Run command on a directory and all its sub-directories
  - `--silent` - Run command with no console output and automatic yes to prompts
  - `--verbose` - List all files where IDs were injected
  - `-h, --help` - Display the help message for this command

#### Notes

- The script attempts to detect the zettel ID using a regular expression. The default approach is to search for the first number with 14 digits, for example `12345698765432`.
- YAML frontmatter will be injected into the file if it does not exist.
- An "id" key will be added to the frontmatter if it does not exist.
- If an ID is found it will be injected into "id".
- If an ID is found but one already exists in "id", it will be overwritten.

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
$> zettelcorn inject.id --recursive --verbose ./my-directory
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

### [🠔](#-documentation) `inject.keywords [options] <directory>`

Inject topic tags into a "keywords" list inside the YAML frontmatter.

#### API

- `directory` - The directory to search for zettels
- `[options]`:
  - `--heuristic` - Attempt to detect lines dedicated to listing topic tags
  - `--merge` - Merge found topic tags into frontmatter "keywords" instead of overwriting them
  - `--skip` - Skip files that contain a "keywords" frontmatter key
  - `--markdown` - Only modify Markdown files by looking for the *.md extension
  - `--recursive` - Run command on a directory and all its sub-directories
  - `--silent` - Run command with no console output and automatic yes to prompts
  - `--verbose` - List all files where keywords were injected
  - `-h, --help` - Display the help message for this command

#### Notes

- Topic tags are defined as a hash followed by a word, for example `#foo` or `#foo-bar-baz`.
- YAML frontmatter will be injected into the file if it does not exist.
- A "keywords" key will be added to the frontmatter if it does not exist.
- Found topic tags will be injected into "keywords".

##### Default

- If topic tags are found but "keywords" already exists, it will be overwritten.

##### `--merge`

- If "keywords" exists and already contains a list, topic tags will be merged into the existing list.
- If "keywords" exists but is not a list, the script will fail.

#### Example

Suppose you have this zettel saved in your Zettelkasten.

```text
my-zettel.md
```

```text
##1979 #Alien #movie #budget

The film Alien debuted in 1979 with an estimated budget of $11,000,000 USD.
In #2020, that same amount would be worth roughly $39,000,000 USD.
```

Running `inject.keywords` with the following command would inject frontmatter and found topic tags
into it for all zettels saved in and under that directory.

```bash
$> zettelcorn inject.keywords --recursive --verbose ./my-directory
```

The example zettel would now look like this.

```text
---
keywords:
  - 1979
  - Alien
  - movie
  - budget
  - 2020
---
##1979 #Alien #movie #budget

The film Alien debuted in 1979 with an estimated budget of $11,000,000 USD.
In #2020, that same amount would be worth roughly $39,000,000 USD.
```

#### Example (`--heuristic`)

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

### [🠔](#-documentation) `inject.title [options] <directory>`

Inject the detected title into a "title" key inside the YAML frontmatter.

#### API

- `directory` - The directory to search for zettels
- `[options]`:
  - `--skip` - Skip files that contain a "title" frontmatter key
  - `--markdown` - Only modify Markdown files by looking for the *.md extension
  - `--recursive` - Run command on a directory and all its sub-directories
  - `--silent` - Run command with no console output and automatic yes to prompts
  - `--verbose` - List all files where titles were injected
  - `-h, --help` - Display the help message for this command

#### Notes

- The script attempts to detect the H1 title using Markdown syntax, for example `# My Title`.
- YAML frontmatter will be injected into the file if it does not exist.
- A "title" key will be added to the frontmatter if it does not exist.
- If a title is found it will be injected into "title".
- If a title is found but one already exists in "title", it will be overwritten.

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
$> zettelcorn inject.title --recursive --verbose ./my-directory
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

### [🠔](#-documentation) `new.zettel [options] [directory]`

Create one or many new zettel files.

#### API

- `[directory]` - The directory where the new zettel files will be created
- `[options]`:
  - `--total [n]` - Create \[n\] new zettel files (default: `1`)
  - `--default` - Ignore the local zettel template if it exists
  - `--template <key>` - Create a new zettel file using a custom template (requires init)
  - `--silent` - Run command with no console output and automatic yes to prompts
  - `--verbose` - List all zettel files that were created
  - `-h, --help` - Display the help message for this command

#### Notes

_See:_ [`init [options] [directory]`](#-init-options-directory)

- New zettels are created with a timestamp ID, e.g., `20200907174614`.
- By default, when a zettel template is found, new zettel files are created based on that template.
- If a local zettel template does not exist, this command uses the Zettelcorn default template.
- You may choose to create a local zettel template with `zettelcorn init`.

#### Example

Suppose you are at the path `/home/ripley/zettelkasten` in your terminal. If a `.zettelcorn`
directory exists there and contains a zettel template file, new zettels will be created from
that template. If not, new zettels will be created from the Zettelcorn default template.

Running `new.zettel` with the following command would create 5 new zettel files in your Zettelkasten.

```bash
$> zettelcorn new.zettel --verbose --total 5 ./my-directory
```

Even if you have local zettel templates, you may wish to use the Zettelcorn default.
To do so, run the same command above using the `--default` flag.

```bash
$> zettelcorn new.zettel --verbose --default --total 5 ./my-directory
```

Alternatively, if you have several different local zettel templates for different purposes,
you can choose the one you want to use. These must first be configured in the local YAML
configuration file the `zettelcorn init` command creates. To use an alternate template instead of
the default, run the `new.zettel` command using the `--template <key>` flag.

```bash
$> zettelcorn new.zettel --verbose --template my_other_template ./my-directory
```

### [🠔](#-documentation) `rename.files [options] <directory> <pattern>`

Rename files containing YAML frontmatter.

#### API

- `directory` - The directory to search for zettels
- `pattern` - The pattern to use when renaming files
- `[options]`:
  - `--dashed` - Substitute dashes for spaces in the file name
  - `--markdown` - Only modify Markdown files by looking for the *.md extension
  - `--recursive` - Run command on a directory and all its sub-directories
  - `--silent` - Run command with no console output and automatic yes to prompts
  - `--verbose` - List all paths that changed along with each new value
  - `-h, --help` - Display the help message for this command

#### Notes

- All files that do not contain frontmatter are skipped.
- It will fail if YAML keys used in the pattern are not found in every file containing frontmatter.

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
$> zettelcorn rename.files --dashed --recursive --verbose ./my-directory "Movies-{id}-{title}-{keywords}.md"
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
