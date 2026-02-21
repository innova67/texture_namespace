"""
texture_namespace - Regolith filter
Reorganizes RP textures under textures/<studio>/<project>/ and updates
all JSON path references in the RP to match.

Settings (passed as sys.argv[1] JSON string by Regolith):
  studio       - Studio abbreviation, e.g. "chillcraft"
  project      - Project abbreviation, e.g. "mechs"
  texture_dirs - (optional) List of subdirs to process.
                 Default: ["entity", "items", "particle"]
"""

import sys
import json
import shutil
from pathlib import Path


IMAGE_EXTENSIONS = {'.png', '.tga'}


def get_settings() -> dict:
    try:
        return json.loads(sys.argv[1])
    except (IndexError, json.JSONDecodeError):
        return {}


def build_path_mapping(textures_dir: Path, studio: str, project: str, texture_dirs: list) -> dict:
    """
    Returns a dict mapping old JSON texture paths to new ones.
    Keys/values are the paths as they appear in JSON (no file extension).

    Example:
      "textures/entity/crab_mech/crab_mech_black"
        -> "textures/chillcraft/mechs/entity/crab_mech/crab_mech_black"
    """
    mapping = {}
    for subdir_name in texture_dirs:
        old_dir = textures_dir / subdir_name
        if not old_dir.exists():
            continue
        for file_path in sorted(old_dir.rglob('*')):
            if file_path.is_file() and file_path.suffix in IMAGE_EXTENSIONS:
                rel_to_textures = file_path.relative_to(textures_dir)
                old_key = 'textures/' + rel_to_textures.with_suffix('').as_posix()
                new_key = f'textures/{studio}/{project}/' + rel_to_textures.with_suffix('').as_posix()
                mapping[old_key] = new_key
    return mapping


def update_json_file(file_path: Path, mapping: dict) -> bool:
    """
    Replaces occurrences of old texture paths with new ones in a JSON file.
    Only replaces quoted strings to avoid false positives.
    Returns True if the file was changed.
    """
    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception as e:
        print(f'[texture_namespace] Warning: could not read {file_path}: {e}')
        return False

    original = content
    for old_path, new_path in mapping.items():
        # Match the path as a quoted JSON string value
        content = content.replace(f'"{old_path}"', f'"{new_path}"')

    if content != original:
        file_path.write_text(content, encoding='utf-8')
        return True
    return False


def move_texture_dirs(textures_dir: Path, studio: str, project: str, texture_dirs: list):
    """
    Moves each processed subdirectory from textures/<subdir>/ to
    textures/<studio>/<project>/<subdir>/.
    """
    new_base = textures_dir / studio / project
    new_base.mkdir(parents=True, exist_ok=True)

    moved = []
    for subdir_name in texture_dirs:
        old_dir = textures_dir / subdir_name
        new_dir = new_base / subdir_name
        if not old_dir.exists():
            continue
        shutil.copytree(str(old_dir), str(new_dir), dirs_exist_ok=True)
        shutil.rmtree(str(old_dir))
        moved.append(subdir_name)

    return moved


def main():
    settings = get_settings()
    studio = settings.get('studio', 'studio')
    project = settings.get('project', 'project')
    texture_dirs = settings.get('texture_dirs', ['entity', 'items', 'particle'])

    rp_dir = Path('RP')
    textures_dir = rp_dir / 'textures'

    if not textures_dir.exists():
        print('[texture_namespace] RP/textures/ not found — skipping.')
        return

    # 1. Build the old→new path mapping
    mapping = build_path_mapping(textures_dir, studio, project, texture_dirs)

    if not mapping:
        print('[texture_namespace] No textures to reorganize — already namespaced or empty.')
        return

    print(f'[texture_namespace] {len(mapping)} texture paths -> textures/{studio}/{project}/')

    # 2. Update all JSON files in RP/ (entity defs, item_texture.json, etc.)
    updated_files = []
    for json_file in sorted(rp_dir.rglob('*.json')):
        if update_json_file(json_file, mapping):
            updated_files.append(json_file)

    if updated_files:
        print(f'[texture_namespace] Updated {len(updated_files)} JSON file(s):')
        for f in updated_files:
            print(f'  {f}')
    else:
        print('[texture_namespace] No JSON files needed path updates.')

    # 3. Move texture directories to the new namespaced location
    moved = move_texture_dirs(textures_dir, studio, project, texture_dirs)
    for subdir_name in moved:
        print(f'[texture_namespace] Moved textures/{subdir_name}/ -> textures/{studio}/{project}/{subdir_name}/')


if __name__ == '__main__':
    main()
