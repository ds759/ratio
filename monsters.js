// Creates an array (of size n) of monsters, given n
const makeMonsters = n =>
	Array.apply(null, { length: n })
		.map(Number.call, Number)
		.map(i => `monster${i}`);

module.exports.makeMonsters = makeMonsters;
