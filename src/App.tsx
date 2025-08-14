import React, { useEffect, useMemo, useState } from 'react'
import { getPrefs, savePrefs } from './lib/db'
import { readTxt, readPdf, readEpub } from './lib/importers'
import WordPlayer from './components/WordPlayer'
import ScrollReader from './components/ScrollReader'
import TopBar from './components/TopBar'
import BottomBar from './components/BottomBar'

function TopBar({ mode, setMode, theme, setTheme }:{ mode:'rsvp'|'scroll', setMode:(m:'rsvp'|'scroll')=>void, theme:'dark'|'light', setTheme:(t:'dark'|'light')=>void }){
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/60 dark:bg-black/40 border-b border-black/10 dark:border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center font-extrabold">M</div>
          <div>
            <h1 className="text-base sm:text-lg font-bold">Mobile Fast Text Reader</h1>
            <div className="text-xs text-black/60 dark:text-white/60">by Han</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex gap-2 p-1 rounded-2xl card">
            <button onClick={()=>setMode('rsvp')} className={mode==='rsvp'?'bg-indigo-600 text-white px-3 py-1.5 rounded-xl':'btn-ghost px-3 py-1.5 rounded-xl'}>RSVP</button>
            <button onClick={()=>setMode('scroll')} className={mode==='scroll'?'bg-indigo-600 text-white px-3 py-1.5 rounded-xl':'btn-ghost px-3 py-1.5 rounded-xl'}>Scroll</button>
          </div>
          <button onClick={()=>setTheme(theme==='dark'?'light':'dark')} className="btn btn-ghost">{theme==='dark'?'Dark':'Light'}</button>
        </div>
      </div>
    </header>
  )
}

export default function App(){
  const [text, setText] = useState('')
  const [wpm, setWpm] = useState(300)
  const [fontPx, setFontPx] = useState(56)
  const [theme, setTheme] = useState<'dark'|'light'>('dark')
  const [mode, setMode] = useState<'rsvp'|'scroll'>('rsvp')
  const [pxPerSec, setPxPerSec] = useState(120)

  const wordCount = useMemo(()=> text.trim()? text.trim().split(/\s+/).length : 0, [text])
  const estimate = useMemo(()=>{
    const sec = wpm>0 ? Math.round((wordCount / wpm) * 60) : 0
    return `${Math.floor(sec/60)}m ${sec%60}s`
  }, [wpm, wordCount])

  useEffect(()=>{ (async()=>{
    const p = await getPrefs()
    setWpm(p.wpm); setFontPx(p.fontPx); setTheme(p.theme ?? 'dark'); setMode((p as any).mode ?? 'rsvp'); setPxPerSec((p as any).scrollPxPerSec ?? 120)
  })() }, [])

  useEffect(()=>{
    const root=document.documentElement
    if(theme==='dark') root.classList.add('dark'); else root.classList.remove('dark')
    savePrefs({ theme })
  }, [theme])

  useEffect(()=>{ savePrefs({ wpm }) }, [wpm])
  useEffect(()=>{ savePrefs({ fontPx }) }, [fontPx])
  useEffect(()=>{ savePrefs({ mode }) }, [mode])
  useEffect(()=>{ savePrefs({ scrollPxPerSec: pxPerSec }) }, [pxPerSec])

  async function importFile(file: File){
    try{
      const ext = file.name.split('.').pop()?.toLowerCase()
      let content = ''
      if(ext==='txt') content = await readTxt(file)
      else if(ext==='pdf') content = await readPdf(file)
      else if(ext==='epub') content = await readEpub(file)
      else throw new Error('Unsupported file type')
      setText(content)
    } catch(e:any){ alert(e?.message || 'Could not import file') }
  }

  return (
    <div className="app-root pb-28">
      <TopBar mode={mode} setMode={setMode} theme={theme} setTheme={setTheme} />

      <main className="max-w-5xl mx-auto px-4 py-5 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 card p-4">
          {mode==='rsvp'
            ? <WordPlayer text={text} wpm={wpm} fontPx={fontPx} />
            : <ScrollReader text={text} fontPx={fontPx} pxPerSec={pxPerSec} />
          }
        </section>

        <aside className="lg:col-span-1 space-y-4">
          <div className="card p-4">
            <label className="text-sm font-semibold">Input Text</label>
            <textarea
              value={text}
              onChange={e=>setText(e.target.value)}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{ e.preventDefault(); const f=e.dataTransfer.files?.[0]; if(f) importFile(f) }}
              className="mt-2 w-full h-40 rounded-xl border p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white dark:bg-black/40 border-black/10 dark:border-white/10"
              placeholder="Paste text here, or drop a .txt/.pdf/.epub…"
            />
            <div className="mt-2 flex items-center gap-3 text-xs text-black/70 dark:text-white/70">
              <span className="badge">Words: {wordCount}</span>
              <span className="badge">Est: {estimate}</span>
            </div>
            <div className="mt-3">
              <label className="btn btn-ghost cursor-pointer inline-flex items-center gap-2">
                Upload File
                <input type="file" className="hidden" accept=".txt,.pdf,.epub" onChange={e=>{ const f=e.target.files?.[0]; if(f) importFile(f) }} />
              </label>
            </div>
          </div>
        </aside>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-20">
        <div className="mx-auto max-w-5xl m-3 rounded-2xl card px-4 py-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="text-xs text-black/70 dark:text-white/70">Text Size</label>
              <div className="flex items-center gap-2">
                <input className="flex-1" type="range" min={16} max={128} value={fontPx} onChange={e=>setFontPx(+e.target.value)} />
                <input className="w-16 text-center rounded bg-white/60 dark:bg-black/40 border border-black/10 dark:border-white/10 p-1 text-xs" type="number" min={16} max={128} value={fontPx} onChange={e=>setFontPx(+e.target.value)} />
              </div>
            </div>
            {mode==='rsvp' ? (
              <div>
                <label className="text-xs text-black/70 dark:text-white/70">Speed (WPM)</label>
                <div className="flex items-center gap-2">
                  <input className="flex-1" type="range" min={50} max={1000} value={wpm} onChange={e=>setWpm(+e.target.value)} />
                  <input className="w-16 text-center rounded bg-white/60 dark:bg-black/40 border border-black/10 dark:border-white/10 p-1 text-xs" type="number" min={50} max={1000} value={wpm} onChange={e=>setWpm(+e.target.value)} />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs text-black/70 dark:text-white/70">Auto‑Scroll (px/sec)</label>
                <div className="flex items-center gap-2">
                  <input className="flex-1" type="range" min={40} max={400} value={pxPerSec} onChange={e=>setPxPerSec(+e.target.value)} />
                  <input className="w-16 text-center rounded bg-white/60 dark:bg-black/40 border border-black/10 dark:border-white/10 p-1 text-xs" type="number" min={40} max={400} value={pxPerSec} onChange={e=>setPxPerSec(+e.target.value)} />
                </div>
              </div>
            )}
            <div className="hidden sm:block text-xs text-black/70 dark:text-white/70 justify-self-end">Settings are saved automatically</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
