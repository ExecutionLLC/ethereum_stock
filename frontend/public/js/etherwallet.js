const Web3 = Web3_require('web3');
const web3 = new Web3();

const BigNumber = Web3_require('bignumber.js');

web3.setProvider(new web3.providers.HttpProvider('http://192.168.1.101:8111/'));
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
            BTC: 'balance-btc'
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
        CHART: 'myChart',
        ALTER_WALLET: {
            PRIVATE_KEY: {
                KEY: 'add-wallet-private-key',
                BUTTON: 'add-wallet-private-key-button'
            },
            FILE: {
                FILE: 'add-wallet-file',
                PASWORD: 'add-wallet-file-password',
                BUTTON: 'add-wallet-file-button'
            }
        }
    },
    $id(id) {
        return $(`#${id}`);
    },
    showBalanceWait(show) {
        $('#balance-wait').toggle(show);
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
    showError(error) {
        $error = $('#balance-error');
        $error.toggle(error != null);
        $error.text(error);
    },
    showCurrentWallet(wallet) {
        $('#wallet-ops').toggle(!!wallet);
        if (!wallet) {
            return;
        }
        $('#wallet-address').text(wallet.address);
    }
};

const Ether = {
    getBalance(contract, walletId, callback) {
        let tokens;
        let tokenPrice;
        try {
            tokens = new BigNumber(contract.clientTokens(walletId)).toNumber();
            tokenPrice = new BigNumber(web3.fromWei(contract.tokenPrice(), 'ether')).toNumber();
        } catch(e) {
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
    getData(web3, abiArray, address, callback) {
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
    getPriceData(client, contract, callback){
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
        $.get('https://min-api.cryptocompare.com/data/price', { fsym: 'ETH', tsyms: 'BTC' } )
            .done(function( data ) {
                callback(null, data);
            })
            .fail(function(error) {
                callback(error);
            });
    },
    getBtcFromEthHistory(ts, callback) {
        $.get('https://min-api.cryptocompare.com/data/pricehistorical', { fsym: 'ETH', tsyms: 'BTC', ts: ts } )
            .done(function( data ) {
                callback(null, data);
            })
            .fail(function(error) {
                callback(error);
            });
    },
    getBtcFromEthHistoryArray(timestamps, callback) {
        async.map(
            timestamps,
            (ts, callback) => API.getBtcFromEthHistory(ts, callback),
            callback
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

function onload() {
    Page.showError();
    Page.showBalance();
    Page.showBalanceWait(false);
    currentWallet = null;
    Page.showCurrentWallet();

    Page.$id(Page.ELEMENT_ID.BALANCE.CHECK_BUTTON).click(() => {
        Page.showBalanceWait(true);
        Page.showError();
        const walletId = Page.$id(Page.ELEMENT_ID.BALANCE.WALLET_INPUT).val();
        const contract = web3.eth
            .contract(CONTRACT.ABI)
            .at(CONTRACT.ID);
        Ether.getBalance(contract, walletId, (err, balance) => {
            if (err) {
                Page.showError(err);
            } else {
                Ether.getPriceData(walletId, contract, (err, res) => {
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
        const wallet = new Wallet(privateKey0x, new ethers.providers.JsonRpcProvider('http://192.168.1.101:8111', false, 15));
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
                    wallet.provider = new ethers.providers.JsonRpcProvider('http://192.168.1.101:8111', false, 15);
                    currentWallet = wallet;
                    Page.showCurrentWallet(wallet);
                });
        });
    });

    $('#buy-tokens-button').click(() => {
        const count = +$('#buy-tokens-count').val();
        const wei = '0x' +new BigNumber(web3.toWei(count, "ether")).toString(16);
        const MyContract = new ethers.Contract(CONTRACT.ID, CONTRACT.ABI, currentWallet);
        MyContract.buy({value: wei, gasLimit: 80000});
    });

    Ether.getData(
        web3,
        CONTRACT.ABI,
        CONTRACT.ID,
        (err, res) => {
            if (err) {
                throw err;
            }
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
            const data = res.map(log => ({
                x: log.timestamp + log.transactionIndex / timeParts[log.timestamp],
                y: log.price
            }));

            const tss = data.map(d => Math.floor(d.x));
            API.getBtcFromEthHistoryArray(tss, (err, btc) => {
                const data2 = data.map((d, i) => ({
                    x: d.x,
                    y: d.y * btc[i].ETH.BTC
                }));
                const ctx = Page.$id(Page.ELEMENT_ID.CHART)[0];
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [
                            {
                                label: 'ETH',
                                lineTension: 0,
                                data: data
                            },
                            {
                                label: 'BTC',
                                lineTension: 0,
                                data: data2
                            },
                        ]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                type: 'time'
                            }]
                        }
                    }
                });
            });
        }
    );
}

$(onload);
