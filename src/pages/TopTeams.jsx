import { useState } from 'react'
import { PL_TEAMS, LALIGA_TEAMS } from '../data/teams'

const POINTS = [100, 75, 50, 25]

export default function TopTeams({ addScore }) {
  const [league, setLeague] = useState('pl')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [hintsShown, setHintsShown] = useState(1)
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState(null)
  const [wrongs, setWrongs] = useState([])
  const [solved, setSolved] = useState({})

  const teams = league === 'pl' ? PL_TEAMS : LALIGA_TEAMS

  const startPlayer = (player) => {
    setSelectedPlayer(player)
    setHintsShown(1)
    setGuess('')
    setResult(null)
    setWrongs([])
  }

  const submitGuess = () => {
    if (!guess.trim()) return
    if (guess.trim().toLowerCase() === selectedPlayer.name.toLowerCase()) {
      const pts = POINTS[hintsShown - 1]
      setResult({ type: 'correct', pts })
      addScore(pts)
      setSolved(s => ({ ...s, [selectedPlayer.name]: pts }))
    } else {
      setWrongs(w => [...w, guess.trim()])
      setGuess('')
    }
  }

  const backToTeam = () => {
    setSelectedPlayer(null)
    setResult(null)
    setGuess('')
    setWrongs([])
  }

  const backToTeams = () => {
    setSelectedTeam(null)
    setSelectedPlayer(null)
    setResult(null)
  }

  if (selectedPlayer) {
    const pts = POINTS[hintsShown - 1]
    const ptsCls = ['pts-100','pts-75','pts-50','pts-25'][hintsShown - 1]
    return (
      <div>
        <button className="back-btn" onClick={backToTeam}>← Back to {selectedTeam.name}</button>
        <div className="page-header">
          <h2>{selectedTeam.emoji} {selectedTeam.name}</h2>
          <p>Guess the player from the hints</p>
        </div>
        <div className="card">
          <div className={`points-badge ${ptsCls}`}>⭐ {pts} POINTS</div>
          {Array.from({ length: hintsShown }).map((_, i) => (
            <div key={i} className="hint-box">
              <span style={{ color: 'var(--text2)', fontSize: 12, marginRight: 8 }}>HINT {i + 1}</span>
              {selectedPlayer.hints[i]}
            </div>
          ))}

          {wrongs.map((w, i) => <div key={i} className="result-wrong">❌ {w}</div>)}

          {result ? (
            <div>
              {result.type === 'correct' && (
                <div className="result-correct">✅ Correct! +{result.pts} pts — {selectedPlayer.name}</div>
              )}
              {result.type === 'skip' && (
                <div className="result-wrong">Answer: <strong>{selectedPlayer.name}</strong></div>
              )}
              <button className="btn btn-green" style={{ marginTop: 14 }} onClick={backToTeam}>
                ← Back to Squad
              </button>
            </div>
          ) : (
            <div>
              <div className="guess-input-wrap" style={{ marginTop: 16 }}>
                <input
                  className="guess-input"
                  placeholder="Type player name..."
                  value={guess}
                  onChange={e => setGuess(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitGuess()}
                />
                <button className="btn btn-green" onClick={submitGuess}>GUESS</button>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                {hintsShown < selectedPlayer.hints.length && (
                  <button className="btn btn-outline" onClick={() => setHintsShown(h => h + 1)}>
                    💡 Hint {hintsShown + 1}
                  </button>
                )}
                <button className="btn btn-outline" style={{ color: 'var(--red)' }}
                  onClick={() => setResult({ type: 'skip' })}>
                  ⏭️ Skip (0pts)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (selectedTeam) {
    return (
      <div>
        <button className="back-btn" onClick={backToTeams}>← All Teams</button>
        <div className="page-header">
          <h2>{selectedTeam.emoji} {selectedTeam.name}</h2>
          <p>Pick a player to guess</p>
        </div>
        <div className="player-list">
          {selectedTeam.players.map((p, i) => {
            const isSolved = solved[p.name]
            return (
              <div key={i} className={`player-item ${isSolved ? 'done' : ''}`}
                onClick={() => startPlayer(p)}>
                <span className="player-num">#{i + 1}</span>
                <span>{isSolved ? p.name : '???'}</span>
                {isSolved && <span style={{ marginLeft: 'auto', color: 'var(--green)', fontSize: 12 }}>✓ {isSolved}pts</span>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h2>🏟️ TOP TEAMS</h2>
        <p>Select a team and guess their players</p>
      </div>
      <div className="tabs">
        <button className={`tab ${league === 'pl' ? 'active' : ''}`} onClick={() => setLeague('pl')}>
          🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League
        </button>
        <button className={`tab ${league === 'laliga' ? 'active' : ''}`} onClick={() => setLeague('laliga')}>
          🇪🇸 La Liga
        </button>
      </div>
      <div className="teams-grid">
        {teams.map(t => (
          <div key={t.id} className="team-card" onClick={() => setSelectedTeam(t)}>
            <div className="team-emoji">{t.emoji}</div>
            <div className="team-name">{t.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>
              {t.players.length} players
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
