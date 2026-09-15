# Donabate Match Helper — MVP Proposal

> Scope note: this proposal implements the "first implementation" already committed to in
> `PROJECT-OS.md` (Donabate-specific, question-first, not a generic handicap calculator). It does
> not reopen those decisions. Any conflict found during research is recorded in §6, not resolved
> by silently changing the established decision.

## 1. Problem

A Donabate member who has arranged a matchplay game (most commonly singles matchplay, casual or
club competition) needs to know **how many strokes they give or receive, and on which holes**,
before or during the round. Today this requires knowing both players' handicaps, converting them
to course handicaps for the tees/course being played, finding the stroke index (SI) order for
that specific routing, and doing the allocation manually. Donabate's existing online calculator
covers general handicap calculation but does not answer this specific matchplay question in
Donabate's own terms (tee combination, SI, competition allowance).

**The question this MVP answers:** *"Playing off the [X] tees over [named 18], what strokes do I
give to / receive from my opponent, and on which holes?"*

## 2. User Journey

1. Member opens the tool (two people setting up a game, or one member checking before a match).
2. Selects the two players' current Handicap Index (or one enters both, e.g. at the first tee).
3. Selects which 18 holes are being played today (Donabate is 27 holes in three 9-hole loops —
   see §5) and which tees.
4. Tool returns: each player's Course Handicap for that combination, the strokes-given
   difference, and the hole-by-hole allocation (which holes the higher-handicap player receives a
   stroke on).
5. Optional: member can screenshot/note the result before teeing off. No accounts, no saved
   history, no scoring in this version.

## 3. Inputs

Minimum required, nothing else:

- Player A Handicap Index
- Player B Handicap Index
- Tee combination being played (which of the three 9-hole loops, in which order, and which tee
  colour/gender set)
- Match format (fixed to singles matchplay for this version — see §4/§8)

Not collected in this version: names beyond "Player A/B", club membership number, competition
entry, live scores.

## 4. Outputs

- Player A and Player B Course Handicap for the selected combination
- The handicap difference (strokes given, and by whom)
- A hole-by-hole table (1–18, in the selected routing's SI order) marking which holes carry a
  stroke
- A one-line plain-language summary, e.g. "Player B gives Player A 5 strokes, on holes with SI
  1–5."

No net-score entry, no result recording, no leaderboard.

## 5. Rules / Data Required — Matchplay Format

**Recommended first format: singles matchplay (individual, one-on-one), 18 holes.**
This matches the "Match Helper" framing in PROJECT-OS.md and is the simplest matchplay format:
one handicap difference, one allocation table, no partner-score logic. Foursomes/fourball/Stableford
matchplay variants are explicitly deferred (§7) — they require combined-handicap rules that add
complexity without testing the core hypothesis (does club-specific context beat a generic tool?).

**Donabate-specific data this requires:**

- Course Rating and Slope Rating for each tee, **for each of the three possible 18-hole
  combinations** Donabate members actually play (Donabate is a 27-hole club — three 9-hole loops,
  commonly combined in pairs, e.g. two loops joined to make an 18). The Course Handicap formula
  depends on the specific 18 selected, not a single fixed course rating.
- Stroke Index (1–18) allocation for each of those combinations and tees — this determines which
  holes receive strokes, and changes depending on which two 9s are joined and in what order.
- Par per hole for each combination (for display alongside SI, not for scoring).
- Which combinations are actually in normal member use (there may be a small number of standard
  pairings the club uses, rather than all mathematically possible combinations).

Indicative tee data found via public listings (not yet verified against the club, see §6):
White (men) 2934yd / rating 127 / slope 36.2; Yellow (men) 2824yd / rating 125 / slope 35.6;
Yellow (women) 2824yd / rating 132 / slope 38.5; Red (women) 2565yd / rating 126 / slope 37 — these
appear to be per-9 or partial figures, not confirmed full-18 combination data.

## 6. Assumptions Requiring Verification

These must be confirmed with Donabate/current WHS data before any calculation is treated as
reliable — none of the below should be hard-coded from assumption alone:

- **Matchplay handicap allowance percentage.** WHS's default recommendation for singles matchplay
  is 100% of the Course Handicap difference, but Golf Ireland gives clubs/committees discretion to
  set 85%, 90%, 95% or 100% for singles matchplay. **This is club/competition-specific and is not
  safe to assume as 100%.** Donabate's actual committee-set allowance (for casual matchplay vs. any
  club matchplay competition) must be confirmed — this is a correctness-critical input, not a
  cosmetic one.
- **Which 18-hole combinations are the "real" ones members play**, and their confirmed Course
  Rating, Slope Rating, and SI table per tee — the figures found in this research pass are from
  third-party listings, not the club's own published card, and are per-9 fragments that have not
  been verified as authoritative full-18 data.
- **Whether "casual"/social matchplay at Donabate conventionally uses a different allowance than
  club competition matchplay** (common at many clubs) — if so, the tool needs to know which
  context it's being used for.
- **Whether Course Handicap should be capped** (WHS handicap index caps / limits) for any member
  bracket relevant to Donabate's membership — affects edge cases, not the core flow.

Until these are confirmed, the tool should visibly label its output as provisional / for
Donabate's own committee-set allowance and course data to be confirmed, rather than presenting
strokes as authoritative.

## 7. Explicitly Out of Scope (for this first version)

- Any format other than 18-hole singles matchplay (no foursomes, fourball/4BBB, Stableford
  matchplay, or team formats).
- Live score entry, match result tracking, or history.
- Player accounts, login, or saved profiles.
- Competition/eligibility logic (entry conditions, qualifying rounds, categories).
- Course/tee data for any club other than Donabate.
- A generic handicap calculator (already exists at Donabate; not a goal per PROJECT-OS.md).
- Any UI beyond what's needed to enter two handicaps and a tee/routing choice and see the result.
- Mobile app / native distribution — a single simple page is sufficient to test the hypothesis.

## 8. Recommended First Implementation

The smallest useful version is a single-purpose calculator, not an application:

- One screen, one job: enter two handicaps + select the 18-hole routing/tees actually offered →
  see Course Handicaps, stroke difference, and hole-by-hole allocation.
- Donabate's course/tee/SI data (once verified, §6) hard-coded as static reference data — no data
  entry UI, no database, no admin screens. It changes rarely enough that "static and manually
  updated when the club changes cards" is acceptable for a prototype.
- No login, no persistence, no backend state. If it needs to be resettable/shareable, a static
  page with client-side calculation is sufficient — no server, no stored data.
- Explicitly labelled as provisional pending confirmation of the allowance percentage and course
  data in §6.

This tests the actual hypothesis in PROJECT-OS.md (does translating Donabate's specific
tee/SI/allowance context into a direct answer beat a generic calculator?) without building
anything that assumes the answer.

## 9. Open Decisions

- Confirm Donabate's committee-set singles matchplay handicap allowance (85/90/95/100%) — owner:
  Steve, needs club/committee confirmation, not assumption.
- Confirm which 18-hole tee combinations are in normal use, and obtain the club's own current
  Course Rating / Slope Rating / SI table for each (the club's own card, not third-party listings).
- Decide whether casual and club-competition matchplay need different allowance handling in this
  first version, or whether v1 supports only one context (recommend: one context only, to keep
  scope minimal — but this is a decision to confirm, not yet made).
- Confirm this first-implementation approach (static single-purpose calculator, no accounts/data
  entry UI) before any build begins, per PROJECT-OS.md's instruction not to scaffold yet.
