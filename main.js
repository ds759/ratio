const io = require("./game-io"); // input/ouput functions
const world = require("./world"); // World and City objects
const monster = require("./monsters"); // Monster objects

// Given functions, call the result of each one on each other
// For functional composistion
const compose = (...fns) => arg =>
	fns.reduce((composed, f) => f(composed), arg);

io.readFile("world_map_small.txt", (err, data) => {
	if (err) console.error(err);

	// Create World/Map outline of given cities from input file
	const emptyWorld = world.world(data);

	// Ask for monster input from user
	io.getMonsterInput(Object.keys(emptyWorld).length, result => {
		// Setup World/Map/Game by adding monsters randomly
		const monsters = monster.makeMonsters(result);
		let gameWorld = world.addMonsters(emptyWorld, monsters); // the structure/object which contains monsters attached to cities
		console.log("\n\nStarting game...\n");
		// commence play...
		let iteration = 0;
		const maxIterations = 1e3; // Set number of iterations here
		let monsterAlive = true;

		while (monsterAlive && iteration < maxIterations) {
			console.log(`Iteration ${iteration} of ${maxIterations}`);
			gameWorld = compose(
				world.monstersMove,
				world.monstersFight
			)(gameWorld);

			monsterAlive = world.isMonsterAlive(gameWorld);
			iteration++;
		}

		io.printResults(gameWorld);
	});
});
