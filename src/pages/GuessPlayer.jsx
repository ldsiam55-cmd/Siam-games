import { useState } from 'react'
import { PLAYERS } from '../data/players'

const POINTS = [100, 75, 50, 25]
const PT_CLASS = ['pts-100', 'pts-75', 'pts-50', 'pts-25']

export default function GuessPlayer({ addScore }) {
  const [idx, setIdx] = useState(0)
  const [hintsShown, setHintsShown] = useState(1)
  const [guess, setGuess] = useState('')
  const [wrongs, setWrongs] = useState([])
  const [result, setResult] = useState(null) // null | 'correct' | 'skip'
  const [sessionScore, setSessionScore] = useState(0)
  const [completed, setCompleted] = useState([])
  const [showingSuggestions, setShowingSuggestions] = useState(false)

  const player = PLAYERS[idx]
  const pts = POINTS[hintsShown - 1]
  const ptsClass = PT_CLASS[hintsShown - 1]

  const suggestions = guess.length > 1
    ? PLAYERS.filter(p =>
        p.name.toLowerCase().includes(guess.toLowerCase()) && p.id !== player.id
      ).slice(0, 5)
    : []

  const submitGuess = (g) => {
    const val = (g || guess).trim()
    if (!val) return
    if (val.toLowerCase() === player.name.toLowerCase()) {
      setResult({ type: 'correct', pts })
      setSessionScore(s => s + pts)
      addScore(pts)
      setCompleted(c => [...c, player.id])
    } else {
      setWrongs(w => [...w, val])
      setGuess('')
    }
    setShowingSuggestions(false)
  }

  const nextPlayer = () => {
    if (idx + 1 >= PLAYERS.length) {
      setIdx(0)
    } else {
      setIdx(i => i + 1)
    }
    setHintsShown(1)
    setGuess('')
    setWrongs([])
    setResult(null)
  }

  const revealHint = () => {
    if (hintsShown < 4) setHintsShown(h => h + 1)
  }

  const skipPlayer = () => {
    setResult({ type: 'skip', answer: player.name })
    setCompleted(c => [...c, player.id])
  }

  return (
    <div>
      <div className="page-header">
        <h2>🕵️ GUESS THE PLAYER</h2>
        <p>Read the hints. Guess faster for more points.</p>
      </div>

      <div className="score-display">
        <div className="score-item">
          <div className="val">{sessionScore}</div>
          <div className="lbl">Session Score</div>
        </div>
        <div className="score-item">
          <div className="val">{idx + 1}/{PLAYERS.length}</div>
          <div className="lbl">Player</div>
        </div>
        <div className="score-item">
          <div className="val">{completed.length}</div>
          <div className="lbl">Solved</div>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((idx) / PLAYERS.length) * 100}%` }} />
      </div>

      <div className="card">
        <div className={`points-badge ${ptsClass}`}>
          ⭐ {pts} POINTS AVAILABLE
        </div>

        {/* Hints */}
        <div style={{ marginBottom: 16 }}>
          {Array.from({ length: hintsShown }).map((_, i) => (
            <div key={i} className="hint-box">
              <span style={{ color: 'var(--text2)', fontSize: 12, marginRight: 8 }}>HINT {i + 1}</span>
              {player.hints[i]}
            </div>
          ))}
        </div>

        {/* Wrong guesses */}
        {wrongs.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {wrongs.map((w, i) => (
              <div key={i} className="result-wrong">❌ {w}</div>
            ))}
          </div>
        )}

        {/* Result */}
        {result && (
          <div>
            {result.type === 'correct' && (
              <div className="result-correct">✅ Correct! +{result.pts} points — {player.name}</div>
            )}
            {result.type === 'skip' && (
              <div className="result-wrong">Answer: <strong>{result.answer}</strong></div>
            )}
            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <button className="btn btn-green" onClick={nextPlayer}>
                {idx + 1 >= PLAYERS.length ? '🔄 Restart' : '➡️ Next Player'}
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        {!result && (
          <div>
            <div className="guess-input-wrap">
              <div className="autocomplete-wrap">
                <input
                  className="guess-input"
                  placeholder="Type footballer name..."
                  value={guess}
                  onChange={e => { setGuess(e.target.value); setShowingSuggestions(true) }}
                  onKeyDown={e => e.key === 'Enter' && submitGuess()}
                  autoComplete="off"
                />
                {showingSuggestions && suggestions.length > 0 && (
                  <div className="autocomplete-list">
                    {suggestions.map(s => (
                      <div key={s.id} className="autocomplete-item"
                        onMouseDown={() => { setGuess(s.name); setShowingSuggestions(false) }}>
                        {s.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="btn btn-green" onClick={() => submitGuess()}>GUESS</button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
              {hintsShown < 4 && (
                <button className="btn btn-outline" onClick={revealHint}>
                  💡 Hint {hintsShown + 1} (-{pts - POINTS[hintsShown]}pts)
                </button>
              )}
              <button className="btn btn-outline" style={{ color: 'var(--red)' }} onClick={skipPlayer}>
                ⏭️ Skip (0pts)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Player list */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 20, letterSpacing: 1, marginBottom: 14, color: 'var(--text2)' }}>
          ALL PLAYERS
        </h3>
        <div className="player-list">
          {PLAYERS.map((p, i) => (
            <div
              key={p.id}
              className={`player-item ${completed.includes(p.id) ? 'done' : ''}`}
              onClick={() => { setIdx(i); setHintsShown(1); setGuess(''); setWrongs([]); setResult(null) }}
            >
              <span className="player-num">#{i + 1}</span>
              <span>{completed.includes(p.id) ? p.name : '???'}</span>
              {completed.includes(p.id) && <span style={{ marginLeft: 'auto', color: 'var(--green)', fontSize: 12 }}>✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
