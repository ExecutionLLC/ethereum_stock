const Page = {
    ELEMENT_ID: {
        NODES: {
            NODE: 'select-node',
            ADD_NODE_GROUP: 'add-node-group',
            ADD_NODE_SHOW_BUTTON: 'add-node-button',
            REMOVE_NODE_BUTTON: 'remove-node-button',
            NAME: 'select-node-name',
            URL: 'select-node-url',
            CHAIN_ID: 'select-node-chain-id',
            ADD: 'select-node-add',
            CANCEL: 'select-node-cancel'
        },
        BALANCE: {
            WALLET_FORM_GROUP: 'wallet-form-group',
            WALLET_INPUT: 'wallet-input',
            CHECK_BUTTON: 'wallet-button',
            CONTAINER: 'balance-container',
            TOKENS: 'balance-tokens',
            ETH: 'balance-eth',
            BTC: 'balance-btc',
            WAIT: 'balance-wait',
            ERROR: 'balance-error'
        },
        TOKENS_HISTORY: {
            TEMPLATE: 'tokens-history-template',
            OPERATION: {
                TIME: 'tokens-history-op-time',
                NAME: 'tokens-history-op-name',
                COUNT: 'tokens-history-op-count'
            },
            CONTAINER: 'tokens-history-container'
        },
        CHART: {
            ID: 'chart',
            BUTTONS: {
                WHOLE: 'chart-whole',
                MONTH: 'chart-month'
            }
        },
        ALTER_WALLET: {
            PRIVATE_KEY: {
                GROUP: 'add-wallet-private-key-group',
                KEY: 'add-wallet-private-key',
                BUTTON: 'add-wallet-private-key-button',
                ERROR: 'add-wallet-private-key-error'
            },
            FILE: {
                GROUP: 'add-wallet-file-group',
                FILE: 'add-wallet-file',
                PASWORD: 'add-wallet-file-password',
                BUTTON: 'add-wallet-file-button',
                ERROR: 'add-wallet-file-error'
            },
            OPERATIONS: {
                CONTAINER: 'wallet-ops',
                WALLET_ADDRESS: 'wallet-address',
                BUY: {
                    GROUP: 'buy-tokens-group',
                    COUNT: 'buy-tokens-count',
                    BUTTON: 'buy-tokens-button',
                    WAIT: 'buy-tokens-wait',
                    ERROR: 'buy-tokens-error'
                },
                SELL: {
                    GROUP: 'sell-tokens-group',
                    COUNT: 'sell-tokens-count',
                    WALLET: 'sell-tokens-wallet',
                    BUTTON: 'sell-tokens-button',
                    WAIT: 'sell-tokens-wait',
                    ERROR: 'sell-tokens-error'
                }
            }
        }
    },
    $id(id) {
        return $(`#${id}`);
    },
    updateNodes() {
        const nodesNames = Nodes.getNodesNames();
        $.each(nodesNames, (i, {id, name}) => {
            Page.appendNode(id, name);
        });
        Page.selectNode(Nodes.getCurrentNodeId());
    },
    appendNode(value, name) {
        Page.$id(Page.ELEMENT_ID.NODES.NODE)
            .append($('<option></option>')
                .attr("value", value)
                .text(name));
    },
    removeNode(value) {
        Page.$id(Page.ELEMENT_ID.NODES.NODE)
            .find(`[value="${value}"]`)
            .remove();
    },
    toggleAddNodeGroup(show) {
        Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_GROUP).toggle(show);
        Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_SHOW_BUTTON).prop('disabled', show);
    },
    showWalletValid(isValid) {
        Page.$id(Page.ELEMENT_ID.BALANCE.WALLET_FORM_GROUP).toggleClass('has-error', !isValid);
        Page.$id(Page.ELEMENT_ID.BALANCE.CHECK_BUTTON).prop('disabled', !isValid);
    },
    showBalanceWait(show) {
        Page.$id(Page.ELEMENT_ID.BALANCE.WAIT).toggle(show);
    },
    showBalance(tokens, eth, btc) {

        function strNull(s) {
            return s == null ? '...' : s;
        }

        Page.$id(Page.ELEMENT_ID.BALANCE.CONTAINER).css('visibility', tokens == null ? 'hidden' : 'visible');
        Page.$id(Page.ELEMENT_ID.BALANCE.TOKENS).text(strNull(tokens));
        Page.$id(Page.ELEMENT_ID.BALANCE.ETH).text(strNull(eth));
        Page.$id(Page.ELEMENT_ID.BALANCE.BTC).text(strNull(btc));
    },
    showTokensHistory(walletId, res) {
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

        const $rows = res && res.map((item, index) => {
            const $el = $tmpl.clone().show();
            addElementIdKey($el, index);
            setElementIdContent($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.TIME, index, moment(item.timestamp * 1000).format('DD.MM.YY HH:mm:ss'));
            setElementIdContent($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.NAME, index, walletId.toLowerCase() === item.to.toLowerCase() ? 'buy' : 'sell');
            setElementIdContent($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.COUNT, index, item.count);
            return $el;
        });
        const $container = Page.$id(Page.ELEMENT_ID.TOKENS_HISTORY.CONTAINER).empty();
        if ($rows) {
            $container.append($rows);
        }
    },
    showAddNodeValid(nameValid, urlValid, chainIdValid) {
        const allValid = nameValid && urlValid && chainIdValid;
        Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_GROUP).toggleClass('has-error', !allValid);
        Page.$id(Page.ELEMENT_ID.NODES.ADD).prop('disabled', !allValid);
        Page.$id(Page.ELEMENT_ID.NODES.NAME).toggleClass('alert-danger', !nameValid);
        Page.$id(Page.ELEMENT_ID.NODES.URL).toggleClass('alert-danger', !urlValid);
        Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).toggleClass('alert-danger', !chainIdValid);
    },
    selectNode(valueToSelect) {
        const element = document.getElementById(Page.ELEMENT_ID.NODES.NODE);
        element.value = valueToSelect;
    },
    showBalanceError(error) {
        Page.$id(Page.ELEMENT_ID.BALANCE.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAlterWalletPrivateKeyError(error) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAlterWalletFileError(error) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showBuyTokensError(error) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showSellTokensError(error) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAlterWalletValid(keyValid, fileValid, filePasswordValid) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.GROUP).toggleClass('has-error', !keyValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.BUTTON).prop('disabled', !keyValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.GROUP).toggleClass('has-error', !fileValid || !filePasswordValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.BUTTON).prop('disabled', !fileValid || !filePasswordValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE).toggleClass('alert-danger', !fileValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.PASWORD).toggleClass('alert-danger', !filePasswordValid);
    },
    showCurrentWallet(wallet) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.CONTAINER).toggle(!!wallet);
        if (!wallet) {
            return;
        }
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.WALLET_ADDRESS).text(wallet.address);
    },
    buyTokensState: {
        _isValid: false,
        _isWaiting: false,
        _showCurrentState() {
            Page.showBuyTokensValid(Page.buyTokensState._isValid);
            Page.toggleBuyWait(Page.buyTokensState._isWaiting);
            Page.showBuyButtonEnable(Page.buyTokensState._isValid && !Page.buyTokensState._isWaiting);
        },
        init() {
            Page.buyTokensState._isValid = false;
            Page.buyTokensState._isWaiting = false;
            Page.buyTokensState._showCurrentState();
        },
        toggleWait(isWait) {
            Page.buyTokensState._isWaiting = isWait;
            Page.buyTokensState._showCurrentState();
        },
        toggleValid(isValid) {
            Page.buyTokensState._isValid = isValid;
            Page.buyTokensState._showCurrentState();
        }
    },
    sellTokensState: {
        _isCountValid: false,
        _isRecipientValid: false,
        _isWaiting: false,
        _showCurrentState() {
            Page.showSellTokensValid(Page.sellTokensState._isCountValid, Page.sellTokensState._isRecipientValid);
            Page.toggleSellWait(Page.sellTokensState._isWaiting);
            Page.showSellButtonEnable(Page.sellTokensState._isCountValid && Page.sellTokensState._isRecipientValid && !Page.buyTokensState._isWaiting);
        },
        init() {
            Page.sellTokensState._isCountValid = false;
            Page.sellTokensState._isRecipientValid = false;
            Page.sellTokensState._isWaiting = false;
            Page.sellTokensState._showCurrentState();
        },
        toggleWait(isWait) {
            Page.sellTokensState._isWaiting = isWait;
            Page.sellTokensState._showCurrentState();
        },
        toggleValid(isCountValid, isRecipientValid) {
            Page.sellTokensState._isCountValid = isCountValid;
            Page.sellTokensState._isRecipientValid = isRecipientValid;
            Page.sellTokensState._showCurrentState();
        }
    },
    showBuyButtonEnable(enable) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.BUTTON).prop('disabled', !enable);
    },
    showSellButtonEnable(enable) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.BUTTON).prop('disabled', !enable);
    },
    showBuyTokensValid(isValid) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.GROUP).toggleClass('has-error', !isValid);
    },
    showSellTokensValid(isCountValid, isRecipientValid) {
        const isGroupValid = isCountValid && isRecipientValid;
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.GROUP).toggleClass('has-error', !isGroupValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).toggleClass('alert-danger', !isCountValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).toggleClass('alert-danger', !isRecipientValid);
    },
    toggleBuyWait(show) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.COUNT).prop('disabled', show);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.WAIT).toggle(show);
    },
    toggleSellWait(show) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).prop('disabled', show);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).prop('disabled', show);
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
    },
    init() {
        Page.toggleAddNodeGroup(false);
        Page.showBalanceError();
        Page.showBalance();
        Page.showTokensHistory();
        Page.showBalanceWait(false);
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

        Page.$id(Page.ELEMENT_ID.NODES.CANCEL).click(() => {
            Page.toggleAddNodeGroup(false);
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.ADD).click(() => {
            Page.toggleAddNodeGroup(false);
            try {
                const name = Page.$id(Page.ELEMENT_ID.NODES.NAME).val();
                const url = Page.$id(Page.ELEMENT_ID.NODES.URL).val();
                const chainId = Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).val();
                const {id, node} = Page.onNodeAdd({name, url, chainId});
                Page.appendNode(id, node.name);
                Page.$id(Page.ELEMENT_ID.NODES.NODE).val(id);
            }
            catch (e) {
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.REMOVE_NODE_BUTTON).click(() => {
            const curNodeId = Page.$id(Page.ELEMENT_ID.NODES.NODE).val();
            try {
                const id = Page.onNodeRemove(curNodeId);
                Page.removeNode(curNodeId);
                Page.$id(Page.ELEMENT_ID.NODES.NODE).val(id);
            } catch (e) {
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.NODE).change(() => {
            const currentNodeId = Page.$id(Page.ELEMENT_ID.NODES.NODE).val();
            try {
                Page.onNodeChange(currentNodeId);
            }
            catch (e) {
            }
        });

        Page.$id(Page.ELEMENT_ID.BALANCE.CHECK_BUTTON).click(() => {
            Page.showBalanceWait(true);
            Page.showBalanceError();
            const walletId = Page.$id(Page.ELEMENT_ID.BALANCE.WALLET_INPUT).val();

            function handleError(err/*, isThrown*/) {
                Page.showBalanceWait(false);
                Page.showBalanceError(err);
                Page.showBalance();
                Page.showTokensHistory();
            }

            function handleResult({balance, tokens}) {
                Page.showBalanceWait(false);
                Page.showBalance(balance.tokens, balance.eth, balance.btc);
                Page.showTokensHistory(walletId, tokens);
            }

            try {
                Page.onBalanceCheck(walletId)
                    .then(({balance, tokens}) => {
                        handleResult({balance, tokens});
                    })
                    .catch((err) => {
                        handleError(err, false);
                    });
            }
            catch (e) {
                handleError(e, true);
            }
            return false;
        });
    },
    onNodeAdd() {},
    onNodeRemove() {},
    onNodeChange() {},
    onBalanceCheck() {}
};
