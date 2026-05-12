# typecheck

Regolith filter that runs TypeScript type checking (`tsc --noEmit`) on your project before esbuild transpiles it. Place it before your esbuild filter so type errors stop the pipeline early.

## What it does

Runs `tsc --noEmit` using the TypeScript bundled with this filter, with your project root as the working directory so it picks up your own `tsconfig.json`.

Exits with code 1 and stops the pipeline if any type errors are found. Prints a success message if the project is clean.

## Requirements

- Your project must have a `tsconfig.json` at the project root.
- Node.js 18+

## Installation

```json
"filterDefinitions": {
    "typecheck": {
        "url": "github.com/innova67/regolith-filters/typecheck",
        "version": "1.0.0"
    }
}
```

Then run:

```sh
regolith install-all
```

## Usage

Add the filter to your profile **before** your esbuild filter:

```json
"filters": [
    {
        "filter": "typecheck"
    },
    {
        "filter": "esbuild"
    }
]
```

## Output

On type errors:

```
BP/scripts/main.ts:12:5 - error TS2322: Type 'string' is not assignable to type 'number'.
```

On a clean project:

```
[OK] typecheck: no type errors found
```
