<template>
    <div class="app-root" :data-active-item="account ? account.name : undefined">
        <div class="account-details" v-if="account">
            <h2>{{ account.name }}</h2>

            <h3>{{ account.currentCode }}</h3>

            <p>Generated every {{ account.step }} seconds, next at {{ account.nextCodeTimestamp }} (in {{ nextCodeIn }} second{{ nextCodeIn === 1 ? '' : 's' }})</p>

            <h4>Algorithm</h4>
            <p>{{ account.algorithm }}</p>

            <h4>Digits</h4>
            <p>{{ account.digits }}</p>

            <h4>Secret</h4>
            <p>{{ account.secret }}</p>

            <h4>Step</h4>
            <p>{{ account.step }} seconds</p>

            <h4>Window</h4>
            <p>{{ account.window }}</p>
        </div>
        <div class="loading-overlay" v-else>
            <p>Loading...</p>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['app-state'],
        data() {
            return {
                time: 0,
                timeout: undefined
            };
        },
        computed: {
            account() {
                return this.appState.account;
            },
            nextCodeIn() {
                return Math.floor((this.account.nextCodeTimestamp - this.time) / 1000) + 1;
            }
        },
        methods: {
            updateTime() {
                this.time = Date.now();
                this.timeout = setTimeout(this.updateTime, 1);
            }
        },
        mounted() {
            this.updateTime();
        },
        unmounted() {
            clearTimeout(this.timeout);
        }
    }
</script>
