// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css';

// Import library
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';
import $ from 'jquery';

// Import our contract artifacts and turn them into usable abstractions.
import game_artifacts from '../../build/contracts/Game.json';

var Game = contract(game_artifacts);

var accounts;
var account;
var gameInstance;

window.App = {
	start: function() {
		var height = 3;
		var width = 3;
		var cells = [];

		let title = document.getElementById('title');
		title.innerHTML = 'You are now playing Tic Tac Toe';

		//connect to Web3
		window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'));

		//set provider
		Game.setProvider(web3.currentProvider);

		// Get the initial accountsin truffle or ganache developer tools
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

			let player = document.getElementById('player');
			player.innerHTML = `Current player is ${account}`;

			App.createNewGame();
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
		} else {
			account = accounts[0];
		}
		let player = document.getElementById('player');
		player.innerHTML = `Current player is ${account}`;
	},

	createNewGame: function() {
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
							value = 'X';
						} else {
							value = 'O';
						}
						event.target.innerHTML = `${value}`;
						let row = parseInt(event.target.dataset.row);
						let col = parseInt(event.target.dataset.col);

						App.setPosition(row, col);
					})
				);
			})
			.catch((error) => {
				console.log(error);
			});
	},

	setPosition: function(row, col) {
		console.log(`${row}, ${col} is being marked in our local node`);
		gameInstance
			.SetPosition(row, col, { from: account })
			.then((result) => {
				console.log(result);
			})
			.then(() => App.printBoard());
	},

	printBoard: function() {
		gameInstance.getBoard.call().then((board) => {
			console.log(board);
		});
	}
};
