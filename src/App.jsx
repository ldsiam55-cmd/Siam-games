import { useState } from 'react'
import Home from './pages/Home'
import GuessPlayer from './pages/GuessPlayer'
import TopTeams from './pages/TopTeams'
import Rankings from './pages/Rankings'
import GridDuel from './pages/GridDuel'
import Leaderboard from './pages/Leaderboard'
import './App.css'

export default function App() {
  const [page, setPage] = useState('home')
  const [score, setScore] = useState(0)

  const addScore = (pts) => setScore(s => s + pts)

  const nav = (p) => setPage(p)

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand" onClick={() => nav('home')}>
          <span className="nav-logo">⚽</span>
          <span className="nav-title">SIAM GAMES</span>
        </div>
        <div className="nav-links">
          <button className={page==='guess' ? 'active':''} onClick={() => nav('guess')}>🕵️ Guess</button>
          <button className={page==='teams' ? 'active':''} onClick={() => nav('teams')}>🏟️ Teams</button>
          <button className={page==='rankings' ? 'active':''} onClick={() => nav('rankings')}>🏆 Rankings</button>
          <button className={page==='grid' ? 'active':''} onClick={() => nav('grid')}>⚡ Grid Duel</button>
          <button className={page==='leaderboard' ? 'active':''} onClick={() => nav('leaderboard')}>🌍 Leaderboard</button>
        </div>
        <div className="nav-score">
          <span>⭐ {score} pts</span>
        </div>
      </nav>

      <main className="main-content">
        {page === 'home' && <Home nav={nav} />}
        {page === 'guess' && <GuessPlayer addScore={addScore} />}
        {page === 'teams' && <TopTeams addScore={addScore} />}
        {page === 'rankings' && <Rankings addScore={addScore} />}
        {page === 'grid' && <GridDuel addScore={addScore} />}
        {page === 'leaderboard' && <Leaderboard score={score} />}
      </main>

      <div className="cr7-watermark">CR7</div>
    </div>
  )
}
