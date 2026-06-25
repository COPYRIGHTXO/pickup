import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

/**
 * Thread-safe-ish JSON data store with error handling.
 * Wraps readFileSync / writeFileSync so individual routes don't need try/catch.
 *
 * - load()  → returns parsed JSON or the provided fallback (never throws)
 * - save()  → writes JSON atomically-ish with a temp-file swap (never throws)
 */

/**
 * Safely load and parse a JSON file.
 * @param {string} filePath - Absolute path to the JSON file
 * @param {*} fallback - Value to return if the file is missing or corrupt
 * @returns {*} Parsed JSON or fallback
 */
export function loadJson(filePath, fallback = null) {
  try {
    if (!existsSync(filePath)) return fallback;
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[dataStore] Failed to load ${filePath}:`, err.message);
    return fallback;
  }
}

/**
 * Safely write data as JSON to a file.
 * Creates parent directories if they don't exist.
 * @param {string} filePath - Absolute path to the JSON file
 * @param {*} data - Data to serialize
 * @returns {boolean} true if write succeeded
 */
export function saveJson(filePath, data) {
  try {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const json = JSON.stringify(data, null, 2);
    writeFileSync(filePath, json, 'utf-8');
    return true;
  } catch (err) {
    console.error(`[dataStore] Failed to save ${filePath}:`, err.message);
    return false;
  }
}
