<template>
    <div class="account" @click="showAccountDetails">
        <h3>{{ account.name }}</h3>

        <p><b>Algorithm</b> {{ account.algorithm }}</p>
        <p><b>Digits</b> {{ account.digits }}</p>
        <p><b>Step</b> {{ account.step }}</p>
        <p><b>Window</b> {{ account.window }}</p>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron';

    export default {
        props: ['account'],
        data() {
            return {
                cache: {}
            };
        },
        methods: {
            showAccountDetails() {
                ipcRenderer.send('show-account-details', this.account.id);
            }
        },
        created() {
            this.cache = Object.assign({}, this.account);
        }
    }
</script>
