const Web3 = require('web3');
const web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://192.168.1.101:8111/'));
web3.eth.defaultAccount = web3.eth.coinbase;

function clearElement(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

function setElementText(el, text) {
    clearElement(el);
    const textNode = document.createTextNode(text);
    el.appendChild(textNode);
}

function showBalanceWait(show) {
    const balanceWait = document.getElementById('balance-wait');
    if (balanceWait) {
        balanceWait.style.display = show ? 'block' : 'none';
    }
}

function showBalance(ae, eth, btc) {

    function showBalanceAt(elementId, balance) {
        const balanceEl = document.getElementById(elementId);
        if (balanceEl) {
            setElementText(balanceEl, '' + balance)
        }
    }

    const balanceContainer = document.getElementById('balance-container');
    if (balanceContainer) {
        balanceContainer.style.display = ae ? 'block' : 'none';
        showBalanceAt('balance-ae', ae);
        showBalanceAt('balance-eth', eth);
        showBalanceAt('balance-btc', btc);
    }
}

function getData(url, abiArray, address, callback) {
    const web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(url));
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

function onload() {
    showBalance();
    showBalanceWait(false);
    const balanceCheckInput = document.getElementById('balance-id');
    if (balanceCheckInput) {
        const balanceCheckButton = document.getElementById('balance-check-button');
        if (balanceCheckButton) {
            balanceCheckButton.addEventListener('click', () => {
                showBalanceWait(true);
                const coinbase = balanceCheckInput.value;
                const originalBalance = web3.fromWei(web3.eth.getBalance(coinbase), 'ether');
                web3.eth.filter('latest').watch(function() {
                    const currentBalance = web3.fromWei(web3.eth.getBalance(coinbase));//.toNumber();
                    console.log(originalBalance + ' ' + currentBalance);
                    // document.getElementById("current").innerText = 'current: ' + currentBalance;
                    // document.getElementById("diff").innerText = 'diff:    ' + (currentBalance - originalBalance);
                    showBalance(currentBalance, currentBalance, currentBalance);
                });
            });
        }
    }
    getData(
        'http://192.168.1.101:8111/',
        [{"constant":false,"inputs":[],"name":"returnAllTokens","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_n","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_n","type":"uint256"}],"name":"returnToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"availableTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tokenPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_price","type":"uint256"}],"name":"setPrice","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_n","type":"uint256"}],"name":"emitTokens","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"clientTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_n","type":"uint256"},{"name":"_price","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newPrice","type":"uint256"},{"indexed":false,"name":"_time","type":"uint256"}],"name":"priceChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_availableTokens","type":"uint256"},{"indexed":false,"name":"_time","type":"uint256"}],"name":"availableTokensChanged","type":"event"}],
        '0xdd78f047453b382db2aff7bbd7b4f80f32950b83',
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
                        steppedLine: 'after',
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

window.addEventListener('DOMContentLoaded', onload);
