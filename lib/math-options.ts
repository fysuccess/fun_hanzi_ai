export type MathLevel = 'easy' | 'medium' | 'hard'

function toOneDecimal(n: number) {
  return Math.round(n * 10) / 10
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function unique(arr: string[]): string[] {
  const set = new Set<string>()
  const out: string[] = []
  for (const v of arr) {
    if (!set.has(v)) {
      set.add(v)
      out.push(v)
    }
  }
  return out
}

function isFraction(ans: string) {
  return /^\d+\s*\/\s*\d+$/.test(ans)
}

function isDecimal(ans: string) {
  // must contain a decimal point (e.g., 6.2). A pure integer (e.g., 6) should NOT be treated as decimal.
  return /^\d+\.\d$/.test(ans)
}

export function buildOptions(answer: string, level: MathLevel): string[] {
  let options: string[] = []
  const ans = String(answer).trim()

  if (level === 'easy') {
    // easy: strictly integer options
    const val = parseInt(ans, 10)
    const candidates = [String(val), String(Math.max(0, val + 1)), String(Math.max(0, val - 1)), String(Math.max(0, val + 2)), String(Math.max(0, val - 2))]
    options = unique(candidates)
  } else if (isFraction(ans)) {
    const [nStr, dStr] = ans.split('/')
    const n = parseInt(nStr.trim(), 10)
    const d = parseInt(dStr.trim(), 10)
    const candidates: string[] = [ans]
    const add = (num: number, den: number) => {
      if (num > 0 && den > 0) candidates.push(`${num}/${den}`)
    }
    add(n + 1, d)
    add(n - 1, d)
    // slight denominator variants using common child-friendly denominators
    const denos = [2, 4, d]
    for (const dd of denos) {
      if (dd !== d) add(n, dd)
    }
    options = unique(candidates)
  } else if (isDecimal(ans)) {
    const val = parseFloat(ans)
    const candidates = [ans]
    const add = (v: number) => candidates.push(String(toOneDecimal(v)))
    add(val + 0.1)
    add(val - 0.1)
    add(val + 0.2)
    add(val - 0.2)
    options = unique(candidates)
  } else {
    // integer
    const val = parseInt(ans, 10)
    const candidates = [String(val), String(Math.max(0, val + 1)), String(Math.max(0, val - 1)), String(Math.max(0, val + 2)), String(Math.max(0, val - 2))]
    options = unique(candidates)
  }

  // ensure exactly 4 options
  if (options.length < 4) {
    // fill with small plausible values
    const fillPool = level === 'easy'
      ? ['0', '1', '2', '3', '4', '5']
      : ['0', '1', '2', '3', '4', '5', '1/2', '1/4', '3/4', '0.5', '1.5']
    for (const v of fillPool) {
      if (options.length >= 4) break
      if (!options.includes(v)) options.push(v)
    }
  }

  // keep only 4 unique with correct included
  if (!options.includes(ans)) options[0] = ans
  // shuffle to randomize order
  const shuffled = shuffle(options.slice(0, 4))
  return shuffled
}
