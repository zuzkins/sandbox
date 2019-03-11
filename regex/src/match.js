function createLiteralMatcher(pattern) {
  return function literalMatcher(str) {
    if (str.length === 0) return {
      matches: false,
      pattern: pattern,
      match: null,
      rest: str
    }
    const ch = str.charAt(0)
    if (ch === pattern) {
      return {
        matches: true,
        pattern: pattern,
        match: ch,
        rest: str.substring(1)
      }
    } else {
      return {
        matches: false,
        pattern: pattern,
        match: null,
        rest: str
      }
    }
  }
}

function niy() {
  throw new Error('matcher not implemented yet!')
}

function anyCharMatcher(str) {
  if (!str || str.length === 0) {
    return {
        matches: false,
        pattern: '.',
        match: null,
        rest: str
    }
  }
  return {
    matches: true,
    pattern: '.',
    match: str.charAt(0),
    rest: str.substring(1)
  }
}

function createStarMatcher(previousMatcher) {
  return function starMatcher(str) {
    const thisResult = {
      matches: true,
      match: '',
      rest: str
    }
    let result = null
    do {
      result = previousMatcher(thisResult.rest)
      if (result.matches) {
        thisResult.match = result.match
        thisResult.matches = true
      }
      thisResult.rest = result.rest
    } while (result.matches)

    return thisResult
  }
}

function parsePattern(pattern) {
  if (!pattern) pattern = ''

  const matchers = []
  for (let i = 0; i < pattern.length; i++) {
    const subPattern = pattern[i]
    if (subPattern === '.') {
      matchers.push({
        type: 'anyChar',
        matcher: anyCharMatcher,
        pattern: subPattern})
    } else if (subPattern === '*') {
      const prev = matchers.pop()
      if (prev === undefined) {
        throw new Error('* matcher modifies previous matcher, but there was none.')
      } else if (prev.type === 'starMatcher') {
        throw new Error('* matcher cannot be used after another * matcher.')
      }

      matchers.push({
        type: 'starMatcher',
        matcher: createStarMatcher(prev.matcher),
        pattern: prev.pattern + '*'
      })
    } else {
      matchers.push({
        type: 'literalMatcher',
        matcher: createLiteralMatcher(subPattern),
        pattern: subPattern
      })
    }
  }
  return matchers
}

function match(str, pattern) {
  const matchers = parsePattern(pattern)

  let strToTest = str
  for (let i = 0; i < matchers.length; i++) {
    const m = matchers[i]
    const res = m.matcher(strToTest)
    if (!res.matches) return false
    strToTest = res.rest
  }

  return true;
}

module.exports = {
  match,
  createLiteralMatcher,
  anyCharMatcher,
  createStarMatcher,
  parsePattern
}

