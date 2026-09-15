# Project OS

> Lightweight decision support for this project.
> Keep this file concise. Record only information that changes decisions.

## 1. Project Intake

**Project:** Golf Club Tools

**Current objective:**
Test whether a small, club-specific utility can simplify a real question for a golf club member. The current first utility is a Donabate-specific Match Helper.

**Users / people affected:**
Initially, members of Donabate Golf Club who need to understand handicap and matchplay information.

**What already exists:**
Donabate Golf Club has an existing online handicap calculator and publishes club/course/competition information. External research also identified more capable generic handicap and matchplay calculators serving Irish and UK golfers.

**Important constraints:**
- Start with one small, bounded utility.
- Do not attempt to replace existing club management systems.
- Generic handicap calculation alone is not a sufficient differentiator.
- Club-specific rules and context should simplify the member's task rather than expose unnecessary calculation complexity.
- Broader multi-club, multi-sport and commercial possibilities remain hypotheses, not requirements.

**Already-decided / do not reopen without reason:**
- The first implementation will not be a generic handicap calculator.
- The initial utility will be Donabate-specific.
- The utility should answer the member's question directly rather than require the member to understand the underlying calculation process.
- Wider sports-club tooling is deferred unless later evidence warrants reopening it.

**Main uncertainties:**
- Whether the proposed Match Helper provides enough additional value over existing tools.
- Which Donabate competition/matchplay formats should be supported initially.
- What minimum club/course/rule data is required.
- Whether the club-specific approach proves reusable beyond this first utility.

**Cost of getting this wrong:**
Low. This is an early, reversible prototype. The primary cost is unnecessary development time and project drift.

**Reversibility:**
High.

**Process depth:** Light

**Why this depth:**
The first implementation is small, experimental and reversible. Research has already been performed to test the initial product direction.

---

## 2. Relevant Knowledge

Only record previous knowledge that is relevant to a current decision.

| Source | Previous learning | Why it matters here | Use / Adapt / Ignore |
|---|---|---|---|
| Initial project idea | Golf and sports clubs contain complexity that small member utilities may simplify. | Establishes the problem space without assuming a particular solution. | Use |
| Donabate handicap calculator | Donabate already uses a small club-specific utility to simplify handicap calculation. | Demonstrates that local convenience tooling already has a role within the club. | Use |
| Stage A discovery | Member questions may be a better abstraction than a collection of unrelated tools. | Encourages the product to begin with the member's desired answer rather than the calculation mechanism. | Use |
| Stage A discovery | Calculate, Explain, Eligibility and Navigate emerged as useful classes of member question. | Potential future direction, but only Calculate/Explain are relevant to the first utility. | Adapt |
| External landscape research | Generic handicap and matchplay calculators already exist and can be substantially more capable than Donabate's current calculator. | Avoids spending effort recreating an already well-served generic product. | Use |
| External landscape research | Clubs still create local convenience tools despite national/general-purpose golf products. | Supports testing whether club-specific context creates useful value. | Use |
| Original idea | Player/member matching could be useful. | No supporting Donabate evidence was found during initial discovery. | Ignore for current scope |
| Broader hypothesis | Similar utility patterns may apply to other sports clubs. | Potentially valuable later but would expand the current experiment prematurely. | Ignore for current scope |
| Stage C verification | Donabate's own handicap calculator page publishes authoritative Course Rating/Slope/Par for its three named 18-hole combinations, but does not publish per-hole Stroke Index or its chosen matchplay allowance percentage. | Some correctness-critical data is obtainable from the club directly; some (SI table, allowance %) is not published anywhere online and needs a human ask (pro shop/committee). | Use |
| Stage C verification | Earlier per-9 tee figures recorded in `docs/MVP.md` §5 (from generic course-directory sites) did not match the club's own combination-level ratings once checked. | Confirms the original caution in this file's "Assumptions Requiring Verification" was warranted — third-party golf-course-directory data should not be treated as authoritative for Donabate-specific calculations. | Use |

**Current knowledge gaps:**
- Exact rules/data needed for the first supported Donabate match format.
- Minimum useful user journey.
- Whether the club-specific abstraction remains useful once implemented.
- Donabate's committee-set singles matchplay handicap allowance percentage (not published; needs asking the club).
- Confirmed Stroke Index table for the implemented routing (Blue+Yellow, White tees) against the club's own scorecard (not published online; needs asking the club).

---

## 3. Risk & Failure

Only include material risks.

| What could fail? | Consequence | Recovery / mitigation | Owner if relevant |
|---|---|---|---|
| We recreate functionality already better served elsewhere. | Wasted development effort. | Keep the utility club-specific and question-focused. | Steve |
| Scope expands into a golf platform or sports-club platform before the first utility is tested. | Project drift and delayed learning. | Preserve wider ideas as hypotheses and keep the first implementation bounded. | Steve |
| Club rules/data are interpreted incorrectly. | Incorrect answers to members. | Verify calculation rules and source data before treating outputs as authoritative. | Steve |
| Project OS capture becomes more work than the prototype. | Experiment process outweighs its value. | Keep documentation limited to decision-changing knowledge. | Project OS experiment |
| The two most correctness-critical matchplay inputs (allowance %, Stroke Index table) are not published by Donabate anywhere online. | The working prototype's stroke allocation is only as good as an unconfirmed default/best-available source, not a confirmed club figure. | Ship with both gaps clearly labelled as unconfirmed in the app itself; treat any real-match use as provisional until the club confirms them. | Steve |

