// World Object is made up of given cities
// Cities are instances of the City class
// Cities act as a Graph / LinkedList (with 4 links)
// The 'monsters' field could have been a queue, but an array provided full functionality
// Uses a 'Builder' OOP design pattern, as varying constructor parameters
class City {
	constructor(build) {
		this.name = build.name;
		this.existing = true;
		this.monsters = [];
		this.direction = {
			north: build.north,
			south: build.south,
			east: build.east,
			west: build.west
		};
	}
	static get Builder() {
		class Builder {
			constructor(name) {
				this.name = name;
			}
			setNorth(north) {
				this.north = north ? north : null;
				return this;
			}
			setSouth(south) {
				this.south = south ? south : null;
				return this;
			}
			setEast(east) {
				this.east = east ? east : null;
				return this;
			}
			setWest(west) {
				this.west = west ? west : null;
				return this;
			}
			build() {
				return new City(this);
			}
		}
		return Builder;
	}
}

// Creates given cities and places them into world object
const World = cities =>
	cities.reduce((world, city) => {
		let cityObj = new City.Builder(city.name)
			.setNorth(city.north)
			.setSouth(city.south)
			.setEast(city.east)
			.setWest(city.west)
			.build();
		world[[city.name]] = cityObj;
		return world;
	}, {});

// Returns a random int less than a given max value
const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

// Returns a random valid movement for a monster out of a city
const getRandomMovement = r => {
	const routes = Object.keys(r).filter(key => {
		if (r[key]) return r[key];
	});
	return r[routes[getRandomInt(routes.length)]];
};

// Used in setting up the world object
// Allocates one monster to each city
// Takes an array of monsters
// - Each element contains a unique monster, which is pushed into a unique city at random
// Returns the world object which now contains monsters in each city
const addMonsters = (world, monsters) => {
	let citiesChosen = [];
	const range = Object.keys(world).length;

	// Selecting a city at random for each monster
	while (citiesChosen.length < monsters.length) {
		let randomStartPosition = getRandomInt(range);
		if (citiesChosen.indexOf(randomStartPosition) === -1)
			citiesChosen.push(randomStartPosition);
	}

	// For each city in the world, if the city is is a chosen city
	// add the monster to it
	Object.keys(world).map((key, i) => {
		if (citiesChosen.indexOf(i) !== -1) {
			world[key].monsters.push(monsters.shift());
		}
	});

	return world;
};

// Updates the world object and city objects included to reference each monsters random movement
// This is done on every iteration
const monstersMove = world => {
	Object.keys(world).map(key => {
		if (world[key].monsters.length === 1) {
			const newCity = getRandomMovement(world[key].direction);

			// This is false if all routes out of a city have been destroyed
			if (newCity) world[newCity].monsters.push(world[key].monsters.shift());
		}
	});
	return world;
};

// Creates and returns a new world object which contains the updated city objects
const monstersFight = world => {
	let destroyedWorld = world;

	Object.keys(destroyedWorld).forEach(city => {
		// We're keeping track of all the cities states (destroyed or not)
		// Hence, we only need to consider destryoing a city if it hasn't already been destroyed
		if (
			destroyedWorld[city].existing &&
			destroyedWorld[city].monsters.length > 1
		) {
			destructionMessage(destroyedWorld[city].monsters, city);
			destroyedWorld = deleteCity(destroyedWorld, city);
		}
	});
	return destroyedWorld;
};

const destructionMessage = (monsters, city) => {
	console.log(
		`${city} has been destroyed by ${monsters.join().replace(/,/g, " and ")}`
	);
};

// Probably a smoother way to do this, but this is robust for now
// Creates a new world object, which is then updated so that:
// - The given city is marked as nonexistent
// - Stops other cities leading to this city
const deleteCity = (world, city) => {
	let newWorld = world;

	newWorld[city].existing = false;

	if (world[city].direction.north)
		newWorld[world[city].direction.north].direction.south = null;
	newWorld[city].direction.north = null;

	if (world[city].direction.south)
		newWorld[world[city].direction.south].direction.north = null;
	newWorld[city].direction.south = null;

	if (world[city].direction.east)
		newWorld[world[city].direction.east].direction.west = null;
	newWorld[city].direction.east = null;

	if (world[city].direction.west)
		newWorld[world[city].direction.west].direction.east = null;
	newWorld[city].direction.west = null;

	return newWorld;
};

// Counts total monsters alive in existing cities
const isMonsterAlive = world => {
	const totalAliveMonsters = Object.keys(world).reduce(
		(total, city) =>
			world[city].existing ? total + world[city].monsters.length : total,
		0
	);
	return totalAliveMonsters > 1 ? true : false;
};

module.exports.world = World;
module.exports.addMonsters = addMonsters;
module.exports.monstersMove = monstersMove;
module.exports.deleteCity = deleteCity;
module.exports.monstersFight = monstersFight;
module.exports.isMonsterAlive = isMonsterAlive;
