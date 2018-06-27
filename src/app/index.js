import {app, ipcMain, BrowserWindow, Menu} from 'electron';
import path from 'path';
import url from 'url';

import menu from './menu';
import AccountsStore from './accounts-store';

const accountsStore = new AccountsStore(path.resolve(__dirname, '..', '..', 'accounts.json'));
let mainWindow;

function sendToAllWindows(event, data) {
    for (let window of BrowserWindow.getAllWindows()) {
        window.send(event, data);
    }
}

app.on('ready', async () => {
    Menu.setApplicationMenu(menu);

    accountsStore.on('add-account', account => sendToAllWindows('add-account', account.strip()));
    accountsStore.on('remove-account', account => sendToAllWindows('remove-account', account.strip()));
    accountsStore.on('update-account', account => sendToAllWindows('update-account', account.strip()));
    accountsStore.on('new-code', ({account, code, nextCodeTimestamp, nextCodeIn}) => sendToAllWindows('new-code', {account: account.strip(), code, nextCodeTimestamp, nextCodeIn}));
    accountsStore.on('set-unsaved', unsaved => sendToAllWindows('set-unsaved', unsaved));

    ipcMain.on('add-account', (event, account) => accountsStore.addAccount(account));
    ipcMain.on('remove-account', (event, account) => accountsStore.removeAccount(account));
    ipcMain.on('update-account', (event, account) => accountsStore.updateAccount(account));
    ipcMain.on('save-accounts', event => accountsStore.save());
    ipcMain.on('replay-all-accounts', event => {
        for (let account of accountsStore.accounts) {
            event.sender.send('add-account', account.strip());
        }
    });

    accountsStore.on('remove-account', account => {
        for (let window of BrowserWindow.getAllWindows()) {
            if (!window.account || window.account.id !== account_id) continue;
            window.close();
        }
    });

    ipcMain.on('show-account-details', (event, account_id) => {
        const account = accountsStore.accounts.find(a => a.id === account_id);

        if (!account) throw new Error(`Cannot open account details for unknown account ${account_id}.`);

        for (let window of BrowserWindow.getAllWindows()) {
            if (!window.account || window.account.id !== account_id) continue;
            return window.focus();
        }

        const detailsWindow = new BrowserWindow({
            width: 280,
            height: 500,
            x: 100,
            y: 100,
            webPreferences: {
                scrollBounce: true
            }
        });

        // The details window will use remote.getCurrentWindow to get the window object, containing this
        detailsWindow.account = account.strip();

        detailsWindow.setMenuBarVisibility(false);
        detailsWindow.setContentProtection(true);
        detailsWindow.loadURL(url.format({
            pathname: path.resolve(__dirname, '..', 'account-details-window', 'index.html'),
            protocol: 'file:',
            slashes: true
        }));
    });

    try {
        await accountsStore.init();
    } catch (err) {
        console.error('Error loading accounts', err);
    }

    mainWindow = new BrowserWindow({
        webPreferences: {
            scrollBounce: true
        }
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.setContentProtection(true);
    mainWindow.loadURL(url.format({
        pathname: path.resolve(__dirname, '..', 'main-window', 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
});
