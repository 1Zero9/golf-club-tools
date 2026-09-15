import './style.css'
import { computeMatch, InvalidHandicapIndexError } from './calc.js'
import { ROUTING, MATCHPLAY_ALLOWANCE_PERCENT, DATA_PROVENANCE } from './donabate-data.js'

const app = document.querySelector('#app')

app.innerHTML = `
  <header class="page-header">
    <h1>Donabate Match Helper</h1>
    <span class="routing-chip">${ROUTING.combination} · ${ROUTING.tee} tees · ${ROUTING.gender}</span>
    <p class="routing-detail">
      Par ${ROUTING.par} &middot; Course Rating ${ROUTING.courseRating} &middot; Slope Rating ${ROUTING.slopeRating}
      &middot; Singles matchplay, ${MATCHPLAY_ALLOWANCE_PERCENT}% allowance
    </p>
  </header>

  <div class="card">
    <div class="player-row">
      <div class="field">
        <label for="hiA">Player A — Handicap Index</label>
        <input id="hiA" inputmode="decimal" placeholder="e.g. 14.4" autocomplete="off" />
      </div>
      <div class="field">
        <label for="hiB">Player B — Handicap Index</label>
        <input id="hiB" inputmode="decimal" placeholder="e.g. 22.7" autocomplete="off" />
      </div>
    </div>
    <p class="error-text" id="error" role="alert"></p>
  </div>

  <div id="result"></div>

  <div class="caveat">
    <strong>Before relying on this for a real match</strong>
    ${DATA_PROVENANCE.strokeIndex}
    ${DATA_PROVENANCE.allowance}
  </div>

  <footer class="app-footer">Prototype — Donabate Golf Club, ${ROUTING.combination} routing only.</footer>
`

const hiAInput = document.querySelector('#hiA')
const hiBInput = document.querySelector('#hiB')
const errorEl = document.querySelector('#error')
const resultEl = document.querySelector('#result')

function render() {
  errorEl.textContent = ''
  resultEl.innerHTML = ''

  const rawA = hiAInput.value.trim()
  const rawB = hiBInput.value.trim()
  if (rawA === '' || rawB === '') {
    return
  }

  let match
  try {
    match = computeMatch({
      handicapIndexA: rawA,
      handicapIndexB: rawB,
      routing: ROUTING,
      allowancePercent: MATCHPLAY_ALLOWANCE_PERCENT,
    })
  } catch (err) {
    if (err instanceof InvalidHandicapIndexError) {
      errorEl.textContent = err.message
      return
    }
    throw err
  }

  resultEl.innerHTML = renderResult(match)
}

function renderResult(match) {
  const summary = renderSummary(match)
  const holesTable = renderHolesTable(match)
  const explainer = renderExplainer(match)
  return `<div class="card">${summary}${holesTable}${explainer}</div>`
}

function renderSummary(match) {
  if (match.strokes === 0) {
    return `
      <div class="result-summary is-level">
        Level match — both players have the same Playing Handicap
        (Player A: <strong>${match.playingHandicapA}</strong>,
        Player B: <strong>${match.playingHandicapB}</strong>). No strokes given either way.
      </div>
    `
  }

  const giver = match.givingPlayer
  const receiver = match.receivingPlayer
  return `
    <div class="result-summary">
      Player <strong>${receiver}</strong> receives
      <strong>${match.strokes}</strong> stroke${match.strokes === 1 ? '' : 's'}
      from Player <strong>${giver}</strong>.
      <br />
      Course Handicaps: Player A <strong>${match.courseHandicapA}</strong>,
      Player B <strong>${match.courseHandicapB}</strong>.
    </div>
  `
}

function renderHolesTable(match) {
  const rows = match.holes
    .map((hole) => {
      const cssClass = hole.strokesReceived > 0 ? 'has-stroke' : ''
      const dots = hole.strokesReceived > 0 ? '&bull;'.repeat(hole.strokesReceived) : '—'
      return `
        <tr class="${cssClass}">
          <td class="hole-num">${hole.hole}</td>
          <td>${hole.par}</td>
          <td>${hole.si}</td>
          <td class="stroke-dots">${dots}</td>
        </tr>
      `
    })
    .join('')

  const strokeCaption =
    match.strokes === 0
      ? 'No holes carry a stroke in this match.'
      : `Holes highlighted below are where Player ${match.receivingPlayer} receives a stroke.`

  return `
    <div class="table-wrap">
      <table class="holes">
        <caption>${strokeCaption}</caption>
        <thead>
          <tr><th>Hole</th><th>Par</th><th>SI</th><th>Strokes</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `
}

function renderExplainer(match) {
  return `
    <details class="explainer">
      <summary>How was this worked out?</summary>
      <div class="explainer-body">
        <p>
          Each player's Handicap Index is converted to a Course Handicap for
          ${ROUTING.combination} (${ROUTING.tee} tees): Handicap Index &times; (Slope Rating &divide; 113)
          + (Course Rating &minus; Par), rounded to a whole number.
        </p>
        <dl>
          <dt>Player A</dt>
          <dd>Handicap Index ${match.handicapIndexA} &rarr; Course Handicap ${match.courseHandicapA} &rarr; Playing Handicap ${match.playingHandicapA} (${MATCHPLAY_ALLOWANCE_PERCENT}% allowance)</dd>
          <dt>Player B</dt>
          <dd>Handicap Index ${match.handicapIndexB} &rarr; Course Handicap ${match.courseHandicapB} &rarr; Playing Handicap ${match.playingHandicapB} (${MATCHPLAY_ALLOWANCE_PERCENT}% allowance)</dd>
        </dl>
        <p>
          The difference between the two Playing Handicaps (${match.strokes}) is the number of
          strokes given by the lower-handicap player to the higher-handicap player, allocated one
          per hole starting at Stroke Index 1, going up to Stroke Index 18, then wrapping back to
          Stroke Index 1 again if there are more than 18 strokes to give.
        </p>
      </div>
    </details>
  `
}

hiAInput.addEventListener('input', render)
hiBInput.addEventListener('input', render)
