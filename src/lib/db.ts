import Dexie, { Table } from 'dexie'

export type Prefs = {
  id: 'prefs'
  wpm: number
  fontPx: number
  theme: 'dark' | 'light'
  mode: 'rsvp' | 'scroll'
  scrollPxPerSec: number
  updatedAt: number
}

class ReaderDB extends Dexie {
  prefs!: Table<Prefs, string>
  constructor() {
    super('reader-db')
    this.version(3).stores({ prefs: 'id' })
  }
}

export const db = new ReaderDB()

export async function getPrefs(): Promise<Prefs> {
  let p = await db.prefs.get('prefs') as Prefs | undefined
  if (!p) {
    p = { id: 'prefs', wpm: 300, fontPx: 56, theme: 'dark', mode: 'rsvp', scrollPxPerSec: 120, updatedAt: Date.now() }
    await db.prefs.put(p)
  }
  if (!('theme' in p)) p.theme = 'dark' as const
  if (!('fontPx' in p)) p.fontPx = 56
  if (!('mode' in p)) p.mode = 'rsvp'
  if (!('scrollPxPerSec' in p)) p.scrollPxPerSec = 120
  return p
}

export async function savePrefs(next: Partial<Prefs>) {
  const cur = await getPrefs()
  const merged = { ...cur, ...next, updatedAt: Date.now() }
  await db.prefs.put(merged as Prefs)
  return merged
}
