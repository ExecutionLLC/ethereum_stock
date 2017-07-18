const Web3 = Web3_require('web3');
const web3 = new Web3();

const BigNumber = Web3_require('bignumber.js');

function initNode() {
    const currentNode = Nodes.getCurrentNode();
    web3.setProvider(new web3.providers.HttpProvider(currentNode.url));
    web3.eth.defaultAccount = web3.eth.coinbase;
}

try {
    initNode();
}
catch (e) {
    console.error(e);
}

const CONTRACT = {
    ID: '0x3f0bb3ede10ad2caed900e2f4f70e1b2ad5631b9',
    ABI: [{
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "approve",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "totalSupply", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {"name": "_recipient", "type": "address"}, {
            "name": "_value",
            "type": "uint256"
        }],
        "name": "transferFrom",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "progress",
        "outputs": [{"name": "_goal", "type": "uint256"}, {"name": "_bought", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_recipient", "type": "address"}],
        "name": "buyFor",
        "outputs": [],
        "payable": true,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "tokenPrice",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [],
        "name": "withdrawChange",
        "outputs": [],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_recipient", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "transfer",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "maxSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
        "name": "allowance",
        "outputs": [{"name": "remaining", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_newOwner", "type": "address"}],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "", "type": "address"}],
        "name": "pendingWithdrawals",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "type": "function"
    }, {
        "inputs": [{"name": "_tokenPrice", "type": "uint256"}, {"name": "_maxSupply", "type": "uint256"}],
        "payable": false,
        "type": "constructor"
    }, {"payable": true, "type": "fallback"}, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_buyer", "type": "address"}, {
            "indexed": true,
            "name": "_recipient",
            "type": "address"
        }, {"indexed": false, "name": "_change", "type": "uint256"}, {
            "indexed": false,
            "name": "_tokens",
            "type": "uint256"
        }, {"indexed": false, "name": "_availableSupply", "type": "uint256"}],
        "name": "TokensBought",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_from", "type": "address"}, {
            "indexed": true,
            "name": "_to",
            "type": "address"
        }],
        "name": "OwnershipTransferred",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_from", "type": "address"}, {
            "indexed": true,
            "name": "_to",
            "type": "address"
        }, {"indexed": false, "name": "_value", "type": "uint256"}],
        "name": "Transfer",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_owner", "type": "address"}, {
            "indexed": true,
            "name": "_spender",
            "type": "address"
        }, {"indexed": false, "name": "_value", "type": "uint256"}],
        "name": "Approval",
        "type": "event"
    }]
};

