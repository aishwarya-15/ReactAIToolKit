// Language detection via Unicode script ranges

const SCRIPT_RANGES = [
  { range: [0x0600, 0x06FF], lang: 'ar' },
  { range: [0x0900, 0x097F], lang: 'hi' },
  { range: [0x0D00, 0x0D7F], lang: 'ml' },
  { range: [0x0E00, 0x0E7F], lang: 'th' },
  { range: [0x3040, 0x309F], lang: 'ja' },
  { range: [0x30A0, 0x30FF], lang: 'ja' },
  { range: [0x4E00, 0x9FFF], lang: 'zh' },
  { range: [0xAC00, 0xD7AF], lang: 'ko' },
  { range: [0x0400, 0x04FF], lang: 'ru' },
  { range: [0x0530, 0x058F], lang: 'hy' },
  { range: [0x10A0, 0x10FF], lang: 'ka' },
  { range: [0x0980, 0x09FF], lang: 'bn' },
  { range: [0x0A80, 0x0AFF], lang: 'gu' },
  { range: [0x0B80, 0x0BFF], lang: 'ta' },
  { range: [0x0C00, 0x0C7F], lang: 'te' },
  { range: [0x0C80, 0x0CFF], lang: 'kn' },
  { range: [0x0A00, 0x0A7F], lang: 'pa' },
  { range: [0x0B00, 0x0B7F], lang: 'or' },
  { range: [0x0E80, 0x0EFF], lang: 'lo' },
  { range: [0x1000, 0x109F], lang: 'my' },
  { range: [0x1780, 0x17FF], lang: 'km' },
  { range: [0x0590, 0x05FF], lang: 'he' },
]

export function detectLang(text) {
  const tally = {}
  for (const ch of text) {
    const cp = ch.codePointAt(0)
    for (const { range, lang } of SCRIPT_RANGES) {
      if (cp >= range[0] && cp <= range[1]) {
        tally[lang] = (tally[lang] || 0) + 1
      }
    }
  }
  let best = null, max = 0
  for (const [lang, count] of Object.entries(tally)) {
    if (count > max) { best = lang; max = count }
  }
  return best || 'en'
}
