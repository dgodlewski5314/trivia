const http = require("http"), fs = require("fs"), path = require("path"), crypto = require("crypto");
const PORT = process.env.PORT || 3000;
const HOST_KEY = process.env.HOST_PASSWORD || "changeme";
const MAX = 25;

const SETS = {
  music: { title: "Music Trivia: 1980–2000", qs: [
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
["Whose 1998 debut single was “…Baby One More Time”?",["Christina Aguilera","Jessica Simpson","Britney Spears","Mandy Moore"],2],
["Which band, led by Freddie Mercury, played at Live Aid in 1985?",["The Who","Queen","Genesis","Dire Straits"],1],
["Which singer released the 1989 album “Like a Prayer”?",["Madonna","Cher","Janet Jackson","Paula Abdul"],0],
["Which country star sang “Friends in Low Places” in 1990?",["Alan Jackson","George Strait","Garth Brooks","Randy Travis"],2],
["Who performed “My Heart Will Go On” in the 1997 film Titanic?",["Mariah Carey","Celine Dion","Whitney Houston","Barbra Streisand"],1]
  ] },
  history: { title: "History Trivia", qs: [
["Which year did the Berlin Wall fall?", ["1961", "1985", "1989", "1991"], 2],
["Who was the first person to walk on the Moon?", ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"], 1],
["Which U.S. president issued the Emancipation Proclamation?", ["Abraham Lincoln", "Ulysses S. Grant", "Andrew Johnson", "James Buchanan"], 0],
["In which year did the Titanic sink?", ["1905", "1912", "1918", "1921"], 1],
["Which country gave the Statue of Liberty to the United States?", ["England", "Spain", "France", "Italy"], 2],
["Who became Britain’s prime minister in 1940 and led the country through most of World War II?", ["Neville Chamberlain", "Clement Attlee", "Anthony Eden", "Winston Churchill"], 3],
["Which ship carried the Pilgrims to America in 1620?", ["Santa Maria", "Mayflower", "Nina", "Golden Hind"], 1],
["In which century was the Magna Carta sealed?", ["10th", "11th", "13th", "15th"], 2],
["Which of the Seven Wonders of the Ancient World still stands today?", ["Colossus of Rhodes", "Hanging Gardens", "Lighthouse of Alexandria", "Great Pyramid of Giza"], 3],
["Who was the main author of the Declaration of Independence?", ["Benjamin Franklin", "John Adams", "Thomas Jefferson", "Alexander Hamilton"], 2],
["In which year did World War I begin?", ["1904", "1914", "1917", "1939"], 1],
["Who became the first Roman emperor in 27 BC?", ["Augustus", "Julius Caesar", "Nero", "Constantine"], 0],
["The D-Day landings in Normandy took place in which year?", ["1942", "1943", "1944", "1945"], 2],
["Which explorer sailed to the Americas in 1492?", ["Ferdinand Magellan", "Christopher Columbus", "Vasco da Gama", "Marco Polo"], 1],
["Who was the first woman to fly solo across the Atlantic Ocean?", ["Bessie Coleman", "Harriet Quimby", "Amelia Earhart", "Jacqueline Cochran"], 2],
["At which Pennsylvania battlefield did Lincoln deliver his famous 1863 address?", ["Antietam", "Gettysburg", "Vicksburg", "Bull Run"], 1],
["Who led the Soviet Union during the 1962 Cuban Missile Crisis?", ["Joseph Stalin", "Leonid Brezhnev", "Mikhail Gorbachev", "Nikita Khrushchev"], 3],
["Where did the Wright brothers make their first powered flight in 1903?", ["Dayton, Ohio", "Kitty Hawk, North Carolina", "Detroit, Michigan", "Cape Canaveral, Florida"], 1],
["Which president was in office when the stock market crashed in October 1929?", ["Calvin Coolidge", "Franklin Roosevelt", "Herbert Hoover", "Woodrow Wilson"], 2],
["In 1803 the United States doubled in size by buying land from which country?", ["Spain", "Britain", "Mexico", "France"], 3]
  ] },
  world: { title: "World Events Trivia", qs: [
["In which year was President John F. Kennedy assassinated?", ["1961", "1963", "1965", "1968"], 1],
["Which space shuttle broke apart shortly after launch in 1986?", ["Columbia", "Discovery", "Challenger", "Atlantis"], 2],
["Which South African leader was released from prison in 1990?", ["Desmond Tutu", "Nelson Mandela", "F. W. de Klerk", "Steve Biko"], 1],
["The 1986 Chernobyl nuclear disaster happened in what is now which country?", ["Russia", "Poland", "Belarus", "Ukraine"], 3],
["In which year did Prince Charles marry Lady Diana Spencer?", ["1979", "1981", "1983", "1986"], 1],
["The 1991 Gulf War began after Iraq invaded which country?", ["Iran", "Kuwait", "Saudi Arabia", "Syria"], 1],
["What was the computer worry at the turn of the year 2000 commonly called?", ["The Millennium Virus", "Code Zero", "The Y2K bug", "The Digital Crash"], 2],
["The United States boycotted the 1980 Summer Olympics held in which city?", ["Los Angeles", "Seoul", "Montreal", "Moscow"], 3],
["In which year did Princess Diana die?", ["1995", "1997", "1999", "2001"], 1],
["Who became Britain’s first female prime minister in 1979?", ["Margaret Thatcher", "Theresa May", "Barbara Castle", "Shirley Williams"], 0],
["The Soviet Union dissolved in which year?", ["1989", "1990", "1991", "1993"], 2],
["The September 11 attacks on the United States happened in which year?", ["1999", "2000", "2001", "2003"], 2],
["Which pope, elected in 1978, was the first from Poland?", ["Paul VI", "John Paul II", "Benedict XVI", "John XXIII"], 1],
["In 1997 Hong Kong was returned to China by which country?", ["Portugal", "Japan", "Britain", "France"], 2],
["The Tiananmen Square protests in Beijing took place in which year?", ["1976", "1984", "1989", "1992"], 2],
["The Woodstock music festival took place in which year?", ["1965", "1967", "1969", "1972"], 2],
["Which U.S. president resigned from office in 1974?", ["Lyndon Johnson", "Richard Nixon", "Gerald Ford", "Jimmy Carter"], 1],
["Dolly the sheep, the first mammal cloned from an adult cell, was born in which country?", ["England", "United States", "Australia", "Scotland"], 3],
["Which currency began circulating as cash in many European countries in 2002?", ["The ecu", "The franc", "The euro", "The mark"], 2],
["In 1979 Americans were taken hostage at the U.S. embassy in which city?", ["Tehran", "Baghdad", "Beirut", "Cairo"], 0]
  ] }
};

const G = { phase: "choose", set: null };   // choose -> lobby -> play -> final
const qs = () => SETS[G.set].qs;
const players = new Map();              // id -> {name, score, idx}
const clients = new Set();

function view() {
  const list = [...players.values()];
  return {
    phase: G.phase, set: G.set, title: G.set ? SETS[G.set].title : "Trivia Night",
    sets: Object.keys(SETS).map(k => ({ id: k, title: SETS[k].title })),
    total: G.set ? qs().length : 0, count: list.length,
    finished: G.set ? list.filter(p => p.idx >= qs().length).length : 0,
    board: list.map(p => ({ n: p.name, s: p.score, i: p.idx })).sort((a, b) => b.s - a.s).slice(0, MAX)
  };
}
function push() { const d = "data: " + JSON.stringify(view()) + "\n\n"; clients.forEach(r => r.write(d)); }
// each player only ever receives their own current question; correct answers never leave the server
const question = p => p.idx < qs().length ? { idx: p.idx, text: qs()[p.idx][0], opts: qs()[p.idx][1] } : null;
const resetAll = () => players.forEach(p => { p.score = 0; p.idx = 0; });

const actions = {
  pick(b) { if (G.phase === "choose" && SETS[b.set]) { G.set = b.set; G.phase = "lobby"; resetAll(); push(); } },
  choose() { if (G.phase === "lobby") { G.set = null; G.phase = "choose"; push(); } },
  start() { if (G.phase === "lobby") { resetAll(); G.phase = "play"; push(); } },
  end() { if (G.phase === "play") { G.phase = "final"; push(); } },
  again() { resetAll(); G.set = null; G.phase = "choose"; push(); }
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
      players.set(id, { name, score: 0, idx: 0 });
      push();
    }
    return send(res, 200, { id });
  }
  if (url === "/api/me") {
    const p = players.get(b.id);
    if (!p) return send(res, 404, { error: "unknown" });
    return send(res, 200, { score: p.score, q: G.phase === "play" ? question(p) : null });
  }
  if (url === "/api/answer") {
    const p = players.get(b.id);
    if (!p) return send(res, 404, { error: "unknown" });
    if (G.phase !== "play" || b.q !== p.idx || !(b.c >= 0 && b.c <= 3)) return send(res, 409, {});
    const correct = (b.c | 0) === qs()[p.idx][2];
    if (correct) p.score += 100;
    p.idx++;
    push();
    return send(res, 200, { correct, score: p.score, next: question(p) });
  }
  const m = url.match(/^\/api\/host\/(\w+)$/);
  if (m && actions[m[1]]) {
    if (req.headers["x-host-key"] !== HOST_KEY) return send(res, 401, {});
    actions[m[1]](b); return send(res, 200, {});
  }
  res.writeHead(404); res.end();
}).listen(PORT, () => console.log("Trivia running on port " + PORT));

setInterval(() => clients.forEach(r => r.write(": ping\n\n")), 25000);
