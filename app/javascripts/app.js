// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css';

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';
import $ from 'jquery';

// Import our contract artifacts and turn them into usable abstractions.
import game_artifacts from '../../build/contracts/Game.json';

// MetaCoin is our usable abstraction, which we'll use through the code below.
var Game = contract(game_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var arrEventsFired;
var gameInstance;

window.App = {
	start: function() {
		var self = this;
		var height = 3;
		var width = 3;
		var cells = [];

		// Bootstrap the MetaCoin abstraction for Use.
		Game.setProvider(web3.currentProvider);

		// Get the initial account balance so it can be displayed.
		web3.eth.getAccounts(function(err, accs) {
			if (err != null) {
				alert('There was an error fetching your accounts.');
				return;
			}

			if (accs.length == 0) {
				alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
				return;
			}

			accounts = accs;
			account = accounts[0];
			arrEventsFired = [];

			let player = document.getElementById('player');
			player.innerHTML = `Current player is ${account}`;
		});

		//initialize board
		const table = document.createElement('tbody');
		for (let h = 0; h < height; h++) {
			const tr = document.createElement('tr');
			for (let w = 0; w < width; w++) {
				const td = document.createElement('td');
				td.dataset.row = h;
				td.dataset.col = w;
				cells.push(td);
				tr.append(td);
			}
			table.append(tr);
		}
		document.getElementById('board').append(table);
	},

	togglePlayer: function() {
		if (account === accounts[0]) {
			account = accounts[1];
			let player = document.getElementById('player');
			player.innerHTML = `Current player is ${account}`;
		}
	},

	createNewGame: function() {
		console.log('Hello! This is a new game');
		Game.new({
			from: account,
			value: web3.toWei(0.1, 'ether'),
			gas: 3000000
		})
			.then((instance) => {
				gameInstance = instance;
				console.log(instance);

				$(
					$('#board').click(function(event) {
						let value;
						if (account === accounts[0]) {
							value = 'hello';
						} else {
							value = 'goodbye';
						}
						event.target.innerHTML = `${value}`;
						let row = parseInt(event.target.dataset.row);
						let col = parseInt(event.target.dataset.col);

						if (account === accounts[0]) {
							App.setMines(row, col);
						} else {
							App.findMines(row, col);
						}
					})
				);
			})
			.catch((error) => {
				console.log(error);
			});
	},

	// joinGame: function() {
	// 	var gameAddress = prompt('Address of the Game');
	// 	if (gameAddress != null) {
	// 		Game.at(gameAddress)
	// 			.then((instance) => {
	// 				gameInstance = instance;
	// 				return gameInstance.joinGame({ from: account, value: web3.toWei(0.1, 'ether'), gas: 300000 });
	// 			})
	// 			.then((result) => {
	// 				console.log(result);
	// 			});
	// 	}
	// },

	setMines: function(row, col) {
		console.log(`${account} is setting up mines!`);
		console.log(`${row}, ${col} is being set`);
		gameInstance
			.SetPosition(row, col, { from: account })
			.then((result) => {
				console.log(result);
			})
			.then(() => App.printBoard(row, col));
	},

	findMines: function(row, col) {
		console.log(`${account} is looking for mines!`);
		gameInstance
			.FindPosition(row, col, {
				from: account,
				value: web3.toWei(0.1, 'ether'),
				gas: 3000000
			})
			.then((result) => {
				console.log(result);
			})
			.then(() => App.printBoard(row, col));
	},

	printBoard: function() {
		gameInstance.getBoard.call().then((board) => {
			console.log(board);
		});
	}
};

window.addEventListener('load', function() {
	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	// if (typeof web3 !== 'undefined') {
	// 	console.warn(
	// 		"Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask"
	// 	);
	// 	// Use Mist/MetaMask's provider
	// 	window.web3 = new Web3(web3.currentProvider);
	// } else {
	// 	console.warn(
	// 		"No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask"
	// 	);
	// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
	window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'));
	// }

	App.start();
});
