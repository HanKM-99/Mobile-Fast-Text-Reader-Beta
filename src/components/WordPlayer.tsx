import React, { useEffect, useMemo, useRef, useState } from 'react'

type Props = { text: string; wpm: number; fontPx: number }
export default function WordPlayer({ text, wpm, fontPx }: Props){
  const words = useMemo(()=>text.trim().split(/\s+/).filter(Boolean),[text])
  const [i,setI]=useState(0)
  const [playing,setPlaying]=useState(false)
  const timer=useRef<number|null>(null)
  const panelRef=useRef<HTMLDivElement|null>(null)
  const lastTapRef=useRef(0)
  const singleTapTimer=useRef<number|null>(null)
  const delay=useMemo(()=>Math.max(50,Math.round(60000/Math.max(50,wpm))),[wpm])

  useEffect(()=>{ if(!playing) return; timer.current=window.setInterval(()=>{ setI(c=>Math.min(c+1,Math.max(0,words.length-1))) },delay); return()=>{ if(timer.current) window.clearInterval(timer.current) }},[playing,delay,words.length])

  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if((e.target as HTMLElement)?.tagName?.match(/INPUT|TEXTAREA/)) return
      if(e.code==='Space'){ e.preventDefault(); togglePlay() }
      if(e.code==='ArrowRight') step(1)
      if(e.code==='ArrowLeft') step(-1)
      if(e.code==='Enter' && e.shiftKey) toggleFullscreen()
    }
    window.addEventListener('keydown',onKey); return()=>window.removeEventListener('keydown',onKey)
  },[])

  function togglePlay(){ if(words.length) setPlaying(p=>!p) }
  function step(d:number){ setI(c=>Math.min(Math.max(0,c+d),Math.max(0,words.length-1))) }

  async function toggleFullscreen(){
    const el=panelRef.current; if(!el) return
    if(document.fullscreenElement){ await document.exitFullscreen() } else { await el.requestFullscreen() }
  }

  function onPointerUp(){
    const now=Date.now()
    if(now-lastTapRef.current<=300){
      if(singleTapTimer.current){ window.clearTimeout(singleTapTimer.current); singleTapTimer.current=null }
      toggleFullscreen(); lastTapRef.current=0
    } else {
      lastTapRef.current=now
      singleTapTimer.current = window.setTimeout(()=>{ togglePlay(); singleTapTimer.current=null },300)
    }
  }

  const current=words[i]||'Ready'
  const progress=words.length?Math.round(((i+1)/words.length)*100):0

  return (
    <div className="w-full">
      <div ref={panelRef} onPointerUp={onPointerUp} onDoubleClick={toggleFullscreen}
        className="rounded-2xl border border-white/10 bg-black/50 shadow-soft w-full h-[42vh] md:h-[50vh] flex items-center justify-center relative select-none cursor-pointer">
        <span style={{fontSize:fontPx}} className="font-extrabold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,.25)]">{current}</span>
        <div className="absolute bottom-0 left-0 h-1 bg-indigo-600" style={{width:progress+'%'}}/>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <button onClick={()=>step(-1)} className="btn btn-ghost">◀ Prev</button>
        <button onClick={togglePlay} className="btn btn-primary">{playing?'Pause':'Play'}</button>
        <button onClick={()=>step(1)} className="btn btn-ghost">Next ▶</button>
      </div>
    </div>
  )
}
