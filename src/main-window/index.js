import { ipcRenderer } from 'electron';
import Vue from 'vue';

import Sidebar from './ui/sidebar';

import App from './ui/app.vue';

import CodesSection from './ui/components/codes-section.vue';
import AccountsSection from './ui/components/accounts-section.vue';

const appState = {
    activeItem: undefined,
    sidebar: new Sidebar(),
    accounts: [],
    accountsLoaded: false
};

global.app = appState;

const instance = new Vue({
    data: { appState },
    components: { App },
    template: `<app :app-state="appState" />`
});

const instanceMount = document.createElement('div');
document.body.appendChild(instanceMount);
instance.$mount(instanceMount);

const mainSection = appState.sidebar.addSection('Main');
appState.activeItem = mainSection.addItem('Codes', CodesSection);
appState.activeItem = mainSection.addItem('Accounts', AccountsSection);

ipcRenderer.on('add-account', (event, account) => appState.accounts.push(account));
ipcRenderer.on('remove-account', (event, account) => appState.accounts.splice(appState.accounts.findIndex(a => a.id === account.id), 1));
ipcRenderer.on('update-account', (event, account) => appState.accounts.splice(appState.accounts.findIndex(a => a.id === account.id), 1, account));
ipcRenderer.on('new-code', (event, {account, code, nextCodeTimestamp, nextCodeIn}) => Object.assign(appState.accounts.find(a => a.id === account.id), {currentCode: code, nextCodeTimestamp, nextCodeIn}));

ipcRenderer.send('replay-all-accounts');
