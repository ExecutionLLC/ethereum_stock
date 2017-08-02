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

function smartCeil(a, pmin, pmax) {
    function log10(a) {
        return Math.log(a) / Math.log(10);
    }

    function flog10(a) {
        return Math.floor(log10(a));
    }

    function ceil(a, n) {
        const p10 = Math.pow(10, n);
        return Math.ceil(a / p10) * p10;
    }

    const min = Math.floor(a + a * pmin + 1);
    const maxDiff = a * pmax;
    const maxDiffLog10 = flog10(maxDiff);
    return ceil(min, maxDiffLog10);
}

TokenPriceChart = {
    chart: null,
    data: null,
    _calcYRange(target, tokens) {
        const targetMax = target.length ? target[0].y : null;
        const tokensMax = tokens.length ? tokens[tokens.length - 1].y : null;
        const setMax = targetMax !== null && tokensMax !== null;
        const setTokensMax = setMax && tokensMax < targetMax * 0.2;

        if (setMax) {
            const maxValue = setTokensMax ? tokensMax : Math.max(tokensMax, targetMax);
            const max = smartCeil(maxValue, 0.05, 0.2);
            return {
                min: 0,
                max: max,
                showTarget: targetMax <= max
            };
        } else {
            return null;
        }
    },
    _makeLabelsFilter(withTarget) {
        function labelsFilterWithTarget(item) {
            return item.datasetIndex !== 1;
        }

        function labelsFilterWOTarget(item) {
            return item.datasetIndex !== 1 && item.datasetIndex !== 2;
        }

        return withTarget ?
            labelsFilterWithTarget :
            labelsFilterWOTarget;
    },
    createChart(ctx, data) {
        TokenPriceChart.data = data;
        const options = {
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
                    id: "y-axis-1"
                }]
            },
            responsive: false
        };

        const yRange = TokenPriceChart._calcYRange(data.target, data.tokens);

        if (yRange) {
            options.scales.yAxes[0].ticks = {
                min: yRange.min,
                max: yRange.max
            };
            options.legend = {
                labels: {
                    filter: TokenPriceChart._makeLabelsFilter(yRange.showTarget)
                }
            };
        }

        TokenPriceChart.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Tokens',
                        borderColor: 'red',
                        pointRadius: 0,
                        lineTension: 0,
                        yAxisID: 'y-axis-1',
                        data: [] // data.tokens
                    },
                    {
                        label: 'Tokens-dots',
                        backgroundColor: 'transparent',
                        borderColor: 'red',
                        borderDash: [0, 1],
                        lineTension: 0,
                        yAxisID: 'y-axis-1',
                        data: [] // data.tokensDots
                    },
                    {
                        label: 'Target',
                        backgroundColor: 'transparent',
                        borderColor: 'blue',
                        pointRadius: 0,
                        lineTension: 0,
                        yAxisID: 'y-axis-1',
                        data: [] // data.target
                    }
                ]
            },
            options: options
        });
    },
    show(fromDate, newData, overrideNow) {
        if (newData) {
            TokenPriceChart.data = newData;
        }
        let now;
        if (overrideNow && TokenPriceChart.data.tokens.length) {
            now = TokenPriceChart.data.tokens[TokenPriceChart.data.tokens.length - 1].x
        } else {
            now = +new Date();
        }
        const newTokens = XYData.setRange(TokenPriceChart.data.tokens, fromDate, now, true);
        const newTokensDots = XYData.setRange(TokenPriceChart.data.tokensDots, fromDate, now, false);
        const newTarget = XYData.setRange(TokenPriceChart.data.target, fromDate, now, true);

        if (newData) {
            const yRange = TokenPriceChart._calcYRange(newTarget, newTokens);
            if (yRange) {
                const yAxe = TokenPriceChart.chart.options.scales.yAxes[0];
                yAxe.ticks.min = yRange.min;
                yAxe.ticks.max = yRange.max;
                TokenPriceChart.chart.options.legend.labels.filter = TokenPriceChart._makeLabelsFilter(yRange.showTarget);
            }
        }
        TokenPriceChart.chart.data.datasets[0].data = newTokens;
        TokenPriceChart.chart.data.datasets[1].data = newTokensDots;
        TokenPriceChart.chart.data.datasets[2].data = newTarget;
        TokenPriceChart.chart.update();
    }
};

