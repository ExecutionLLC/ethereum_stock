const Web3 = Web3_require('web3');
const web3 = new Web3();

const BigNumber = Web3_require('bignumber.js');

if (!localStorage['Nodes']) {
    var Nodes = {
        Node1: {
            name: 'igor',
            url: 'http://192.168.1.101:8111/',
            chainId: 15
        },
        Node2: {
            name: 'dima',
            url: 'http://192.168.1.104:8111/',
            chainId: 15
        },
    };
    localStorage.setItem('Nodes', JSON.stringify(Nodes));
}

if (!localStorage['selectedNodeValue']) {
    localStorage.setItem('selectedNodeValue', 'Node1');
}

var currentNode = JSON.parse(localStorage['Nodes']).Node1;
web3.setProvider(new web3.providers.HttpProvider(currentNode.url));
web3.eth.defaultAccount = web3.eth.coinbase;

const CONTRACT = {
    ID: '0x68487936c94e1c8fe0fc7d5cc79c5d6b1f330a2a',
    ABI: [{"constant":false,"inputs":[],"name":"returnAllTokens","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_n","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_n","type":"uint256"}],"name":"returnToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"availableTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tokenPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_price","type":"uint256"}],"name":"setPrice","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_n","type":"uint256"}],"name":"emitTokens","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"clientTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_n","type":"uint256"},{"name":"_price","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newPrice","type":"uint256"}],"name":"priceChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_availableTokens","type":"uint256"}],"name":"availableTokensChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_client","type":"address"},{"indexed":false,"name":"_isAcquired","type":"bool"},{"indexed":false,"name":"_n","type":"uint256"},{"indexed":false,"name":"_currentTokenPrice","type":"uint256"}],"name":"tokenAcquiredOrReturned","type":"event"}]
};

let currentWallet = null;

