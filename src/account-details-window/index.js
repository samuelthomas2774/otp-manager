import { remote, ipcRenderer } from 'electron';
import Vue from 'vue';

import AccountDetails from './ui/account-details.vue';

const appState = {
    account: undefined,
    accountsLoaded: false
};

global.app = appState;

const instance = new Vue({
    data: { appState },
    components: { AccountDetails },
    template: `<account-details :app-state="appState" />`
});

const instanceMount = document.createElement('div');
document.body.appendChild(instanceMount);
instance.$mount(instanceMount);

ipcRenderer.on('update-account', (event, account) => {
    if (account.id !== appState.account.id) return;
    appState.account = account;
    document.title = appState.account.name;
});
ipcRenderer.on('new-code', (event, {account, code, nextCodeTimestamp, nextCodeIn}) => {
    if (account.id !== appState.account.id) return;
    Object.assign(appState.account, {currentCode: code, nextCodeTimestamp, nextCodeIn});
});

const currentWindow = remote.getCurrentWindow();
appState.account = currentWindow.account;

document.title = appState.account.name;
