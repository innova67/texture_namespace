# Texture Namespace

Regolith filter that reorganizes Resource Pack textures under a namespaced folder structure and updates all JSON path references to match. Prevents texture conflicts between different addons installed in the same world.

## What it does

During each build, the filter:

1. Moves texture subdirectories from `textures/<subdir>/` to `textures/<studio>/<project>/<subdir>/`
2. Updates all JSON path references across the RP (entity definitions, `item_texture.json`, etc.)

**Source files in `packs/` are never modified** — the reorganization happens only on the Regolith build copy.

### Example

Before (source):

```
RP/textures/entity/crab_mech/crab_mech_black.png
RP/textures/items/wrecking_ball_icon.png
RP/entity/crab_mech.json  →  "textures/entity/crab_mech/crab_mech_black"
```

After (build output):

```
RP/textures/chillcraft/mechs/entity/crab_mech/crab_mech_black.png
RP/textures/chillcraft/mechs/items/wrecking_ball_icon.png
RP/entity/crab_mech.json  →  "textures/chillcraft/mechs/entity/crab_mech/crab_mech_black"
```

## Installation

```json
"filterDefinitions": {
    "texture_namespace": {
        "url": "github.com/innova67/texture_namespace",
        "version": "1.0.0"
    }
}
```

Then run:

```sh
regolith install-all
```

## Usage

Add the filter to your profile **before** `texture_list` so the texture list is generated with the correct namespaced paths:

```json
"filters": [
    {
        "filter": "texture_namespace",
        "settings": {
            "studio": "chillcraft",
            "project": "mechs"
        }
    },
    {
        "filter": "texture_list"
    }
]
```

## Settings

| Setting        | Type       | Required | Default                           | Description                                              |
| -------------- | ---------- | -------- | --------------------------------- | -------------------------------------------------------- |
| `studio`       | `string`   | Yes      | `"studio"`                        | Studio abbreviation used as the first namespace folder   |
| `project`      | `string`   | Yes      | `"project"`                       | Project abbreviation used as the second namespace folder |
| `texture_dirs` | `string[]` | No       | `["entity", "items", "particle"]` | List of subdirectories inside `textures/` to reorganize  |

### Custom texture_dirs example

```json
{
	"filter": "texture_namespace",
	"settings": {
		"studio": "chillcraft",
		"project": "mechs",
		"texture_dirs": ["entity", "items", "particle", "blocks"]
	}
}
```

## Notes

- `texture_set.json` files (PBR material sets) use relative filename references and are moved alongside their textures without needing internal updates.
- The filter scans all `.json` files in `RP/` for path replacements, only matching quoted strings to avoid false positives.
- Supports `.png` and `.tga` texture formats.
- Requires Python 3.8+.
