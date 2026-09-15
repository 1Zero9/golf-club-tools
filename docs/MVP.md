# Donabate Match Helper — MVP Proposal

> Scope note: this proposal implements the "first implementation" already committed to in
> `PROJECT-OS.md` (Donabate-specific, question-first, not a generic handicap calculator). It does
> not reopen those decisions. Any conflict found during research is recorded in §6, not resolved
> by silently changing the established decision.

> **Stage C update (2026-09-15):** the working slice described here has been built (see
> `app/`). Sections 5, 6 and 9 below have been updated with what could and could not be verified
> against Donabate's own authoritative sources. See §10 for the full verification record.

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
3. (v1: fixed — see §5) The tool supports one routing/tee only for this first working slice:
   Blue + Yellow, White tees. Selecting a different routing/tee is out of scope for v1.
4. Tool returns: each player's Course Handicap for that combination, the strokes-given
   difference, and the hole-by-hole allocation (which holes the higher-handicap player receives a
   stroke on).
5. Optional: member can screenshot/note the result before teeing off. No accounts, no saved
   history, no scoring in this version.

## 3. Inputs

Minimum required, nothing else:

- Player A Handicap Index
- Player B Handicap Index
- Match format (fixed to singles matchplay for this version — see §4/§8)

Routing/tee is **not** an input in v1 — it is fixed to one supported combination (§5) rather than
selectable, to keep the first working slice to data that has actually been verified.

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

**Donabate-specific data this requires — now resolved for one routing (Stage C):**

- **Supported routing/tee for v1: Blue + Yellow, White tees (Men's).** Par 72, Course Rating 71.7,
  Slope Rating 127. This is one of Donabate's own three named 18-hole combinations (Red+Blue,
  Yellow+Blue, Red+Yellow) and its Course Rating/Slope/Par were read directly from Donabate Golf
  Club's own published handicap calculator (donabategolfclub.com/handicap-calculator) — this is
  club-authoritative, not a third-party estimate.
- **Correction to the earlier indicative figures in this section:** the per-9/partial tee figures
  originally recorded here (White 2934yd/rating 127/slope 36.2 etc.) were third-party fragments
  and did not match the club's own combination-level ratings once checked — they are superseded
  by the verified figures above and should not be used. This is exactly the kind of unverified
  assumption §6 warned against; it has now been corrected rather than carried forward.
- **Stroke Index per hole:** could not be verified against Donabate's own printed scorecard or
  pro-shop system — the club's public site does not publish a hole-by-hole SI table, only the
  combination-level Course Rating/Slope/Par. The SI table used in the implementation comes from a
  third-party course listing (hole19golf.com) for the same "Blue-Yellow, 18 Holes" combination,
  cross-checked only by matching total Par (72) and the combination name. It is used because it is
  internally consistent (all 18 stroke indices present exactly once) and is the best available fit
  — but it is **not confirmed authoritative** and is flagged as such in the app itself. See §6 and
  §10.
- The other two combinations (Red+Blue, Red+Yellow) and their tees are out of scope for v1 (§7) —
  only Blue+Yellow/White is implemented.

## 6. Assumptions Requiring Verification

These must be confirmed with Donabate/current WHS data before any calculation is treated as
fully reliable — the implementation labels its output as provisional for exactly this reason.
Status after Stage C verification:

- **Matchplay handicap allowance percentage — still unresolved.** Golf Ireland confirms clubs may
  set 85–100% for singles matchplay (its 2025 rule change; previously a fixed 95%). Donabate's own
  website does not publish which figure its committee has chosen for any of its listed singles
  matchplay formats (Andy Doherty Singles, Club Singles, The Cotter Cup, 5-Day Singles Matchplay),
  and this can't be determined by reading the site (the club's own calculator computes it
  client-side without showing the percentage used). **The implementation uses the WHS/R&A default
  of 100%** as the least-assumption fallback, clearly labelled in the UI — this is a corrigible
  default, not a confirmed Donabate figure. Still needs club/committee confirmation.
- **Which 18-hole combination and Course Rating/Slope/Par to use — now resolved for one
  combination.** Blue+Yellow, White tees is verified from Donabate's own handicap calculator page
  (§5). The other two combinations remain unverified/unimplemented (deferred, §7).
- **Stroke Index per hole for the supported routing — still unresolved.** No authoritative
  (club-published) hole-by-hole SI table could be found; see §5 and §10 for what was used instead
  and why. This is the main remaining correctness gap: the app's "which holes" answer is only as
  good as an unconfirmed third-party source.
- **Whether casual/social matchplay at Donabate uses a different allowance than club competition
  matchplay** — still unconfirmed; v1 supports only one context (§9).
- **Whether Course Handicap should be capped** for any member bracket — not investigated in Stage
  C; the implementation validates Handicap Index against the general WHS range (-10 to 54) but
  does not apply any Donabate-specific cap.

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
  Steve, needs club/committee confirmation (e.g. via the pro shop or club secretary); the app
  currently defaults to 100% (WHS default) and labels this as unconfirmed.
- Confirm the Stroke Index table for Blue+Yellow/White against Donabate's own scorecard or pro
  shop system — the app currently uses a third-party value, flagged in-app as unconfirmed. This is
  the single highest-priority follow-up before treating any real match output as authoritative.
- Decide whether to extend to the other two combinations (Red+Blue, Red+Yellow) and to non-White
  tees once the above are confirmed, or keep v1 scoped to one routing for longer.
- Decide whether casual and club-competition matchplay need different allowance handling, or
  whether v1 continues to support only one context (current implementation: one context only).

## 10. Verification Record (Stage C)

Authoritative sources checked, and outcome:

| Item | Source checked | Outcome |
|---|---|---|
| Course Rating / Slope / Par, Blue+Yellow combination | Donabate GC's own handicap calculator (donabategolfclub.com/handicap-calculator) | **Verified.** White (M) Par 72 / CR 71.7 / Slope 127; Yellow (M) Par 72 / CR 70.8 / Slope 124; Yellow (F) Par 72 / CR 76.6 / Slope 132; Red (F) Par 72 / CR 73.4 / Slope 126. |
| Singles matchplay handicap allowance (Golf Ireland policy) | Golf Ireland / press coverage of its 2025 WHS allowance rule change | **Verified as policy**: clubs may set 85–100% for singles matchplay at their discretion. |
| Donabate's own chosen allowance percentage | Donabate GC website (handicap calculator, local rules) | **Not found** — not published. App defaults to WHS 100%, labelled unconfirmed. |
| Stroke Index per hole, Blue+Yellow/White | Donabate GC website (no SI table published); third-party listing (hole19golf.com, "Blue-Yellow, 18 Holes", Red/Ladies tee) | **Not authoritatively verified.** Third-party table used as best available, matches combination name and total Par (72), but sourced from a different tee/gender card and not cross-checked against the club's own scorecard. Labelled unconfirmed in-app. |
| WHS Course Handicap formula | R&A/USGA World Handicap System documentation | **Verified**: Course Handicap = round(Handicap Index × (Slope Rating ÷ 113) + (Course Rating − Par)). |

This is a partial-verification outcome, not a full stop: two of the four required checks (Course
Rating/Slope/Par, and the calculation formula) were confirmed against authoritative sources; the
allowance percentage and Stroke Index table could not be, because Donabate does not publish them
and no reliable authoritative alternative was found. Rather than silently assuming figures for
these two, the implementation uses clearly-labelled defaults/best-available data and surfaces the
gap directly in the UI and in §6/§9 above, per the instruction not to trust unverified figures
silently.