const Page = {
    ELEMENT_ID: {
        BALANCE: {
            WALLET_INPUT: 'u40_input',
            CHECK_BUTTON: 'u42',
            CONTAINER: 'u21',
            TOKENS: 'balance-tokens',
            ETH: 'balance-eth',
            BTC: 'balance-btc',
            WAIT: 'u36-1'
        },
        TOKENS_HISTORY: {
            TEMPLATE: 'tokens-history-template',
            OPERATION: {
                TIME: 'tokens-history-op-time',
                NAME: 'tokens-history-op-name',
                COUNT: 'tokens-history-op-count',
                PRICE: 'tokens-history-op-price'
            },
            CONTAINER: 'tokens-history-container'
        },
        CHART: {
            ID: 'myChart',
            BUTTONS: {
                WHOLE: 'u13',
                MONTH: 'u11'
            }
        },
        ALTER_WALLET: {
            PRIVATE_KEY: {
                KEY: 'add-wallet-private-key',
                BUTTON: 'add-wallet-private-key-button'
            },
            FILE: {
                FILE: 'add-wallet-file',
                PASWORD: 'add-wallet-file-password',
                BUTTON: 'add-wallet-file-button'
            },
            OPERATIONS: {
                CONTAINER: 'wallet-ops',
                WALLET_ADDRESS: 'wallet-address',
                BUY: {
                    COUNT: 'buy-tokens-count',
                    BUTTON: 'buy-tokens-button',
                    WAIT: 'buy-tokens-wait'
                },
                SELL: {
                    COUNT: 'sell-tokens-count',
                    BUTTON: 'sell-tokens-button',
                    WAIT: 'sell-tokens-wait'
                }
            },
            SELECT_NODE: {
                NODE: 'select-node',
                NAME: 'select-node-name',
                URL: 'select-node-url',
                CHAIN_ID: 'select-node-chain-id',
                ADD: 'select-node-add'
            }
        }
    },
    $id(id) {
        return $(`#${id}`);
    },
    updateNodes() {
        $.each(JSON.parse(localStorage['Nodes']), function (key, value) {
            Page.appendNode(key, value.name);
        });
        Page.selectNode(localStorage['selectedNodeValue']);
    },
    appendNode(value, name) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.SELECT_NODE.NODE)
            .append($('<option></option>')
                .attr("value", value)
                .text(name));
    },
    showBalanceWait(show) {
        Page.$id(Page.ELEMENT_ID.BALANCE.WAIT).toggle(show);
    },
    showBalance(tokens, eth, btc) {

        function strNull(s) {
            return s == null ? '...' : s;
        }

        Page.$id(Page.ELEMENT_ID.BALANCE.CONTAINER)
            .removeClass('ax_default_hidden')
            .attr('style', '')
            .toggle(tokens != null);
        Page.$id(Page.ELEMENT_ID.BALANCE.TOKENS).text(strNull(tokens));
        Page.$id(Page.ELEMENT_ID.BALANCE.ETH).text(strNull(eth));
        Page.$id(Page.ELEMENT_ID.BALANCE.BTC).text(strNull(btc));
    },
    showTokensHistory(res) {
        const $tmpl = Page.$id(Page.ELEMENT_ID.TOKENS_HISTORY.TEMPLATE);

        function addElementIdKey($el, key) {
            const newId = $el[0].id + '-' + key;
            $el.prop('id', newId);
        }

        function setElementContent($el, key, text) {
            addElementIdKey($el, key);
            $el.text(text);
        }

        function setElementIdContent($parent, elId, key, text) {
            const $el = $parent.find(`#${elId}`);
            setElementContent($el, key, text);
        }

        const $rows = res.map((item, index) => {
            const $el = $tmpl.clone().show();
            addElementIdKey($el, index);
            setElementIdContent($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.TIME, index, moment(item.timestamp * 1000).format('DD.MM.YY HH:mm:ss'));
            setElementIdContent($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.NAME, index, item.isAsquired ? 'buy' : 'sell');
            setElementIdContent($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.COUNT, index, item.count);
            setElementIdContent($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.PRICE, index, item.tokenPrice);
            return $el;
        });
        Page.$id(Page.ELEMENT_ID.TOKENS_HISTORY.CONTAINER).empty().append($rows);

    },
    selectNode(valueToSelect) {
        var element = document.getElementById(Page.ELEMENT_ID.ALTER_WALLET.SELECT_NODE.NODE);
        element.value = valueToSelect;
    },
    getCurrentNode() {
        var curNodeName = localStorage['selectedNodeValue'];
        return JSON.parse(localStorage['Nodes'])[curNodeName];
    },
    showError(error) {
        $error = $('#balance-error');
        $error.toggle(error != null);
        $error.text(error);
    },
    showCurrentWallet(wallet) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.CONTAINER).toggle(!!wallet);
        if (!wallet) {
            return;
        }
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.WALLET_ADDRESS).text(wallet.address);
    },
    toggleBuyWait(show) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.COUNT).prop('disabled', show);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.BUTTON).prop('disabled', show);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.WAIT).toggle(show);
    },
    toggleSellWait(show) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).prop('disabled', show);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.BUTTON).prop('disabled', show);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WAIT).toggle(show);
    },
    initTokenPriceChart(callback) {
        const ctx = Page.$id(Page.ELEMENT_ID.CHART.ID)[0];
        if (!ctx) {
            callback('No canvas element');
            return;
        }
        Ether.getPriceHistoryData(
            web3,
            CONTRACT.ABI,
            CONTRACT.ID,
            (err, res) => {
                if (!err) {
                    TokenPriceChart.createChart(ctx, res);
                }
                callback(err, res);
            }
        );
    },
    showTokenPriceChart(fromDate) {
        TokenPriceChart.show(fromDate);
    }
};

