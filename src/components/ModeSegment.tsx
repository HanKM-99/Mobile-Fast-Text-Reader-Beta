import React from 'react'
import clsx from 'clsx'

type Props = { value: 'rsvp' | 'scroll'; onChange: (m: 'rsvp'|'scroll') => void }
export default function ModeSegment({ value, onChange }: Props){
  const btn = (m:'rsvp'|'scroll', label:string) => (
    <button
      onClick={()=>onChange(m)}
      className={clsx('px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors', value===m ? 'bg-indigo-600 text-white' : 'btn-ghost')}
    >{label}</button>
  )
  return <div className="inline-flex gap-2 p-1 rounded-2xl card">{btn('rsvp','RSVP')}{btn('scroll','Scroll')}</div>
}
