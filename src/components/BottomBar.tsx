import React from 'react'

type Props = {
  wpm: number
  setWpm: (n:number)=>void
  fontPx: number
  setFontPx: (n:number)=>void
  pxPerSec: number
  setPxPerSec: (n:number)=>void
  mode: 'rsvp' | 'scroll'
}

export default function BottomBar({ wpm, setWpm, fontPx, setFontPx, pxPerSec, setPxPerSec, mode }: Props){
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20">
      <div className="mx-auto max-w-5xl m-3 rounded-2xl border border-white/10 bg-black/70 backdrop-blur px-4 py-3 shadow-soft">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="text-xs text-white/70">Text Size</label>
            <div className="flex items-center gap-2">
              <input className="flex-1" type="range" min={16} max={128} value={fontPx} onChange={e=>setFontPx(+e.target.value)} />
              <input className="w-16 text-center rounded bg-black/40 border border-white/10 p-1 text-xs" type="number" min={16} max={128} value={fontPx} onChange={e=>setFontPx(+e.target.value)} />
            </div>
          </div>
          {mode==='rsvp' ? (
            <div>
              <label className="text-xs text-white/70">Speed (WPM)</label>
              <div className="flex items-center gap-2">
                <input className="flex-1" type="range" min={50} max={1000} value={wpm} onChange={e=>setWpm(+e.target.value)} />
                <input className="w-16 text-center rounded bg-black/40 border border-white/10 p-1 text-xs" type="number" min={50} max={1000} value={wpm} onChange={e=>setWpm(+e.target.value)} />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs text-white/70">Auto‑Scroll (px/sec)</label>
              <div className="flex items-center gap-2">
                <input className="flex-1" type="range" min={40} max={400} value={pxPerSec} onChange={e=>setPxPerSec(+e.target.value)} />
                <input className="w-16 text-center rounded bg-black/40 border border-white/10 p-1 text-xs" type="number" min={40} max={400} value={pxPerSec} onChange={e=>setPxPerSec(+e.target.value)} />
              </div>
            </div>
          )}
          <div className="hidden sm:block text-xs text-white/70 justify-self-end">Settings are saved automatically</div>
        </div>
      </div>
    </footer>
  )
}
