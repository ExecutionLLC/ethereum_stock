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
}

window.addEventListener('DOMContentLoaded', onload);
