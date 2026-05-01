# Abbreviation

Regolith filter that reduces JSON filenames in the Behavior Pack and Resource Pack to short abbreviations of at most 5 letters. Keeps file trees readable and avoids overly long paths without manual renaming.

## What it does

During each build, the filter:

1. Strips common suffixes from the stem (`.behavior`, `.animation`, `.animation_controller`, etc.)
2. For **compound names** (containing `_` or `-`): takes the first letter of each word
3. For **single words**: takes the first, middle, and last letter
4. Truncates the result to **5 characters** maximum
5. Resolves collisions in the same directory by appending a counter (`name1.json`, `name2.json`, …)

**Source files in `packs/` are never modified** — renaming happens only on the Regolith build copy.

### Example

Before (source):

```
BP/entities/zombie_piglin_spawn.behavior.json
BP/entities/attack_speed_boost.behavior.json
BP/entities/creeper.json
```

After (build output):

```
BP/entities/zps.json
BP/entities/asb.json
BP/entities/cpr.json
```

## Installation

```json
"filterDefinitions": {
    "abbreviation": {
        "url": "github.com/innova67/regolith-filters/abbreviation",
        "version": "1.0.0"
    }
}
```

Then run:

```sh
regolith install-all
```

## Usage

Add the filter to your profile:

```json
"filters": [
    {
        "filter": "abbreviation"
    }
]
```

This filter takes no settings — it applies the same abbreviation rules everywhere.

## Notes

**BP ignored directories** — these folders are left untouched:

`loot_tables`, `trading`, `scripts`, `structures`, `texts`, `feature_rules`, `features`, `biomes`

**RP ignored directories** — left untouched:

`textures`, `texts`, `sounds`, `particles`

**RP ignored files** — always kept as-is:

`manifest.json`, `sounds.json`, `blocks.json`

- `manifest.json` is always skipped in BP as well.
- Only `.json` filenames are changed — folder names are never modified.
- Requires Python 3.8+.
