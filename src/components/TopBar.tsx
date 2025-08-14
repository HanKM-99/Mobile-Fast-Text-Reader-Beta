import React from 'react'
import ModeSegment from './ModeSegment'
import { Sun, Moon } from 'lucide-react'

type Props = {
  mode: 'rsvp' | 'scroll'
  setMode: (m:'rsvp'|'scroll')=>void
  theme: 'dark' | 'light'
  toggleTheme: ()=>void
}

export default function TopBar({ mode, setMode, theme, toggleTheme }: Props){
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center font-extrabold">M</div>
          <div>
            <h1 className="text-base sm:text-lg font-bold">Mobile Fast Text Reader</h1>
            <div className="text-xs text-white/60">by Han</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ModeSegment value={mode} onChange={setMode} />
          <button onClick={toggleTheme} className="btn btn-ghost inline-flex items-center gap-2">{theme==='dark'?<Moon size={16}/>:<Sun size={16}/>} {theme==='dark'?'Dark':'Light'}</button>
        </div>
      </div>
    </header>
  )
}
