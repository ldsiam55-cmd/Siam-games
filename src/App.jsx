import { useState, useEffect, useRef } from "react";

/* ── Keyframe animations injected once ── */
const STYLES = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-18px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  15%      { transform: translateX(-10px); }
  30%      { transform: translateX(10px); }
  45%      { transform: translateX(-8px); }
  60%      { transform: translateX(8px); }
  75%      { transform: translateX(-4px); }
  90%      { transform: translateX(4px); }
}
@keyframes bounceIn {
  0%   { opacity: 0; transform: scale(0.3); }
  50%  { opacity: 1; transform: scale(1.15); }
  70%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}
@keyframes popIn {
  0%   { transform: scale(0.7); opacity: 0; }
  70%  { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); }
}
@keyframes pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(0,153,255,0.45); }
  50%      { box-shadow: 0 0 0 10px rgba(0,153,255,0); }
}
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
@keyframes float {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-6px); }
}
@keyframes correctFlash {
  0%   { background: rgba(0,204,68,0.25); }
  100% { background: rgba(7,42,18,1); }
}
@keyframes scorePop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.35); color: #ffd700; }
  100% { transform: scale(1); }
}
@keyframes confettiFall {
  0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(60px) rotate(360deg); opacity: 0; }
}
@keyframes progressGrow {
  from { width: 0%; }
}

/* Page wrapper */
.page-enter { animation: fadeInUp 0.38s cubic-bezier(.22,1,.36,1) both; }

/* Cards */
.game-card {
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  cursor: pointer;
}
.game-card:hover {
  transform: translateY(-6px) scale(1.015);
  box-shadow: 0 20px 48px rgba(0,100,255,0.18);
}
.game-card:active { transform: translateY(-2px) scale(0.99); }

/* Diff cards */
.diff-card {
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  cursor: pointer;
}
.diff-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 24px 52px rgba(0,0,0,0.4);
}

/* Nav buttons */
.nav-btn {
  transition: background 0.18s, color 0.18s, transform 0.12s;
}
.nav-btn:hover { transform: translateY(-1px); }
.nav-btn:active { transform: scale(0.96); }

/* Hint items */
.hint-item { animation: slideInLeft 0.32s cubic-bezier(.22,1,.36,1) both; }

/* Guess button */
.guess-btn {
  transition: transform 0.15s, filter 0.15s;
}
.guess-btn:hover  { filter: brightness(1.15); transform: scale(1.03); }
.guess-btn:active { transform: scale(0.96); }

/* Hint reveal button */
.hint-reveal-btn {
  transition: background 0.18s, border-color 0.18s, transform 0.12s;
}
.hint-reveal-btn:hover  { transform: scale(1.02); filter: brightness(1.1); }
.hint-reveal-btn:active { transform: scale(0.97); }

