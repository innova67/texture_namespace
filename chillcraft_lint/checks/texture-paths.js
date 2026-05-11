"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.texturePaths = void 0;
const path = require("path");
const fs = require("fs");
const ID = "texture-paths";
exports.texturePaths = {
    id: ID,
    severity: "error",
    scope: "texture",
    run(ctx) {
        const issues = [];
        const texturesRoot = path.join(ctx.rpDir, "textures");
        if (!fs.existsSync(texturesRoot))
            return issues;
        // Archivos sueltos en la raíz de textures/ están prohibidos
        for (const entry of fs.readdirSync(texturesRoot, { withFileTypes: true })) {
            if (entry.isFile()) {
                issues.push({
                    checkId: ID,
                    severity: "error",
                    message: `Archivo suelto en textures/ — debe estar en textures/chillcraft/{proj}/`,
                    path: path.join(texturesRoot, entry.name),
                });
            }
        }
        // Carpetas en textures/ deben ser "chillcraft" (o "blocks"/"entity"/"ui" que son vanilla)
        const VANILLA_TEXTURE_DIRS = new Set(["blocks", "entity", "gui", "ui", "items", "environment", "colormap", "flame_atlas", "misc", "map", "mob_effect", "particle"]);
        for (const entry of fs.readdirSync(texturesRoot, { withFileTypes: true })) {
            if (!entry.isDirectory())
                continue;
            if (VANILLA_TEXTURE_DIRS.has(entry.name)) {
                issues.push({
                    checkId: ID,
                    severity: "error",
                    message: `Carpeta "${entry.name}" en textures/ indica override vanilla — custom textures deben ir en textures/chillcraft/{proj}/`,
                    path: path.join(texturesRoot, entry.name),
                });
            }
            if (entry.name !== "chillcraft" && !VANILLA_TEXTURE_DIRS.has(entry.name)) {
                issues.push({
                    checkId: ID,
                    severity: "warning",
                    message: `Carpeta "${entry.name}" en textures/ no sigue la convención chillcraft/ — verificar naming`,
                    path: path.join(texturesRoot, entry.name),
                });
            }
        }
        return issues;
    },
};
