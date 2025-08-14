import React, { useEffect, useMemo, useState } from 'react'
import { getPrefs, savePrefs } from './lib/db'
import { readTxt, readPdf, readEpub } from './lib/importers'
import WordPlayer from './components/WordPlayer'
import ScrollReader from './components/ScrollReader'
import TopBar from './components/TopBar'
import BottomBar from './components/BottomBar'

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
    setWpm(p.wpm); setFontPx(p.fontPx); setTheme(p.theme); setMode(p.mode); setPxPerSec(p.scrollPxPerSec)
  })() }, [])

  useEffect(()=>{ const root=document.documentElement; if(theme==='dark') root.classList.add('dark'); else root.classList.remove('dark') }, [theme])
  useEffect(()=>{ savePrefs({ wpm }) }, [wpm])
  useEffect(()=>{ savePrefs({ fontPx }) }, [fontPx])
  useEffect(()=>{ savePrefs({ theme }) }, [theme])
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
    <div className="min-h-screen bg-gradient-to-b from-black via-surface to-black text-gray-100 pb-28">
      <TopBar mode={mode} setMode={setMode} theme={theme} toggleTheme={()=>setTheme(t=>t==='dark'?'light':'dark')} />

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
              className="mt-2 w-full h-40 rounded-xl bg-black/40 border border-white/10 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Paste text here, or drop a .txt/.pdf/.epub…"
            />
            <div className="mt-2 flex items-center gap-3 text-xs text-white/70">
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

          <div className="card p-4">
            <h3 className="text-sm font-semibold mb-2">Tips</h3>
            <ul className="text-xs text-white/70 space-y-1 list-disc pl-5">
              <li>Single tap: play/pause (both modes)</li>
              <li>Double tap: fullscreen toggle</li>
              <li>Keyboard: Space/Arrows; Shift+Enter fullscreen</li>
              <li>Settings are saved automatically</li>
            </ul>
          </div>
        </aside>
      </main>

      <BottomBar
        wpm={wpm} setWpm={setWpm}
        fontPx={fontPx} setFontPx={setFontPx}
        pxPerSec={pxPerSec} setPxPerSec={setPxPerSec}
        mode={mode}
      />
    </div>
  )
}