TokenPriceChart = {
    chart: null,
    data: null,
    createChart(ctx, data) {
        TokenPriceChart.data = data;
        TokenPriceChart.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'ETH',
                        backgroundColor: 'transparent',
                        borderColor: 'red',
                        lineTension: 0,
                        yAxisID: "y-axis-1",
                        data: [],//data.eth,
                        pointRadius: 0
                    },
                    {
                        label: 'ETH-dots',
                        backgroundColor: 'transparent',
                        borderColor: 'red',
                        borderDash: [0, 1],
                        lineTension: 0,
                        yAxisID: "y-axis-1",
                        data: [],//data.ethDots
                    },
                    {
                        label: 'BTC',
                        backgroundColor: 'transparent',
                        borderColor: 'blue',
                        lineTension: 0,
                        yAxisID: "y-axis-2",
                        data: [],//data.btc
                    },
                ]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            tooltipFormat: 'll HH:mm'
                        }
                    }],
                    yAxes: [{
                        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: "left",
                        id: "y-axis-1",
                    }, {
                        type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: "right",
                        id: "y-axis-2",
                        gridLines: {
                            drawOnChartArea: false
                        }
                    }]
                },
                responsive: false
            }
        });
    },
    show(fromDate) {
        const newEth = XYData.setRange(TokenPriceChart.data.eth, fromDate, +new Date());
        const newEthDots = XYData.setRange(TokenPriceChart.data.ethDots, fromDate, +new Date());
        const newBtc = XYData.setRange(TokenPriceChart.data.btc, fromDate, +new Date());

        TokenPriceChart.chart.data.datasets[0].data = newEth;
        TokenPriceChart.chart.data.datasets[1].data = newEthDots;
        TokenPriceChart.chart.data.datasets[2].data = newBtc;
        TokenPriceChart.chart.update();
    }
};

