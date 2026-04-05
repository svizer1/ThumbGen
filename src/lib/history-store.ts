import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { HistoryEntry } from '@/types';

const DATA_DIR = join(process.cwd(), 'data');
const HISTORY_FILE = join(DATA_DIR, 'history.json');
const MAX_ENTRIES = 200;

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function getHistory(): Promise<HistoryEntry[]> {
  try {
    await ensureDataDir();
    const raw = await readFile(HISTORY_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // File doesn't exist yet — return empty list
    return [];
  }
}

export async function saveToHistory(entry: HistoryEntry): Promise<void> {
  await ensureDataDir();
  const history = await getHistory();
  history.unshift(entry); // newest first
  const trimmed = history.slice(0, MAX_ENTRIES);
  await writeFile(HISTORY_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
}

export async function deleteFromHistory(id: string): Promise<void> {
  await ensureDataDir();
  const history = await getHistory();
  const filtered = history.filter((e) => e.id !== id);
  await writeFile(HISTORY_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
}

export async function clearHistory(): Promise<void> {
  await ensureDataDir();
  await writeFile(HISTORY_FILE, '[]', 'utf-8');
}