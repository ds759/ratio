const stdin = process.stdin;
const stdout = process.stdout;

// Reads given text file
const readFile = (fileName, callback) => {
	const lineReader = require("readline").createInterface({
		input: require("fs").createReadStream(fileName)
	});

	let file = [];

	// Read data into array
	lineReader
		.on("line", line => file.push(line))
		.on("error", line => callback(error, null))
		.on("close", () => {
			// Convert array into JSON object
			var json = file.map(line => {
				return line
					.split(new RegExp([" ", "="].join("|"), "g"))
					.reduce((obj, val, i, array) => {
						i === 0
							? (obj["name"] = array[0])
							: i % 2 === 0
							? (obj[array[i - 1]] = val)
							: null;
						return obj;
					}, {});
			});
			callback(null, json);
		});
};

// Prompts user to enter total monsters
const getMonsterInput = (max, callback) => {
	getInput(max, callback);
};

// Recursively called until the correct type of input is entered
const getInput = (max, callback) => {
	const readline = require("readline").createInterface({
		input: process.stdin,
		output: process.stdout
	});

	readline.question(
		`Please enter the number of monsters (<${max})\n`,
		number => {
			readline.close();
			if (checkValidInput(number, max)) return callback(number);
			getInput(max, callback);
		}
	);
};
const checkValidInput = (input, max) => {
	try {
		if (isNaN(parseInt(input))) {
			throw "NaN";
		} else if (parseInt(input) > max - 1) {
			throw "tooBig";
		} else if (parseInt(input) < 0) {
			throw "noNegative";
		} else {
			return true;
		}
	} catch (e) {
		if (e === "NaN") console.log("You must input an integer!\n\n");
		if (e === "tooBig")
			console.log(`You must enter an integer less than ${max}!\n\n`);
		if (e === "noNegative")
			console.log("Must be a positive amount of monsters!\n\n");
		return false;
	}
};

const printResults = world => {
	console.log("\n\n\nPrinting final results...\n");
	Object.keys(world).forEach(key => {
		const city = world[key];
		const directions = Object.keys(city.direction);

		const cityOutput = directions.reduce(
			(acc, direction) =>
				city.existing && city.direction[direction]
					? acc + ` ${direction}=${city.direction[direction]}`
					: acc,
			city.name
		);
		if (cityOutput.indexOf("=") !== -1) console.log(cityOutput); // Only prints existing cities
	});
};

module.exports.readFile = readFile;
module.exports.printResults = printResults;
module.exports.getMonsterInput = getMonsterInput;
