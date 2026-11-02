// Open api/games.json through a local web server, not file:// fetch.
fetch('../../games.json').then(r=>r.json()).then(console.log).catch(console.error);
