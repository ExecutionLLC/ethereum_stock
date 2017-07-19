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
            CANCEL: 'select-node-cancel',
            ADD_ERROR: 'add-node-error',
            NODE_ERROR: 'node-error'
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
                NAME_BUY: 'tokens-history-op-name-buy',
                NAME_SELL: 'tokens-history-op-name-sell',
                COUNT: 'tokens-history-op-count'
            },
            CONTAINER: 'tokens-history-container',
            CONTENT: 'tokens-history-content'
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
    disableRemoveNode(disable) {
        Page.$id(Page.ELEMENT_ID.NODES.REMOVE_NODE_BUTTON).prop('disabled', disable);
    },
    disableSelectNode(disable) {
        Page.$id(Page.ELEMENT_ID.NODES.NODE).prop('disabled', disable);
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
        Page.$id(Page.ELEMENT_ID.TOKENS_HISTORY.CONTAINER).css('visibility', res == null ? 'hidden' : 'visible');

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

        function toggleElementId($parent, elId, key, show) {
            const $el = $parent.find(`#${elId}`);
            addElementIdKey($el, key);
            $el.toggle(show);
        }

        const $rows = res && res.map((item, index) => {
            const $el = $tmpl.clone().show();
            addElementIdKey($el, index);
            setElementIdContent($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.TIME, index, moment(item.timestamp * 1000).format('DD.MM.YY HH:mm:ss'));
            const isBuy = walletId.toLowerCase() === item.to.toLowerCase();
            toggleElementId($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.NAME_BUY, index, isBuy);
            toggleElementId($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.NAME_SELL, index, !isBuy);
            setElementIdContent($el, Page.ELEMENT_ID.TOKENS_HISTORY.OPERATION.COUNT, index, item.count);
            return $el;
        });
        const $container = Page.$id(Page.ELEMENT_ID.TOKENS_HISTORY.CONTENT).empty();
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
    showNodeError(error) {
        Page.$id(Page.ELEMENT_ID.NODES.NODE_ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAddNodeError(error) {
        Page.$id(Page.ELEMENT_ID.NODES.ADD_ERROR)
            .text(error)
            .toggle(error != null);
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
            const isValid = Page.buyTokensState._isValid;
            const isWaiting = Page.buyTokensState._isWaiting;
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.GROUP).toggleClass('has-error', !isValid);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.COUNT).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.WAIT).toggle(isWaiting);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.BUTTON).prop('disabled', !isValid || isWaiting);
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
            const isCountValid = Page.sellTokensState._isCountValid;
            const isRecipientValid = Page.sellTokensState._isRecipientValid;
            const isWaiting = Page.sellTokensState._isWaiting;
            const isGroupValid = isCountValid && isRecipientValid;
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.GROUP).toggleClass('has-error', !isGroupValid);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).toggleClass('alert-danger', !isCountValid);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).toggleClass('alert-danger', !isRecipientValid);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WAIT).toggle(isWaiting);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.BUTTON).prop('disabled', !isCountValid || !isRecipientValid || isWaiting);
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
        Page.disableRemoveNode(!Nodes.canRemoveNode());
        Page.disableSelectNode(false);
        Page.showNodeError();
        Page.showAddNodeError();
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

        Page.buyTokensState.init();
        Page.sellTokensState.init();

        Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_SHOW_BUTTON).click(() => {
            Page.toggleAddNodeGroup(true);
            Page.disableRemoveNode(true);
            Page.disableSelectNode(true);
            Page.showNodeError();
            Page.showAddNodeError();
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.CANCEL).click(() => {
            Page.toggleAddNodeGroup(false);
            Page.disableRemoveNode(!Nodes.canRemoveNode());
            Page.disableSelectNode(false);
            Page.showNodeError();
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.ADD).click(() => {
            Page.showAddNodeError();
            Page.showNodeError();
            try {
                const name = Page.$id(Page.ELEMENT_ID.NODES.NAME).val();
                const url = Page.$id(Page.ELEMENT_ID.NODES.URL).val();
                const chainId = Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).val();
                const {id, node} = Page.onNodeAdd({name, url, chainId});
                Page.appendNode(id, node.name);
                Page.$id(Page.ELEMENT_ID.NODES.NODE).val(id);
                Page.toggleAddNodeGroup(false);
                Page.disableRemoveNode(!Nodes.canRemoveNode());
                Page.disableSelectNode(false);
            }
            catch (e) {
                Page.showAddNodeError(e);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.REMOVE_NODE_BUTTON).click(() => {
            Page.showNodeError();
            const curNodeId = Page.$id(Page.ELEMENT_ID.NODES.NODE).val();
            try {
                const id = Page.onNodeRemove(curNodeId);
                Page.removeNode(curNodeId);
                Page.$id(Page.ELEMENT_ID.NODES.NODE).val(id);
            } catch (e) {
                Page.showNodeError(e);
            }
            Page.disableRemoveNode(!Nodes.canRemoveNode());
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.NODE).change(() => {
            Page.showNodeError();
            const currentNodeId = Page.$id(Page.ELEMENT_ID.NODES.NODE).val();
            try {
                Page.onNodeChange(currentNodeId);
            }
            catch (e) {
                Page.showNodeError(e);
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
                Page.onBalanceCheckAsync(walletId)
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

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.BUTTON).click(() => {
            Page.showCurrentWallet();
            Page.showAlterWalletPrivateKeyError();
            Page.showAlterWalletFileError();
            const privateKey = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.KEY).val();
            const privateKey0x = /^0x/.test(privateKey) ? privateKey : `0x${privateKey}`;
            try {
                const wallet = Page.onAlterWalletPrivateKey(privateKey0x);
                Page.showCurrentWallet(wallet);
            }
            catch (e) {
                Page.showAlterWalletPrivateKeyError(e);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.BUTTON).click(() => {
            Page.showCurrentWallet();
            Page.showAlterWalletPrivateKeyError();
            Page.showAlterWalletFileError();
            const file = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE)[0].files[0];
            const password = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.PASWORD).val();
            try {
                Page.onAlterWalletFileAsync(file, password)
                    .then((wallet) => {
                        Page.showCurrentWallet(wallet);
                    })
                    .catch((err) => {
                        Page.showAlterWalletFileError(err);
                    });
            }
            catch (e) {
                Page.showAlterWalletFileError(err);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.BUTTON).click(() => {
            Page.showBuyTokensError();
            Page.buyTokensState.toggleWait(true);
            const count = +Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.COUNT).val();
            try {
                Page.onBuyTokensAsync(count)
                    .then(() => {
                        Page.buyTokensState.toggleWait(false);
                    })
                    .catch((err) => {
                        Page.showBuyTokensError(err);
                        Page.buyTokensState.toggleWait(false);
                    })
            }
            catch (e) {
                Page.showBuyTokensError(e);
                Page.buyTokensState.toggleWait(false);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.BUTTON).click(() => {
            Page.showSellTokensError();
            Page.sellTokensState.toggleWait(true);
            const count = +Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).val();
            const walletId = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).val();
            try {
                Page.onSellTokensAsync(count, walletId)
                    .then(() => {
                        Page.sellTokensState.toggleWait(false);
                    })
                    .catch((err) => {
                        Page.showSellTokensError(err);
                        Page.sellTokensState.toggleWait(false);
                    })
            }
            catch (e) {
                Page.showSellTokensError(e);
                Page.sellTokensState.toggleWait(false);
            }
            return false;
        });

        // Add node validation >>>

        Page.showAddNodeValid(false);
        function calcAndShowAddNodeValid() {
            const {nameValid, urlValid, chainIdValid} = Page.onAddNodeValidation(
                Page.$id(Page.ELEMENT_ID.NODES.NAME).val(),
                Page.$id(Page.ELEMENT_ID.NODES.URL).val(),
                Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).val()
            );
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

        // <<< Add node validation

        // Wallet validation >>>

        Page.showWalletValid(false);

        Page.$id(Page.ELEMENT_ID.BALANCE.WALLET_INPUT).on('input', (evt) => {
            Page.showWalletValid(
                Page.onBalanceWalletValidation(evt.target.value)
            );
        });

        // <<< Wallet validation

        // Alter wallet validation >>>

        Page.showAlterWalletValid(false, false, true);
        function showCurrentAlterWalletValid() {
            const {keyValid, fileValid} = Page.onAlterWalletValidation(
                Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.KEY).val(),
                Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE)[0].files[0]
            );
            Page.showAlterWalletValid(keyValid, fileValid, true);
        }

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.KEY).on('input', () => {
            showCurrentAlterWalletValid();
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE).on('change', () => {
            showCurrentAlterWalletValid();
        });

        // <<< Alter wallet validation

        // Buy tokens validation >>>

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.COUNT).on('input', (evt) => {
            Page.buyTokensState.toggleValid(
                Page.onBuyTokensValidation(evt.target.value)
            );
        });

        // <<< Buy tokens validation

        // Sell tokens validation >>>

        function showCurrentSellTokensValid() {
            const {countValid, recipientValid} = Page.onSellTokensValidation(
                Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).val(),
                Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).val()
            );
            Page.sellTokensState.toggleValid(countValid, recipientValid);
        }

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.WALLET).on('input', (evt) => {
            showCurrentSellTokensValid();
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.SELL.COUNT).on('input', (evt) => {
            showCurrentSellTokensValid();
        });

        // <<< Sell tokens validation

    },
    onNodeAdd() {},
    onNodeRemove() {},
    onNodeChange() {},
    onBalanceCheckAsync() {},
    onAlterWalletPrivateKey() {},
    onAlterWalletFileAsync() {},
    onBuyTokensAsync() {},
    onSellTokensAsync() {},
    onAddNodeValidation() {},
    onBalanceWalletValidation() {},
    onAlterWalletValidation() {},
    onBuyTokensValidation() {},
    onSellTokensValidation() {}
};
