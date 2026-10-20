const http = require("http"), fs = require("fs"), path = require("path"), crypto = require("crypto");
const PORT = process.env.PORT || 3000;
const HOST_KEY = process.env.HOST_PASSWORD || "changeme";
const MAX = 25;

const Q = [
["Which artist released the album “Thriller” in 1982?",["Prince","Michael Jackson","Lionel Richie","Stevie Wonder"],1],
["What was the very first music video shown on MTV in 1981?",["“Video Killed the Radio Star”","“Girls on Film”","“Rio”","“Bette Davis Eyes”"],0],
["Which band sang “Don’t Stop Believin’”?",["Foreigner","Boston","Styx","Journey"],3],
["Live Aid in 1985 was held in London and which American city?",["New York","Los Angeles","Philadelphia","Chicago"],2],
["Prince’s 1984 film and album share which title?",["1999","Purple Rain","Raspberry Beret","Sign o’ the Times"],1],
["Who wrote “I Will Always Love You,” a 1992 hit for Whitney Houston?",["Loretta Lynn","Tammy Wynette","Reba McEntire","Dolly Parton"],3],
["Which duo sang “Wake Me Up Before You Go-Go”?",["Wham!","Duran Duran","Spandau Ballet","Culture Club"],0],
["Phil Collins was the drummer and later lead singer of which band?",["Yes","Genesis","Supertramp","Asia"],1],
["Which 1991 Nirvana album includes “Smells Like Teen Spirit”?",["Bleach","In Utero","Nevermind","Incesticide"],2],
["Which 1986 song paired Run-D.M.C. with Aerosmith?",["“Dream On”","“Sweet Emotion”","“Walk This Way”","“Rag Doll”"],2],
["U2’s 1987 album featuring “With or Without You” is called…",["War","The Joshua Tree","Achtung Baby","Boy"],1],
["Who sang “Girls Just Want to Have Fun”?",["Pat Benatar","Debbie Gibson","Belinda Carlisle","Cyndi Lauper"],3],
["Sony and Philips launched which music format in 1982?",["Compact disc","MiniDisc","8-track tape","Digital Audio Tape"],0],
["What was the Spice Girls’ first single in 1996?",["“Say You’ll Be There”","“Wannabe”","“2 Become 1”","“Stop”"],1],
["“Ice Ice Baby” (1990) sampled which Queen and David Bowie song?",["“Fame”","“Let’s Dance”","“Radio Ga Ga”","“Under Pressure”"],3],
["Whose 1998 debut single was “…Baby One More Time”?",["Christina Aguilera","Jessica Simpson","Britney Spears","Mandy Moore"],2]
];

const G = { phase: "lobby", q: 0, start: 0, timer: null };
const players = new Map(); // id -> {name, score, ans}
const clients = new Set();

function view() {
  const list = [...players.values()];
  const v = {
    phase: G.phase, q: G.q, total: Q.length, qid: G.start,
    count: list.length, answered: list.filter(p => p.ans).length,
    board: list.map(p => ({ n: p.name, s: p.score })).sort((a, b) => b.s - a.s).slice(0, MAX)
  };
  if (G.phase === "q" || G.phase === "reveal") { v.text = Q[G.q][0]; v.opts = Q[G.q][1]; }
  if (G.phase === "reveal") v.correct = Q[G.q][2]; // correct answer is only sent after reveal
  return v;
}
function push() { const d = "data: " + JSON.stringify(view()) + "\n\n"; clients.forEach(r => r.write(d)); }

function startQ() {
  clearTimeout(G.timer);
  G.phase = "q"; G.start = Date.now();
  players.forEach(p => p.ans = null);
  push();
}
function reveal() {
  if (G.phase !== "q") return;
  clearTimeout(G.timer);
  G.phase = "reveal";
  players.forEach(p => {
    if (p.ans && p.ans.c === Q[G.q][2]) p.score += 100;
  });
  push();
}
const actions = {
  start() { if (G.phase === "lobby") { G.q = 0; startQ(); } },
  reveal,
  next() { if (G.phase !== "reveal") return; if (G.q + 1 < Q.length) { G.q++; startQ(); } else { G.phase = "final"; push(); } },
  again() { clearTimeout(G.timer); G.phase = "lobby"; G.q = 0; players.forEach(p => { p.score = 0; p.ans = null; }); push(); }
};

function body(req) {
  return new Promise(res => {
    let b = ""; req.on("data", c => { b += c; if (b.length > 5000) req.destroy(); });
    req.on("end", () => { try { res(JSON.parse(b || "{}")); } catch { res({}); } });
  });
}
const send = (res, code, obj) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(obj)); };

http.createServer(async (req, res) => {
  const url = req.url.split("?")[0];
  if (req.method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(fs.readFileSync(path.join(__dirname, "index.html")));
  }
  if (req.method === "GET" && url === "/events") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    clients.add(res); res.write("data: " + JSON.stringify(view()) + "\n\n");
    return req.on("close", () => clients.delete(res));
  }
  if (req.method !== "POST") { res.writeHead(404); return res.end(); }
  const b = await body(req);
  if (url === "/api/join") {
    let id = b.id;
    if (!players.has(id)) {
      const name = String(b.name || "").trim().slice(0, 20);
      if (!name) return send(res, 400, { error: "name" });
      if (players.size >= MAX) return send(res, 403, { error: "full" });
      id = crypto.randomUUID();
      players.set(id, { name, score: 0, ans: null });
      push();
    }
    return send(res, 200, { id });
  }
  if (url === "/api/answer") {
    const p = players.get(b.id);
    if (!p) return send(res, 404, { error: "unknown" });
    if (G.phase !== "q" || p.ans || !(b.c >= 0 && b.c <= 3)) return send(res, 409, {});
    p.ans = { c: b.c | 0 };
    push();
    return send(res, 200, {});
  }
  const m = url.match(/^\/api\/host\/(\w+)$/);
  if (m && actions[m[1]]) {
    if (req.headers["x-host-key"] !== HOST_KEY) return send(res, 401, {});
    actions[m[1]](); return send(res, 200, {});
  }
  res.writeHead(404); res.end();
}).listen(PORT, () => console.log("Trivia running on port " + PORT));

setInterval(() => clients.forEach(r => r.write(": ping\n\n")), 25000);
