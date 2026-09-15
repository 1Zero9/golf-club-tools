// Donabate Golf Club — reference data for the first supported routing.
//
// Provenance (see docs/MVP.md for the full verification record):
// - Combination name, Par, Course Rating, Slope Rating: Donabate GC's own published
//   handicap calculator (donabategolfclub.com/handicap-calculator) — club-authoritative.
// - Stroke Index per hole: a third-party aggregator (hole19golf.com) showing the same
//   "Blue-Yellow, 18 Holes" combination and matching total Par (72). This has NOT been
//   confirmed against Donabate's own printed/pro-shop scorecard and was sourced from a
//   ladies' (Red) tee card, not the White tee card used here — stroke index order is
//   usually tee-independent, but this is not confirmed for Donabate. Verify before
//   relying on it for a real match.
// - Singles matchplay handicap allowance: no club-specific figure is published by
//   Donabate. Golf Ireland permits clubs to set 85-100% for singles matchplay; this
//   implementation uses the WHS/R&A default of 100% until Donabate's committee-set
//   figure is confirmed.

export const ROUTING = {
  label: "Blue + Yellow — White tees (Men's)",
  combination: 'Blue + Yellow',
  tee: 'White',
  gender: "Men's",
  par: 72,
  courseRating: 71.7,
  slopeRating: 127,
  holes: [
    { hole: 1, par: 4, si: 5 },
    { hole: 2, par: 5, si: 17 },
    { hole: 3, par: 3, si: 15 },
    { hole: 4, par: 4, si: 1 },
    { hole: 5, par: 4, si: 3 },
    { hole: 6, par: 4, si: 9 },
    { hole: 7, par: 3, si: 7 },
    { hole: 8, par: 4, si: 13 },
    { hole: 9, par: 5, si: 11 },
    { hole: 10, par: 3, si: 8 },
    { hole: 11, par: 5, si: 16 },
    { hole: 12, par: 4, si: 4 },
    { hole: 13, par: 3, si: 14 },
    { hole: 14, par: 4, si: 2 },
    { hole: 15, par: 5, si: 6 },
    { hole: 16, par: 4, si: 10 },
    { hole: 17, par: 3, si: 18 },
    { hole: 18, par: 5, si: 12 },
  ],
}

export const MATCHPLAY_ALLOWANCE_PERCENT = 100

export const DATA_PROVENANCE = {
  courseRatingSlopePar:
    "Verified from Donabate Golf Club's own published handicap calculator.",
  strokeIndex:
    'From a third-party course listing (hole19golf.com), not confirmed against ' +
    "Donabate's own scorecard or pro shop system. Confirm before relying on this for a real match.",
  allowance:
    'WHS/R&A default (100%) for singles matchplay, used because Donabate has not ' +
    "published its own committee-set allowance. Golf Ireland permits clubs to choose " +
    '85-100% for singles matchplay — confirm Donabate\'s actual figure with the club.',
}
