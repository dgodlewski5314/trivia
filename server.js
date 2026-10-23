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
  ushistory: { title: "US History Trivia", qs: [
    ["Who was the first President of the United States?", ["John Adams", "George Washington", "Thomas Jefferson", "Benjamin Franklin"], 1],
    ["In which year was the Declaration of Independence adopted?", ["1754", "1787", "1776", "1801"], 2],
    ["Who was President of the United States during the Civil War?", ["Ulysses S. Grant", "Andrew Johnson", "Abraham Lincoln", "James Buchanan"], 2],
    ["In 1803 the United States doubled in size by buying the Louisiana Territory from which country?", ["France", "Spain", "Britain", "Mexico"], 0],
    ["Which ship carried the Pilgrims to America in 1620?", ["Santa Maria", "Golden Hind", "Mayflower", "Nina"], 2],
    ["Where did the Wright brothers make their first powered flight in 1903?", ["Dayton, Ohio", "Detroit, Michigan", "Cape Canaveral, Florida", "Kitty Hawk, North Carolina"], 3],
    ["Which 1863 battle in Pennsylvania was a turning point of the Civil War?", ["Gettysburg", "Antietam", "Vicksburg", "Bull Run"], 0],
    ["The U.S. entered World War II in 1941 after the attack on which naval base?", ["Guam", "Pearl Harbor", "Manila Bay", "San Diego"], 1],
    ["Who was President when the stock market crashed in October 1929?", ["Calvin Coolidge", "Franklin Roosevelt", "Herbert Hoover", "Harry Truman"], 2],
    ["Which President set the goal of landing a man on the Moon before the end of the 1960s?", ["Lyndon B. Johnson", "Dwight Eisenhower", "Richard Nixon", "John F. Kennedy"], 3],
    ["In 1955 Rosa Parks refused to give up her bus seat in which city?", ["Montgomery, Alabama", "Birmingham, Alabama", "Atlanta, Georgia", "Memphis, Tennessee"], 0],
    ["The 1954 case Brown v. Board of Education ruled segregation unconstitutional in which setting?", ["Buses", "Public schools", "Voting booths", "Public parks"], 1],
    ["Who delivered the “I Have a Dream” speech in 1963?", ["Malcolm X", "John Lewis", "Martin Luther King Jr.", "Medgar Evers"], 2],
    ["The Transcontinental Railroad was completed in 1869 at Promontory Summit in which state?", ["Nevada", "Wyoming", "Colorado", "Utah"], 3],
    ["The 1849 Gold Rush began after gold was found in which state?", ["Alaska", "Oregon", "California", "Colorado"], 2],
    ["Which President signed the Civil Rights Act of 1964?", ["Lyndon B. Johnson", "John F. Kennedy", "Richard Nixon", "Dwight Eisenhower"], 0],
    ["The Alamo, site of an 1836 battle, is in which present-day state?", ["Arizona", "Texas", "New Mexico", "Louisiana"], 1],
    ["Which amendment, ratified in 1920, gave women the right to vote?", ["15th", "17th", "21st", "19th"], 3],
    ["Which President resigned from office in 1974?", ["Gerald Ford", "Richard Nixon", "Spiro Agnew", "Lyndon Johnson"], 1],
    ["Which President was elected to four terms?", ["Theodore Roosevelt", "Woodrow Wilson", "Franklin D. Roosevelt", "Dwight Eisenhower"], 2]
  ] },
  world: { title: "World Events: The Last Century", qs: [
    ["In which year did World War I end?", ["1916", "1918", "1919", "1921"], 1],
    ["Which leader came to power after the 1917 Russian Revolution?", ["Joseph Stalin", "Leon Trotsky", "Vladimir Lenin", "Nicholas II"], 2],
    ["World War II began in Europe in which year, with Germany’s invasion of Poland?", ["1936", "1937", "1941", "1939"], 3],
    ["Atomic bombs were dropped on Hiroshima and Nagasaki in which year?", ["1945", "1943", "1944", "1947"], 0],
    ["The state of Israel was founded in which year?", ["1945", "1948", "1956", "1967"], 1],
    ["India gained independence from Britain in which year?", ["1939", "1950", "1947", "1962"], 2],
    ["Which leader brought the communists to power in China in 1949?", ["Sun Yat-sen", "Chiang Kai-shek", "Deng Xiaoping", "Mao Zedong"], 3],
    ["In which year did the Berlin Wall fall?", ["1989", "1985", "1987", "1991"], 0],
    ["Which country launched Sputnik, the first artificial satellite, in 1957?", ["United States", "Soviet Union", "Germany", "Japan"], 1],
    ["In which year did Apollo 11 land the first humans on the Moon?", ["1965", "1967", "1969", "1972"], 2],
    ["Which South African leader was freed from prison in 1990 after 27 years?", ["Desmond Tutu", "F. W. de Klerk", "Steve Biko", "Nelson Mandela"], 3],
    ["The 1986 Chernobyl disaster happened in what is now which country?", ["Russia", "Ukraine", "Poland", "Belarus"], 1],
    ["In which year did the Titanic sink?", ["1912", "1905", "1918", "1921"], 0],
    ["The 1914 assassination of Archduke Franz Ferdinand took place in which city?", ["Vienna", "Belgrade", "Sarajevo", "Berlin"], 2],
    ["The stock market crash that began the Great Depression happened in which year?", ["1925", "1927", "1931", "1929"], 3],
    ["Which Soviet leader introduced the reforms called glasnost and perestroika?", ["Mikhail Gorbachev", "Leonid Brezhnev", "Nikita Khrushchev", "Boris Yeltsin"], 0],
    ["In 1997 Hong Kong was returned to China by which country?", ["Portugal", "Britain", "Japan", "France"], 1],
    ["In which year was President John F. Kennedy assassinated?", ["1961", "1965", "1963", "1968"], 2],
    ["The 1991 Gulf War began after Iraq invaded which country?", ["Iran", "Saudi Arabia", "Syria", "Kuwait"], 3],
    ["The Korean War began in which year?", ["1950", "1948", "1953", "1955"], 0]
  ] },
  tv: { title: "TV Shows: 1990s to 2010", qs: [
    ["Which sitcom followed six friends in New York and ran from 1994 to 2004?", ["Seinfeld", "Friends", "Frasier", "Will & Grace"], 1],
    ["Which sitcom was famously described as “a show about nothing”?", ["Seinfeld", "Frasier", "Cheers", "Mad About You"], 0],
    ["The medical drama ER, which began in 1994, was set in which city?", ["New York", "Seattle", "Chicago", "Boston"], 2],
    ["Who was the original U.S. host of “Who Wants to Be a Millionaire” in 1999?", ["Alex Trebek", "Pat Sajak", "Bob Barker", "Regis Philbin"], 3],
    ["In The X-Files, FBI agent Fox Mulder’s partner was Dana…?", ["Scully", "Skinner", "Krycek", "Doggett"], 0],
    ["What is the name of the hometown of The Simpsons?", ["Shelbyville", "Springfield", "Quahog", "Capeside"], 1],
    ["In the series Lost, the survivors crashed on an island after which flight went down?", ["Pacific Flight 714", "Atlantic Flight 77", "Oceanic Flight 815", "Island Air 29"], 2],
    ["Which HBO series followed New Jersey mob boss Tony Soprano?", ["The Wire", "Oz", "Deadwood", "The Sopranos"], 3],
    ["In Breaking Bad, which high-school teacher turns to making drugs?", ["Walter White", "Dexter Morgan", "Nancy Botwin", "Patty Hewes"], 0],
    ["Which American Idol judge was famous for blunt critiques?", ["Randy Jackson", "Simon Cowell", "Paula Abdul", "Ryan Seacrest"], 1],
    ["Which actor starred in The Fresh Prince of Bel-Air?", ["Martin Lawrence", "Tim Allen", "Will Smith", "Jamie Foxx"], 2],
    ["On Home Improvement, what was the name of Tim Allen’s TV show within the show?", ["Fix It Time", "Handy Hour", "Wrench Works", "Tool Time"], 3],
    ["On the sitcom Frasier, what is Frasier Crane’s job?", ["Radio psychiatrist", "Newspaper columnist", "Stand-up comedian", "Chef"], 0],
    ["The American version of The Office is set at which paper company?", ["Vance Refrigeration", "Dunder Mifflin", "Sabre", "Initech"], 1],
    ["Which show starred David Hasselhoff as a lifeguard in the 1990s?", ["Knight Rider", "Magnum, P.I.", "Baywatch", "Miami Vice"], 2],
    ["Who took over The Tonight Show from Johnny Carson in 1992?", ["David Letterman", "Conan O’Brien", "Craig Kilborn", "Jay Leno"], 3],
    ["Who played the title role in Buffy the Vampire Slayer?", ["Sarah Michelle Gellar", "Alyson Hannigan", "Katie Holmes", "Neve Campbell"], 0],
    ["Which comedian starred in Everybody Loves Raymond?", ["Kevin James", "Ray Romano", "Jerry Seinfeld", "Bill Maher"], 1],
    ["Survivor premiered in 2000 on which network?", ["NBC", "ABC", "CBS", "Fox"], 2],
    ["In the series 24, which character does Kiefer Sutherland play?", ["Jack Ryan", "Jack Shephard", "Jack Donaghy", "Jack Bauer"], 3]
  ] }
};
// Mixed game: 5 questions each from music, US history, world events and TV, taken in turn
SETS.mixed = { title: "Mixed Bag: All Topics", qs: [] };
for (let i = 0; i < 5; i++) ["music", "ushistory", "world", "tv"].forEach(k => SETS.mixed.qs.push(SETS[k].qs[i]));

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
