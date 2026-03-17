import { useState, useEffect } from 'react'

// Firebase config — replace with your actual config if needed
const FIREBASE_URL = 'https://siam-games-default-rtdb.firebaseio.com'

const FLAGS = ['🇧🇩','🏴󠁧󠁢󠁥󠁮󠁧󠁿','🇫🇷','🇩🇪','🇧🇷','🇦🇷','🇵🇹','🇪🇸','🇮🇹','🇳🇱','🇧🇪','🇺🇸','🇨🇦','🇦🇺','🇯🇵','🇰🇷','🇳🇬','🇬🇭','🌍']

export default function Leaderboard({ score }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState(localStorage.getItem('siam_name') || '')
  const [flag, setFlag] = useState(localStorage.getItem('siam_flag') || '🌍')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${FIREBASE_URL}/players.json`)
      const data = await res.json()
      if (data) {
        const list = Object.entries(data)
          .map(([id, v]) => ({ id, ...v }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 50)
        setEntries(list)
      }
    } catch (e) {
      console.error('Failed to load leaderboard', e)
    }
    setLoading(false)
  }

  const submitScore = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    try {
      const playerId = localStorage.getItem('siam_id') || `player_${Date.now()}`
      localStorage.setItem('siam_id', playerId)
      localStorage.setItem('siam_name', name)
      localStorage.setItem('siam_flag', flag)

      await fetch(`${FIREBASE_URL}/players/${playerId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          flag,
          score,
          updatedAt: Date.now()
        })
      })
      setSubmitted(true)
      await fetchLeaderboard()
    } catch (e) {
      console.error('Submit failed', e)
    }
    setSubmitting(false)
  }

  const rankStyle = (i) => {
    if (i === 0) return 'top1'
    if (i === 1) return 'top2'
    if (i === 2) return 'top3'
    return ''
  }

  const rankEmoji = (i) => {
    if (i === 0) return '🥇'
    if (i === 1) return '🥈'
    if (i === 2) return '🥉'
    return `#${i + 1}`
  }

  return (
    <div>
      <div className="page-header">
        <h2>🌍 GLOBAL LEADERBOARD</h2>
        <p>Compete with players worldwide</p>
      </div>

      {/* Score submit card */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: 1, marginBottom: 14 }}>
          YOUR SCORE
        </div>
        <div style={{ fontFamily: 'Orbitron', fontSize: 32, color: 'var(--green)', marginBottom: 16 }}>
          {score} pts
        </div>

        {!submitted ? (
          <div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              <input
                className="guess-input"
                placeholder="Your name..."
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ maxWidth: 220 }}
              />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {FLAGS.map(f => (
                  <button key={f} onClick={() => setFlag(f)}
                    style={{
                      background: flag === f ? 'rgba(0,255,135,0.15)' : 'transparent',
                      border: `1px solid ${flag === f ? 'var(--green)' : 'var(--border)'}`,
                      borderRadius: 6,
                      padding: '6px 8px',
                      cursor: 'pointer',
                      fontSize: 18
                    }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-green" onClick={submitScore} disabled={submitting || !name.trim()}>
              {submitting ? 'Submitting...' : '🏆 Submit to Leaderboard'}
            </button>
          </div>
        ) : (
          <div className="result-correct">✅ Score submitted! You're on the leaderboard.</div>
        )}
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: 1, marginBottom: 16 }}>
          TOP 50 PLAYERS
        </div>
        {loading ? (
          <div style={{ color: 'var(--text2)', textAlign: 'center', padding: 32 }}>Loading...</div>
        ) : entries.length === 0 ? (
          <div style={{ color: 'var(--text2)', textAlign: 'center', padding: 32 }}>
            No scores yet — be the first! 🏆
          </div>
        ) : (
          <table className="lb-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.id}>
                  <td><span className={`lb-rank ${rankStyle(i)}`}>{rankEmoji(i)}</span></td>
                  <td>{e.flag} {e.name}</td>
                  <td style={{ fontFamily: 'Orbitron', fontSize: 14, color: 'var(--green)' }}>
                    {e.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
