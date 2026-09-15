// WHS calculations for the Donabate Match Helper.
// Formula source: R&A/USGA World Handicap System, Rules of Handicapping.
//   Course Handicap = Handicap Index x (Slope Rating / 113) + (Course Rating - Par)
//   rounded to the nearest whole number.
// Singles matchplay: each player's Course Handicap is reduced by the matchplay
// allowance percentage (rounded to a whole number) to get a Playing Handicap; the
// difference between the two Playing Handicaps is the number of strokes given by the
// lower handicap player to the higher handicap player, allocated one per hole in
// ascending Stroke Index order (wrapping around for differences greater than 18).

const MIN_HANDICAP_INDEX = -10
const MAX_HANDICAP_INDEX = 54

export class InvalidHandicapIndexError extends Error {}

export function validateHandicapIndex(value) {
  const number = typeof value === 'number' ? value : Number(value)
  if (value === '' || value === null || value === undefined || Number.isNaN(number)) {
    throw new InvalidHandicapIndexError('Enter a Handicap Index (a number, e.g. 14.4).')
  }
  if (!Number.isFinite(number)) {
    throw new InvalidHandicapIndexError('Handicap Index must be a finite number.')
  }
  if (number < MIN_HANDICAP_INDEX || number > MAX_HANDICAP_INDEX) {
    throw new InvalidHandicapIndexError(
      `Handicap Index must be between ${MIN_HANDICAP_INDEX} and ${MAX_HANDICAP_INDEX}.`
    )
  }
  return number
}

export function computeCourseHandicap(handicapIndex, { slopeRating, courseRating, par }) {
  const raw = handicapIndex * (slopeRating / 113) + (courseRating - par)
  return Math.round(raw)
}

export function computePlayingHandicap(courseHandicap, allowancePercent) {
  return Math.round(courseHandicap * (allowancePercent / 100))
}

// Allocates `strokes` strokes across `holes` ([{hole, par, si}]) in ascending SI order,
// giving every hole one stroke per full lap through the 18 stroke indices before any
// hole gets a second stroke — correct for stroke counts above 18.
export function allocateStrokes(holes, strokes) {
  const holeCount = holes.length
  const baseStrokesPerHole = Math.floor(strokes / holeCount)
  const extraStrokeHoleCount = strokes % holeCount
  return holes.map((hole) => ({
    ...hole,
    strokesReceived: baseStrokesPerHole + (hole.si <= extraStrokeHoleCount ? 1 : 0),
  }))
}

export function computeMatch({
  handicapIndexA,
  handicapIndexB,
  routing,
  allowancePercent,
}) {
  const hiA = validateHandicapIndex(handicapIndexA)
  const hiB = validateHandicapIndex(handicapIndexB)

  const courseHandicapA = computeCourseHandicap(hiA, routing)
  const courseHandicapB = computeCourseHandicap(hiB, routing)

  const playingHandicapA = computePlayingHandicap(courseHandicapA, allowancePercent)
  const playingHandicapB = computePlayingHandicap(courseHandicapB, allowancePercent)

  const difference = playingHandicapB - playingHandicapA
  const strokes = Math.abs(difference)
  // difference > 0 means B's playing handicap is higher, so B receives strokes.
  const receivingPlayer = strokes === 0 ? null : difference > 0 ? 'B' : 'A'
  const givingPlayer = strokes === 0 ? null : difference > 0 ? 'A' : 'B'

  const holes = allocateStrokes(routing.holes, strokes)

  return {
    handicapIndexA: hiA,
    handicapIndexB: hiB,
    courseHandicapA,
    courseHandicapB,
    playingHandicapA,
    playingHandicapB,
    strokes,
    givingPlayer,
    receivingPlayer,
    holes,
  }
}
