export async function readTxt(file: File) { return await file.text() }

export async function readPdf(file: File): Promise<string> {
  const [{ getDocument, GlobalWorkerOptions }]: any = await Promise.all([
    import('pdfjs-dist/legacy/build/pdf.js') as any
  ])
  ;(GlobalWorkerOptions as any).workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
  const buf = await file.arrayBuffer()
  const pdf = await getDocument({ data: buf }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((it: any) => it.str).join(' ') + '\n'
  }
  return text
}

export async function readEpub(file: File): Promise<string> {
  const JSZip = (await import('jszip')).default
  const buf = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(buf)
  async function readString(path: string) { const f = zip.file(path); return f ? await f.async('string') : null }
  const containerXML = await readString('META-INF/container.xml')
  if (!containerXML) throw new Error('Invalid EPUB (no container.xml)')
  const parser = new DOMParser()
  const cdoc = parser.parseFromString(containerXML, 'text/xml')
  const rootfile = cdoc.querySelector('rootfile')?.getAttribute('full-path')
  if (!rootfile) throw new Error('Invalid EPUB (no rootfile)')
  const opfText = await readString(rootfile)
  if (!opfText) throw new Error('Invalid EPUB (no OPF)')
  const opf = parser.parseFromString(opfText, 'text/xml')
  const base = rootfile.split('/').slice(0, -1).join('/')
  const spineIds = Array.from(opf.querySelectorAll('itemref')).map(n => n.getAttribute('idref')).filter(Boolean) as string[]
  const items = new Map<string, string>()
  opf.querySelectorAll('manifest > item').forEach(it => { items.set(it.getAttribute('id')!, it.getAttribute('href')!) })
  let out = ''
  for (const id of spineIds) {
    const href = items.get(id!) ; if (!href) continue
    const path = (base ? base + '/' : '') + href
    const html = await readString(path) ; if (!html) continue
    const doc = parser.parseFromString(html, 'text/html')
    out += (doc.body?.textContent || '').replace(/\s+/g, ' ').trim() + '\n\n'
  }
  return out.trim()
}
