import { useState } from "react";

const footballers = [
  { name: "Lionel Messi", club: "Inter Miami", country: "Argentina", clubFlag: "🇺🇸", countryFlag: "🇦🇷", hints: ["Won 8 Ballon d'Or awards", "Scored 700+ career goals", "Currently plays in MLS, USA"] },
  { name: "Cristiano Ronaldo", club: "Al Nassr", country: "Portugal", clubFlag: "🇸🇦", countryFlag: "🇵🇹", hints: ["Won 5 UEFA Champions Leagues", "Scored 900+ career goals", "Currently plays in Saudi Arabia"] },
  { name: "Kylian Mbappé", club: "Real Madrid", country: "France", clubFlag: "🇪🇸", countryFlag: "🇫🇷", hints: ["Won the 2018 FIFA World Cup", "Fastest player at PSG", "Now plays in Spain for Los Blancos"] },
  { name: "Erling Haaland", club: "Man City", country: "Norway", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", countryFlag: "🇳🇴", hints: ["His father also played football", "Premier League top scorer record", "Plays in Manchester, England"] },
  { name: "Vinicius Jr", club: "Real Madrid", country: "Brazil", clubFlag: "🇪🇸", countryFlag: "🇧🇷", hints: ["Brazilian winger known for dribbling", "Won UCL in 2022 with his club", "Plays for the most decorated club in Europe"] },
  { name: "Jude Bellingham", club: "Real Madrid", country: "England", clubFlag: "🇪🇸", countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Moved from Borussia Dortmund to Spain", "One of England's best midfielders", "Wears the #5 shirt at the Bernabéu"] },
];

const topTeams = [
  { rank: 1, name: "Real Madrid", country: "Spain", flag: "🇪🇸", titles: 15, accent: "#00aaff" },
  { rank: 2, name: "AC Milan", country: "Italy", flag: "🇮🇹", titles: 7, accent: "#ff4455" },
  { rank: 3, name: "Bayern Munich", country: "Germany", flag: "🇩🇪", titles: 6, accent: "#ff6600" },
  { rank: 4, name: "Liverpool", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", titles: 6, accent: "#cc0022" },
  { rank: 5, name: "Barcelona", country: "Spain", flag: "🇪🇸", titles: 5, accent: "#aa00ff" },
  { rank: 6, name: "Ajax", country: "Netherlands", flag: "🇳🇱", titles: 4, accent: "#ff0033" },
  { rank: 7, name: "Man United", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", titles: 3, accent: "#dd1111" },
  { rank: 8, name: "Inter Milan", country: "Italy", flag: "🇮🇹", titles: 3, accent: "#0044ee" },
  { rank: 9, name: "Juventus", country: "Italy", flag: "🇮🇹", titles: 2, accent: "#888888" },
  { rank: 10, name: "Chelsea", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", titles: 2, accent: "#0066cc" },
];

const rankings = [
  { rank: 1, player: "Lionel Messi", country: "🇦🇷", club: "Inter Miami", clubFlag: "🇺🇸", goals: 837, assists: 380, trophies: 44 },
  { rank: 2, player: "Cristiano Ronaldo", country: "🇵🇹", club: "Al Nassr", clubFlag: "🇸🇦", goals: 901, assists: 250, trophies: 35 },
  { rank: 3, player: "Kylian Mbappé", country: "🇫🇷", club: "Real Madrid", clubFlag: "🇪🇸", goals: 345, assists: 180, trophies: 20 },
  { rank: 4, player: "Erling Haaland", country: "🇳🇴", club: "Man City", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", goals: 280, assists: 70, trophies: 12 },
  { rank: 5, player: "Vinicius Jr", country: "🇧🇷", club: "Real Madrid", clubFlag: "🇪🇸", goals: 150, assists: 110, trophies: 10 },
  { rank: 6, player: "Rodri", country: "🇪🇸", club: "Man City", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", goals: 40, assists: 95, trophies: 18 },
  { rank: 7, player: "Lamine Yamal", country: "🇪🇸", club: "Barcelona", clubFlag: "🇪🇸", goals: 55, assists: 60, trophies: 8 },
  { rank: 8, player: "Jude Bellingham", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", club: "Real Madrid", clubFlag: "🇪🇸", goals: 90, assists: 75, trophies: 9 },
  { rank: 9, player: "Phil Foden", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", club: "Man City", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", goals: 85, assists: 80, trophies: 14 },
  { rank: 10, player: "Harry Kane", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", club: "Bayern Munich", clubFlag: "🇩🇪", goals: 310, assists: 140, trophies: 5 },
];

const leaderboard = [
  { rank: 1, name: "SiamMaster", score: 9850, badge: "🏆", country: "🇹🇭" },
  { rank: 2, name: "FootballKing", score: 8720, badge: "🥈", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { rank: 3, name: "GoalScorer99", score: 7650, badge: "🥉", country: "🇧🇷" },
  { rank: 4, name: "TacticalGenius", score: 6540, badge: "⭐", country: "🇪🇸" },
  { rank: 5, name: "BallMaster", score: 5430, badge: "⭐", country: "🇦🇷" },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [hintIndex, setHintIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const f = footballers[currentIdx];

  const handleGuess = () => {
    if (!guess.trim()) return;
    const correct = guess.trim().toLowerCase() === f.name.toLowerCase();
    setResult(correct);
    setAnswered(true);
    if (correct) setScore(s => s + (3 - hintIndex) * 150);
  };

  const nextQuestion = () => {
    setCurrentIdx(i => (i + 1) % footballers.length);
    setGuess(""); setHintIndex(0); setResult(null); setAnswered(false);
  };

  return (
    <div style={s.app}>
      <div style={s.bg} />

      {/* HEADER */}
      <header style={s.header}>
        <div style={s.headerTop}>
          <div style={s.logo} onClick={() => setPage("home")}>
            <span style={{ fontSize: 44 }}>⚽</span>
            <div>
              <div style={s.logoTitle}>SIAM FOOTBALL IQ</div>
              <div style={s.logoSub}>The Ultimate Football Quiz</div>
            </div>
          </div>
          <div style={s.scorePill}>
            <div style={s.scoreLabel}>YOUR SCORE</div>
            <div style={s.scoreNum}>{score.toLocaleString()}</div>
          </div>
        </div>
        <nav style={s.nav}>
          {[
            { id: "home", label: "🏠 Home" },
            { id: "guess", label: "🎯 Guess Player" },
            { id: "teams", label: "🏆 Top Teams" },
            { id: "rankings", label: "📊 Rankings" },
            { id: "leaderboard", label: "🎖️ Leaderboard" },
          ].map(n => (
            <button key={n.id} style={{ ...s.navBtn, ...(page === n.id ? s.navActive : {}) }} onClick={() => setPage(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
      </header>

      <main style={s.main}>

        {/* HOME */}
        {page === "home" && (
          <div>
            <div style={s.hero}>
              <div style={s.heroBadge}>⚽ SEASON 2025/26 EDITION</div>
              <h1 style={s.heroTitle}>SIAM<br />FOOTBALL IQ</h1>
              <p style={s.heroDesc}>Challenge yourself with the ultimate football quiz. Guess players from clues, explore top clubs with flags, and battle for the top spot!</p>
            </div>
            <div style={s.grid4}>
              {[
                { icon: "🎯", title: "Guess the Footballer", desc: "Identify world-class players from clues and hints", page: "guess", accent: "#0099ff" },
                { icon: "🏆", title: "Top Teams", desc: "Champions League winners with country flags", page: "teams", accent: "#ffd700" },
                { icon: "📊", title: "Top 10 Rankings", desc: "Greatest players ranked with club & country flags", page: "rankings", accent: "#00ddaa" },
                { icon: "🎖️", title: "Leaderboard", desc: "Top quiz masters from around the world", page: "leaderboard", accent: "#ff6b35" },
              ].map(c => (
                <div key={c.page} style={{ ...s.card, borderTop: `5px solid ${c.accent}` }} onClick={() => setPage(c.page)}>
                  <div style={{ fontSize: 54, marginBottom: 14 }}>{c.icon}</div>
                  <div style={s.cardTitle}>{c.title}</div>
                  <div style={s.cardDesc}>{c.desc}</div>
                  <div style={{ ...s.cardCta, background: c.accent }}>Play Now →</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GUESS */}
        {page === "guess" && (
          <div>
            <h2 style={s.pageTitle}>🎯 Guess the Footballer</h2>
            <div style={s.quizCard}>
              <div style={s.quizMeta}>
                <span>Question <strong style={{ color: "#fff" }}>{currentIdx + 1}</strong> of {footballers.length}</span>
                <span>Score: <strong style={{ color: "#0099ff", fontSize: 20 }}>{score}</strong> pts</span>
              </div>
              <div style={s.hintsArea}>
                <div style={s.hintsLabel}>CLUES</div>
                {f.hints.slice(0, hintIndex + 1).map((h, i) => (
                  <div key={i} style={s.hintItem}>
                    <span style={s.hintNum}>{i + 1}</span>
                    <span style={{ fontSize: 19 }}>{h}</span>
                  </div>
                ))}
              </div>
              {!answered && hintIndex < f.hints.length - 1 && (
                <button style={s.hintBtn} onClick={() => setHintIndex(i => i + 1)}>
                  💡 Show Next Hint ({f.hints.length - 1 - hintIndex} remaining)
                </button>
              )}
              {!answered ? (
                <div style={s.inputRow}>
                  <input style={s.input} value={guess} onChange={e => setGuess(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleGuess()} placeholder="Type the player's full name..." autoFocus />
                  <button style={s.guessBtn} onClick={handleGuess}>GUESS ⚽</button>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ ...s.resultBanner, background: result ? "#072a12" : "#2a0707", border: `2px solid ${result ? "#00cc44" : "#cc0000"}` }}>
                    <div style={{ fontSize: 48 }}>{result ? "✅" : "❌"}</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: result ? "#00ff66" : "#ff4444" }}>
                      {result ? `CORRECT! +${(3 - hintIndex) * 150} pts` : "WRONG ANSWER!"}
                    </div>
                    <div style={{ fontSize: 22, marginTop: 8 }}>
                      Answer: <strong>{f.name}</strong> {f.countryFlag}
                    </div>
                    <div style={{ fontSize: 17, color: "#aaa", marginTop: 4 }}>
                      Club: {f.club} {f.clubFlag} &nbsp;|&nbsp; Country: {f.country} {f.countryFlag}
                    </div>
                  </div>
                  <button style={s.nextBtn} onClick={nextQuestion}>Next Player →</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TEAMS */}
        {page === "teams" && (
          <div>
            <h2 style={s.pageTitle}>🏆 Top Teams — Champions League Winners</h2>
            <div style={s.teamGrid}>
              {topTeams.map(t => (
                <div key={t.name} style={{ ...s.teamCard, boxShadow: `0 0 22px ${t.accent}22`, borderTop: `4px solid ${t.accent}` }}>
                  <div style={s.teamRankBadge}>#{t.rank}</div>
                  <div style={{ fontSize: 52, margin: "10px 0 6px" }}>{t.flag}</div>
                  <div style={{ ...s.teamName, color: t.accent }}>{t.name}</div>
                  <div style={s.teamCountry}>{t.country} {t.flag}</div>
                  <div style={s.teamTitles}>🏆 <strong>{t.titles}</strong> UCL Titles</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RANKINGS */}
        {page === "rankings" && (
          <div>
            <h2 style={s.pageTitle}>📊 Top 10 Player Rankings</h2>
            <div style={s.rankTable}>
              <div style={s.rankHead}>
                <span>Rank</span>
                <span>Player</span>
                <span>Nation</span>
                <span>Club</span>
                <span>⚽ Goals</span>
                <span>🎯 Assists</span>
                <span>🏆 Trophies</span>
              </div>
              {rankings.map(r => (
                <div key={r.rank} style={{ ...s.rankRow, background: r.rank <= 3 ? "rgba(0,100,255,0.07)" : "rgba(255,255,255,0.02)" }}>
                  <span style={{ fontSize: 26, fontWeight: 900, color: r.rank === 1 ? "#ffd700" : r.rank === 2 ? "#c0c0c0" : r.rank === 3 ? "#cd7f32" : "#444" }}>
                    {r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : `#${r.rank}`}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 18 }}>{r.player}</span>
                  <span style={{ fontSize: 30 }}>{r.country}</span>
                  <span style={{ fontSize: 15, color: "#889" }}>{r.club} {r.clubFlag}</span>
                  <span style={{ fontWeight: 800, fontSize: 20, color: "#0099ff" }}>{r.goals}</span>
                  <span style={{ fontWeight: 800, fontSize: 20, color: "#00ddaa" }}>{r.assists}</span>
                  <span style={{ fontWeight: 800, fontSize: 20, color: "#ffd700" }}>{r.trophies}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEADERBOARD */}
        {page === "leaderboard" && (
          <div>
            <h2 style={s.pageTitle}>🎖️ Global Leaderboard</h2>
            <div style={s.yourScoreBox}>
              Your Score: <strong style={{ color: "#0099ff", fontSize: 30 }}>{score.toLocaleString()}</strong> pts
            </div>
            <div style={s.leaderList}>
              {leaderboard.map(p => (
                <div key={p.rank} style={{ ...s.leaderRow, background: p.rank === 1 ? "rgba(255,215,0,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${p.rank === 1 ? "rgba(255,215,0,0.25)" : "rgba(255,255,255,0.07)"}` }}>
                  <span style={{ fontSize: 40 }}>{p.badge}</span>
                  <span style={{ fontSize: 32 }}>{p.country}</span>
                  <span style={{ flex: 1, fontWeight: 800, fontSize: 22 }}>{p.name}</span>
                  <span style={{ fontWeight: 900, fontSize: 26, color: "#0099ff" }}>
                    {p.score.toLocaleString()} <span style={{ fontSize: 14, color: "#445", fontWeight: 400 }}>pts</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <footer style={s.footer}>⚽ Siam Football IQ © 2026 — The Ultimate Football Quiz Experience</footer>
    </div>
  );
}

const s = {
  app: { minHeight: "100vh", background: "#060d1a", color: "#fff", fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative", overflowX: "hidden" },
  bg: { position: "fixed", inset: 0, backgroundImage: "radial-gradient(ellipse at 15% 50%, rgba(0,80,200,0.13) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(0,40,150,0.18) 0%, transparent 45%)", pointerEvents: "none", zIndex: 0 },
  header: { background: "rgba(4,12,30,0.97)", borderBottom: "2px solid #0055cc", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" },
  headerTop: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px" },
  logo: { display: "flex", alignItems: "center", gap: 14, cursor: "pointer" },
  logoTitle: { fontSize: 26, fontWeight: 900, color: "#0099ff", letterSpacing: 3, lineHeight: 1.1 },
  logoSub: { fontSize: 13, color: "#445", letterSpacing: 2, marginTop: 3 },
  scorePill: { background: "rgba(0,100,255,0.1)", border: "1px solid #0055cc", borderRadius: 14, padding: "10px 24px", textAlign: "center" },
  scoreLabel: { fontSize: 12, color: "#556", letterSpacing: 2 },
  scoreNum: { fontSize: 30, fontWeight: 900, color: "#0099ff", lineHeight: 1.2 },
  nav: { display: "flex", gap: 6, padding: "0 20px 14px", overflowX: "auto" },
  navBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#778", padding: "9px 20px", borderRadius: 24, cursor: "pointer", fontSize: 16, whiteSpace: "nowrap", transition: "all 0.2s", fontWeight: 500 },
  navActive: { background: "#0055cc", border: "1px solid #0099ff", color: "#fff", fontWeight: 700 },
  main: { position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "40px 20px 70px" },
  hero: { textAlign: "center", marginBottom: 56 },
  heroBadge: { display: "inline-block", background: "rgba(0,100,255,0.13)", border: "1px solid #0055cc", color: "#0099ff", padding: "9px 26px", borderRadius: 24, fontSize: 15, letterSpacing: 2, marginBottom: 26, fontWeight: 600 },
  heroTitle: { fontSize: "clamp(56px, 11vw, 92px)", fontWeight: 900, lineHeight: 1, margin: "0 0 22px", background: "linear-gradient(135deg, #0099ff 0%, #ffffff 65%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroDesc: { color: "#778", fontSize: 19, maxWidth: 580, margin: "0 auto", lineHeight: 1.75 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 22 },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 30, cursor: "pointer", transition: "transform 0.2s", textAlign: "center" },
  cardTitle: { fontSize: 21, fontWeight: 800, margin: "12px 0 10px", lineHeight: 1.3 },
  cardDesc: { color: "#667", fontSize: 16, marginBottom: 22, lineHeight: 1.65 },
  cardCta: { display: "inline-block", padding: "11px 26px", borderRadius: 24, color: "#000", fontWeight: 800, fontSize: 16 },
  pageTitle: { fontSize: 34, fontWeight: 900, marginBottom: 30, borderLeft: "5px solid #0099ff", paddingLeft: 18, lineHeight: 1.2 },
  quizCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 38 },
  quizMeta: { display: "flex", justifyContent: "space-between", fontSize: 18, color: "#667", marginBottom: 30 },
  hintsArea: { marginBottom: 26 },
  hintsLabel: { fontSize: 14, letterSpacing: 3, color: "#0099ff", marginBottom: 16, fontWeight: 700 },
  hintItem: { display: "flex", alignItems: "center", gap: 16, background: "rgba(0,100,255,0.07)", border: "1px solid rgba(0,100,255,0.18)", borderRadius: 14, padding: "15px 20px", marginBottom: 12 },
  hintNum: { background: "#0055cc", color: "#fff", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0 },
  hintBtn: { background: "transparent", border: "2px solid #ffd700", color: "#ffd700", padding: "11px 26px", borderRadius: 24, cursor: "pointer", marginBottom: 26, fontSize: 17, fontWeight: 600, display: "block" },
  inputRow: { display: "flex", gap: 14 },
  input: { flex: 1, background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "17px 22px", color: "#fff", fontSize: 19, outline: "none" },
  guessBtn: { background: "#0055cc", border: "none", borderRadius: 14, padding: "17px 30px", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 18, whiteSpace: "nowrap" },
  resultBanner: { borderRadius: 18, padding: "30px 24px", marginBottom: 22, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  nextBtn: { background: "transparent", border: "2px solid #0099ff", color: "#0099ff", padding: "13px 34px", borderRadius: 24, cursor: "pointer", fontSize: 19, fontWeight: 700 },
  teamGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 18 },
  teamCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 24, textAlign: "center" },
  teamRankBadge: { fontSize: 14, color: "#445", fontWeight: 700, letterSpacing: 1 },
  teamName: { fontSize: 21, fontWeight: 900, margin: "6px 0 4px" },
  teamCountry: { fontSize: 16, color: "#667", marginBottom: 14 },
  teamTitles: { fontSize: 17, color: "#ffd700", fontWeight: 700, padding: "9px 14px", background: "rgba(255,215,0,0.07)", borderRadius: 10 },
  rankTable: { background: "rgba(255,255,255,0.02)", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" },
  rankHead: { display: "grid", gridTemplateColumns: "70px 1fr 70px 1fr 100px 110px 120px", padding: "17px 24px", background: "rgba(0,100,255,0.1)", fontSize: 13, letterSpacing: 2, color: "#0099ff", fontWeight: 700, gap: 8 },
  rankRow: { display: "grid", gridTemplateColumns: "70px 1fr 70px 1fr 100px 110px 120px", padding: "17px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", gap: 8, alignItems: "center" },
  yourScoreBox: { textAlign: "center", fontSize: 22, color: "#667", marginBottom: 28, padding: "22px", background: "rgba(0,100,255,0.06)", borderRadius: 16, border: "1px solid rgba(0,100,255,0.14)" },
  leaderList: { display: "flex", flexDirection: "column", gap: 14 },
  leaderRow: { display: "flex", alignItems: "center", gap: 20, padding: "22px 30px", borderRadius: 18 },
  footer: { textAlign: "center", padding: "30px", color: "#223", fontSize: 15, borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 40 },
};
