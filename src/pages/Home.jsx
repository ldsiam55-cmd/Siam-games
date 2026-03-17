export default function Home({ nav }) {
  const games = [
    {
      id: 'guess',
      icon: '🕵️',
      title: 'GUESS THE PLAYER',
      desc: '4 cryptic hints. How fast can you identify the footballer?',
      badge: '100 pts max'
    },
    {
      id: 'teams',
      icon: '🏟️',
      title: 'TOP TEAMS',
      desc: 'Premier League & La Liga squads — current stars and legends.',
      badge: 'PL + La Liga'
    },
    {
      id: 'rankings',
      icon: '🏆',
      title: 'TOP 10 RANKINGS',
      desc: 'Drag and drop to rank the greatest in football history.',
      badge: '6 challenges'
    },
    {
      id: 'grid',
      icon: '⚡',
      title: 'GRID DUEL',
      desc: 'Football Tic Tac Toe — name players that fit two categories.',
      badge: 'vs CPU / Friend'
    },
    {
      id: 'leaderboard',
      icon: '🌍',
      title: 'LEADERBOARD',
      desc: 'Global rankings — compete with players worldwide.',
      badge: 'Live rankings'
    }
  ]

  return (
    <div>
      <div className="home-hero">
        <h1>SIAM GAMES</h1>
        <p>The ultimate football IQ challenge</p>
      </div>
      <div className="games-grid">
        {games.map(g => (
          <div key={g.id} className="game-card" onClick={() => nav(g.id)}>
            <div className="icon">{g.icon}</div>
            <h3>{g.title}</h3>
            <p>{g.desc}</p>
            <span className="badge">{g.badge}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
