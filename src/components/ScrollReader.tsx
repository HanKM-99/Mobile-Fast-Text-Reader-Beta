import React, { useEffect, useRef, useState } from 'react'

type Props = { text: string; fontPx: number; pxPerSec: number }

export default function ScrollReader({ text, fontPx, pxPerSec }: Props){
  const containerRef = useRef<HTMLDivElement|null>(null)
  const [playing, setPlaying] = useState(false)
  const raf = useRef<number| null>(null)
  const last = useRef<number>(0)
  const lastTapRef = useRef(0)
  const singleTapTimer = useRef<number|null>(null)

  useEffect(()=>{
    if(!playing) return
    function step(ts:number){
      if(!last.current) last.current = ts
      const dt = (ts - last.current) / 1000
      last.current = ts
      const el = containerRef.current
      if(el){
        el.scrollTop += pxPerSec * dt
        const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight
        if(atBottom){ setPlaying(false); cancelAnimationFrame(raf.current!); raf.current=null; return }
      }
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return ()=>{ if(raf.current) cancelAnimationFrame(raf.current); raf.current=null; last.current=0 }
  },[playing, pxPerSec])

  function toggle(){ setPlaying(p=>!p) }

  async function toggleFullscreen(){
    const el = containerRef.current
    if(!el) return
    if(document.fullscreenElement){ await document.exitFullscreen() } else { await el.requestFullscreen() }
  }

  function onPointerUp(){
    const now=Date.now()
    if(now - lastTapRef.current <= 300){
      if(singleTapTimer.current){ window.clearTimeout(singleTapTimer.current); singleTapTimer.current=null }
      toggleFullscreen(); lastTapRef.current = 0
    } else {
      lastTapRef.current = now
      singleTapTimer.current = window.setTimeout(()=>{ toggle(); singleTapTimer.current=null },300)
    }
  }

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        onPointerUp={onPointerUp}
        onDoubleClick={toggleFullscreen}
        className="rounded-2xl card w-full h-[60vh] overflow-y-auto p-5 leading-relaxed"
        style={{ scrollBehavior: 'auto' }}
      >
        <article className="prose max-w-none dark:prose-invert">
          <p style={{ fontSize: fontPx }} className="whitespace-pre-wrap">{text || 'Paste or import text to start…'}</p>
        </article>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button onClick={toggle} className="btn btn-primary">{playing?'Pause Auto‑Scroll':'Start Auto‑Scroll'}</button>
        <button onClick={()=>{ const el=containerRef.current; if(el) el.scrollTop=0 }} className="btn btn-ghost">Back to Top</button>
      </div>
    </div>
  )
}
