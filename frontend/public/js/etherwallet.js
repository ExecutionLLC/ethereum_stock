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
        $('#balance-container').toggle(!!tokens);
        $('#balance-tokens').text(tokens);
        $('#balance-eth').text(eth);
        $('#balance-btc').text(btc);
    }
};

const Ether = {
    getBalance(contract, walletId) {
        const tokens = contract.clientTokens(walletId).c[0];
        const tokenPrice = contract.tokenPrice().c[0];
        return {
            tokens,
            tokenPrice,
            eth: tokens * tokenPrice
        };
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

function onload() {
    Page.showBalance();
    Page.showBalanceWait(false);

    $('#balance-check-button').click(() => {
        Page.showBalanceWait(true);
        const walletId = $('#balance-id').val();
        const contract = web3.eth
            .contract(CONTRACT.ABI)
            .at(CONTRACT.ID);
        const balance = Ether.getBalance(contract, walletId);
        Page.showBalance(balance.tokens, balance.eth);
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