const Ether = {
    getBalance(contract, walletId, callback) {
        let tokens;
        let tokenPrice;
        try {
            tokens = new BigNumber(contract.clientTokens(walletId)).toNumber();
            tokenPrice = new BigNumber(web3.fromWei(contract.tokenPrice(), 'ether')).toNumber();
        } catch (e) {
            callback(e);
            return;
        }
        API.getBtcFromEtH((error, result) => {
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
    _getData(web3, abiArray, address, callback) {
        const MyContract = web3.eth.contract(abiArray);
        const myContractInstance = MyContract.at(address);
        const myEvent = myContractInstance.priceChanged({}, {fromBlock: 0, toBlock: 'latest'});
        myEvent.get((error, logs) => {
            if (error) {
                callback(error);
            } else {
                async.map(logs, (log, callback) => {
                    web3.eth.getBlock(log.blockNumber, (error, block) => {
                        const {transactionIndex, args: {_newPrice}} = log;
                        const ethPrice = new BigNumber(web3.fromWei(_newPrice, 'ether')).toNumber();
                        const {timestamp} = block;
                        callback(null, {
                            timestamp,
                            transactionIndex,
                            price: ethPrice
                        });
                    });
                }, callback);
            }
        });
    },
    getPriceHistoryData(web3, abiArray, address, callback) {

        function transactionsToXY(transactions) {
            const transactionsForTimestamps = transactions.reduce(
                (parts, trx) => {
                    const {transactionIndex, timestamp} = trx;
                    const transactionsForTimestamp = parts[timestamp] || 0;
                    const atLeastTransactionsForTimestamp = transactionIndex + 1;
                    if (transactionsForTimestamp < atLeastTransactionsForTimestamp) {
                        parts[timestamp] = atLeastTransactionsForTimestamp;
                    }
                    return parts;
                },
                {}
            );
            const lastTimestamp = Math.floor(+new Date() / 1000);
            const transactionsInLastTimestamp = transactionsForTimestamps[lastTimestamp] || 0;
            transactionsForTimestamps[lastTimestamp] = transactionsInLastTimestamp + 1;
            return transactions.map(trx => ({
                x: 1000 * (trx.timestamp + trx.transactionIndex / transactionsForTimestamps[trx.timestamp]),
                y: trx.price
            }));
        }

        try {
            Ether._getData(
                web3,
                abiArray,
                address,
                (err, res) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    const transactionsXY = transactionsToXY(res);
                    const data = XYData.setRange(transactionsXY, 0, +new Date());
                    const steppedData = XYData.makeStepped(data);
                    const steppedDataMarks = XYData.makeLastInX(steppedData);
                    const dataRange = XYData.getRange(steppedData);
                    const BTCCurrencyInterval = 1000 * 60 * 60 * 6;
                    const currencyIntervalsCountEstimate = dataRange / BTCCurrencyInterval;
                    const steppedDataWIntermediate = currencyIntervalsCountEstimate > 1000 ? steppedData : XYData.addIntermediatePoints(steppedData, BTCCurrencyInterval);
                    API.getBtcFromEthHistoryArray(steppedDataWIntermediate.map(xy => xy.x), (err, btc) => {
                        const dataBtc = steppedDataWIntermediate.map((d, i) => ({
                            x: d.x,
                            y: d.y * btc[i].ETH.BTC
                        }));
                        callback(null, {eth: steppedData, ethDots: steppedDataMarks, btc: dataBtc});
                    });
                }
            );
        }
        catch (e) {
            callback(e);
        }
    },
    getPriceData(client, contract, callback) {
        const myEvent = contract.tokenAcquiredOrReturned({_client: client}, {fromBlock: 0, toBlock: 'latest'});
        myEvent.get((error, logs) => {
            if (error) {
                callback(error);
            } else {
                async.map(logs.slice(-5), (log, callback) => {
                    web3.eth.getBlock(log.blockNumber, (error, block) => {
                        const {args: {_currentTokenPrice, _isAcquired, _n}} = log;
                        const {timestamp} = block;
                        callback(null, {
                            timestamp,
                            tokenPrice: new BigNumber(web3.fromWei(_currentTokenPrice, 'ether')).toNumber(),
                            isAsquired: _isAcquired,
                            count: new BigNumber(_n).toNumber()
                        });
                    });
                }, callback);
            }
        });
    }
};

const API = {
    getBtcFromEtH(callback) {
        $.get('https://min-api.cryptocompare.com/data/price', {fsym: 'ETH', tsyms: 'BTC'})
            .done(function (data) {
                callback(null, data);
            })
            .fail(function (error) {
                callback(error);
            });
    },
    getBtcFromEthHistory(ts, callback) {
        $.get('https://min-api.cryptocompare.com/data/pricehistorical', {fsym: 'ETH', tsyms: 'BTC', ts: ts})
            .done(function (data) {
                callback(null, data);
            })
            .fail(function (error) {
                callback(error);
            });
    },
    getBtcFromEthHistoryArray(timestamps, callback) {
        const uniqueTimestamps = timestamps.reduce(
            (obj, ts) => {
                obj[ts] = ts;
                return obj;
            },
            Object.create(null)
        );
        async.map(
            uniqueTimestamps,
            (ts, callback) => {
                API.getBtcFromEthHistory(ts, (err, res) => {
                    if (!err)
                        uniqueTimestamps[ts] = res;
                    callback(err, res);
                });
            },
            (err) => {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, timestamps.map(ts => uniqueTimestamps[ts]));
            }
        );
    }
};

function readFileContent(file, callback) {
    const fr = new FileReader();
    fr.onload = function () {
        callback(fr.result);
    };
    fr.readAsText(file);
}

const XYData = {
    makeStepped(data) {
        return data.reduce(
            (res, item) => {
                if (res.prev && res.prev.x !== item.x) {
                    res.newData.push({
                        x: item.x,
                        y: res.prev.y
                    });
                }
                res.newData.push(item);
                res.prev = item;
                return res;
            },
            {newData: [], prev: null}
        ).newData;
    },
    makeLastInX(data) {
        return data.filter((item, i) => i === data.length - 1 || item.x !== data[i + 1].x);
    },
    addIntermediatePoints(data, maxInterval) {
        return data.reduce(
            (res, xy, index) => {
                if (index >= data.length - 1) {
                    res.push(xy);
                    return res;
                }
                const intervalLength = data[index + 1].x - xy.x;
                if (intervalLength <= maxInterval) {
                    res.push(xy);
                    return res;
                }
                const newPointsCount = Math.floor(intervalLength / maxInterval);
                const newXs = new Array(newPointsCount)
                    .fill(null)
                    .map((_, i) => ({
                        x: xy.x + Math.floor((i + 1) * intervalLength / (newPointsCount + 1)),
                        y: xy.y
                    }));
                return res.concat([xy]).concat(newXs);
            },
            []
        );
    },
    setRange(data, min, max) {

        function findDataInterval(data, x, iMin, iMax) {
            if (iMin == null) {
                return findDataInterval(data, x, 0, iMax);
            }
            if (iMax == null) {
                return findDataInterval(data, x, iMin, data.length - 1);
            }
            if (iMin >= data.length) {
                return -1;
            }
            if (iMax < 0) {
                return -1;
            }
            if (iMin > iMax) {
                return -1;
            }
            if (x < data[iMin].x) {
                return iMin - 1;
            }
            if (x >= data[iMax].x) {
                return iMax;
            }
            const range = iMax - iMin;
            if (range <= 1) {
                return iMin;
            }
            const iMid = iMin + Math.floor(range / 2);
            if (x < data[iMid].x) {
                return findDataInterval(data, x, iMin, iMid);
            } else {
                return findDataInterval(data, x, iMid, iMax);
            }
        }

        function rangeMin(data, min) {
            const minIndex = findDataInterval(data, min);
            if (minIndex < 0) {
                return data;
            } else {
                if (data.length < 1) {
                    return data;
                }
                if (data[minIndex].x === min) {
                    return data.slice(minIndex);
                } else {
                    return [{x: min, y: data[minIndex].y}].concat(data.slice(minIndex + 1));
                }
            }
        }

        function rangeMax(data, max) {
            const maxIndex = findDataInterval(data, max);
            if (maxIndex < 0) {
                return [];
            } else {
                if (data[maxIndex].x === max) {
                    return data.slice(0, maxIndex + 1);
                } else {
                    return data.slice(0, maxIndex + 1).concat([{x: max, y: data[maxIndex].y}]);
                }
            }
        }

        const dataRangeMin = rangeMin(data, min);
        const dataRangeMinMax = rangeMax(dataRangeMin, max);
        return dataRangeMinMax;
    },
    getRange(data) {
        if (data.length < 2) {
            return 0;
        }
        return data[data.length - 1].x - data[0].x;
    }
};

function onload() {
    Page.showError();
    Page.showBalance();
    Page.showBalanceWait(false);
    currentWallet = null;
    Page.showCurrentWallet();
    Page.updateNodes();

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.SELECT_NODE.NODE).change(() => {
         var curNodeName = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.SELECT_NODE.NODE).val();
        currentNode = JSON.parse(localStorage['Nodes'])[curNodeName];
        web3.setProvider(new web3.providers.HttpProvider(currentNode.url));
        localStorage.setItem('selectedNodeValue', curNodeName);
    });

    Page.$id(Page.ELEMENT_ID.BALANCE.CHECK_BUTTON).click(() => {
        Page.showBalanceWait(true);
        Page.showError();
        const walletId = Page.$id(Page.ELEMENT_ID.BALANCE.WALLET_INPUT).val();
        const contract = web3.eth
            .contract(CONTRACT.ABI)
            .at(CONTRACT.ID);
        Ether.getBalance(contract, walletId, (err, balance) => {
            if (err) {
                Page.showBalanceWait(false);
                Page.showError(err);
            } else {
                Ether.getPriceData(walletId, contract, (err, res) => {
                    Page.showBalanceWait(false);
                    Page.showBalance(balance.tokens, balance.eth, balance.btc);
                    Page.showTokensHistory(res);
                });
            }
        });
    });

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.BUTTON).click(() => {
        currentWallet = null;
        Page.showCurrentWallet();
        const Wallet = ethers.Wallet;
        const privateKey = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.KEY).val();
        const privateKey0x = /^0x/.test(privateKey) ? privateKey : `0x${privateKey}`;
        var currentNode = Page.getCurrentNode();
        const wallet = new Wallet(privateKey0x, new ethers.providers.JsonRpcProvider(currentNode.url, false, currentNode.chainId));
        currentWallet = wallet;
        Page.showCurrentWallet(wallet);
    });

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.BUTTON).click(() => {
        currentWallet = null;
        Page.showCurrentWallet();
        const Wallet = ethers.Wallet;
        const file = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE)[0].files[0];
        readFileContent(file, (content) => {
            const password = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.PASWORD).val();
            Wallet.fromEncryptedWallet(content, password)
                .then((wallet) => {
                    var currentNode = Page.getCurrentNode();
                    wallet.provider = new ethers.providers.JsonRpcProvider(currentNode.url, false, currentNode.chainId);
                    currentWallet = wallet;
                    Page.showCurrentWallet(wallet);
                });
        });
    });

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.BUTTON).click(() => {
        Page.toggleBuyWait(true);
        const count = +Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.COUNT).val();
        const contract = web3.eth
            .contract(CONTRACT.ABI)
            .at(CONTRACT.ID);
        const tokenPrice = contract.tokenPrice();
        const wei = tokenPrice.times(count);
        const weiStr = `0x${wei.toString(16)}`;
        const MyContract = new ethers.Contract(CONTRACT.ID, CONTRACT.ABI, currentWallet);
        MyContract.buy({value: weiStr, gasLimit: 80000})
            .then((res) => {
                console.log(res);
                return res.hash;
            })
            .then((transactionHash) => {
                currentWallet.provider.once(transactionHash, (transaction) => {
                    console.log('Transaction buy Minded: ' + transaction.hash);
                    console.log(transaction);
                    Page.toggleBuyWait(false);
                });
            });
    });

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.SELECT_NODE.ADD).click(() => {
        var name = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.SELECT_NODE.NAME).val();
        var url = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.SELECT_NODE.URL).val();
        var chainId = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.SELECT_NODE.CHAIN_ID).val();
        if (name && url && chainId) {
            //todo: generate uuid
            const id = Object.keys(localStorage[Node]).length;
            const Nodes = JSON.parse(localStorage['Nodes']);

            Nodes[id] = {
                name,
                url,
                chainId
            };
            localStorage.setItem('Nodes', JSON.stringify(Nodes));
            Page.appendNode(id, name);
        } else {
            //todo: log error
        }
    });

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.BUTTON).click(() => {
        Page.toggleSellWait(true);
        const count = +Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).val();
        console.log('sell tokens', count);
        const MyContract = new ethers.Contract(CONTRACT.ID, CONTRACT.ABI, currentWallet);
        MyContract.returnToken(count)
            .then((res) => {
                console.log(res);
                return res.hash;
            })
            .then((transactionHash) => {
                currentWallet.provider.once(transactionHash, (transaction) => {
                    console.log('Transaction sell Minded: ' + transaction.hash);
                    console.log(transaction);
                    MyContract.withdraw()
                        .then((res) => {
                            console.log(res);
                            return res.hash;
                        })
                        .then((transactionHash) => {
                            currentWallet.provider.once(transactionHash, (transaction) => {
                                console.log('Transaction back maney Minded: ' + transaction.hash);
                                console.log(transaction);
                                Page.toggleSellWait(false);
                            });
                        });
                });
            });
    });

    Page.initTokenPriceChart((err) => {
        if (err) {
            console.log('Init token chart error', err);
        } else {
            Page.$id(Page.ELEMENT_ID.CHART.BUTTONS.WHOLE).click(() => {
                Page.showTokenPriceChart(0);
            });
            Page.$id(Page.ELEMENT_ID.CHART.BUTTONS.MONTH).click(() => {
                Page.showTokenPriceChart(+moment().subtract(6, 'day'));
            });
            Page.showTokenPriceChart(0);
        }
    });
}

$(onload);
