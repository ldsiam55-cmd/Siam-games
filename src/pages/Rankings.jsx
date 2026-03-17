import { useState } from 'react'

const CHALLENGES = [
  {
    id: 'ucl_goals',
    title: 'UCL All-Time Top Scorers',
    question: 'Rank these players by Champions League goals (most to least)',
    correct: ['Cristiano Ronaldo', 'Lionel Messi', 'Robert Lewandowski', 'Karim Benzema', 'Raul', 'Ruud van Nistelrooy', 'Thomas Muller', 'Thierry Henry', 'Alfredo Di Stefano', 'Andriy Shevchenko'],
    facts: ['140 goals','129 goals','101 goals','90 goals','71 goals','56 goals','54 goals','50 goals','49 goals','48 goals']
  },
  {
    id: 'transfers',
    title: 'Record Transfers',
    question: 'Rank these transfers by fee paid (most expensive to least)',
    correct: ['Neymar (PSG)', 'Kylian Mbappe (Real Madrid)', 'Joao Felix (Atletico)', 'Jack Grealish (Man City)', 'Enzo Fernandez (Chelsea)', 'Antony (Man Utd)', 'Romelu Lukaku (Chelsea)', 'Paul Pogba (Man Utd)', 'Antoine Griezmann (Barcelona)', 'Ousmane Dembele (Barcelona)'],
    facts: ['£198m', '£180m', '£113m', '£100m', '£107m', '£86m', '£97.5m', '£89m', '£107m', '£124m']
  },
  {
    id: 'ballon_dor',
    title: 'Ballon d\'Or Winners',
    question: 'Rank these players by number of Ballon d\'Or awards (most to least)',
    correct: ["Lionel Messi", "Cristiano Ronaldo", "Michel Platini", "Johan Cruyff", "Marco van Basten", "Ronaldo (R9)", "Zinedine Zidane", "Ronaldinho", "Luka Modric", "Karim Benzema"],
    facts: ['8', '5', '3', '3', '3', '2', '1', '1', '1', '1']
  },
  {
    id: 'pl_goals',
    title: 'Premier League Top Scorers',
    question: 'Rank these PL all-time top scorers (most to least goals)',
    correct: ['Alan Shearer', 'Wayne Rooney', 'Andrew Cole', 'Frank Lampard', 'Thierry Henry', 'Robbie Fowler', 'Michael Owen', 'Les Ferdinand', 'Teddy Sheringham', 'Robin van Persie'],
    facts: ['260', '208', '187', '177', '175', '163', '150', '149', '147', '144']
  },
  {
    id: 'wc_goals',
    title: 'World Cup All-Time Scorers',
    question: 'Rank these World Cup all-time top scorers (most to least)',
    correct: ['Miroslav Klose', 'Ronaldo R9', 'Gerd Muller', 'Just Fontaine', 'Pele', 'Sandor Kocsis', 'Jurgen Klinsmann', 'Helmut Rahn', 'Gary Lineker', 'Gabriel Batistuta'],
    facts: ['16', '15', '14', '13', '12', '11', '11', '10', '10', '10']
  },
  {
    id: 'wages',
    title: 'Highest Earners',
    question: 'Rank these players by reported weekly wages (highest to lowest)',
    correct: ['Cristiano Ronaldo', 'Neymar', 'Kylian Mbappe', 'Lionel Messi', 'Erling Haaland', 'Mohamed Salah', 'Kevin De Bruyne', 'Harry Kane', 'Vinicius Junior', 'Phil Foden'],
    facts: ['£3.5m/wk','£2.8m/wk','£2m/wk','£1.7m/wk','£375k/wk','£350k/wk','£400k/wk','£250k/wk','£300k/wk','£200k/wk']
  }
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Rankings({ addScore }) {
  const [selected, setSelected] = useState(null)
  const [order, setOrder] = useState([])
  const [revealed, setRevealed] = useState(false)
  const [dragIdx, setDragIdx] = useState(null)

  const startChallenge = (c) => {
    setSelected(c)
    setOrder(shuffle(c.correct))
    setRevealed(false)
  }

  const reveal = () => {
    const correct = order.filter((item, i) => item === selected.correct[i]).length
    const pts = correct * 10
    addScore(pts)
    setRevealed(true)
  }

  const handleDragStart = (i) => setDragIdx(i)
  const handleDragOver = (e, i) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) return
    const newOrder = [...order]
    const item = newOrder.splice(dragIdx, 1)[0]
    newOrder.splice(i, 0, item)
    setOrder(newOrder)
    setDragIdx(i)
  }
  const handleDragEnd = () => setDragIdx(null)

  if (selected) {
    return (
      <div>
        <button className="back-btn" onClick={() => setSelected(null)}>← All Challenges</button>
        <div className="page-header">
          <h2>🏆 {selected.title}</h2>
          <p>{selected.question}</p>
        </div>
        <div style={{ marginBottom: 12, color: 'var(--text2)', fontSize: 14 }}>
          💡 Drag and drop to reorder
        </div>
        <div className="rank-list">
          {order.map((item, i) => {
            const isCorrect = revealed && item === selected.correct[i]
            const isWrong = revealed && item !== selected.correct[i]
            return (
              <div
                key={item}
                className={`rank-item ${dragIdx === i ? 'dragging' : ''}`}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={e => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
              >
                <span className="rank-num">#{i + 1}</span>
                <span style={{ flex: 1 }} className={isCorrect ? 'rank-correct' : isWrong ? 'rank-wrong' : ''}>
                  {item}
                </span>
                {revealed && (
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>
                    {isCorrect ? '✅' : `❌ → ${selected.correct[i]}`}
                  </span>
                )}
                {revealed && (
                  <span style={{ fontSize: 12, color: 'var(--text2)', marginLeft: 8 }}>
                    {selected.facts[i]}
                  </span>
                )}
              </div>
            )
          })}
        </div>
        {!revealed ? (
          <button className="btn btn-green" style={{ marginTop: 20 }} onClick={reveal}>
            🔍 Reveal Answers
          </button>
        ) : (
          <div>
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(0,255,135,0.08)', borderRadius: 8, color: 'var(--green)' }}>
              ✅ {order.filter((item, i) => item === selected.correct[i]).length}/10 correct × 10pts = {order.filter((item, i) => item === selected.correct[i]).length * 10} pts
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button className="btn btn-outline" onClick={() => { setOrder(shuffle(selected.correct)); setRevealed(false) }}>
                🔄 Try Again
              </button>
              <button className="btn btn-outline" onClick={() => setSelected(null)}>
                ← Challenges
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h2>🏆 TOP 10 RANKINGS</h2>
        <p>Drag and drop to rank the greatest in football history</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {CHALLENGES.map(c => (
          <div key={c.id} className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onClick={() => startChallenge(c)}>
            <div>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: 1 }}>{c.title}</div>
              <div style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>{c.question}</div>
            </div>
            <span style={{ color: 'var(--green)', fontSize: 20 }}>→</span>
          </div>
        ))}
      </div>
    </div>
  )
}
