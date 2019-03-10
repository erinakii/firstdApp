// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';
import $ from 'jquery';

// Import our contract artifacts and turn them into usable abstractions.
import paint_artifacts from '../../build/contracts/Paint.json';

var Paint = contract(paint_artifacts);

var accounts;
var account;
var paintInstance;

window.Color = {
	start: function() {
		window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'));

		// Bootstrap the MetaCoin abstraction for Use.
		Paint.setProvider(web3.currentProvider);

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

			let player = document.getElementById('player');
			player.innerHTML = `Current player is ${account}`;

			Color.startPaint();
		});

		var height = 20;
		var width = 20;
		var cells = [];

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

	startPaint: function() {
		console.log(account);
		Paint.new({
			from: account,
			value: web3.toWei(0.1, 'ether'),
			gas: 3000000
		})
			.then((instance) => {
				paintInstance = instance;
				console.log(instance);

				$(
					$('#board').click(function(event) {
						event.target.className = 'blue';
						let row = parseInt(event.target.dataset.row);
						let col = parseInt(event.target.dataset.col);

						Color.setPaint(row, col);
					})
				);
			})
			.catch((error) => {
				console.log(error);
			});
	},

	setPaint: function(row, col) {
		paintInstance
			.setPaint(row, col, {
				from: account
				// value: web3.toWei(0.1, 'ether'),
				// gas: 3000000
			})
			.then((result) => {
				console.log(result);
			})
			.then(() => Color.printBoard());
	},

	printBoard: function() {
		paintInstance.getBoard.call().then((board) => {
			console.log(board);
		});
	}
};

// window.addEventListener('load', function() {
// 	if (typeof web3 !== 'undefined') {
// 		console.warn(
// 			"Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask"
// 		);
// 		// Use Mist/MetaMask's provider
// 		window.web3 = new Web3(web3.currentProvider);
// 	} else {
// 		console.warn(
// 			"No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask"
// 		);
// 		window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'));
// 	}
// });