let currentWallet = null;

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
            tokens = new BigNumber(contract.balanceOf(walletId)).toNumber();
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
    getHistoryData(event, count, callback) {
        event.get((error, logs) => {
            if (error) {
                callback(error);
            } else {
                async.map(logs.slice(-count), (log, callback) => {
                    web3.eth.getBlock(log.blockNumber, (error, block) => {
                        const {args: {_from, _to, _value}} = log;
                        const {timestamp} = block;
                        callback(null, {
                            timestamp,
                            from: _from,
                            to: _to,
                            count: new BigNumber(_value).toNumber()
                        });
                    });
                }, (error, result) => {
                    callback(error, result);
                });
            }
        });
    },
    getPriceData(client, web3contract, callback) {
        const toClientEvent = web3contract.Transfer({_to: client}, {
            fromBlock: 0,
            toBlock: 'latest',
            topics: ['_from: client']
        });
        const fromClientEvent = web3contract.Transfer({_from: client}, {
            fromBlock: 0,
            toBlock: 'latest',
            topics: ['_from: client']
        });
        const historyCount = 5;
        async.parallel({
            toClientHistory: (callback) => Ether.getHistoryData(toClientEvent, historyCount, callback),
            fromClientHistory: (callback) => Ether.getHistoryData(fromClientEvent, historyCount, callback),
        }, (error, {toClientHistory, fromClientHistory}) => {
            if (error) {
                callback(error)
            } else {
                const allHistory = toClientHistory.concat(fromClientHistory);
                allHistory.sort((x, y) => {
                    return x.timestamp - y.timestamp
                }).slice(-historyCount);
                callback(null, allHistory);
            }
        });
    },
    buyTokens(wallet, contractAddress, value) {
        const provider = wallet.provider;
        const gasPricePromise = provider.getGasPrice();
        const transactionCountPromise = provider.getTransactionCount(wallet.address);

        return Promise.all([
            gasPricePromise,
            transactionCountPromise,
        ])
            .then((result) => {
                const gasPrice = result[0];
                const transactionCount = result[1];
                const transactionParams = {
                    to: contractAddress,
                    from: wallet.address,
                    value: value
                };
                return provider.estimateGas(transactionParams)
                    .then((gasLimit) => {
                        transactionParams.gasLimit = gasLimit;
                        const transaction = {
                            to: contractAddress,
                            from: wallet.address,
                            gasPrice,
                            gasLimit,
                            value: value,
                            nonce: transactionCount,
                            chainId: provider.chainId
                        };
                        const signedTransaction = wallet.sign(transaction);
                        return provider.sendTransaction(signedTransaction)
                    });

            })
            .then((hash) => {
                console.log(hash);
                return provider.waitForTransaction(hash)
            })
            .then((transaction) => console.log("The transaction was mined: Block " + transaction.hash));

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
    if (file.size > 102400) { // 100K JSON wallet will be our limit
        callback(`JSON file too big (${file.size} bytes)`);
        return;
    }
    const fr = new FileReader();
    fr.onload = function () {
        callback(null, fr.result);
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
        return rangeMax(dataRangeMin, max);
    },
    getRange(data) {
        if (data.length < 2) {
            return 0;
        }
        return data[data.length - 1].x - data[0].x;
    }
};

const Validator = {
    walletId(address) {
        if (address.substring(0, 2) !== '0x') {
            return false;
        } else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            return false;
        } else {
            return true;
        }
    },
    url(url) {
        return /^https?:\/\/[^/]+/.test(url);
    },
    chainId(chainId) {
        return /^\d+$/.test(chainId);
    },
    privateKey(key) {
        const prefixLength = key.substring(0, 2) === '0x' ? 2 : 0;
        const keyDigits = key.length - prefixLength;
        return keyDigits === 64 || keyDigits ===128 || keyDigits === 132;
    },
    tokenCount(count) {
        return /^\d+$/.test(count);
    }
};

