const http = require("http"), fs = require("fs"), path = require("path"), crypto = require("crypto");
const PORT = process.env.PORT || 3000;
const HOST_KEY = process.env.HOST_PASSWORD || "changeme";
const MAX = 25;

const SETS = {
  music: { title: "Music Trivia: 1980–2000", qs: [
    ["Thriller (1982) became one of the best-selling albums ever, and the zombies were not paid overtime. Which producer, who also steered Off the Wall and Bad, ran the show?", ["Quincy Jones", "Nile Rodgers", "Phil Ramone", "Rick Rubin"], 0],
    ["MTV launched on August 1, 1981 and bravely opened with a video about radio being murdered by television. Which act made it?", ["Duran Duran", "The Buggles", "Devo", "Talking Heads"], 1],
    ["Which vocalist hit the impossibly high notes on Journey’s “Don’t Stop Believin’,” the song every karaoke bar plays at 11 p.m.?", ["Steve Winwood", "Sammy Hagar", "Steve Perry", "Brad Delp"], 2],
    ["Live Aid in 1985 had two main stages: Wembley in London, and which Philadelphia stadium that has since been demolished and stopped judging us?", ["Veterans Stadium", "Franklin Field", "The Spectrum", "JFK Stadium"], 3],
    ["Prince’s Purple Rain was recorded with which backing band, whose name sounds like a polite uprising?", ["The Revolution", "The New Power Generation", "The Time", "The Family"], 0],
    ["Dolly Parton wrote “I Will Always Love You” as a farewell to which mentor and duet partner, so it was a breakup song with great manners?", ["Kenny Rogers", "Porter Wagoner", "Waylon Jennings", "Conway Twitty"], 1],
    ["George Michael got the idea for “Wake Me Up Before You Go-Go” from a note left by which bandmate, who had repeated one word twice in a sleepy scribble?", ["Pepsi", "Martin Kemp", "Andrew Ridgeley", "Shirlie"], 2],
    ["Phil Collins drummed, sang, and later won an Oscar for “You’ll Be in My Heart” from which Disney film about a man raised by apes?", ["The Lion King", "Hercules", "Mulan", "Tarzan"], 3],
    ["The cover of Nirvana’s Nevermind shows a naked baby underwater, chasing what?", ["A dollar bill on a fishhook", "A rubber duck", "A guitar pick", "A giant clam"], 0],
    ["Run-D.M.C. and Aerosmith teamed up on “Walk This Way,” which Aerosmith first released in 1975 on which album with an oddly cozy name?", ["Rocks", "Toys in the Attic", "Get Your Wings", "Pump"], 1],
    ["U2 has a guy called The Edge, a guy called Bono, and a bassist named Adam Clayton. Who plays the drums and gets no nickname?", ["Charlie Watts", "Stewart Copeland", "Larry Mullen Jr.", "Phil Collins"], 2],
    ["Cyndi Lauper made “Girls Just Want to Have Fun” famous, but it was written by a man. Which rocker?", ["Rob Hyman", "Billy Steinberg", "Tom Kelly", "Robert Hazard"], 3],
    ["The first album commercially released on compact disc in 1982 was by which Piano Man, proving shiny discs could also be dramatic?", ["Billy Joel", "Elton John", "Barry Manilow", "Neil Diamond"], 0],
    ["In the Spice Girls, which member went by the nickname “Scary,” a title she probably negotiated herself?", ["Geri Halliwell", "Mel B", "Emma Bunton", "Victoria Beckham"], 1],
    ["Vanilla Ice’s “Ice Ice Baby” (1990) was the first hip-hop single to top which chart, to the dismay of every pair of baggy pants?", ["Billboard 200", "UK Singles Chart", "Billboard Hot 100", "Soul Train Chart"], 2],
    ["“…Baby One More Time” was written and produced by which Swedish hitmaker, who has quietly ruled the pop charts from Stockholm ever since?", ["Denniz Pop", "Benny Andersson", "Avicii", "Max Martin"], 3],
    ["In 1999 Garth Brooks invented a dark-haired rocker alter ego for an album, proving even country stars want a mid-career makeover. What was the alter ego’s name?", ["Chris Gaines", "Tyler Durden", "Hank Jr.", "Billy Ray"], 0],
    ["Who composed the music for “My Heart Will Go On,” the song that sank the ears of everyone in 1997?", ["John Williams", "James Horner", "Hans Zimmer", "Alan Menken"], 1],
    ["A controversy over the “Like a Prayer” video in 1989 caused Madonna to lose a lucrative sponsorship from which soft drink company?", ["Coca-Cola", "Dr Pepper", "Pepsi", "Sprite"], 2],
    ["Which Norwegian band’s 1985 hit “Take On Me” had a video where a girl falls into a pencil-sketch comic?", ["Duran Duran", "Depeche Mode", "Tears for Fears", "a-ha"], 3]
  ] },
  ushistory: { title: "US History Trivia", qs: [
    ["George Washington never lived in the White House, because it didn’t exist yet. Which city hosted the new government when it first met in 1789?", ["Philadelphia", "New York City", "Boston", "Annapolis"], 1],
    ["The Declaration of Independence was approved on July 4, 1776, but delegates mostly signed it on which later date, apparently after a bout of procrastination?", ["July 8, 1776", "September 17, 1776", "August 2, 1776", "January 1, 1777"], 2],
    ["At Gettysburg in 1863, Lincoln spoke for about two minutes, after which man gave a two-hour speech nobody remembers?", ["Daniel Webster", "Stephen Douglas", "William Seward", "Edward Everett"], 3],
    ["The Louisiana Purchase cost roughly three cents an acre. About how much did the U.S. pay in total, the real estate bargain of the century?", ["$15 million", "$1.5 million", "$150 million", "$1.5 billion"], 0],
    ["The Mayflower Compact was signed in 1620 while the ship sat off which cape, long before anyone suggested a GPS?", ["Cape Hatteras", "Cape Cod", "Cape Ann", "Cape May"], 1],
    ["The Wright brothers’ first flight in 1903 went about 120 feet, shorter than the wingspan of a Boeing 747. Who was at the controls?", ["Wilbur Wright", "Glenn Curtiss", "Orville Wright", "Charles Taylor"], 2],
    ["Lee surrendered to Grant in the parlor of whose house at Appomattox, a man who had moved to escape the war after it ran over his farm earlier?", ["Joshua Chamberlain", "Ambrose Burnside", "George Pickett", "Wilmer McLean"], 3],
    ["When Congress voted to declare war on Japan on December 8, 1941, how many members voted no, apparently the only one with a differing opinion?", ["None", "Seven", "One", "Twenty"], 2],
    ["During the Great Depression, the shantytowns of the homeless were sarcastically named after which president?", ["Herbert Hoover", "Calvin Coolidge", "Warren Harding", "Franklin Roosevelt"], 0],
    ["In his 1962 Rice University speech, Kennedy said we would go to the Moon because the goal was what, a rare honest line from a politician?", ["Easy", "Hard", "Cheap", "Quick"], 1],
    ["The Montgomery bus boycott that followed Rosa Parks’s 1955 arrest lasted how long, outlasting most New Year’s resolutions?", ["About 3 weeks", "About 6 months", "381 days", "Three years"], 2],
    ["Which Chief Justice wrote the unanimous 1954 Brown v. Board of Education decision, a name that sounds like it could also run a rabbit farm?", ["Warren Burger", "Thurgood Marshall", "Hugo Black", "Earl Warren"], 3],
    ["About how many people gathered at the 1963 March on Washington, enough to make parking truly impossible?", ["250,000", "25,000", "100,000", "1 million"], 0],
    ["The ceremonial golden spike in 1869 joined the Union Pacific to which other railroad at Promontory Summit?", ["Southern Pacific", "Central Pacific", "Northern Pacific", "Santa Fe"], 1],
    ["Gold was found in 1848 at a sawmill in which California town, which then promptly got crowded?", ["Sacramento", "Placerville", "Coloma", "Sonora"], 2],
    ["Which senator spoke for more than 14 hours against the Civil Rights Act of 1964, proving he could talk longer than a family reunion?", ["Strom Thurmond", "Barry Goldwater", "Everett Dirksen", "Robert Byrd"], 3],
    ["Which coonskin-capped frontiersman and former Congressman died at the Alamo in 1836?", ["Davy Crockett", "Daniel Boone", "Kit Carson", "Jim Bridger"], 0],
    ["Which state became the 36th to ratify the 19th Amendment, after a young legislator reportedly read a letter from his mother?", ["Kentucky", "Tennessee", "Georgia", "Alabama"], 1],
    ["Which Vice President resigned in 1973 after pleading no contest to tax evasion, less than a year before his boss followed suit?", ["Nelson Rockefeller", "Gerald Ford", "Spiro Agnew", "Hubert Humphrey"], 2],
    ["After FDR won four terms, which amendment, ratified in 1951, limited presidents to two, a polite “thanks but no thanks”?", ["20th", "21st", "25th", "22nd"], 3]
  ] },
  world: { title: "World Events: The Last Century", qs: [
    ["The armistice ending World War I was signed in a railway car in a forest near which French town, proving diplomacy can happen on a train?", ["Compiègne", "Fontainebleau", "Versailles", "Ardennes"], 0],
    ["After the 1917 Revolution, the Bolsheviks moved the capital from Petrograd to which city, presumably for the central heating?", ["Kiev", "Moscow", "Minsk", "Vladivostok"], 1],
    ["Which British prime minister declared war on Germany on September 3, 1939, a year after waving a piece of paper promising “peace for our time”?", ["Winston Churchill", "Clement Attlee", "Neville Chamberlain", "Stanley Baldwin"], 2],
    ["The B-29 that dropped the atomic bomb on Hiroshima was named after the pilot’s mother. What was it called?", ["Bockscar", "Memphis Belle", "Spirit of St. Louis", "Enola Gay"], 3],
    ["Who declared Israel’s independence in May 1948 and became its first prime minister, a man whose name takes a full breath to say?", ["David Ben-Gurion", "Chaim Weizmann", "Golda Meir", "Menachem Begin"], 0],
    ["Who became India’s first prime minister when it gained independence at midnight on August 15, 1947?", ["Mahatma Gandhi", "Jawaharlal Nehru", "Muhammad Ali Jinnah", "Sardar Patel"], 1],
    ["Mao’s 1934–35 retreat of the Red Army, covering thousands of miles on foot, is known as the what?", ["The Great Leap", "The Red Walk", "The Long March", "The Silk Detour"], 2],
    ["The Berlin Wall stood for how many years, long enough to have its own bad reputation but not long enough to retire?", ["8", "18", "38", "28"], 3],
    ["In April 1961, which Soviet cosmonaut became the first human in space, beating the Americans by a few weeks and bragging rights forever?", ["Yuri Gagarin", "Alexei Leonov", "Valentina Tereshkova", "Gherman Titov"], 0],
    ["During Apollo 11 in 1969, which astronaut stayed in orbit to mind the spaceship while two colleagues walked on the Moon?", ["Pete Conrad", "Jim Lovell", "Michael Collins", "Gene Cernan"], 2],
    ["Nelson Mandela spent 18 of his 27 years in prison on which island, off Cape Town?", ["Gorée Island", "Ellis Island", "Devil’s Island", "Robben Island"], 3],
    ["After the 1986 Chernobyl accident, which nearby purpose-built city was evacuated?", ["Pripyat", "Kiev", "Minsk", "Kharkiv"], 0],
    ["Which ship rescued the Titanic survivors in 1912, arriving after the party had already ended badly?", ["Californian", "Carpathia", "Olympic", "Lusitania"], 1],
    ["The 1919 Treaty of Versailles was signed in which famously shiny room of the palace?", ["Throne Room", "Orangery", "Hall of Mirrors", "Grand Gallery"], 2],
    ["Which 1930 U.S. tariff law, named after two congressmen and sounding like a cartoon law firm, is blamed for deepening the Depression?", ["Glass-Steagall", "Sherman Act", "Taft-Hartley", "Smoot-Hawley"], 3],
    ["Mikhail Gorbachev’s policy of glasnost meant roughly what, a novel idea in Moscow?", ["Openness", "Rebuilding", "Five-year plan", "Vodka rationing"], 0],
    ["Who was the last British governor of Hong Kong, who left after handing it over in 1997?", ["Edward Heath", "Chris Patten", "Douglas Hurd", "David Wilson"], 1],
    ["Two days after President Kennedy’s assassination in 1963, who shot Lee Harvey Oswald on live television?", ["Jim Garrison", "Earl Warren", "Jack Ruby", "Lyndon Johnson"], 2],
    ["Which U.S. general, nicknamed “Stormin’ Norman,” commanded coalition forces in the 1991 Gulf War?", ["Colin Powell", "Tommy Franks", "Wesley Clark", "Norman Schwarzkopf"], 3],
    ["Korea was split into North and South along which line of latitude, as if with a very long ruler?", ["38th parallel", "34th parallel", "36th parallel", "40th parallel"], 0]
  ] },
  tv: { title: "TV Shows: 1990s to 2010", qs: [
    ["On Friends, what was the name of Ross’s pet monkey, who had a better career than most of the cast’s exes?", ["Bubbles", "Marcel", "Abu", "Cheeta"], 1],
    ["On Seinfeld, what is Kramer’s first name, a name that sounds like a cologne?", ["Jerry", "Newman", "Cosmo", "Kenny"], 2],
    ["Which actor played Dr. Doug Ross on ER, the pediatrician all the hospital’s nurses seemed to enjoy?", ["Anthony Edwards", "Noah Wyle", "Eriq La Salle", "George Clooney"], 3],
    ["On Who Wants to Be a Millionaire, Regis Philbin’s most dramatic line was a question about your final what?", ["Is that your final answer?", "Are you sure about that?", "Care to phone a friend?", "Shall we lock it in?"], 0],
    ["The X-Files’ famous tagline says the truth is where?", ["Above us", "Out there", "Underground", "Classified"], 1],
    ["Which Simpsons kid is voiced by a woman, Nancy Cartwright, who also does Nelson and Ralph?", ["Lisa", "Maggie", "Bart", "Milhouse"], 2],
    ["The mysterious numbers on Lost were 4, 8, 15, 16, 23 and what, the answer to everything?", ["108", "23", "15", "42"], 3],
    ["On The Sopranos, Tony’s first panic attack was triggered by what leaving his backyard pool?", ["Ducks", "Geese", "Horses", "Squirrels"], 0],
    ["In Breaking Bad, which alias, borrowed from a physicist, does Walter White use?", ["Schrödinger", "Heisenberg", "Oppenheimer", "Fermi"], 1],
    ["Who won the very first season of American Idol in 2002?", ["Justin Guarini", "Clay Aiken", "Kelly Clarkson", "Carrie Underwood"], 2],
    ["In the Fresh Prince theme song, Will says he was born and raised where, before being sent to live with his aunt and uncle?", ["South Central LA", "Brooklyn", "Detroit", "West Philadelphia"], 3],
    ["Which flannel-wearing sidekick of Tim Allen on Tool Time never took off his beard-covered smile?", ["Al Borland", "Wilson", "Randy", "Jill"], 0],
    ["On Frasier, what was the name of Niles’s wife who was talked about constantly and almost never seen?", ["Lilith", "Maris", "Daphne", "Roz"], 1],
    ["The Office’s Dunder Mifflin branch is in which Pennsylvania city?", ["Harrisburg", "Pittsburgh", "Scranton", "Allentown"], 2],
    ["On Baywatch, which character did Pamela Anderson play, running very slowly and quite dramatically?", ["Stephanie Holden", "Summer Quinn", "Caroline Holden", "C.J. Parker"], 3],
    ["After losing the Tonight Show job to Jay Leno in 1992, which host moved to CBS for a rival show in 1993?", ["David Letterman", "Conan O’Brien", "Craig Ferguson", "Arsenio Hall"], 0],
    ["What is Buffy’s last name, which sounds like a cheerful warning label for vampires?", ["Harris", "Summers", "Rosenberg", "Giles"], 1],
    ["What does Ray Barone do for a living on Everybody Loves Raymond?", ["Police officer", "Chef", "Sportswriter", "Insurance salesman"], 2],
    ["Who won the first Survivor in 2000 and became famous for his lack of formal wear?", ["Rudy Boesch", "Kelly Wiglesworth", "Sue Hawk", "Richard Hatch"], 3],
    ["On 24, Jack Bauer works for CTU, which stands for what, an agency whose employees never get a day off?", ["Counter Terrorist Unit", "Central Tactical Unit", "Covert Threat Unit", "Crisis Task Unit"], 0]
  ] },
  nicknames: { title: "Famous People’s Nicknames", qs: [
    ["Which rocker’s nickname, “The Boss,” reportedly began because he was the one handing out the band’s pay, a job that guarantees zero popularity?", ["Billy Joel", "Bruce Springsteen", "Bob Seger", "Tom Petty"], 1],
    ["Which jazz trumpeter’s nickname, “Satchmo,” is short for a word referring to his remarkably generous mouth?", ["Duke Ellington", "Miles Davis", "Louis Armstrong", "Dizzy Gillespie"], 2],
    ["Which baseball legend, born George Herman Ruth Jr., was nicknamed “The Sultan of Swat,” because “Guy Who Hits Stuff Far” was too long for a scoreboard?", ["Lou Gehrig", "Ty Cobb", "Babe Ruth", "Honus Wagner"], 2],
    ["Which tough-as-wood president was nicknamed “Old Hickory”?", ["Zachary Taylor", "Andrew Jackson", "Andrew Johnson", "Sam Houston"], 1],
    ["Which Moon walker got the nickname “Buzz” as a child because his little sister mispronounced the word “brother”?", ["Neil Armstrong", "Michael Collins", "Pete Conrad", "Buzz Aldrin"], 3],
    ["Gordon Sumner reportedly became “Sting” after wearing a black-and-yellow striped sweater that made him look like what?", ["A bee or wasp", "A zebra", "A tiger", "A traffic cone"], 0],
    ["Paul Hewson of U2 took the name “Bono” from a Dublin shop that sold what, which at least explains his talent for being heard?", ["Guitars", "Sunglasses", "Hearing aids", "Fish and chips"], 2],
    ["Richard Starkey became “Ringo” because of what he wore on his fingers?", ["Rings", "Guitar picks", "Drumstick tape", "Band-Aids"], 0],
    ["Margaret Thatcher’s nickname, “The Iron Lady,” was first used by a newspaper in which country, meant as an insult she happily adopted?", ["France", "Soviet Union", "Argentina", "Germany"], 1],
    ["John Wayne, born Marion Morrison, got his lifelong nickname “Duke” from what?", ["A pet dog", "A racehorse", "A card game", "A British title"], 0],
    ["Which NBA star, nicknamed “The Round Mound of Rebound,” later became famous for saying whatever came into his head on TV?", ["Shaquille O’Neal", "Larry Johnson", "Karl Malone", "Charles Barkley"], 3],
    ["Which Chicago Bears defensive lineman, nicknamed “The Refrigerator,” also scored a touchdown as a fullback, to the delight of everyone with a snack?", ["Mike Singletary", "William Perry", "Walter Payton", "Jim McMahon"], 1],
    ["Which football quarterback, nicknamed “Broadway Joe,” famously guaranteed a Super Bowl win in 1969?", ["Joe Montana", "Joe Theismann", "Joe Namath", "Joe Frazier"], 2],
    ["Which NBA power forward earned the nickname “The Mailman” because he always delivered?", ["Karl Malone", "John Stockton", "Dennis Rodman", "Patrick Ewing"], 0],
    ["Which hockey player, whose nickname is simply “The Great One,” wore number 99 and made modesty look optional?", ["Mario Lemieux", "Gordie Howe", "Bobby Orr", "Wayne Gretzky"], 3],
    ["Which Yankees center fielder, nicknamed “The Yankee Clipper,” hit safely in 56 straight games in 1941?", ["Lou Gehrig", "Mickey Mantle", "Joe DiMaggio", "Yogi Berra"], 2],
    ["Which singer was “The Man in Black,” a nickname that spared him a wardrobe decision every morning?", ["Waylon Jennings", "Willie Nelson", "Kris Kristofferson", "Johnny Cash"], 3],
    ["Which singer, famous for dance moves and screams, was called “The Godfather of Soul”?", ["James Brown", "Ray Charles", "Otis Redding", "Sam Cooke"], 0],
    ["Which “Great Balls of Fire” pianist went by the menacing nickname “The Killer”?", ["Johnny Cash", "Carl Perkins", "Jerry Lee Lewis", "Elvis Presley"], 2],
    ["Which Red Hot Chili Peppers bassist, born Michael Balzary, goes by a name that is also a small, jumpy insect?", ["Slash", "Flea", "Sting", "Moby"], 1]
  ] }
};
// Mixed game: 4 questions each from music, US history and TV, 5 from world events (taken in turn),
// plus Oregon and Arizona state-bird questions, with an X-Files question to finish
SETS.mixed = { title: "Mixed Bag: All Topics", qs: [] };
for (let i = 0; i < 4; i++) ["music", "ushistory", "world", "tv"].forEach(k => SETS.mixed.qs.push(SETS[k].qs[i]));
SETS.mixed.qs.push(SETS.world.qs[4]);
SETS.mixed.qs.splice(8, 0, ["Oregon shares its state bird with five other states, so it can’t claim to be original. Which bird is it?", ["American robin", "Steller’s jay", "Western meadowlark", "Mountain bluebird"], 2]);
SETS.mixed.qs.splice(14, 0, ["Arizona’s state bird weaves football-shaped nests inside prickly cacti, because it takes safety seriously. Which bird is it?", ["Roadrunner", "Cactus wren", "Gambel’s quail", "Gila woodpecker"], 1]);
SETS.mixed.qs.push(SETS.tv.qs[4]);

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
