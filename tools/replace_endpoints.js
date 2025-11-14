#!/usr/bin/env node
/**
 * replace_endpoints.js
 * Migra referencias del frontend desde rutas legacy '../../php/...*.php' a rutas REST '/api/...'
 * Elimina el sufijo .php y normaliza a API_BASE_URL + "/modulo/endpoint".
 *
 * USO:
 *   node tools/replace_endpoints.js            (aplica cambios)
 *   DRY_RUN=1 node tools/replace_endpoints.js  (solo muestra diff)
 *
 * NOTAS DE SEGURIDAD:
 * - NO añade ninguna key de servicio. Asegúrate de no exponer SUPABASE_SERVICE_ROLE_KEY en el frontend.
 * - Sólo modifica archivos dentro de /js y /HTML (excepto /vendor y minificados). Genera backup .bak por archivo modificado.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DRY = process.env.DRY_RUN === '1';

// Directorios que procesaremos
const TARGET_DIRS = [path.join(ROOT, 'js'), path.join(ROOT, 'HTML')];

// Ignorar estos patrones
const IGNORE_REGEX = /(?:vendor|\.min\.js$|sb-admin-2\.min\.js)$/i;

// Extensiones a procesar
const EXTENSIONS = new Set(['.js', '.html']);

// Reemplazos directos simples (map de patrones exactos -> nuevo valor) - se aplican antes de regex compleja
const SIMPLE_REPLACEMENTS = [
  // Ejemplos específicos si existieran rutas duras; se pueden ampliar
];

// Regex para rutas legacy relativas que apuntan a carpeta php (en minúscula o mayúscula)
// Captura: prefix (../../php/), cuerpo del path, sufijo .php y opcional query
const LEGACY_RELATIVE_REGEX = /(["'`])((?:\.\.\/)+php\/|(?:\.\.\/)+PHP\/)([A-Za-z0-9_\/-]+?)(\.php)(\?[^"'`]*)?(["'`])/g;

// Regex para expresiones ya con API_BASE_URL que terminan en .php
const API_BASE_REGEX = /(API_BASE_URL\s*\+\s*["']\/[A-Za-z0-9_\/-]+?)\.php(\b)/g;

// También detectar fetch/$.get con comillas simples/dobles sin concatenación
// Ej: fetch('../../php/attendance/grades.php')

function processContent(content) {
  let original = content;

  // Aplicar reemplazos simples
  for (const [from, to] of SIMPLE_REPLACEMENTS) {
    content = content.split(from).join(to);
  }

  // Reemplazar rutas relativas legacy
  content = content.replace(LEGACY_RELATIVE_REGEX, (full, quoteOpen, prefix, pathPart, phpExt, query, quoteClose) => {
    // pathPart puede ser: observations/get_all, activities/create, etc.
    // Quitamos .php, mantenemos query si existe.
    const clean = pathPart; // ya sin .php
    const finalPath = clean; // Podemos decidir si remover '/get_all' -> lo dejamos por compatibilidad
    const queryStr = query || '';
    return `API_BASE_URL + "/${finalPath}${queryStr}"`;
  });

  // Reemplazar rutas que ya usan API_BASE_URL y terminan en .php
  content = content.replace(API_BASE_REGEX, (full, start, tail) => start + tail.replace(/\.php/, ''));

  return { changed: content !== original, content };
}

function walk(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (IGNORE_REGEX.test(full)) continue;
      walk(full, results);
    } else {
      if (!EXTENSIONS.has(path.extname(e.name))) continue;
      if (IGNORE_REGEX.test(full)) continue;
      results.push(full);
    }
  }
  return results;
}

function main() {
  let files = [];
  for (const d of TARGET_DIRS) {
    if (fs.existsSync(d)) files = walk(d, files);
  }
  let modifiedCount = 0;

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const { changed, content } = processContent(raw);
    if (changed) {
      modifiedCount++;
      if (DRY) {
        console.log(`[DRY] Would modify: ${file}`);
      } else {
        // Backup
        fs.writeFileSync(file + '.bak', raw, 'utf8');
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Modified: ${file}`);
      }
    }
  }

  console.log(`\nTotal archivos analizados: ${files.length}`);
  console.log(`Archivos modificados: ${modifiedCount}`);
  if (DRY) console.log('Modo DRY_RUN: no se aplicaron cambios.');
}

main();
