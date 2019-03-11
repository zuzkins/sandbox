const m = require('./index.js')

describe('Literal matcher, when given a pattern of', () => {
  describe('a, should', () => {
    const aMatcher = m.createLiteralMatcher('a')
    test('match a string "a"', () => {
      const result = aMatcher('a')
      expect(result.matches).toBeTruthy()
    }),
    describe('match a string "abcde"', () => {
      const match = aMatcher('abcde')
      test('so that matches flag is truthy', () => {
        expect(match.matches).toBeTruthy()
      }),
      test('so that remaining text to match is "bcde"', () => {
        expect(match.rest).toBe('bcde')
      })
    }),
    describe('not match', () => {
      test('the string "b"', () => {
        expect(aMatcher('b').matches).toBeFalsy()
      }),
      test('the empty string', () => {
        expect(aMatcher('').matches).toBeFalsy()
      })
    })
  })
})

describe('Any char matcher, should', () => {
  test('match a letter', () => {
    expect(m.anyCharMatcher('a').matches).toBeTruthy()
  }),
  test('fail when the string is empty', () => {
    expect(m.anyCharMatcher('').matches).toBeFalsy()
  })
})

describe('Star matcher, should', () => {
  const aMatcher = m.createLiteralMatcher('a')
  const matcher = m.createStarMatcher(aMatcher)

  test('match the string "aaa" with pattern "a*"', () => {
    expect(matcher('aaa').matches).toBeTruthy()
  }),
  test('match the string "" with pattern "a*"', () => {
    expect(matcher('').matches).toBeTruthy()
  })
})

describe('Parsing a pattern', () => {
  describe('with a ".", should', () => {
    test('return "anyChar" matcher for the pattern "."', () => {
      expect(m.parsePattern('.').map((p) => p.type)).toEqual(['anyChar'])
    }),
    test('return "anyChar" matcher for any "." in the pattern', () => {
      expect(m.parsePattern('...'). map((p) => p.type)).toEqual(['anyChar', 'anyChar', 'anyChar'])
    })
  }),
  describe('with a "*", should', () => {
    test('fail, if there is no previous matcher in the pattern', () => {
      expect(() => {m.parsePattern('*')}).toThrow(/modifies previous matcher, but there was none./)
    }),
    test('fail, if previous pattern is also an "*"', () => {
      expect(() => {m.parsePattern('.**')}).toThrow(/cannot be used after another/)
    }),
    test('successfully modify previous pattern in ",*"', () => {
      const matchers = m.parsePattern('.*')
      expect(matchers.length).toBe(1)
      expect(matchers[0].pattern).toBe('.*')
    })
  })
  describe('with any other character, should', () => {
    test('return a literal matcher', () => {
      expect(m.parsePattern('a')[0].type).toBe('literalMatcher')
      expect(m.parsePattern('b?/5%^&').map((p) => p.type)).toEqual([
        'literalMatcher', 'literalMatcher', 'literalMatcher', 'literalMatcher',
        'literalMatcher', 'literalMatcher', 'literalMatcher'
      ])
    })
  })
})


describe('matching pattern', () => {
  test('"abcde", should match the text "abcde', () => {
    expect(m.match('abcde', 'abcde')).toBeTruthy()
  }),
  test('"ab.de", should match the text "abcde', () => {
    expect(m.match('abcde', 'ab.de')).toBeTruthy()
  }),
  test('"ab...", should match the text "abcde', () => {
    expect(m.match('abcde', 'ab...')).toBeTruthy()
  }),
  test('"a*bcde" should match the text "abcde"', () => {
    expect(m.match('abcde', 'a*bcde')).toBeTruthy()
  }),
  test('"a*bcd." should match the text "bcde"', () => {
    expect(m.match('bcde', 'a*bcd.')).toBeTruthy()
  }),
  test('".*" should match the text "abcde"', () => {
    expect(m.match('abcde', '.*')).toBeTruthy()
  }),
  test('empty pattern should match anything', () => {
    expect(m.match('abcde', '')).toBeTruthy()
  })
})
