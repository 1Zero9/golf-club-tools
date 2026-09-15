import { describe, it, expect } from 'vitest'
import {
  computeCourseHandicap,
  computePlayingHandicap,
  allocateStrokes,
  computeMatch,
  validateHandicapIndex,
  InvalidHandicapIndexError,
} from './calc.js'
import { ROUTING, MATCHPLAY_ALLOWANCE_PERCENT } from './donabate-data.js'

// Independently calculated WHS reference values for the supported routing
// (Blue + Yellow, White tees: Slope 127, Course Rating 71.7, Par 72).
// Course Handicap = round(HI * (127/113) + (71.7 - 72))

describe('computeCourseHandicap', () => {
  it('matches a hand-calculated example (HI 10.0)', () => {
    // 10 * 1.1238938... - 0.3 = 10.938938... -> 11
    expect(computeCourseHandicap(10.0, ROUTING)).toBe(11)
  })

  it('matches a hand-calculated example (HI 12.0)', () => {
    // 12 * 1.1238938... - 0.3 = 13.186726... -> 13
    expect(computeCourseHandicap(12.0, ROUTING)).toBe(13)
  })

  it('matches a hand-calculated example with a decimal Handicap Index (HI 14.4)', () => {
    // 14.4 * 1.1238938... - 0.3 = 15.884071... -> 16
    expect(computeCourseHandicap(14.4, ROUTING)).toBe(16)
  })

  it('matches a hand-calculated example with a decimal Handicap Index (HI 22.7)', () => {
    // 22.7 * 1.1238938... - 0.3 = 25.212393... -> 25
    expect(computeCourseHandicap(22.7, ROUTING)).toBe(25)
  })
})

describe('computePlayingHandicap', () => {
  it('applies a 100% allowance unchanged', () => {
    expect(computePlayingHandicap(13, 100)).toBe(13)
  })

  it('applies a reduced allowance and rounds to a whole number', () => {
    // 13 * 0.95 = 12.35 -> 12
    expect(computePlayingHandicap(13, 95)).toBe(12)
  })
})

describe('allocateStrokes', () => {
  it('gives every hole zero strokes when strokes is 0', () => {
    const result = allocateStrokes(ROUTING.holes, 0)
    expect(result.every((h) => h.strokesReceived === 0)).toBe(true)
  })

  it('gives exactly one stroke each to the lowest-SI holes for strokes <= 18', () => {
    const result = allocateStrokes(ROUTING.holes, 5)
    const withStroke = result.filter((h) => h.strokesReceived === 1)
    const withoutStroke = result.filter((h) => h.strokesReceived === 0)
    expect(withStroke).toHaveLength(5)
    expect(withoutStroke).toHaveLength(13)
    expect(withStroke.map((h) => h.si).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5])
  })

  it('gives every hole at least one stroke and wraps correctly above 18', () => {
    const result = allocateStrokes(ROUTING.holes, 20)
    // 20 = 1*18 + 2, so every hole gets 1, and the two lowest-SI holes get a 2nd.
    const twoStrokeHoles = result.filter((h) => h.strokesReceived === 2)
    const oneStrokeHoles = result.filter((h) => h.strokesReceived === 1)
    expect(twoStrokeHoles).toHaveLength(2)
    expect(oneStrokeHoles).toHaveLength(16)
    expect(twoStrokeHoles.map((h) => h.si).sort((a, b) => a - b)).toEqual([1, 2])
    expect(result.reduce((sum, h) => sum + h.strokesReceived, 0)).toBe(20)
  })

  it('handles a large (37-stroke) difference correctly', () => {
    const result = allocateStrokes(ROUTING.holes, 37)
    // 37 = 2*18 + 1, so every hole gets 2, and the single lowest-SI hole gets a 3rd.
    expect(result.reduce((sum, h) => sum + h.strokesReceived, 0)).toBe(37)
    const threeStrokeHoles = result.filter((h) => h.strokesReceived === 3)
    expect(threeStrokeHoles).toHaveLength(1)
    expect(threeStrokeHoles[0].si).toBe(1)
  })
})

