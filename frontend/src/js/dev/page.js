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
            WITHDRAWALS_ETH: 'balance-withdrawals-eth',
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
                WAIT: 'add-wallet-private-key-wait',
                ERROR: 'add-wallet-private-key-error'
            },
            FILE: {
                GROUP: 'add-wallet-file-group',
                FILE: 'add-wallet-file',
                PASSWORD: 'add-wallet-file-password',
                BUTTON: 'add-wallet-file-button',
                WAIT: 'add-wallet-file-wait',
                ERROR: 'add-wallet-file-error'
            },
            OPERATIONS: {
                CONTAINER: 'wallet-ops',
                WALLET_ADDRESS: 'wallet-address',
                BUY_FOR_SELF: {
                    GROUP: 'buy-for-self-tokens-group',
                    COUNT: 'buy-for-self-tokens-count',
                    GAS_PRICE: 'buy-for-self-gas-price',
                    BUTTON: 'buy-for-self-tokens-button',
                    PRICE: 'buy-for-self-tokens-price',
                    WAIT: 'buy-for-self-tokens-wait',
                    ERROR: 'buy-for-self-tokens-error',
                    TRANSACTION_WAIT: 'buy-for-self-tokens-transaction-waiting',
                    TRANSACTION_COMPLETE: 'buy-for-self-tokens-transaction-completed',
                    TRANSACTION_FAILED: 'buy-for-self-tokens-transaction-failed'
                },
                BUY_FOR_USER: {
                    GROUP: 'buy-for-user-tokens-group',
                    COUNT: 'buy-for-user-tokens-count',
                    WALLET: 'buy-for-user-tokens-wallet',
                    BUTTON: 'buy-for-user-tokens-button',
                    PRICE: 'buy-for-user-tokens-price',
                    WAIT: 'buy-for-user-tokens-wait',
                    ERROR: 'buy-for-user-tokens-error',
                    TRANSACTION_WAIT: 'buy-for-user-tokens-transaction-waiting',
                    TRANSACTION_COMPLETE: 'buy-for-user-tokens-transaction-completed',
                    TRANSACTION_FAILED: 'buy-for-user-tokens-transaction-failed'
                }
            },
            INFO: {
                BALANCE: 'alter-wallet-balance',
                WITHDRAWALS: 'alter-wallet-withdrawals',
                PRICE: 'alter-wallet-token-price',
                CAN_BE_BOUGHT: 'alter-wallet-tokens-can-be-bought',
                TOKENS_LEFT: 'alter-wallet-tokens-left',
                WALLET_TOKENS: 'alter-wallet-tokens'
            }
        }
    },
    $id(id) {
        return $(`#${id}`);
    },
    setNodes(nodesNames, currentId, canRemove) {
        $.each(nodesNames, (i, {id, name}) => {
            Page.appendNode(id, name);
        });
        Page.selectNode(currentId);
        Page.nodesState.disableRemoveNode(!canRemove);
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
    showWalletValid(isValid) {
        Page.$id(Page.ELEMENT_ID.BALANCE.WALLET_FORM_GROUP).toggleClass('has-error', !isValid);
        Page.$id(Page.ELEMENT_ID.BALANCE.CHECK_BUTTON).prop('disabled', !isValid);
    },
    showBalanceWait(show) {
        Page.$id(Page.ELEMENT_ID.BALANCE.WAIT).toggle(show);
    },
    showAlterWalletPrivateKeyWait(isWaiting) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
    },
    showAlterWalletFileWait(isWaiting) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
    },
    showBalance(tokens, eth, btc, withdrawals) {

        function strNull(s) {
            return s == null ? '...' : s;
        }

        Page.$id(Page.ELEMENT_ID.BALANCE.CONTAINER).css('visibility', tokens == null ? 'hidden' : 'visible');
        Page.$id(Page.ELEMENT_ID.BALANCE.TOKENS).text(strNull(tokens));
        Page.$id(Page.ELEMENT_ID.BALANCE.ETH).text(strNull(eth));
        Page.$id(Page.ELEMENT_ID.BALANCE.BTC).text(strNull(btc));
        Page.$id(Page.ELEMENT_ID.BALANCE.WITHDRAWALS_ETH).text(strNull(withdrawals));
    },
    showTokensHistory(walletId, res) {
        Page.$id(Page.ELEMENT_ID.TOKENS_HISTORY.CONTAINER).css('visibility', res == null ? 'hidden' : 'visible');

        const $template = Page.$id(Page.ELEMENT_ID.TOKENS_HISTORY.TEMPLATE);

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
            const $el = $template.clone().show();
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
        Page.$id(Page.ELEMENT_ID.NODES.NODE).val(valueToSelect);
    },
    getSelectedNode() {
        return Page.$id(Page.ELEMENT_ID.NODES.NODE).val();
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
    showBuyForSelfTokensError(error) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_SELF.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showBuyForUserTokensError(error) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAlterWalletValid(keyValid, fileValid, filePasswordValid) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.GROUP).toggleClass('has-error', !keyValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.BUTTON).prop('disabled', !keyValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.GROUP).toggleClass('has-error', !fileValid || !filePasswordValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.BUTTON).prop('disabled', !fileValid || !filePasswordValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE).toggleClass('alert-danger', !fileValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.PASSWORD).toggleClass('alert-danger', !filePasswordValid);
    },
    showCurrentWallet(walletInfo) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.CONTAINER).toggle(!!walletInfo);
        if (!walletInfo) {
            return;
        }
        const {wallet, info, gasPrice} = walletInfo;
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.WALLET_ADDRESS).text(wallet.address);
        const INFO_IDS = Page.ELEMENT_ID.ALTER_WALLET.INFO;
        Page.$id(INFO_IDS.BALANCE).text(info.balance);
        Page.$id(INFO_IDS.WITHDRAWALS).text(info.withdrawals);
        Page.$id(INFO_IDS.PRICE).text(info.price);
        Page.$id(INFO_IDS.CAN_BE_BOUGHT).text(info.canBeBought);
        Page.$id(INFO_IDS.TOKENS_LEFT).text(info.tokensLeft);
        Page.$id(INFO_IDS.WALLET_TOKENS).text(info.walletTokens);

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_SELF.GAS_PRICE).val(gasPrice);
    },
    buyForSelfTokensState: {
        _isValid: false,
        _isWaiting: false,
        _showCurrentState() {
            const isValid = Page.buyForSelfTokensState._isValid;
            const isWaiting = Page.buyForSelfTokensState._isWaiting;
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_SELF.GROUP).toggleClass('has-error', !isValid);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_SELF.COUNT).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_SELF.GAS_PRICE).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_SELF.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_SELF.BUTTON).prop('disabled', !isValid || isWaiting);
        },
        init() {
            Page.buyForSelfTokensState._isValid = false;
            Page.buyForSelfTokensState._isWaiting = false;
            Page.buyForSelfTokensState._showCurrentState();
        },
        toggleWait(isWait) {
            Page.buyForSelfTokensState._isWaiting = isWait;
            Page.buyForSelfTokensState._showCurrentState();
        },
        toggleValid(isValid) {
            Page.buyForSelfTokensState._isValid = isValid;
            Page.buyForSelfTokensState._showCurrentState();
        }
    },
    buyForUserTokensState: {
        _isCountValid: false,
        _isRecipientValid: false,
        _isWaiting: false,
        _showCurrentState() {
            const isCountValid = Page.buyForUserTokensState._isCountValid;
            const isRecipientValid = Page.buyForUserTokensState._isRecipientValid;
            const isWaiting = Page.buyForUserTokensState._isWaiting;
            const isGroupValid = isCountValid && isRecipientValid;
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.GROUP).toggleClass('has-error', !isGroupValid);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.COUNT).toggleClass('alert-danger', !isCountValid);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.WALLET).toggleClass('alert-danger', !isRecipientValid);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.WALLET).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.COUNT).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
            Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.BUTTON).prop('disabled', !isCountValid || !isRecipientValid || isWaiting);
        },
        init() {
            Page.buyForUserTokensState._isCountValid = false;
            Page.buyForUserTokensState._isRecipientValid = false;
            Page.buyForUserTokensState._isWaiting = false;
            Page.buyForUserTokensState._showCurrentState();
        },
        toggleWait(isWait) {
            Page.buyForUserTokensState._isWaiting = isWait;
            Page.buyForUserTokensState._showCurrentState();
        },
        toggleValid(isCountValid, isRecipientValid) {
            Page.buyForUserTokensState._isCountValid = isCountValid;
            Page.buyForUserTokensState._isRecipientValid = isRecipientValid;
            Page.buyForUserTokensState._showCurrentState();
        }
    },
    showBuyForSelfTokensPrice(price) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_SELF.PRICE).text(price);
    },
    showBuyForUserTokensPrice(price) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.PRICE).text(price);
    },
    showTransaction(ids, id, complete, fail) {
        const $wait = Page.$id(ids.TRANSACTION_WAIT);
        const $complete = Page.$id(ids.TRANSACTION_COMPLETE);
        const $failed = Page.$id(ids.TRANSACTION_FAILED);
        $wait.hide();
        $complete.hide();
        $failed.hide();
        if (id == null) {
            return;
        }
        const $caption = complete ?
            fail ?
                $failed :
                $complete :
            $wait;
        const templateText = $caption.data('template');
        const text = templateText.replace('%', id);
        $caption.text(text).show();
    },
    showBuyForSelfTransaction(id, complete, fail) {
        Page.showTransaction(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_SELF, id, complete, fail);
    },
    showBuyForUserTransaction(id, complete, fail) {
        Page.showTransaction(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER, id, complete, fail);
    },
    getChartCanvasElement() {
        return Page.$id(Page.ELEMENT_ID.CHART.ID)[0];
    },
    nodesState: {
        _disableRemove: false,
        _nodeAdding: false,
        _showCurrentState() {
            const disableRemove = Page.nodesState._disableRemove;
            const nodeAdding = Page.nodesState._nodeAdding;
            Page.$id(Page.ELEMENT_ID.NODES.REMOVE_NODE_BUTTON).prop('disabled', disableRemove || nodeAdding);
            Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_GROUP).toggle(nodeAdding);
            Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_SHOW_BUTTON).prop('disabled', nodeAdding);
            Page.$id(Page.ELEMENT_ID.NODES.NODE).prop('disabled', nodeAdding);
        },
        init() {
            Page.nodesState._showCurrentState();
        },
        disableRemoveNode(disable) {
            Page.nodesState._disableRemove = disable;
            Page.nodesState._showCurrentState();
        },
        toggleNodeAdding(adding) {
            Page.nodesState._nodeAdding = adding;
            Page.nodesState._showCurrentState();
        }
    },
    init() {
        Page.showNodeError();
        Page.showAddNodeError();
        Page.showBalanceError();
        Page.showBalance();
        Page.showTokensHistory();
        Page.showBalanceWait(false);
        Page.showAlterWalletPrivateKeyWait(false);
        Page.showAlterWalletFileWait(false);
        Page.showCurrentWallet();
        Page.showAlterWalletPrivateKeyError();
        Page.showAlterWalletFileError();
        Page.showBuyForSelfTokensError();
        Page.showBuyForUserTokensError();
        Page.showBuyForSelfTransaction();
        Page.showBuyForUserTransaction();

        Page.buyForSelfTokensState.init();
        Page.buyForUserTokensState.init();
        Page.nodesState.init();

        Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_SHOW_BUTTON).click(() => {
            Page.nodesState.toggleNodeAdding(true);
            Page.showNodeError();
            Page.showAddNodeError();
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.CANCEL).click(() => {
            Page.nodesState.toggleNodeAdding(false);
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
                const {id, node, canRemoveNode} = Page.onNodeAdd({name, url, chainId});
                Page.appendNode(id, node.name);
                Page.selectNode(id);
                Page.nodesState.toggleNodeAdding(false);
                Page.nodesState.disableRemoveNode(!canRemoveNode);
            }
            catch (e) {
                Page.showAddNodeError(e);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.REMOVE_NODE_BUTTON).click(() => {
            Page.showNodeError();
            const curNodeId = Page.getSelectedNode();
            try {
                const {id, canRemoveNode} = Page.onNodeRemove(curNodeId);
                Page.removeNode(curNodeId);
                Page.nodesState.disableRemoveNode(!canRemoveNode);
                Page.selectNode(id);
            } catch (e) {
                Page.showNodeError(e);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.NODE).change(() => {
            Page.showNodeError();
            const currentNodeId = Page.getSelectedNode();
            try {
                const canRemoveNode = Page.onNodeChange(currentNodeId);
                Page.nodesState.disableRemoveNode(!canRemoveNode);
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
                Page.showBalance(balance.tokens, balance.eth, balance.btc, balance.withdrawals);
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
            Page.showAlterWalletPrivateKeyWait(true);
            const privateKey = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.KEY).val();
            const privateKey0x = /^0x/.test(privateKey) ? privateKey : `0x${privateKey}`;
            try {
                Page.onAlterWalletPrivateKeyAsync(privateKey0x)
                    .then((walletInfo) => {
                        Page.showCurrentWallet(walletInfo);
                        Page.showAlterWalletPrivateKeyWait(false);
                    })
                    .catch((err) => {
                        Page.showAlterWalletPrivateKeyError(err);
                        Page.showAlterWalletPrivateKeyWait(false);
                    });
            }
            catch (e) {
                Page.showAlterWalletPrivateKeyError(e);
                Page.showAlterWalletPrivateKeyWait(false);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.BUTTON).click(() => {
            Page.showCurrentWallet();
            Page.showAlterWalletPrivateKeyError();
            Page.showAlterWalletFileError();
            Page.showAlterWalletFileWait(true);
            const file = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE)[0].files[0];
            const password = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.PASSWORD).val();
            try {
                Page.onAlterWalletFileAsync(file, password)
                    .then((walletInfo) => {
                        Page.showCurrentWallet(walletInfo);
                        Page.showAlterWalletFileWait(false);
                    })
                    .catch((err) => {
                        Page.showAlterWalletFileError(err);
                        Page.showAlterWalletFileWait(false);
                    });
            }
            catch (e) {
                Page.showAlterWalletFileError(e);
                Page.showAlterWalletFileWait(false);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_SELF.BUTTON).click(() => {
            Page.showBuyForSelfTokensError();
            Page.showBuyForSelfTransaction();
            Page.buyForSelfTokensState.toggleWait(true);
            const count = +Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_SELF.COUNT).val();
            const gasPrice = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_SELF.GAS_PRICE).val();
            try {
                let transactionId;
                function onTransactionId(id) {
                    transactionId = id;
                    Page.showBuyForSelfTransaction(id, false);
                }

                Page.onBuyTokensAsync(count, gasPrice, onTransactionId)
                    .then(() => {
                        Page.buyForSelfTokensState.toggleWait(false);
                        Page.showBuyForSelfTransaction(transactionId, true);
                    })
                    .catch((err) => {
                        Page.showBuyForSelfTokensError(err);
                        Page.buyForSelfTokensState.toggleWait(false);
                        Page.showBuyForSelfTransaction(transactionId, true, true);
                    })
            }
            catch (e) {
                Page.showBuyForSelfTokensError(e);
                Page.buyForSelfTokensState.toggleWait(false);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.BUTTON).click(() => {
            Page.showBuyForUserTokensError();
            Page.showBuyForUserTransaction();
            Page.buyForUserTokensState.toggleWait(true);
            const count = +Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.COUNT).val();
            const walletId = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.WALLET).val();
            try {
                let transactionId;
                function onTransactionId(id) {
                    transactionId = id;
                    Page.showBuyForUserTransaction(id, false);
                }

                Page.onBuyForUserTokensAsync(count, walletId, onTransactionId)
                    .then(() => {
                        Page.buyForUserTokensState.toggleWait(false);
                        Page.showBuyForUserTransaction(transactionId, true);
                    })
                    .catch((err) => {
                        Page.showBuyForUserTokensError(err);
                        Page.buyForUserTokensState.toggleWait(false);
                        Page.showBuyForUserTransaction(transactionId, true, true);
                    })
            }
            catch (e) {
                Page.showBuyForUserTokensError(e);
                Page.buyForUserTokensState.toggleWait(false);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.CHART.BUTTONS.WHOLE).click(() => {
            Page.onChartShowWhole();
            return false;
        });
        Page.$id(Page.ELEMENT_ID.CHART.BUTTONS.MONTH).click(() => {
            Page.onChartShowMonth();
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

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_SELF.COUNT).on('input', (evt) => {
            Page.buyForSelfTokensState.toggleValid(
                Page.onBuyForSelfTokensValidation(evt.target.value)
            );
        });

        // <<< Buy tokens validation

        // Buy for user tokens validation >>>

        function showCurrentBuyForUserTokensValid() {
            const {countValid, recipientValid} = Page.onBuyForUserTokensValidation(
                Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.COUNT).val(),
                Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.WALLET).val()
            );
            Page.buyForUserTokensState.toggleValid(countValid, recipientValid);
        }

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.WALLET).on('input', () => {
            showCurrentBuyForUserTokensValid();
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY_FOR_USER.COUNT).on('input', () => {
            showCurrentBuyForUserTokensValid();
        });

        // <<< Buy for user  tokens validation

    },
    onNodeAdd() {},
    onNodeRemove() {},
    onNodeChange() {},
    onBalanceCheckAsync() {},
    onAlterWalletPrivateKeyAsync() {},
    onAlterWalletFileAsync() {},
    onBuyTokensAsync() {},
    onBuyForUserTokensAsync() {},
    onAddNodeValidation() {},
    onBalanceWalletValidation() {},
    onAlterWalletValidation() {},
    onBuyForSelfTokensValidation() {},
    onBuyForUserTokensValidation() {},
    onChartShowWhole() {},
    onChartShowMonth() {}
};
