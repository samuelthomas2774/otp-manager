import {app, ipcMain} from 'electron';
import fs from 'fs';
import EventEmitter from 'events';
import crypto from 'crypto';

import { Authenticator } from 'otplib/authenticator';

const readFile = (...args) => new Promise((rs, rj) => fs.readFile(...args, (err, data) => err ? rj(err) : rs(data)));
const writeFile = (...args) => new Promise((rs, rj) => fs.writeFile(...args, (err, data) => err ? rj(err) : rs(data)));

export class Account extends EventEmitter {
    constructor(account, id) {
        super();
        // Object.assign(this, account);
        this.id = id;
        this.active = false;
        this.timeout = undefined;
        this.interval = undefined;

        this.name = account.name || 'New account';
        this.secret = account.secret || '';
        this.algorithm = account.algorithm || 'sha512';
        this.step = account.step || 30;
        this.digits = account.digits || 6;
        this.window = account.window || 0;
    }

    get authenticator() {
        const authenticator = new Authenticator();

        // authenticator.options = {
        //     secret: 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD',
        //     algorithm: 'sha512',
        //     step: 20,
        //     digits: 8,
        //     window: 1,
        //     crypto
        // };
        authenticator.options = Object.assign({crypto}, this);

        return authenticator;
    }

    get currentCode() {
        try {
            return this.authenticator.generate();
        } catch (err) {
            console.error('Error generating code', err);
            return '';
        }
    }

    get nextCodeTimestamp() {
        return Date.now() + this.nextCodeIn;
    }

    get nextCodeIn() {
        const step = this.step * 1000;
        const epoch = Date.now();
        const count = epoch % step;
        return step - count;
    }

    start() {
        this.stop();
        this.active = true;

        this.timeout = setTimeout(() => {
            const {nextCodeTimestamp, nextCodeIn} = this;
            this.emit('new-code', {code: this.currentCode, nextCodeTimestamp, nextCodeIn});
            this.interval = setInterval(() => {
                const {nextCodeTimestamp, nextCodeIn} = this;
                this.emit('new-code', {code: this.currentCode, nextCodeTimestamp, nextCodeIn});
            }, this.step * 1000);
        }, this.nextCodeIn);
    }

    stop() {
        this.active = false;
        clearTimeout(this.timeout);
        clearInterval(this.interval);
    }

    strip() {
        const {id, name, currentCode, nextCodeTimestamp, nextCodeIn, secret, algorithm, step, digits, window} = this;
        return {id, name, currentCode, nextCodeTimestamp, nextCodeIn, secret, algorithm, step, digits, window};
    }
}

export default class extends EventEmitter {

    constructor(dataPath) {
        super();
        this.dataPath = dataPath;
        this.accounts = [];
        this.unsaved = false;
        this.id = 0;
    }

    async init() {
        const accountsDataString = await this.readDatabaseFile();

        for (let account of JSON.parse(accountsDataString)) {
            this.addAccount(account);
        }

        console.log('Accounts data:', this.accounts);
    }

    async readDatabaseFile() {
        try {
            return await readFile(this.dataPath);
        } catch (err) {
            if (err.code === 'ENOENT') return '[]';
            console.error('Failed to read accounts database', err);
            return '{}';
        }
    }

    writeDatabaseFile(string) {
        return writeFile(this.dataPath, string);
    }

    strip() {
        return this.accounts.map(a => a.strip());
    }

    async save() {
        console.log('Saving accounts database', this.dataPath, this.strip());
        await this.writeDatabaseFile(JSON.stringify(this.strip(), null, 4) + '\n');
        this.unsaved = false;
        this.emit('set-unsaved', false);
    }

    addAccount(account) {
        account = new Account(account, this.id++);
        account.on('new-code', ({code, nextCodeTimestamp}) => this.emit('new-code', {account, code, nextCodeTimestamp}));
        account.start();
        console.log('Adding account', account);
        this.accounts.push(account);
        this.unsaved = true;
        this.emit('add-account', account);
        this.emit('set-unsaved', true);
        return account;
    }

    removeAccount(account) {
        const index = this.accounts.findIndex(a => a.id === account.id || a.id === account);
        if (index <= -1) return;

        account = this.accounts[index];
        console.log('Removing account', account);
        account.stop();
        this.accounts.splice(index, 1);
        this.unsaved = true;
        this.emit('remove-account', account);
        this.emit('set-unsaved', true);
    }

    updateAccount(id, account) {
        if (!account) account = id, id = account.id;
        const index = this.accounts.findIndex(a => a.id === id);
        if (index <= -1) return;

        account = Object.assign(this.accounts[index], account);
        if (account.active) accout.stop(), account.start();
        console.log('Updating account', account);
        // this.accounts.splice(index, 1, account);
        this.unsaved = true;
        this.emit('update-account', account);
        this.emit('set-unsaved', true);
        return account;
    }

}