describe('validateHandicapIndex', () => {
  it('accepts a valid decimal value', () => {
    expect(validateHandicapIndex(14.4)).toBe(14.4)
  })

  it('accepts a valid numeric string', () => {
    expect(validateHandicapIndex('22.7')).toBe(22.7)
  })

  it('rejects an empty value', () => {
    expect(() => validateHandicapIndex('')).toThrow(InvalidHandicapIndexError)
  })

  it('rejects a non-numeric value', () => {
    expect(() => validateHandicapIndex('abc')).toThrow(InvalidHandicapIndexError)
  })

  it('rejects a value below the WHS minimum', () => {
    expect(() => validateHandicapIndex(-50)).toThrow(InvalidHandicapIndexError)
  })

  it('rejects a value above the WHS maximum', () => {
    expect(() => validateHandicapIndex(100)).toThrow(InvalidHandicapIndexError)
  })
})

describe('computeMatch', () => {
  it('handles equal Handicap Indexes cleanly (no strokes either way)', () => {
    const result = computeMatch({
      handicapIndexA: 15.0,
      handicapIndexB: 15.0,
      routing: ROUTING,
      allowancePercent: MATCHPLAY_ALLOWANCE_PERCENT,
    })
    expect(result.strokes).toBe(0)
    expect(result.givingPlayer).toBeNull()
    expect(result.receivingPlayer).toBeNull()
    expect(result.holes.every((h) => h.strokesReceived === 0)).toBe(true)
  })

  it('handles a small handicap difference, with B receiving from A', () => {
    const result = computeMatch({
      handicapIndexA: 10.0,
      handicapIndexB: 12.0,
      routing: ROUTING,
      allowancePercent: MATCHPLAY_ALLOWANCE_PERCENT,
    })
    expect(result.courseHandicapA).toBe(11)
    expect(result.courseHandicapB).toBe(13)
    expect(result.strokes).toBe(2)
    expect(result.givingPlayer).toBe('A')
    expect(result.receivingPlayer).toBe('B')
    const strokeHoles = result.holes.filter((h) => h.strokesReceived > 0)
    expect(strokeHoles.map((h) => h.si).sort((a, b) => a - b)).toEqual([1, 2])
  })

  it('handles the same players in the opposite order, with A receiving from B', () => {
    const result = computeMatch({
      handicapIndexA: 12.0,
      handicapIndexB: 10.0,
      routing: ROUTING,
      allowancePercent: MATCHPLAY_ALLOWANCE_PERCENT,
    })
    expect(result.strokes).toBe(2)
    expect(result.givingPlayer).toBe('B')
    expect(result.receivingPlayer).toBe('A')
  })

  it('handles a large handicap difference, including decimal Handicap Indexes', () => {
    const result = computeMatch({
      handicapIndexA: 5.4,
      handicapIndexB: 28.6,
      routing: ROUTING,
      allowancePercent: MATCHPLAY_ALLOWANCE_PERCENT,
    })
    expect(result.courseHandicapA).toBe(6)
    expect(result.courseHandicapB).toBe(32)
    expect(result.strokes).toBe(26)
    expect(result.givingPlayer).toBe('A')
    expect(result.receivingPlayer).toBe('B')
    // 26 strokes over 18 holes: every hole gets 1, the 8 lowest-SI holes get a 2nd.
    expect(result.holes.reduce((sum, h) => sum + h.strokesReceived, 0)).toBe(26)
    expect(result.holes.filter((h) => h.strokesReceived === 2)).toHaveLength(8)
  })

  it('handles decimal Handicap Indexes on both sides', () => {
    const result = computeMatch({
      handicapIndexA: 14.4,
      handicapIndexB: 22.7,
      routing: ROUTING,
      allowancePercent: MATCHPLAY_ALLOWANCE_PERCENT,
    })
    expect(result.courseHandicapA).toBe(16)
    expect(result.courseHandicapB).toBe(25)
    expect(result.strokes).toBe(9)
    expect(result.givingPlayer).toBe('A')
    expect(result.receivingPlayer).toBe('B')
  })

  it('rejects invalid input rather than producing a result', () => {
    expect(() =>
      computeMatch({
        handicapIndexA: 'not-a-number',
        handicapIndexB: 12.0,
        routing: ROUTING,
        allowancePercent: MATCHPLAY_ALLOWANCE_PERCENT,
      })
    ).toThrow(InvalidHandicapIndexError)
  })
})