const Ether = {
    getBalance(contract, walletId, callback) {
        let tokens;
        let tokenPrice;
        let withdrawals;
        try {
            tokens = new BigNumber(contract.balanceOf(walletId)).toNumber();
            tokenPrice = new BigNumber(web3.fromWei(contract.tokenPrice(), 'ether')).toNumber();
            withdrawals = new BigNumber(web3.fromWei(contract.pendingWithdrawals(walletId), 'ether')).toNumber();
        } catch (e) {
            callback(e);
            return;
        }
        API.getBtcFromEth((error, result) => {
            if (error) {
                callback(error);
            } else {
                const eth = tokens * tokenPrice;
                const btc = eth * result.BTC;
                callback(null, {
                    tokens,
                    tokenPrice,
                    eth,
                    btc,
                    withdrawals
                });
            }
        });

    },
    getHistoryData(event, count, callback) {
        event.get((error, logs) => {
            if (error) {
                callback(error);
            } else {
                async.map(logs.slice(-count), (log, callback) => {
                    const {args: {_from, _to, _value}} = log;
                    Ether.getBlockTimestamp(log.blockNumber, (error, timestamp) => {
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
    getBlockTimestamp(blockNumber, callback) {
        web3.eth.getBlock(blockNumber, (error, block) => {
            if (error) {
                callback (error);
            } else {
                callback(null, block.timestamp);
            }
        });
    },
    getTokensHistory(callback) {
        const web3contract = web3.eth
            .contract(CONTRACT.ABI)
            .at(CONTRACT.ID);
        const transferEvent = web3contract.Transfer({}, {fromBlock: 0, toBlock: 'latest'});
        const target = new BigNumber(web3contract.maxSupply()).valueOf();
        transferEvent.get((error, allLogs) => {
            if (error) {
                callback(error);
                return;
            }

            function isLogToShow(log) {
                return log.args._from === '0x0000000000000000000000000000000000000000';
            }

            function timestampLog(log, callback) {
                Ether.getBlockTimestamp(log.blockNumber, (error, timestamp) => {
                    const {transactionIndex, args: {_value}} = log;
                    callback(null, {
                        timestamp,
                        transactionIndex,
                        tokens: new BigNumber(_value).toNumber()
                    });
                });
            }

            function watchLogs(fromBlock, onLog) {

                function handleLogAsync(log, callback) {
                    if (!isLogToShow(log)) {
                        return;
                    }
                    timestampLog(log, callback);
                }

                const web3contract = web3.eth
                    .contract(CONTRACT.ABI)
                    .at(CONTRACT.ID);
                const transferEvent = web3contract.Transfer({}, {fromBlock: fromBlock, toBlock: 'latest'});
                transferEvent.watch((err, log) => {
                    if (err) {
                        return;
                    }
                    handleLogAsync(log, (err, log) => {
                        if (err) {
                            return;
                        }
                        onLog(log);
                    })
                });
            }

            const logs = allLogs.filter(isLogToShow);
            async.map(logs, timestampLog, (err, tokens) => {
                if (err) {
                    callback(err);
                    return;
                }

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
                        y: trx.tokens
                    }));
                }

                watchLogs(logs.length ? logs[logs.length - 1].blockNumber + 1 : 0, (log) => {
                    tokens.push(log);
                    handleTokens(tokens, (err, data) => {
                        callback(err, Object.assign({}, data, {update: true}));
                    });
                });

                function handleTokens(tokens, callback) {
                    const xy = transactionsToXY(tokens);
                    const xyAccum = XYData.makeAccumulation(xy);
                    const xyStepped = XYData.makeStepped(xyAccum);
                    const steppedDataMarks = XYData.makeLastInX(xyStepped);
                    callback(null, {data: {
                        tokens: xyStepped,
                        tokensDots: steppedDataMarks,
                        target: [
                            {
                                x: xyAccum.length ? xyAccum[0].x : 0,
                                y: target
                            }
                        ]
                    }});
                }

                handleTokens(tokens, callback);
            });
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
                });
                const allHistoryLast = allHistory.slice(-historyCount);
                callback(null, allHistoryLast);
            }
        });
    },
    buyTokens(wallet, contractAddress, value, gasPrice, onTransaction) {
        const provider = wallet.provider;

        return provider.getTransactionCount(wallet.address)
            .then((transactionCount) => {
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
                onTransaction(hash);
                console.log(hash);
                return provider.waitForTransaction(hash)
            })
            .then((transaction) => console.log("The transaction was mined: Block " + transaction.hash));

    },
    getWalletInfoAsync(wallet) {
        const web3contract = web3.eth
            .contract(CONTRACT.ABI)
            .at(CONTRACT.ID);
        const walletId = wallet.address;
        const [goal, bought] = web3contract.progress();
        return wallet.getBalance().then((balanceResult) => {
            const balance = new BigNumber(balanceResult);
            const tokenPrice = web3contract.tokenPrice();
            const canBeBought = balance.div(tokenPrice).floor();
            const tokensLeft = new BigNumber(goal).sub(bought);
            const walletTokens = web3contract.balanceOf(walletId);
            return {
                balance: web3.fromWei(balance, 'ether'),
                withdrawals: web3.fromWei(web3contract.pendingWithdrawals(walletId), 'ether'),
                price: web3.fromWei(tokenPrice, 'ether'),
                canBeBought: canBeBought,
                tokensLeft: tokensLeft,
                tokensAvailable: BigNumber.min(canBeBought, tokensLeft),
                walletTokens
            };
        });
    }
};

const API = {
    getBtcFromEth(callback) {
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

function readFileContentAsync(file) {
    if (file.size > 102400) { // 100K JSON wallet will be our limit
        return Promise.reject(`JSON file too big (${file.size} bytes)`);
    } else {
        return new Promise((resolve) => {
            const fr = new FileReader();
            fr.onload = function () {
                resolve(fr.result);
            };
            fr.readAsText(file);
        });
    }
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
    setRange(data, min, max, addMax) {

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

        function rangeMax(data, max, addMax) {
            const maxIndex = findDataInterval(data, max);
            if (maxIndex < 0) {
                return [];
            } else {
                if (data[maxIndex].x === max || !addMax) {
                    return data.slice(0, maxIndex + 1);
                } else {
                    return data.slice(0, maxIndex + 1).concat([{x: max, y: data[maxIndex].y}]);
                }
            }
        }

        const dataRangeMin = rangeMin(data, min);
        return rangeMax(dataRangeMin, max, addMax);
    },
    getRange(data) {
        if (data.length < 2) {
            return 0;
        }
        return data[data.length - 1].x - data[0].x;
    },
    makeAccumulation(data) {
        let accum = 0;
        return data.map((xy) => {
            accum += xy.y;
            return {
                x: xy.x,
                y: accum
            };
        });
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
    currentWallet = null;
    Page.init();
    Page.setNodes(
        Nodes.getNodesNames(),
        Nodes.getCurrentNodeId(),
        Nodes.canRemoveNode(Nodes.getCurrentNodeId())
    );

    Page.onBalanceWalletValidation = (walletId) => {
        return Validator.walletId(walletId);
    };

    Page.onBalanceCheckAsync = (walletId) => {
        const contract = web3.eth
            .contract(CONTRACT.ABI)
            .at(CONTRACT.ID);
        return new Promise((resolve, reject) => {
            Ether.getBalance(contract, walletId, (err, balance) => {
                if (err) {
                    reject(err);
                } else {
                    Ether.getPriceData(walletId, contract, (err, tokens) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({balance, tokens});
                        }
                    });
                }
            });
        });
    };

    Page.onAlterWalletValidation = (key, file) => {
        return {
            keyValid: Validator.privateKey(key),
            fileValid: !!file
        };
    };

    Page.onAlterWalletPrivateKeyAsync = (privateKey0x) => {
        currentWallet = null;
        const Wallet = ethers.Wallet;
        const currentNode = Nodes.getCurrentNode();
        const wallet = new Wallet(privateKey0x, new ethers.providers.JsonRpcProvider(currentNode.url, false, currentNode.chainId));
        return Ether.getWalletInfoAsync(wallet).then((info) => {
            currentWallet = {
                wallet,
                info
            };
            return currentWallet;
        });
    };

    Page.onAlterWalletFileAsync = (file, password) => {
        return readFileContentAsync(file)
            .then((content) => {
                const Wallet = ethers.Wallet;
                return Wallet.fromEncryptedWallet(content, password);
            })
            .then((wallet) => {
                const currentNode = Nodes.getCurrentNode();
                wallet.provider = new ethers.providers.JsonRpcProvider(currentNode.url, false, currentNode.chainId);
                const info = Ether.getWalletInfoAsync(wallet);
                const gasPrice= wallet.provider.getGasPrice();
                return Promise.all([info,gasPrice])
                    .then(([info, gasPrice]) => {
                        currentWallet = {
                            wallet,
                            info,
                            gasPrice
                        };
                        return currentWallet;
                    });
            });
    };

    Page.onBuyTokensValidation = (count) => {
        if (!Validator.tokenCount(count)) {
            Page.showBuyTokensPrice(0);
            return false;
        }
        Page.showBuyTokensPrice(currentWallet.info.price.mul(count).toString());
        return !currentWallet.info.tokensAvailable.lessThan(count);
    };

    Page.onBuyTokensAsync = (count, gasPrice, onTransaction) => {
        const contract = web3.eth
            .contract(CONTRACT.ABI)
            .at(CONTRACT.ID);
        const tokenPrice = contract.tokenPrice();
        const wei = tokenPrice.times(count);
        const weiStr = `0x${wei.toString(16)}`;
        const gasPriceStr = `0x${new BigNumber(gasPrice).toString(16)}`;
        return Ether.buyTokens(currentWallet.wallet, CONTRACT.ID, weiStr,gasPriceStr, onTransaction)
            .then(() => {
                const info = Ether.getWalletInfoAsync(currentWallet.wallet);
                const gasPrice= currentWallet.wallet.provider.getGasPrice();
                return Promise.all([info,gasPrice]);
            })
            .then(([info, gasPrice]) => {
                currentWallet = {
                    wallet: currentWallet.wallet,
                    info,
                    gasPrice
                };
                Page.showCurrentWallet(currentWallet);
            });
    };

    Page.onAddNodeValidation = (name, url, chainId) => {
        return {
            nameValid: !!name,
            urlValid: Validator.url(url),
            chainIdValid: Validator.chainId(chainId)
        };
    };

    Page.onNodeAdd = ({name, url, chainId: chainIdStr}) => {
        if (name && url && chainIdStr) {
            const chainId = +chainIdStr;
            const newNode = {
                name,
                url,
                chainId
            };
            const newNodeId = Nodes.addNode(newNode);
            web3.setProvider(new web3.providers.HttpProvider(url));
            return {
                id: newNodeId,
                node: newNode,
                canRemoveNode: Nodes.canRemoveNode(newNodeId)
            };
        } else {
            throw 'Fail to add node';
        }
    };

    Page.onNodeRemove = (idToRemove) => {
        const {id, node} = Nodes.removeNode(idToRemove);
        web3.setProvider(new web3.providers.HttpProvider(node.url));
        return {
            id,
            canRemoveNode: Nodes.canRemoveNode(id)
        };
    };

    Page.onNodeChange = (id) => {
        const currentNode = Nodes.setCurrentNodeId(id);
        web3.setProvider(new web3.providers.HttpProvider(currentNode.url));
        return Nodes.canRemoveNode(id);
    };

    Page.onSellTokensValidation = (count, walletId) => {
        let countValid;
        if (!Validator.tokenCount(count)) {
            countValid = false;
            Page.showSellTokensPrice(0);
        } else {
            Page.showSellTokensPrice(currentWallet.info.price.mul(count));
            countValid = !currentWallet.info.tokensAvailable.lessThan(count);
        }
        return {
            countValid,
            recipientValid: Validator.walletId(walletId)
        };
    };

    Page.onSellTokensAsync = (count, walletId, onTransaction) => {
        const contract = new ethers.Contract(CONTRACT.ID, CONTRACT.ABI, currentWallet.wallet);
        return contract.tokenPrice()
            .then((tokenPrice) => {
                const wei = new BigNumber(tokenPrice[0]).times(count);
                const weiStr = `0x${wei.toString(16)}`;
                return contract.estimate.buyFor(walletId, {value: weiStr})
                    .then((gasCost) => ({gasCost, weiStr}));
            })
            .then(({gasCost, weiStr}) => {
                return contract.buyFor(walletId, {value: weiStr, gasLimit: gasCost})
            })
            .then((buyTransaction) => {
                const {hash} = buyTransaction;
                onTransaction(hash);
                return new Promise((resolve) => {
                    currentWallet.wallet.provider.once(hash, (transaction) => {
                        console.log('Transaction sell Minded: ' + transaction.hash);
                        console.log(transaction);
                        resolve();
                    });
                });
            })
            .then(() => {
                const info = Ether.getWalletInfoAsync(currentWallet.wallet);
                const gasPrice= currentWallet.wallet.provider.getGasPrice();
                return Promise.all([info,gasPrice]);
            })
            .then(([info, gasPrice]) => {
                currentWallet = {
                    wallet: currentWallet.wallet,
                    info,
                    gasPrice
                };
                Page.showCurrentWallet(currentWallet);
            });
    };

    const chartCtx = Page.getChartCanvasElement();
    if (!chartCtx) {
        console.log('No chart canvas element');
    } else {
        const wc = createChartWaiting(chartCtx);

        let fromDate = 0;

        function showChart() {
            TokenPriceChart.show(fromDate);
        }

        Ether.getTokensHistory((err, result) => {
            if (err) {
                throw `Tokens history error, ${err}`;
            }
            const {data, update} = result;
            if (update) {
                TokenPriceChart.show(fromDate, data, true);
                return;
            }
            wc.destroy();
            TokenPriceChart.createChart(chartCtx, data);
            Page.onChartShowWhole = () => {
                fromDate = 0;
                showChart()
            };
            Page.onChartShowMonth = () => {
                fromDate = +moment().subtract(7, 'day');
                showChart()
            };
            showChart();
        });
    }
}

$(onload);
