# Zettelcorn

CLI utilities for managing your Zettelkasten knowledge base.

- [x] Compatible with Linux
- [x] Compatible with Windows
- [ ] Not tested with macOS but [_should_ work](https://github.com/davidtimmons/zettelcorn/issues/1)

![Zettelcorn](./media/promo.png)

## [⬑](#zettelcorn) Table of Contents

1. [Overview](#-overview)
1. [Install](#-install)
1. [Documentation](#-documentation)
1. [Develop](#-development)
1. [Contribute](#-contribute)
1. [Credits](#-credits)
1. [License](#-license)

## [🠕](#-table-of-contents) Overview

Adding new notes to a digital Zettelkasten should be easy. Blank note files present no problems, but what if new notes should comply with a certain template structure? What if a Zettelkasten uses several *different* note templates? This adds unnecessary friction to what should be a simple writing process. Copying and pasting templates can be an irritating distraction when all we really want to do is quickly record a sudden insight in a new note file.

Maintaining consistent note structure can also be a problem. What if we decide file names should follow a different format than our earlier notes? Or what if we suddenly need accurate metadata about each of our notes for a new Zettelkasten tool to function correctly? Reversing early note structure decisions becomes a time-consuming slog as a Zettelkasten grows. Our focus should be on writing new notes, not managing note files and metadata.

Zettelcorn takes the manual labor out of maintaining a digital Zettelkasten. Add one, two, or a hundred blank notes at a time using any custom template. Rename files in the entire Zettelkasten (or specific directories) with very little effort. Parse existing notes then inject a unique ID, title, and keyword list into YAML frontmatter for each note. Maintaining a digital Zettelkasten should not be a struggle. Zettelcorn makes it easy to focus on the fun parts.

## [🠕](#-table-of-contents) Install

1. Install Deno by following [the steps on the official website](https://deno.land/#installation).
2. Open a terminal window.
3. Run the Zettelcorn CLI script remotely.

```bash
$> deno run --import-map=import_map.json --allow-read --allow-write https://raw.githubusercontent.com/davidtimmons/zettelcorn/master/lib/zettelcorn.ts
```

After running Zettelcorn, Deno will cache all its dependencies. You will need to include a
`--reload` flag whenever you want Deno to update your cache to use the latest Zettelcorn version.

### Deno Compatibility

Zettelcorn was last tested with Deno `1.21.0`.

### Deno Flags

- `--allow-read` - Zettelcorn reads zettel files from your file system.
- `--allow-write` - Zettelcorn modifies and writes files but always with your permission.
- `--reload` - Updates the Deno cache to use the latest version of Zettelcorn.

### Linux

Consider creating an alias in your `.bashrc` (or equivalent) configuration file to make
running Zettelcorn easier.

```bash
alias zettelcorn="deno run --import-map=import_map.json --allow-read --allow-write https://raw.githubusercontent.com/davidtimmons/zettelcorn/master/lib/zettelcorn.ts"
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
  $im = "https://raw.githubusercontent.com/davidtimmons/zettelcorn/master/import_map.json";
  $zc = "https://raw.githubusercontent.com/davidtimmons/zettelcorn/master/lib/zettelcorn.ts";
  deno.exe run --import-map=$im --allow-read --allow-write $zc @args
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

See [the Zettelcorn manual](./MANUAL.md) for detailed instructions on using this CLI tool.

## [🠕](#-table-of-contents) Develop

Zettelcorn includes a permissive license. You are free to modify the source code to suit your needs. Use the included `Makefile` to run this project, or use Deno directly from the command line.

After cloning the project, install and cache the dependencies:

- `make install` or
- `deno cache --reload --lock=lock.json ./deps.ts`

Run the Zettelcorn test suite with the following command:

- `make test` or
- `deno test --lock=lock.json --import-map=import_map.json --allow-read --allow-write ./test/`

Run Zettelcorn from a local directory with this command:

- `make run` or
- `deno run --lock=lock.json --import-map=import_map.json --allow-read --allow-write ./lib/zettelcorn.ts`

## [🠕](#-table-of-contents) Contribute

Is there a feature you want that Zettelcorn doesn't have?
[Suggestions](https://github.com/davidtimmons/zettelcorn/issues) and
[contributions](https://github.com/davidtimmons/zettelcorn/pulls) are welcome!

## [🠕](#-table-of-contents) Credits

The illustration above is from [unDraw](https://undraw.co/).

## [🠕](#-table-of-contents) License

Licensed under [the MIT license](./LICENSE).