/* Action buttons */
.action-btn {
  transition: transform 0.15s, filter 0.15s, box-shadow 0.15s;
}
.action-btn:hover  { transform: translateY(-2px); filter: brightness(1.12); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
.action-btn:active { transform: scale(0.97); }

/* Shake on wrong */
.shake { animation: shake 0.52s ease both; }

/* Correct flash */
.correct-flash { animation: correctFlash 0.7s ease forwards; }

/* Big emoji bounce */
.bounce-in { animation: bounceIn 0.6s cubic-bezier(.22,1,.36,1) both; }

/* Score pop */
.score-pop { animation: scorePop 0.5s ease both; }

/* Score pill pulse when score changes */
.score-pill-pulse { animation: pulse 0.8s ease; }

/* Trophy float */
.trophy-float { animation: float 2.4s ease-in-out infinite; }

/* Leaderboard rows stagger */
.leader-row { animation: fadeInUp 0.35s both; }

/* Team cards stagger */
.team-card-anim { animation: fadeInUp 0.35s both; }

/* Input focus glow */
.quiz-input:focus {
  border-color: #0099ff !important;
  box-shadow: 0 0 0 3px rgba(0,153,255,0.2);
  outline: none;
}

/* Confetti particle */
.confetti-dot {
  position: absolute;
  width: 8px; height: 8px;
  border-radius: 50%;
  animation: confettiFall 0.9s ease-out forwards;
  pointer-events: none;
}
`;

/* ── Data ── */
const players = {
  easy: [
    { name: "Lionel Messi", club: "Inter Miami", clubFlag: "🇺🇸", country: "Argentina", countryFlag: "🇦🇷", hints: ["Won 8 Ballon d'Or awards — the most in history","Spent most of his career at Barcelona, Spain","He is from Rosario, Argentina","Currently plays in Major League Soccer, USA","His nickname is 'La Pulga' — The Flea"] },
    { name: "Cristiano Ronaldo", club: "Al Nassr", clubFlag: "🇸🇦", country: "Portugal", countryFlag: "🇵🇹", hints: ["Has scored over 900 career goals","Won 5 UEFA Champions League trophies","Born on the island of Madeira","Currently plays in Saudi Arabia","His son shares his name — Cristiano Jr."] },
    { name: "Kylian Mbappe", club: "Real Madrid", clubFlag: "🇪🇸", country: "France", countryFlag: "🇫🇷", hints: ["Won the FIFA World Cup with France in 2018","Was a teen sensation at AS Monaco","Spent years at Paris Saint-Germain","Now plays at Real Madrid in Spain","Famous for his blazing speed on the wing"] },
    { name: "Erling Haaland", club: "Man City", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "Norway", countryFlag: "🇳🇴", hints: ["His father Alfie also played professional football","Set Premier League single-season scoring records","Came from Borussia Dortmund to England","Plays for Manchester City","He is over 6 feet tall and known for his power"] },
    { name: "Neymar Jr", club: "Al Hilal", clubFlag: "🇸🇦", country: "Brazil", countryFlag: "🇧🇷", hints: ["Famous for his tricks and flamboyant style","Won the Champions League with Barcelona in 2015","Broke the world transfer record when he moved to PSG","Brazilian forward who now plays in Saudi Arabia","His full name is Neymar da Silva Santos Junior"] },
    { name: "Robert Lewandowski", club: "Barcelona", clubFlag: "🇪🇸", country: "Poland", countryFlag: "🇵🇱", hints: ["Scored 41 Bundesliga goals in a single season","Won multiple titles with Bayern Munich","He is the captain of the Polish national team","Now plays for Barcelona in La Liga","Known as one of the best pure strikers ever"] },
    { name: "Mohamed Salah", club: "Liverpool", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "Egypt", countryFlag: "🇪🇬", hints: ["Called 'The Egyptian King' by Liverpool fans","Won the Premier League and Champions League with his club","He is Egypt's all-time top scorer","Plays as a right winger for Liverpool","Famous for his curved left-footed goals"] },
    { name: "Karim Benzema", club: "Al Ittihad", clubFlag: "🇸🇦", country: "France", countryFlag: "🇫🇷", hints: ["Won the Ballon d'Or in 2022","Spent over a decade as Real Madrid's striker","Won 5 Champions League titles in his career","Now plays in Saudi Arabia","French striker of Algerian descent"] },
    { name: "Harry Kane", club: "Bayern Munich", clubFlag: "🇩🇪", country: "England", countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["England's all-time record goal scorer","Spent most of his career at Tottenham Hotspur","Moved to Germany to play in the Bundesliga","Known for his powerful shooting and link-up play","Won the 2024 Bundesliga top scorer award"] },
    { name: "Vinicius Jr", club: "Real Madrid", clubFlag: "🇪🇸", country: "Brazil", countryFlag: "🇧🇷", hints: ["Brazilian winger famous for his dribbling skills","Won the Champions League final man of the match in 2022","Joined Real Madrid as a teenager from Flamengo","Plays on the left wing at the Bernabeu","Strong anti-racism advocate in football"] },
  ],
  medium: [
    { name: "Jude Bellingham", club: "Real Madrid", clubFlag: "🇪🇸", country: "England", countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Started his career at Birmingham City aged 16","Moved to Borussia Dortmund before Real Madrid","One of the youngest players to captain England","Plays central midfield but scores many goals","Wears the famous number 5 shirt at Real Madrid"] },
    { name: "Lamine Yamal", club: "Barcelona", clubFlag: "🇪🇸", country: "Spain", countryFlag: "🇪🇸", hints: ["Born on the same day Spain won Euro 2008","The youngest ever player to debut for Spain","Plays as a right winger for his club","Won Euro 2024 with Spain as a 16-year-old","Plays for the same club his idol Messi was at"] },
    { name: "Phil Foden", club: "Man City", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England", countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Nicknamed The Stockport Iniesta","Has been at his club since age 4","Won 6 Premier League titles","Part of Man City's treble-winning squad in 2023","Scored the winner in Euro 2024 group stages"] },
    { name: "Rodri", club: "Man City", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "Spain", countryFlag: "🇪🇸", hints: ["Won the Ballon d'Or in 2024","Defensive midfielder known for his passing range","Won Euro 2024 with Spain","Plays for Pep Guardiola at his current club","Previously played for Atletico Madrid"] },
    { name: "Bukayo Saka", club: "Arsenal", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England", countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Came through the youth ranks of his current club","Named Arsenal player of the season multiple times","Plays right wing for club and country","Nigerian heritage, born in London","Missed a penalty in Euro 2020 final for England"] },
    { name: "Pedri", club: "Barcelona", clubFlag: "🇪🇸", country: "Spain", countryFlag: "🇪🇸", hints: ["Won the Golden Boy award in 2021","Compared to Andres Iniesta for his style of play","Joined Barcelona from Las Palmas","Central midfielder from the Canary Islands","Won Euro 2024 with the Spanish national team"] },
    { name: "Bernardo Silva", club: "Man City", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "Portugal", countryFlag: "🇵🇹", hints: ["Voted Man City's player of the season twice","Joined Man City from AS Monaco in 2017","Known for tireless pressing and technical skill","Portuguese attacking midfielder","Was part of Man City's historic treble in 2023"] },
    { name: "Virgil van Dijk", club: "Liverpool", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "Netherlands", countryFlag: "🇳🇱", hints: ["Considered one of the greatest defenders ever","Came second in the 2019 Ballon d'Or","Moved from Southampton to Liverpool for a then-record fee","Captain of the Netherlands national team","Plays as a central defender at Anfield"] },
    { name: "Kevin De Bruyne", club: "Man City", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "Belgium", countryFlag: "🇧🇪", hints: ["Often called the best midfielder in the world","Flopped at Chelsea before becoming a star","Belgian playmaker with exceptional vision","Has won 6 Premier League titles","Set multiple Premier League assist records"] },
    { name: "Trent Alexander-Arnold", club: "Real Madrid", clubFlag: "🇪🇸", country: "England", countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Grew up as a Liverpool fan before joining their academy","Known as a right back who plays like a midfielder","Set records for assists from a defensive position","Left Liverpool in 2025 after a trophy-laden stint","Now plays for the most decorated club in Europe"] },
  ],
  hard: [
    { name: "Jamal Musiala", club: "Bayern Munich", clubFlag: "🇩🇪", country: "Germany", countryFlag: "🇩🇪", hints: ["Born in Stuttgart but grew up in England","Chose to represent Germany over England","Attacking midfielder at Bayern Munich","Won the Bundesliga multiple times before age 22","Known for his quick feet in tight spaces"] },
    { name: "Florian Wirtz", club: "Bayer Leverkusen", clubFlag: "🇩🇪", country: "Germany", countryFlag: "🇩🇪", hints: ["Helped his club win the Bundesliga unbeaten in 2024","Plays for a club from a pharmaceutical city in Germany","Young attacking midfielder dubbed Germany's best talent","Suffered an ACL injury in 2022 but bounced back","Plays for the Werkself — Factory Eleven"] },
    { name: "Raphinha", club: "Barcelona", clubFlag: "🇪🇸", country: "Brazil", countryFlag: "🇧🇷", hints: ["Played for Leeds United in the Premier League","Barcelona beat several clubs to sign him in 2022","Brazilian right winger with direct style","Became a key player at Camp Nou after slow start","His full name is Raphael Dias Belloli"] },
    { name: "Ruben Dias", club: "Man City", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "Portugal", countryFlag: "🇵🇹", hints: ["Won the Premier League Player of the Year in 2021","Signed from Benfica for around 65 million pounds","Portuguese central defender","Transformed Man City's defence after his arrival","Often partners John Stones at the back"] },
    { name: "Federico Valverde", club: "Real Madrid", clubFlag: "🇪🇸", country: "Uruguay", countryFlag: "🇺🇾", hints: ["Nicknamed El Pajarito — The Little Bird","Born in Montevideo, South America","Box-to-box midfielder with incredible stamina","Won multiple Champions League medals","Once made a famous last-ditch tackle in the Super Cup"] },
    { name: "Gavi", club: "Barcelona", clubFlag: "🇪🇸", country: "Spain", countryFlag: "🇪🇸", hints: ["Won the Golden Boy award in 2022","Came through La Masia — Barcelona's famous academy","Plays as a central midfielder with high energy","Won Euro 2024 with Spain","His full name is Pablo Martin Paez Gavira"] },
    { name: "Marcus Rashford", club: "Aston Villa", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "England", countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", hints: ["Scored on his debut for Manchester United in 2016","Campaigned for free school meals for children in the UK","Left Man United in 2025 after a difficult final season","Now plays in the Midlands, England","Fast left-footed forward from Manchester"] },
    { name: "Enzo Fernandez", club: "Chelsea", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "Argentina", countryFlag: "🇦🇷", hints: ["Won the World Cup with Argentina in 2022","Named the best young player at that World Cup","Moved from Benfica to London for a British transfer record","Central midfielder with excellent passing ability","Plays for the Blues at Stamford Bridge"] },
    { name: "Khvicha Kvaratskhelia", club: "PSG", clubFlag: "🇫🇷", country: "Georgia", countryFlag: "🇬🇪", hints: ["Nicknamed Kvaradona by Napoli fans","Helped Napoli win Serie A in 2023 for first time in 33 years","Left-footed winger from the Caucasus region","Moved to Paris in January 2025","His country Georgia qualified for Euro 2024 for first time"] },
    { name: "Alejandro Garnacho", club: "Man United", clubFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "Argentina", countryFlag: "🇦🇷", hints: ["Born in Spain but chose to represent Argentina","Scored a spectacular overhead kick in 2023","Plays as a left winger at Old Trafford","Part of Argentina's 2024 Copa America squad","Wears the number 11 shirt at his club"] },
  ],
};

const topTeams = [
  { rank: 1, name: "Real Madrid", country: "Spain", flag: "🇪🇸", titles: 15, accent: "#00aaff" },
  { rank: 2, name: "AC Milan", country: "Italy", flag: "🇮🇹", titles: 7, accent: "#ff4455" },
  { rank: 3, name: "Bayern Munich", country: "Germany", flag: "🇩🇪", titles: 6, accent: "#ff6600" },
  { rank: 4, name: "Liverpool", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", titles: 6, accent: "#cc0022" },
  { rank: 5, name: "Barcelona", country: "Spain", flag: "🇪🇸", titles: 5, accent: "#aa00ff" },
  { rank: 6, name: "Ajax", country: "Netherlands", flag: "🇳🇱", titles: 4, accent: "#ff0033" },
  { rank: 7, name: "Man United", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", titles: 3, accent: "#dd1111" },
  { rank: 8, name: "Inter Milan", country: "Italy", flag: "🇮🇹", titles: 3, accent: "#0044ee" },
  { rank: 9, name: "Juventus", country: "Italy", flag: "🇮🇹", titles: 2, accent: "#888" },
  { rank: 10, name: "Chelsea", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", titles: 2, accent: "#0066cc" },
];

const rankings = [
  { rank: 1, player: "Lionel Messi", country: "🇦🇷", club: "Inter Miami", clubFlag: "🇺🇸", goals: 837, assists: 380, trophies: 44 },
  { rank: 2, player: "Cristiano Ronaldo", country: "🇵🇹", club: "Al Nassr", clubFlag: "🇸🇦", goals: 901, assists: 250, trophies: 35 },
  { rank: 3, player: "Kylian Mbappe", country: "🇫🇷", club: "Real Madrid", clubFlag: "🇪🇸", goals: 345, assists: 180, trophies: 20 },
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

const POINTS = [100, 75, 50, 25];
const DIFF = {
  easy:   { label: "Easy",   emoji: "🟢", color: "#00cc55", desc: "Well-known world stars — perfect to start!" },
  medium: { label: "Medium", emoji: "🟡", color: "#ffcc00", desc: "Premier League and European stars" },
  hard:   { label: "Hard",   emoji: "🔴", color: "#ff4444", desc: "Only true football experts will know these!" },
};

/* ── Animated score counter ── */
function AnimatedScore({ value }) {
  const [displayed, setDisplayed] = useState(value);
  const [popping, setPopping] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value === prevRef.current) return;
    const diff = value - prevRef.current;
    const steps = 20;
    const stepVal = diff / steps;
    let step = 0;
    setPopping(true);
    const id = setInterval(() => {
      step++;
      setDisplayed(Math.round(prevRef.current + stepVal * step));
      if (step >= steps) {
        clearInterval(id);
        setDisplayed(value);
        prevRef.current = value;
        setTimeout(() => setPopping(false), 400);
      }
    }, 18);
    return () => clearInterval(id);
  }, [value]);

  return (
    <span className={popping ? "score-pop" : ""} style={{ display: "inline-block" }}>
      {displayed.toLocaleString()}
    </span>
  );
}

/* ── Confetti burst ── */
function Confetti() {
  const colors = ["#ffd700","#0099ff","#00cc55","#ff6b35","#ff44aa","#ffffff"];
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${10 + Math.random() * 80}%`,
    delay: `${Math.random() * 0.4}s`,
    size: `${6 + Math.random() * 6}px`,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {dots.map(d => (
        <div key={d.id} className="confetti-dot" style={{
          left: d.left, top: "10%",
          width: d.size, height: d.size,
          background: d.color,
          animationDelay: d.delay,
        }} />
      ))}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [pageKey, setPageKey] = useState(0);
  const [difficulty, setDifficulty] = useState(null);
  const [quizPhase, setQuizPhase] = useState("select");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hintIdx, setHintIdx] = useState(0);
  const [guess, setGuess] = useState("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scorePillPulse, setScorePillPulse] = useState(false);

  const startQuiz = (diff) => {
    setDifficulty(diff); setQuizPhase("playing");
    setCurrentIdx(0); setHintIdx(0); setGuess("");
    setAnswered(false); setCorrect(false); setRoundScore(0);
    setPageKey(k => k + 1);
  };

  const resetQuiz = () => { setDifficulty(null); setQuizPhase("select"); setPageKey(k => k + 1); };

  const handleGuess = () => {
    if (!guess.trim() || answered) return;
    const p = players[difficulty][currentIdx];
    const isCorrect = guess.trim().toLowerCase() === p.name.toLowerCase();
    setCorrect(isCorrect);
    setAnswered(true);
    if (isCorrect) {
      const pts = POINTS[hintIdx];
      setRoundScore(s => s + pts);
      setTotalScore(s => s + pts);
      setShowConfetti(true);
      setScorePillPulse(true);
      setTimeout(() => { setShowConfetti(false); setScorePillPulse(false); }, 1000);
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      setTimeout(() => setQuizPhase("gameover"), 600);
    }
  };

  const nextQuestion = () => {
    const list = players[difficulty];
    if (currentIdx + 1 >= list.length) { setQuizPhase("complete"); return; }
    setCurrentIdx(i => i + 1); setHintIdx(0);
    setGuess(""); setAnswered(false); setCorrect(false);
    setPageKey(k => k + 1);
  };

  const goTo = (p) => {
    setPage(p);
    setPageKey(k => k + 1);
    if (p === "guess") { setQuizPhase("select"); setDifficulty(null); }
  };

  const cp = difficulty ? players[difficulty][currentIdx] : null;
  const d = difficulty ? DIFF[difficulty] : null;

  return (
    <div style={s.app}>
      <style>{STYLES}</style>
      <div style={s.bg} />

      <header style={s.header}>
        <div style={s.headerTop}>
          <div style={s.logo} onClick={() => goTo("home")}>
            <span style={{ fontSize: 42, animation: "float 2.4s ease-in-out infinite" }}>⚽</span>
            <div>
              <div style={s.logoTitle}>SIAM FOOTBALL IQ</div>
              <div style={s.logoSub}>The Ultimate Football Quiz</div>
            </div>
          </div>
          <div style={s.scorePill} className={scorePillPulse ? "score-pill-pulse" : ""}>
            <div style={s.scoreLabel}>TOTAL SCORE</div>
            <div style={s.scoreNum}><AnimatedScore value={totalScore} /></div>
          </div>
        </div>
        <nav style={s.nav}>
          {[
            {id:"home",label:"🏠 Home"},
            {id:"guess",label:"🎯 Guess Player"},
            {id:"teams",label:"🏆 Top Teams"},
            {id:"rankings",label:"📊 Rankings"},
            {id:"leaderboard",label:"🎖️ Leaderboard"},
          ].map(n => (
            <button
              key={n.id}
              className="nav-btn"
              style={{...s.navBtn,...(page===n.id?s.navActive:{})}}
              onClick={() => goTo(n.id)}
            >{n.label}</button>
          ))}
        </nav>
      </header>

      <main style={s.main}>
        <div key={pageKey} className="page-enter">

          {/* ── HOME ── */}
          {page === "home" && (
            <div>
              <div style={s.hero}>
                <div style={s.heroBadge}>⚽ SEASON 2025/26 EDITION</div>
                <h1 style={s.heroTitle}>SIAM<br />FOOTBALL IQ</h1>
                <p style={s.heroDesc}>Challenge yourself with the ultimate football quiz. 30 players across 3 difficulty levels — can you get them all?</p>
              </div>
              <div style={s.grid4}>
                {[
                  {icon:"🎯",title:"Guess the Footballer",desc:"Easy, Medium & Hard — 30 players, 5 hints each",page:"guess",accent:"#0099ff"},
                  {icon:"🏆",title:"Top Teams",desc:"Champions League winners with country flags",page:"teams",accent:"#ffd700"},
                  {icon:"📊",title:"Top 10 Rankings",desc:"Greatest players with club and country flags",page:"rankings",accent:"#00ddaa"},
                  {icon:"🎖️",title:"Leaderboard",desc:"Top quiz masters from around the world",page:"leaderboard",accent:"#ff6b35"},
                ].map((c, i) => (
                  <div
                    key={c.page}
                    className="game-card"
                    style={{...s.card, borderTop:`5px solid ${c.accent}`, animationDelay:`${i*0.07}s`, animation:`fadeInUp 0.38s ${i*0.07}s both`}}
                    onClick={() => goTo(c.page)}
                  >
                    <div style={{fontSize:52,marginBottom:14}}>{c.icon}</div>
                    <div style={s.cardTitle}>{c.title}</div>
                    <div style={s.cardDesc}>{c.desc}</div>
                    <div style={{...s.cardCta,background:c.accent,transition:"transform 0.15s",display:"inline-block",padding:"11px 26px",borderRadius:24,color:"#000",fontWeight:800,fontSize:16}}>Play Now →</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── GUESS ── */}
          {page === "guess" && (
            <>
              {quizPhase === "select" && (
                <div>
                  <h2 style={s.pageTitle}>🎯 Guess the Footballer</h2>
                  <p style={{color:"#778",fontSize:18,marginBottom:32}}>
                    Choose your difficulty. Each level has <strong style={{color:"#fff"}}>10 players</strong> with <strong style={{color:"#fff"}}>5 hints</strong> each.
                    A wrong answer means <strong style={{color:"#ff4444"}}>Game Over!</strong>
                  </p>
                  <div style={s.scoringBox}>
                    <div style={s.scoringTitle}>🏅 SCORING — How many hints did you need?</div>
                    <div style={s.scoringGrid}>
                      {POINTS.map((pts,i) => (
                        <div key={i} style={s.scoringItem}>
                          <div style={s.scoringHint}>Hint {i+1}</div>
                          <div style={{...s.scoringPts,color:i===0?"#ffd700":i===1?"#0099ff":i===2?"#00ddaa":"#ff9900"}}>{pts} pts</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={s.diffGrid}>
                    {Object.entries(DIFF).map(([key,cfg],i) => (
                      <div
                        key={key}
                        className="diff-card"
                        style={{...s.diffCard, borderTop:`5px solid ${cfg.color}`, animation:`fadeInUp 0.38s ${i*0.1}s both`}}
                        onClick={() => startQuiz(key)}
                      >
                        <div style={{fontSize:54,marginBottom:12}}>{cfg.emoji}</div>
                        <div style={{...s.diffLabel,color:cfg.color}}>{cfg.label}</div>
                        <div style={s.diffDesc}>{cfg.desc}</div>
                        <div style={s.diffSub}>10 Players · 5 Hints each</div>
                        <div style={{...s.cardCta,background:cfg.color,marginTop:22}}>Start {cfg.label} →</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {quizPhase === "playing" && cp && (
                <div>
                  <div style={s.quizHeader}>
                    <div>
                      <h2 style={{...s.pageTitle,marginBottom:4}}>🎯 {d.label} Mode {d.emoji}</h2>
                      <div style={{color:"#778",fontSize:17}}>Player <strong style={{color:"#fff"}}>{currentIdx+1}</strong> of {players[difficulty].length}</div>
                    </div>
                    <div style={s.quizScoreBox}>
                      <div style={{fontSize:12,color:"#556",letterSpacing:2}}>ROUND SCORE</div>
                      <div style={{fontSize:30,fontWeight:900,color:d.color}}><AnimatedScore value={roundScore} /></div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={s.progressBar}>
                    <div style={{
                      ...s.progressFill,
                      width:`${((currentIdx)/players[difficulty].length)*100}%`,
                      background:`linear-gradient(90deg, ${d.color}88, ${d.color})`,
                    }} />
                  </div>

                  <div className={shaking ? "shake" : ""} style={{position:"relative"}}>
                    {showConfetti && <Confetti />}
                    <div style={s.quizCard}>
                      <div style={s.hintsLabel}>HINTS REVEALED: {hintIdx+1} / {cp.hints.length}</div>
                      <div style={s.hintsArea}>
                        {cp.hints.slice(0,hintIdx+1).map((h,i) => (
                          <div
                            key={`${currentIdx}-${i}`}
                            className="hint-item"
                            style={{...s.hintItem, borderColor:i===hintIdx?d.color:"rgba(0,100,255,0.18)", animationDelay:`${i===hintIdx ? 0 : 0}s`}}
                          >
                            <span style={{...s.hintNum,background:d.color}}>{i+1}</span>
                            <span style={{fontSize:19,flex:1}}>{h}</span>
                            <span style={s.hintPts}>+{POINTS[i]}pts</span>
                          </div>
                        ))}
                      </div>

                      {!answered && hintIdx < cp.hints.length-1 && (
                        <button
                          className="hint-reveal-btn"
                          style={{...s.hintBtn,borderColor:d.color,color:d.color}}
                          onClick={() => setHintIdx(i => i+1)}
                        >
                          👁️ Reveal Hint {hintIdx+2} — Correct answer worth <strong>{POINTS[hintIdx+1]} pts</strong>
                        </button>
                      )}

                      {!answered ? (
                        <div style={s.inputRow}>
                          <input
                            className="quiz-input"
                            style={s.input}
                            value={guess}
                            onChange={e => setGuess(e.target.value)}
                            onKeyDown={e => e.key==="Enter" && handleGuess()}
                            placeholder="Type the player's full name..."
                            autoFocus
                          />
                          <button className="guess-btn action-btn" style={{...s.guessBtn,background:d.color}} onClick={handleGuess}>GUESS ⚽</button>
                        </div>
                      ) : correct ? (
                        <div style={{textAlign:"center"}}>
                          <div className="correct-flash" style={{...s.resultBanner,border:"2px solid #00cc44"}}>
                            <div className="bounce-in" style={{fontSize:52}}>✅</div>
                            <div style={{fontSize:30,fontWeight:900,color:"#00ff66",animation:"popIn 0.4s ease both"}}>CORRECT! +{POINTS[hintIdx]} pts</div>
                            <div style={{fontSize:20,marginTop:8}}>{cp.name} {cp.countryFlag}</div>
                            <div style={{fontSize:16,color:"#aaa",marginTop:4}}>{cp.club} {cp.clubFlag} · {cp.country} {cp.countryFlag}</div>
                          </div>
                          <button className="action-btn" style={s.nextBtn} onClick={nextQuestion}>
                            {currentIdx+1 < players[difficulty].length ? "Next Player →" : "See Results 🏆"}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}

              {quizPhase === "gameover" && cp && (
                <div style={{textAlign:"center",padding:"40px 20px"}}>
                  <div className="bounce-in" style={{fontSize:80}}>💀</div>
                  <h2 style={{fontSize:44,fontWeight:900,color:"#ff4444",margin:"16px 0",animation:"popIn 0.45s 0.2s both"}}>GAME OVER!</h2>
                  <p style={{fontSize:22,color:"#778",marginBottom:8}}>Wrong answer — better luck next time!</p>
                  <div style={{...s.resultBox,animation:"fadeInUp 0.4s 0.3s both"}}>
                    <div style={{fontSize:18,color:"#aaa",marginBottom:8}}>The answer was:</div>
                    <div style={{fontSize:32,fontWeight:900}}>{cp.name} {cp.countryFlag}</div>
                    <div style={{fontSize:18,color:"#778",marginTop:6}}>{cp.club} {cp.clubFlag} · {cp.country}</div>
                    <div style={{marginTop:24,fontSize:22,color:"#0099ff"}}>Score this round: <strong>{roundScore}</strong> pts</div>
                    <div style={{fontSize:17,color:"#556"}}>Players completed: {currentIdx} / {players[difficulty].length}</div>
                  </div>
                  <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:30,flexWrap:"wrap",animation:"fadeInUp 0.4s 0.5s both"}}>
                    <button className="action-btn" style={s.retryBtn} onClick={() => startQuiz(difficulty)}>🔄 Try Again</button>
                    <button className="action-btn" style={s.changeDiffBtn} onClick={resetQuiz}>🎯 Change Difficulty</button>
                  </div>
                </div>
              )}

              {quizPhase === "complete" && (
                <div style={{textAlign:"center",padding:"40px 20px"}}>
                  <div className="bounce-in trophy-float" style={{fontSize:80}}>🏆</div>
                  <h2 style={{fontSize:44,fontWeight:900,color:"#ffd700",margin:"16px 0",animation:"popIn 0.45s 0.2s both"}}>COMPLETED!</h2>
                  <p style={{fontSize:22,color:"#778",animation:"fadeIn 0.5s 0.35s both",opacity:0}}>You finished {d.label} mode without a single mistake!</p>
                  <div style={{...s.resultBox,animation:"fadeInUp 0.45s 0.45s both",position:"relative",overflow:"hidden"}}>
                    <Confetti />
                    <div style={{fontSize:20,color:"#aaa"}}>Final Score</div>
                    <div className="score-pop" style={{fontSize:60,fontWeight:900,color:d.color,margin:"10px 0"}}>{roundScore}</div>
                    <div style={{fontSize:18,color:"#778"}}>pts from {players[difficulty].length} players</div>
                  </div>
                  <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:30,flexWrap:"wrap",animation:"fadeInUp 0.4s 0.6s both"}}>
                    <button className="action-btn" style={s.retryBtn} onClick={() => startQuiz(difficulty)}>🔄 Play Again</button>
                    <button className="action-btn" style={s.changeDiffBtn} onClick={resetQuiz}>🎯 Change Difficulty</button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── TEAMS ── */}
          {page === "teams" && (
            <div>
              <h2 style={s.pageTitle}>🏆 Top Teams — Champions League Winners</h2>
              <div style={s.teamGrid}>
                {topTeams.map((t,i) => (
                  <div
                    key={t.name}
                    className="game-card team-card-anim"
                    style={{...s.teamCard, borderTop:`4px solid ${t.accent}`, boxShadow:`0 0 20px ${t.accent}22`, animationDelay:`${i*0.05}s`}}
                  >
                    <div style={s.teamRankBadge}>#{t.rank}</div>
                    <div style={{fontSize:52,margin:"10px 0 6px"}}>{t.flag}</div>
                    <div style={{...s.teamName,color:t.accent}}>{t.name}</div>
                    <div style={s.teamCountry}>{t.country} {t.flag}</div>
                    <div style={s.teamTitles}>🏆 <strong>{t.titles}</strong> UCL Titles</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RANKINGS ── */}
          {page === "rankings" && (
            <div>
              <h2 style={s.pageTitle}>📊 Top 10 Player Rankings</h2>
              <div style={s.rankTable}>
                <div style={s.rankHead}>
                  <span>Rank</span><span>Player</span><span>Nation</span><span>Club</span>
                  <span>⚽ Goals</span><span>🎯 Assists</span><span>🏆 Trophies</span>
                </div>
                {rankings.map((r,i) => (
                  <div
                    key={r.rank}
                    style={{
                      ...s.rankRow,
                      background: r.rank<=3 ? "rgba(0,100,255,0.07)" : "rgba(255,255,255,0.02)",
                      animation: `fadeInUp 0.32s ${i*0.05}s both`,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(0,100,255,0.12)"}
                    onMouseLeave={e => e.currentTarget.style.background=r.rank<=3?"rgba(0,100,255,0.07)":"rgba(255,255,255,0.02)"}
                  >
                    <span style={{fontSize:26,fontWeight:900,color:r.rank===1?"#ffd700":r.rank===2?"#c0c0c0":r.rank===3?"#cd7f32":"#444"}}>
                      {r.rank===1?"🥇":r.rank===2?"🥈":r.rank===3?"🥉":`#${r.rank}`}
                    </span>
                    <span style={{fontWeight:700,fontSize:18}}>{r.player}</span>
                    <span style={{fontSize:28}}>{r.country}</span>
                    <span style={{fontSize:15,color:"#889"}}>{r.club} {r.clubFlag}</span>
                    <span style={{fontWeight:800,fontSize:20,color:"#0099ff"}}>{r.goals}</span>
                    <span style={{fontWeight:800,fontSize:20,color:"#00ddaa"}}>{r.assists}</span>
                    <span style={{fontWeight:800,fontSize:20,color:"#ffd700"}}>{r.trophies}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LEADERBOARD ── */}
          {page === "leaderboard" && (
            <div>
              <h2 style={s.pageTitle}>🎖️ Global Leaderboard</h2>
              <div style={s.yourScoreBox}>
                Your Total Score: <strong style={{color:"#0099ff",fontSize:30}}><AnimatedScore value={totalScore} /></strong> pts
              </div>
              <div style={s.leaderList}>
                {leaderboard.map((p,i) => (
                  <div
                    key={p.rank}
                    className="leader-row"
                    style={{
                      ...s.leaderRow,
                      background: p.rank===1?"rgba(255,215,0,0.07)":"rgba(255,255,255,0.03)",
                      border: `1px solid ${p.rank===1?"rgba(255,215,0,0.25)":"rgba(255,255,255,0.07)"}`,
                      animationDelay: `${i*0.08}s`,
                      transition: "transform 0.18s, box-shadow 0.18s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateX(6px)"; e.currentTarget.style.boxShadow="0 4px 24px rgba(0,100,255,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
                  >
                    <span style={{fontSize:38}}>{p.badge}</span>
                    <span style={{fontSize:30}}>{p.country}</span>
                    <span style={{flex:1,fontWeight:800,fontSize:22}}>{p.name}</span>
                    <span style={{fontWeight:900,fontSize:26,color:"#0099ff"}}>{p.score.toLocaleString()} <span style={{fontSize:13,color:"#445",fontWeight:400}}>pts</span></span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <footer style={s.footer}>⚽ Siam Football IQ © 2026 — The Ultimate Football Quiz Experience</footer>
    </div>
  );
}

const s = {
  app:{minHeight:"100vh",background:"#060d1a",color:"#fff",fontFamily:"'Segoe UI',system-ui,sans-serif",position:"relative",overflowX:"hidden"},
  bg:{position:"fixed",inset:0,backgroundImage:"radial-gradient(ellipse at 15% 50%, rgba(0,80,200,0.13) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(0,40,150,0.18) 0%, transparent 45%)",pointerEvents:"none",zIndex:0},
  header:{background:"rgba(4,12,30,0.97)",borderBottom:"2px solid #0055cc",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(12px)"},
  headerTop:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 28px"},
  logo:{display:"flex",alignItems:"center",gap:14,cursor:"pointer"},
  logoTitle:{fontSize:24,fontWeight:900,color:"#0099ff",letterSpacing:3,lineHeight:1.1},
  logoSub:{fontSize:12,color:"#445",letterSpacing:2,marginTop:3},
  scorePill:{background:"rgba(0,100,255,0.1)",border:"1px solid #0055cc",borderRadius:14,padding:"10px 24px",textAlign:"center"},
  scoreLabel:{fontSize:12,color:"#556",letterSpacing:2},
  scoreNum:{fontSize:28,fontWeight:900,color:"#0099ff",lineHeight:1.2},
  nav:{display:"flex",gap:6,padding:"0 20px 14px",overflowX:"auto"},
  navBtn:{background:"transparent",border:"1px solid rgba(255,255,255,0.08)",color:"#778",padding:"9px 20px",borderRadius:24,cursor:"pointer",fontSize:15,whiteSpace:"nowrap",fontWeight:500},
  navActive:{background:"#0055cc",border:"1px solid #0099ff",color:"#fff",fontWeight:700},
  main:{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",padding:"40px 20px 70px"},
  hero:{textAlign:"center",marginBottom:56},
  heroBadge:{display:"inline-block",background:"rgba(0,100,255,0.13)",border:"1px solid #0055cc",color:"#0099ff",padding:"9px 26px",borderRadius:24,fontSize:15,letterSpacing:2,marginBottom:26,fontWeight:600},
  heroTitle:{fontSize:"clamp(54px,11vw,90px)",fontWeight:900,lineHeight:1,margin:"0 0 22px",background:"linear-gradient(135deg,#0099ff 0%,#ffffff 65%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  heroDesc:{color:"#778",fontSize:19,maxWidth:580,margin:"0 auto",lineHeight:1.75},
  grid4:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:22},
  card:{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:30,cursor:"pointer",textAlign:"center"},
  cardTitle:{fontSize:21,fontWeight:800,margin:"12px 0 10px"},
  cardDesc:{color:"#667",fontSize:16,marginBottom:22,lineHeight:1.65},
  cardCta:{display:"inline-block",padding:"11px 26px",borderRadius:24,color:"#000",fontWeight:800,fontSize:16},
  pageTitle:{fontSize:32,fontWeight:900,marginBottom:24,borderLeft:"5px solid #0099ff",paddingLeft:18},
  scoringBox:{background:"rgba(0,100,255,0.07)",border:"1px solid rgba(0,100,255,0.2)",borderRadius:18,padding:"24px 28px",marginBottom:36},
  scoringTitle:{fontSize:14,letterSpacing:2,color:"#0099ff",fontWeight:700,marginBottom:18},
  scoringGrid:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12},
  scoringItem:{textAlign:"center",background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"14px 8px"},
  scoringHint:{fontSize:13,color:"#667",marginBottom:6},
  scoringPts:{fontSize:28,fontWeight:900},
  diffGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:22},
  diffCard:{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:32,cursor:"pointer",textAlign:"center"},
  diffLabel:{fontSize:28,fontWeight:900,marginBottom:10,letterSpacing:2},
  diffDesc:{color:"#778",fontSize:16,lineHeight:1.6,marginBottom:8},
  diffSub:{fontSize:14,color:"#445",marginTop:6},
  quizHeader:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20},
  quizScoreBox:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"12px 22px",textAlign:"center"},
  progressBar:{height:7,background:"rgba(255,255,255,0.06)",borderRadius:6,marginBottom:28,overflow:"hidden"},
  progressFill:{height:"100%",borderRadius:6,transition:"width 0.6s cubic-bezier(.22,1,.36,1)"},
  quizCard:{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:24,padding:36},
  hintsLabel:{fontSize:13,letterSpacing:3,color:"#0099ff",marginBottom:16,fontWeight:700},
  hintsArea:{marginBottom:22},
  hintItem:{display:"flex",alignItems:"center",gap:14,background:"rgba(0,100,255,0.07)",border:"1px solid",borderRadius:14,padding:"14px 18px",marginBottom:10},
  hintNum:{color:"#fff",borderRadius:"50%",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,flexShrink:0},
  hintPts:{marginLeft:"auto",fontSize:13,color:"#ffd700",fontWeight:700,whiteSpace:"nowrap"},
  hintBtn:{background:"transparent",border:"2px solid",padding:"12px 26px",borderRadius:24,cursor:"pointer",marginBottom:26,fontSize:16,fontWeight:600,display:"block",width:"100%",textAlign:"center"},
  inputRow:{display:"flex",gap:14},
  input:{flex:1,background:"rgba(255,255,255,0.06)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:14,padding:"16px 20px",color:"#fff",fontSize:18,outline:"none",transition:"border-color 0.2s, box-shadow 0.2s"},
  guessBtn:{border:"none",borderRadius:14,padding:"16px 28px",color:"#000",fontWeight:800,cursor:"pointer",fontSize:17,whiteSpace:"nowrap"},
  resultBanner:{borderRadius:18,padding:"28px 20px",marginBottom:20,display:"flex",flexDirection:"column",alignItems:"center",gap:8},
  nextBtn:{background:"transparent",border:"2px solid #0099ff",color:"#0099ff",padding:"13px 34px",borderRadius:24,cursor:"pointer",fontSize:18,fontWeight:700},
  resultBox:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"32px 24px",margin:"28px auto",maxWidth:480,position:"relative",overflow:"hidden"},
  retryBtn:{background:"#0055cc",border:"none",borderRadius:14,padding:"14px 32px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:18},
  changeDiffBtn:{background:"transparent",border:"2px solid #778",color:"#aaa",borderRadius:14,padding:"14px 32px",fontWeight:700,cursor:"pointer",fontSize:18},
  teamGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:18},
  teamCard:{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:24,textAlign:"center"},
  teamRankBadge:{fontSize:13,color:"#445",fontWeight:700},
  teamName:{fontSize:20,fontWeight:900,margin:"6px 0 4px"},
  teamCountry:{fontSize:16,color:"#667",marginBottom:12},
  teamTitles:{fontSize:16,color:"#ffd700",fontWeight:700,padding:"8px 14px",background:"rgba(255,215,0,0.07)",borderRadius:10},
  rankTable:{background:"rgba(255,255,255,0.02)",borderRadius:18,overflow:"hidden",border:"1px solid rgba(255,255,255,0.07)"},
  rankHead:{display:"grid",gridTemplateColumns:"70px 1fr 70px 1fr 100px 110px 120px",padding:"16px 22px",background:"rgba(0,100,255,0.1)",fontSize:13,letterSpacing:2,color:"#0099ff",fontWeight:700,gap:8},
  rankRow:{display:"grid",gridTemplateColumns:"70px 1fr 70px 1fr 100px 110px 120px",padding:"16px 22px",borderTop:"1px solid rgba(255,255,255,0.05)",gap:8,alignItems:"center"},
  yourScoreBox:{textAlign:"center",fontSize:20,color:"#667",marginBottom:28,padding:"20px",background:"rgba(0,100,255,0.06)",borderRadius:16,border:"1px solid rgba(0,100,255,0.14)"},
  leaderList:{display:"flex",flexDirection:"column",gap:14},
  leaderRow:{display:"flex",alignItems:"center",gap:20,padding:"20px 28px",borderRadius:18},
  footer:{textAlign:"center",padding:"28px",color:"#223",fontSize:15,borderTop:"1px solid rgba(255,255,255,0.05)",marginTop:40},
};
