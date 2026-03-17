import { useState } from 'react'

const PUZZLES = [
  {
    title: 'Club Connections',
    rows: ['Real Madrid', 'Barcelona', 'Man City'],
    cols: ['France 🇫🇷', 'Brazil 🇧🇷', 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿'],
    solutions: {
      '0-0': ['Mbappe','Benzema','Zidane','Camavinga'],
      '0-1': ['Vinicius','Rodrygo','Militao','Marcelo'],
      '0-2': ['Bellingham','Saka','Trent'],
      '1-0': ['Griezmann','Dembele','Coman'],
      '1-1': ['Neymar','Raphinha','Dani Alves'],
      '1-2': ['Sterling','Lineker','Gary Lineker'],
      '2-0': ['Mbappe','Giroud','Laporte'],
      '2-1': ['Ederson','Gabriel','Silva'],
      '2-2': ['Foden','Sterling','Walker']
    }
  },
  {
    title: 'PL Legends',
    rows: ['Arsenal', 'Liverpool', 'Chelsea'],
    cols: ['Scored 100+ PL Goals', 'World Cup Winner', 'Cost £50m+'],
    solutions: {
      '0-0': ['Thierry Henry','Ian Wright','Robin van Persie'],
      '0-1': ['Patrick Vieira','Robert Pires','Kolo Toure'],
      '0-2': ['Declan Rice','Nicolas Pepe','Kai Havertz'],
      '1-0': ['Robbie Fowler','Michael Owen','Steven Gerrard'],
      '1-1': ['Alisson','Fabinho','Roberto Firmino'],
      '1-2': ['Mohamed Salah','Virgil van Dijk','Darwin Nunez'],
      '2-0': ['Frank Lampard','Didier Drogba','John Terry'],
      '2-1': ['Didier Drogba','N\'Golo Kante','Willian'],
      '2-2': ['Romelu Lukaku','Kai Havertz','Enzo Fernandez']
    }
  },
  {
    title: 'International Stars',
    rows: ['UCL Winner', 'World Cup Winner', 'Ballon d\'Or Winner'],
    cols: ['Spanish 🇪🇸', 'German 🇩🇪', 'Portuguese 🇵🇹'],
    solutions: {
      '0-0': ['Isco','Modric','Benzema','Ramos','Casillas','Xavi','Iniesta'],
      '0-1': ['Muller','Klose','Lahm','Schweinsteiger','Neuer'],
      '0-2': ['Ronaldo','Eusebio','Figo'],
      '1-0': ['Iniesta','Xavi','Villa','Torres','Casillas'],
      '1-1': ['Muller','Klose','Lahm','Schweinsteiger'],
      '1-2': ['Ronaldo','Eusebio'],
      '2-0': ['Iniesta','Xavi','Zidane','Messi'],
      '2-1': ['Muller','Lahm'],
      '2-2': ['Ronaldo','Eusebio','Figo']
    }
  }
]

const TEAM_EMOJIS = {
  'Real Madrid': '⚪', 'Barcelona': '🔵', 'Man City': '🔵',
  'Arsenal': '🔴', 'Liverpool': '🔴', 'Chelsea': '🔵',
  'UCL Winner': '🏆', 'World Cup Winner': '🌍', 'Ballon d\'Or Winner': '🥇'
}

export default function GridDuel({ addScore }) {
  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const [mode, setMode] = useState(null) // 'solo' | 'cpu' | 'friend'
  const [board, setBoard] = useState(Array(9).fill(null)) // null | {player, mark}
  const [currentMark, setCurrentMark] = useState('X')
  const [activeCell, setActiveCell] = useState(null)
  const [inputVal, setInputVal] = useState('')
  const [wrongCell, setWrongCell] = useState(null)
  const [winner, setWinner] = useState(null)
  const [score, setScore] = useState({ X: 0, O: 0 })

  const puzzle = PUZZLES[puzzleIdx]

  const checkWin = (b, mark) => {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ]
    return wins.some(combo => combo.every(i => b[i]?.mark === mark))
  }

  const getCellKey = (row, col) => `${row}-${col}`

  const isCellValid = (row, col, playerName) => {
    const key = getCellKey(row, col)
    const solutions = puzzle.solutions[key] || []
    return solutions.some(s => s.toLowerCase() === playerName.toLowerCase().trim())
  }

  const cpuMove = (newBoard) => {
    const empty = newBoard.map((v, i) => v === null ? i : -1).filter(i => i !== -1)
    if (empty.length === 0) return

    // Try to win
    for (const i of empty) {
      const test = [...newBoard]
      const row = Math.floor(i / 3), col = i % 3
      const key = getCellKey(row, col)
      const solutions = puzzle.solutions[key] || []
      if (solutions.length > 0) {
        test[i] = { player: solutions[0], mark: 'O' }
        if (checkWin(test, 'O')) {
          finalizeMove(newBoard, i, solutions[0], 'O')
          return
        }
      }
    }

    // Block X
    for (const i of empty) {
      const test = [...newBoard]
      const row = Math.floor(i / 3), col = i % 3
      const key = getCellKey(row, col)
      const solutions = puzzle.solutions[key] || []
      if (solutions.length > 0) {
        test[i] = { player: solutions[0], mark: 'X' }
        if (checkWin(test, 'X')) {
          finalizeMove(newBoard, i, solutions[0], 'O')
          return
        }
      }
    }

    // Random valid move
    const validCells = empty.filter(i => {
      const row = Math.floor(i / 3), col = i % 3
      const key = getCellKey(row, col)
      return (puzzle.solutions[key] || []).length > 0
    })

    if (validCells.length > 0) {
      const i = validCells[Math.floor(Math.random() * validCells.length)]
      const row = Math.floor(i / 3), col = i % 3
      const key = getCellKey(row, col)
      const solutions = puzzle.solutions[key]
      finalizeMove(newBoard, i, solutions[0], 'O')
    }
  }

  const finalizeMove = (currentBoard, cellIdx, playerName, mark) => {
    const newBoard = [...currentBoard]
    newBoard[cellIdx] = { player: playerName, mark }
    setBoard(newBoard)

    if (checkWin(newBoard, mark)) {
      setWinner(mark)
      setScore(s => ({ ...s, [mark]: s[mark] + 1 }))
      addScore(mark === 'X' ? 50 : 0)
    } else if (newBoard.every(c => c !== null)) {
      setWinner('draw')
    }
  }

  const handleCellClick = (row, col) => {
    if (winner) return
    const idx = row * 3 + col
    if (board[idx]) return
    if (mode === 'cpu' && currentMark === 'O') return
    setActiveCell({ row, col, idx })
    setInputVal('')
  }

  const handleGuess = () => {
    if (!activeCell || !inputVal.trim()) return
    const { row, col, idx } = activeCell

    if (isCellValid(row, col, inputVal)) {
      const newBoard = [...board]
      newBoard[idx] = { player: inputVal, mark: currentMark }
      setBoard(newBoard)
      setActiveCell(null)
      setInputVal('')

      if (checkWin(newBoard, currentMark)) {
        setWinner(currentMark)
        setScore(s => ({ ...s, [currentMark]: s[currentMark] + 1 }))
        addScore(currentMark === 'X' ? 50 : 10)
        return
      }
      if (newBoard.every(c => c !== null)) {
        setWinner('draw')
        return
      }

      const nextMark = currentMark === 'X' ? 'O' : 'X'
      setCurrentMark(nextMark)

      if (mode === 'cpu' && nextMark === 'O') {
        setTimeout(() => cpuMove(newBoard), 600)
        setCurrentMark('X')
      }
    } else {
      setWrongCell(idx)
      setTimeout(() => setWrongCell(null), 1000)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentMark('X')
    setActiveCell(null)
    setInputVal('')
    setWinner(null)
    setWrongCell(null)
  }

  if (!mode) {
    return (
      <div>
        <div className="page-header">
          <h2>⚡ GRID DUEL</h2>
          <p>Name a footballer who fits both categories to claim the cell</p>
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32 }}>
          {[{m:'solo',icon:'🎯',label:'Solo',desc:'Fill all 9 cells alone'},
            {m:'cpu',icon:'🤖',label:'Vs CPU',desc:'You vs AI opponent'},
            {m:'friend',icon:'🆚',label:'Vs Friend',desc:'Pass and play locally'}
          ].map(({m, icon, label, desc}) => (
            <div key={m} className="card" style={{ cursor: 'pointer', flex: '1 1 160px', textAlign: 'center' }}
              onClick={() => { setMode(m); resetGame() }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, letterSpacing: 1 }}>{label}</div>
              <div style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ color: 'var(--text2)', marginBottom: 12, fontSize: 14 }}>Select puzzle:</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {PUZZLES.map((p, i) => (
              <button key={i} className={`tab ${puzzleIdx === i ? 'active' : ''}`} onClick={() => setPuzzleIdx(i)}>
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button className="back-btn" onClick={() => setMode(null)}>← Menu</button>
        <div style={{ display: 'flex', gap: 16 }}>
          <span style={{ color: 'var(--green)', fontFamily: 'Orbitron', fontSize: 14 }}>✕ {score.X}</span>
          {mode !== 'solo' && <span style={{ color: 'var(--red)', fontFamily: 'Orbitron', fontSize: 14 }}>○ {score.O}</span>}
        </div>
        <button className="btn btn-outline" onClick={resetGame} style={{ fontSize: 13, padding: '6px 12px' }}>🔄 Reset</button>
      </div>

      <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 1, marginBottom: 8, color: 'var(--green)' }}>
        {puzzle.title}
      </div>

      {!winner && (
        <div style={{ marginBottom: 12, color: 'var(--text2)', fontSize: 14 }}>
          {mode === 'solo' ? '🎯 Fill all cells' :
            mode === 'cpu' ? `Your turn (✕)` :
            `${currentMark === 'X' ? 'Player 1 (✕)' : 'Player 2 (○)'} — place your mark`}
        </div>
      )}

      {winner && (
        <div className="result-correct" style={{ marginBottom: 16 }}>
          {winner === 'draw' ? "🤝 Draw!" :
            mode === 'solo' ? "🎉 Board complete!" :
            winner === 'X' ? (mode === 'cpu' ? "🏆 You win! +50pts" : "🏆 Player 1 wins!") :
            mode === 'cpu' ? "🤖 CPU wins!" : "🏆 Player 2 wins!"}
          <button className="btn btn-outline" style={{ marginLeft: 16, fontSize: 13 }} onClick={resetGame}>Play Again</button>
        </div>
      )}

      {/* Board */}
      <div className="grid-board">
        {/* Top-left empty */}
        <div />
        {puzzle.cols.map((col, i) => (
          <div key={i} className="grid-header" style={{ fontSize: 13, padding: '8px 4px' }}>{col}</div>
        ))}
        {puzzle.rows.map((row, r) => (
          <>
            <div key={`row-${r}`} className="grid-header" style={{ fontSize: 13 }}>
              {TEAM_EMOJIS[row] || ''} {row}
            </div>
            {puzzle.cols.map((_, c) => {
              const idx = r * 3 + c
              const cell = board[idx]
              const isActive = activeCell?.idx === idx
              const isWrong = wrongCell === idx
              return (
                <div
                  key={`${r}-${c}`}
                  className={`grid-cell ${cell?.mark === 'X' ? 'taken-x' : cell?.mark === 'O' ? 'taken-o' : ''}`}
                  onClick={() => !cell && handleCellClick(r, c)}
                  style={{
                    border: isActive ? '2px solid var(--green)' : isWrong ? '2px solid var(--red)' : undefined,
                    flexDirection: 'column', gap: 4
                  }}
                >
                  {cell ? (
                    <>
                      <span className="cell-mark" style={{ color: cell.mark === 'X' ? 'var(--green)' : 'var(--red)' }}>
                        {cell.mark === 'X' ? '✕' : '○'}
                      </span>
                      <span className="cell-player" style={{ color: 'var(--text2)', fontSize: 10 }}>{cell.player}</span>
                    </>
                  ) : (
                    <span style={{ color: 'var(--border)', fontSize: 20 }}>+</span>
                  )}
                </div>
              )
            })}
          </>
        ))}
      </div>

      {/* Input modal */}
      {activeCell && !winner && (
        <div style={{ marginTop: 20 }} className="card">
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 16, marginBottom: 10, color: 'var(--text2)' }}>
            WHO FITS: {puzzle.rows[activeCell.row]} × {puzzle.cols[activeCell.col]}?
          </div>
          <div className="guess-input-wrap">
            <input
              className="guess-input"
              placeholder="Type footballer name..."
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGuess()}
              autoFocus
            />
            <button className="btn btn-green" onClick={handleGuess}>CONFIRM</button>
          </div>
          <button className="btn btn-outline" style={{ marginTop: 10 }} onClick={() => setActiveCell(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
