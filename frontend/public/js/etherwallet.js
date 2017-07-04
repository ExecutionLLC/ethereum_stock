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

function showBalance(tokens, eth, btc) {

    function showBalanceAt(elementId, balance) {
        const balanceEl = document.getElementById(elementId);
        if (balanceEl) {
            setElementText(balanceEl, '' + balance)
        }
    }

    const balanceContainer = document.getElementById('balance-container');
    if (balanceContainer) {
        balanceContainer.style.display = tokens ? 'block' : 'none';
        showBalanceAt('balance-tokens', tokens);
        showBalanceAt('balance-eth', eth);
        showBalanceAt('balance-btc', btc);
    }
}

function getBalance(contract, walletId) {
    const tokens = contract.clientTokens(walletId/*'0xA226Ca6Cd9190B39FEe7324c7E26f1B7e13476aA'*/).c[0];
    const tokenPrice = contract.tokenPrice().c[0];
    return {
        tokens,
        tokenPrice,
        eth: tokens * tokenPrice
    };
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
                const walletId = balanceCheckInput.value;
                const contract = web3.eth
                    .contract([{"constant":false,"inputs":[],"name":"returnAllTokens","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destruct","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_n","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_n","type":"uint256"}],"name":"returnToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"availableTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tokenPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_price","type":"uint256"}],"name":"setPrice","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_n","type":"uint256"}],"name":"emitTokens","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"clientTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_n","type":"uint256"},{"name":"_price","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newPrice","type":"uint256"}],"name":"priceChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_availableTokens","type":"uint256"}],"name":"availableTokensChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_client","type":"address"},{"indexed":false,"name":"_n","type":"uint256"},{"indexed":false,"name":"_currentTokenPrice","type":"uint256"}],"name":"tokenAcquired","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_client","type":"address"},{"indexed":false,"name":"_n","type":"uint256"},{"indexed":false,"name":"_currentTokenPrice","type":"uint256"}],"name":"tokenReturned","type":"event"}])
                    .at('0x231fe53762953bedf6ff9dfe0a838be2b85e5c72');
                const balance = getBalance(contract, walletId);
                showBalance(balance.tokens, balance.eth);
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', onload);
