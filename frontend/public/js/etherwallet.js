const Web3 = require('web3');
const web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://192.168.1.101:8111/'));
web3.eth.defaultAccount = web3.eth.coinbase;

const CONTRACT = {
    ID: '0x231fe53762953bedf6ff9dfe0a838be2b85e5c72',
    ABI: [{"constant":false,"inputs":[],"name":"returnAllTokens","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_n","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_n","type":"uint256"}],"name":"returnToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"availableTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tokenPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_price","type":"uint256"}],"name":"setPrice","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_n","type":"uint256"}],"name":"emitTokens","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"clientTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_n","type":"uint256"},{"name":"_price","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newPrice","type":"uint256"}],"name":"priceChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_availableTokens","type":"uint256"}],"name":"availableTokensChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_client","type":"address"},{"indexed":false,"name":"_n","type":"uint256"},{"indexed":false,"name":"_currentTokenPrice","type":"uint256"}],"name":"tokenAcquired","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_client","type":"address"},{"indexed":false,"name":"_n","type":"uint256"},{"indexed":false,"name":"_currentTokenPrice","type":"uint256"}],"name":"tokenReturned","type":"event"}]
};

const Page = {
    showBalanceWait(show) {
        $('#balance-wait').toggle(show);
    },
    showBalance(tokens, eth, btc) {

        function strNull(s) {
            return s == null ? '...' : s;
        }

        $('#balance-container').toggle(tokens != null);
        $('#balance-tokens').text(strNull(tokens));
        $('#balance-eth').text(strNull(eth));
        $('#balance-btc').text(strNull(btc));
    },
    showError(error) {
        $error = $('#balance-error');
        $error.toggle(error != null);
        $error.text(error);
    }
};

const Ether = {
    getBalance(contract, walletId, callback) {
        let tokens;
        let tokenPrice;
        try {
            tokens = contract.clientTokens(walletId).c[0];
            tokenPrice = contract.tokenPrice().c[0];
        } catch(e) {
            callback(e);
            return;
        }
        getBtcFromEtH((error, result) => {
            if (error) {
                callback(error);
            } else {
                const eth = tokens * tokenPrice;
                const btc = eth * result.BTC;
                callback(null, {
                    tokens,
                    tokenPrice,
                    eth,
                    btc
                });
            }
        });

    },
    getData(web3, abiArray, address, callback) {
        const MyContract = web3.eth.contract(abiArray);
        const myContractInstance = MyContract.at(address);
        const myEvent = myContractInstance.priceChanged({}, {fromBlock: 0, toBlock: 'latest', 'topics': ['timestamp']});
        myEvent.get((error, logs) => {
            if (error) {
                callback(error);
            } else {
                async.map(logs, (log, callback) => {
                    web3.eth.getBlock(log.blockNumber, (error, block) => {
                        const {transactionIndex, args: {_newPrice: {c}}} = log;
                        const {timestamp} = block;
                        callback(null, {
                            timestamp,
                            transactionIndex,
                            price: c[0]
                        });
                    });
                }, callback);
            }
        });
    }
};

function getBtcFromEtH(callback) {
    $.get('https://min-api.cryptocompare.com/data/price', { fsym: 'ETH', tsyms: 'BTC' } )
        .done(function( data ) {
            callback(null, data);
        })
        .fail(function(error) {
            callback(error);
        });
}

function readFileContent(file, callback) {
    const fr = new FileReader();
    fr.onload = function () {
        callback(fr.result);
    };
    fr.readAsText(file);
}

function onload() {
    Page.showError();
    Page.showBalance();
    Page.showBalanceWait(false);

    $('#balance-check-button').click(() => {
        Page.showBalanceWait(true);
        Page.showError();
        const walletId = $('#balance-id').val();
        const contract = web3.eth
            .contract(CONTRACT.ABI)
            .at(CONTRACT.ID);
        Ether.getBalance(contract, walletId, (err, balance) => {
            if (err) {
                Page.showError(err);
            } else {
                Page.showBalance(balance.tokens, balance.eth, balance.btc);
            }
        });
    });

    $('#add-wallet-private-key-button').click(() => {
        const Wallet = ethers.Wallet;
        const privateKey = $('#add-wallet-private-key').val();
        const privateKey0x = /^0x/.test(privateKey) ? privateKey : `0x${privateKey}`;
        const wallet = new Wallet(privateKey0x);
        console.log("Address: " + wallet.address);
    });

    $('#add-wallet-file-button').click(() => {
        const Wallet = ethers.Wallet;
        const file = $('#add-wallet-file')[0].files[0];
        readFileContent(file, (content) => {
            const password = $('#add-wallet-file-password').val();
            Wallet.fromEncryptedWallet(content, password)
                .then((wallet) => {
                    console.log(wallet.address);
                });
        });
    });

    Ether.getData(
        web3,
        CONTRACT.ABI,
        CONTRACT.ID,
        (err, res) => {
            if (err) {
                throw err;
            }
            console.log('err, res', err, res);
            const timeParts = res.reduce(
                (parts, log) => {
                    const time = log.timestamp;
                    const index = log.transactionIndex;
                    const indexes = parts[time] > index + 1 ? parts[time] : index + 1;
                    return Object.assign({}, parts, {
                        [time]: indexes
                    });
                },
                {}
            );
            console.log('timeParts');
            console.log(timeParts);
            const data = res.map(log => ({
                x: log.timestamp + log.transactionIndex / timeParts[log.timestamp],
                y: log.price
            }));
            console.log(data);
            const ctx = document.getElementById("myChart");
            new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Scatter Dataset',
                        lineTension: 0,
                        data: data
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            type: 'time'
                        }]
                    }
                }
            });
        }
    );
}

$(onload);