function onload() {
    Page.toggleAddNodeGroup(false);
    Page.showBalanceError();
    Page.showBalance();
    Page.showTokensHistory();
    Page.showBalanceWait(false);
    currentWallet = null;
    Page.showCurrentWallet();
    Page.showAlterWalletPrivateKeyError();
    Page.showAlterWalletFileError();
    Page.showBuyTokensError();
    Page.showSellTokensError();
    Page.updateNodes();

    Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_SHOW_BUTTON).click(() => {
        Page.toggleAddNodeGroup(true);
        return false;
    });

    Page.$id(Page.ELEMENT_ID.NODES.REMOVE_NODE_BUTTON).click(() => {
        const curNodId = Page.$id(Page.ELEMENT_ID.NODES.NODE).val();
        const newNodeInfo = Nodes.removeNode(curNodId);
        Page.removeNode(curNodId);
        Page.$id(Page.ELEMENT_ID.NODES.NODE).val(newNodeInfo.id);
        web3.setProvider(new web3.providers.HttpProvider(newNodeInfo.node.url));
        return false;
    });

    Page.$id(Page.ELEMENT_ID.NODES.CANCEL).click(() => {
        Page.toggleAddNodeGroup(false);
        return false;
    });

    Page.$id(Page.ELEMENT_ID.NODES.NODE).change(() => {
        const currentNodeId = Page.$id(Page.ELEMENT_ID.NODES.NODE).val();
        const currentNode = Nodes.setCurrentNodeId(currentNodeId);
        web3.setProvider(new web3.providers.HttpProvider(currentNode.url));
    });

    Page.showWalletValid(false);

    Page.$id(Page.ELEMENT_ID.BALANCE.WALLET_INPUT).on('input', (evt) => {
        Page.showWalletValid(Validator.walletId(evt.target.value));
    });

    Page.$id(Page.ELEMENT_ID.BALANCE.CHECK_BUTTON).click(() => {
        Page.showBalanceWait(true);
        Page.showBalanceError();
        const walletId = Page.$id(Page.ELEMENT_ID.BALANCE.WALLET_INPUT).val();
        const contract = web3.eth
            .contract(CONTRACT.ABI)
            .at(CONTRACT.ID);
        Ether.getBalance(contract, walletId, (err, balance) => {
            if (err) {
                Page.showBalanceWait(false);
                Page.showBalanceError(err);
                Page.showBalance();
                Page.showTokensHistory();
            } else {
                Ether.getPriceData(walletId, contract, (err, res) => {
                    Page.showBalanceWait(false);
                    if (err) {
                        Page.showBalanceError(err);
                        Page.showBalance();
                        Page.showTokensHistory();
                    } else {
                        Page.showBalance(balance.tokens, balance.eth, balance.btc);
                        Page.showTokensHistory(walletId, res);
                    }
                });
            }
        });
        return false;
    });

    Page.showAlterWalletValid(false, false, true);
    function showCurrentAlterWalletValid() {
        const keyValid = Validator.privateKey(Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.KEY).val());
        const fileValid = !!Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE)[0].files[0];
        Page.showAlterWalletValid(keyValid, fileValid, true);
    }

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.KEY).on('input', () => {
        showCurrentAlterWalletValid();
    });

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE).on('change', () => {
        showCurrentAlterWalletValid();
    });

    Page.buyTokensState.init();
    Page.sellTokensState.init();

    function showCurrentSellTokensValid() {
        const countValid = Validator.tokenCount(Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).val());
        const recipientValid = Validator.walletId(Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).val());
        Page.sellTokensState.toggleValid(countValid, recipientValid);
    }

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.COUNT).on('input', (evt) => {
        Page.buyTokensState.toggleValid(Validator.tokenCount(evt.target.value));
    });

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).on('input', (evt) => {
        showCurrentSellTokensValid();
    });

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).on('input', (evt) => {
        showCurrentSellTokensValid();
    });

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.BUTTON).click(() => {
        currentWallet = null;
        Page.showCurrentWallet();
        Page.showAlterWalletPrivateKeyError();
        Page.showAlterWalletFileError();
        const Wallet = ethers.Wallet;
        const privateKey = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.KEY).val();
        const privateKey0x = /^0x/.test(privateKey) ? privateKey : `0x${privateKey}`;
        const currentNode = Nodes.getCurrentNode();
        try {
            const wallet = new Wallet(privateKey0x, new ethers.providers.JsonRpcProvider(currentNode.url, false, currentNode.chainId));
            currentWallet = wallet;
            Page.showCurrentWallet(wallet);
        } catch (e) {
            Page.showAlterWalletPrivateKeyError(e);
        }
        return false;
    });

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.BUTTON).click(() => {
        currentWallet = null;
        Page.showCurrentWallet();
        Page.showAlterWalletPrivateKeyError();
        Page.showAlterWalletFileError();
        const Wallet = ethers.Wallet;
        const file = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE)[0].files[0];
        readFileContent(file, (err, content) => {
            if (err) {
                Page.showAlterWalletFileError(err);
                return;
            }
            const password = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.PASWORD).val();
            Wallet.fromEncryptedWallet(content, password)
                .then((wallet) => {
                    const currentNode = Nodes.getCurrentNode();
                    wallet.provider = new ethers.providers.JsonRpcProvider(currentNode.url, false, currentNode.chainId);
                    currentWallet = wallet;
                    Page.showCurrentWallet(wallet);
                })
                .catch((err) => {
                    Page.showAlterWalletFileError(err);
                });
        });
        return false;
    });

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.BUTTON).click(() => {
        Page.showBuyTokensError();
        Page.buyTokensState.toggleWait(true);
        const count = +Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.COUNT).val();
        const contract = web3.eth
            .contract(CONTRACT.ABI)
            .at(CONTRACT.ID);
        const tokenPrice = contract.tokenPrice();
        const wei = tokenPrice.times(count);
        const weiStr = `0x${wei.toString(16)}`;
        Ether.buyTokens(currentWallet, CONTRACT.ID, weiStr)
            .then(() => {
                Page.buyTokensState.toggleWait(false);
            })
            .catch((err) => {
                Page.showBuyTokensError(err);
                Page.buyTokensState.toggleWait(false);
            });
        return false;
    });

    Page.showAddNodeValid(false);
    function calcAndShowAddNodeValid() {
        const nameValid = !!Page.$id(Page.ELEMENT_ID.NODES.NAME).val();
        const urlValid = Validator.url(Page.$id(Page.ELEMENT_ID.NODES.URL).val());
        const chainIdValid = Validator.chainId(Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).val());
        Page.showAddNodeValid(nameValid, urlValid, chainIdValid);
    }

    Page.$id(Page.ELEMENT_ID.NODES.NAME).on('input', () => {
        calcAndShowAddNodeValid();
    });

    Page.$id(Page.ELEMENT_ID.NODES.URL).on('input', () => {
        calcAndShowAddNodeValid();
    });

    Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).on('input', () => {
        calcAndShowAddNodeValid();
    });

    Page.$id(Page.ELEMENT_ID.NODES.ADD).click(() => {
        Page.toggleAddNodeGroup(false);
        const name = Page.$id(Page.ELEMENT_ID.NODES.NAME).val();
        const url = Page.$id(Page.ELEMENT_ID.NODES.URL).val();
        const chainId = Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).val();
        if (name && url && chainId) {
            const newNodeId = Nodes.addNode({
                name,
                url,
                chainId
            });
            Page.appendNode(newNodeId, name);
            web3.setProvider(new web3.providers.HttpProvider(url));
            Page.$id(Page.ELEMENT_ID.NODES.NODE).val(newNodeId);
        } else {
            //log error
        }
        return false;
    });

    Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.BUTTON).click(() => {
        Page.showSellTokensError();
        Page.sellTokensState.toggleWait(true);
        const count = +Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).val();
        const walletId = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).val();
        console.log('sell tokens', count);
        const contract = new ethers.Contract(CONTRACT.ID, CONTRACT.ABI, currentWallet);
        contract.tokenPrice()
            .then((tokenPrice) => {
                const wei = new BigNumber(tokenPrice[0]).times(count);
                const weiStr = `0x${wei.toString(16)}`;
                contract.estimate.buyFor(walletId, {value: weiStr})
                    .then((gasCost) => {
                        contract.buyFor(walletId, {value: weiStr, gasLimit:gasCost})
                            .then((res) => {
                                console.log(res);
                                return res.hash;
                            })
                            .then((transactionHash) => {
                                currentWallet.provider.once(transactionHash, (transaction) => {
                                    Page.sellTokensState.toggleWait(false);
                                    console.log('Transaction sell Minded: ' + transaction.hash);
                                    console.log(transaction);
                                });
                            })
                            .catch((err) => {
                                Page.showSellTokensError(err);
                                Page.sellTokensState.toggleWait(false);
                            });
                    })
                    .catch((err) => {
                        Page.showSellTokensError(err);
                        Page.sellTokensState.toggleWait(false);
                    });
            })
            .catch((err) => {
                Page.showSellTokensError(err);
                Page.sellTokensState.toggleWait(false);
            });
        return false;
    });

    // Page.initTokenPriceChart((err) => {
    //     if (err) {
    //         console.log('Init token chart error', err);
    //     } else {
    //         Page.$id(Page.ELEMENT_ID.CHART.BUTTONS.WHOLE).click(() => {
    //             Page.showTokenPriceChart(0);
    //             return false;
    //         });
    //         Page.$id(Page.ELEMENT_ID.CHART.BUTTONS.MONTH).click(() => {
    //             Page.showTokenPriceChart(+moment().subtract(7, 'day'));
    //             return false;
    //         });
    //         Page.showTokenPriceChart(0);
    //     }
    // });
}

$(onload);