**Time/lifecycle concerns:**
Club rules, course data and competition rules can change and may become stale.

**External dependencies:**
Published Donabate Golf Club information and applicable golf handicap/matchplay rules.

**Important recovery path:**
The prototype can be stopped or re-scoped without affecting an existing production system.

---

## 4. Scope & Stop

**Original objective still intact?** Yes

**Current scope change, if any:**
The initial idea was broad small tools for golf/sports club members. Discovery narrowed the first implementation to a Donabate-specific Match Helper.

**Why is it justified?**
External research showed that generic handicap/matchplay calculation is already well served, while club-specific convenience tooling continues to exist. The narrower utility tests whether club context provides useful differentiation.

**Are we deepening the existing promise or expanding it?**
Narrowing/deepening.

**Are we changing working software? Why?**
No. This is a new prototype.

**Are repeated reviews still materially changing the outcome?**
The most recent bounded external research materially changed the proposed first utility. Further general landscape research is not currently justified.

**Current decision:** Continue

**Reason:**
There is enough evidence to justify testing one small Donabate-specific Match Helper without committing to a wider platform.

---

## 5. Learning

Only capture something likely to improve a future decision.

### Learning record

**Date:** 2026-09-15

**What happened:**
The project began with a broad idea for useful golf/sports-club member tools. Initial Donabate discovery suggested that member questions may be a more useful framing than individual tools. Before implementation, bounded Irish/UK landscape research was performed.

**What we expected:**
A Matchplay Helper might be a useful extension of Donabate's existing handicap calculator.

**What we learned:**
Generic handicap and matchplay calculation is already well served by existing products. However, clubs continue to provide local utilities, suggesting that club-specific knowledge and convenience may provide the more useful opportunity. The first utility was therefore narrowed from a generic Matchplay Helper to a Donabate-specific Match Helper.

**Reusable beyond this project?** Unsure

**Candidate type:** Decision

**Future relevance:**
When considering later utilities or broader club/sport expansion, test whether the value comes from generic functionality or from translating local context into a simple answer for the member.

### Learning record

**Date:** 2026-09-15

**What happened:**
Stage C attempted to verify the Donabate-specific data (course/tee ratings, Stroke Index table, matchplay handicap allowance) called out as unverified in `docs/MVP.md`, then built the smallest working slice.

**What we expected:**
That the club's own website would publish enough data (a course card with SI, and a stated allowance percentage) to fully verify the calculation before building.

**What we learned:**
Donabate's own site publishes authoritative Course Rating/Slope/Par per named 18-hole combination (via its handicap calculator page), which was enough to correct earlier third-party figures. It does **not** publish a per-hole Stroke Index table or its committee-set matchplay allowance percentage — these exist only in the club's in-person systems (pro shop computer, printed card). A useful prototype could still be built by implementing one verified routing (Blue+Yellow, White tees) and clearly labelling the two remaining gaps as unconfirmed defaults rather than either stopping entirely or silently guessing.

**Reusable beyond this project?** Yes

**Candidate type:** Pattern

**Future relevance:**
For any future Donabate-specific (or other club-specific) utility: expect a club website to answer "what" (ratings) but not "how" (competition rules, SI allocation) — those need a direct ask to the club. Partial verification with clearly labelled gaps is preferable to either a full stop or silent assumption when only some inputs are confirmable remotely.

---

## Project OS Experiment Log

| Date | Capability | Why invoked | Material change? | Friction | Notes |
|---|---|---|---|---|---|
| 2026-09-15 | Project intake / discovery | Establish the real problem before implementation. | Yes | None | Broad tooling idea narrowed towards member questions. |
| 2026-09-15 | External research | Test whether existing products invalidate the proposed Matchplay Helper. | Yes | Research could easily expand without a stop condition. | Bounded research changed the direction from generic Matchplay Helper to Donabate-specific Match Helper. |
| 2026-09-15 | Knowledge capture | Preserve Stage A decisions and learning for later project work. | Pending | GitHub integration could inspect the repository but direct file creation returned HTTP 403. | Operational repository friction; no Project OS framework change permitted during Experiment 003. |
| 2026-09-15 | Authoritative verification + first build (Stage C) | Resolve MVP.md's correctness gaps before building; then build the smallest working slice. | Yes | Two of four required verifications (allowance %, SI table) had no authoritative online source at all, not just a hard-to-find one — a stop/build tension the process doesn't explicitly resolve. | Proceeded with the build, using verified data where found and clearly labelling the two unconfirmed items in-app, rather than a full stop; recorded as a reusable pattern above. |
