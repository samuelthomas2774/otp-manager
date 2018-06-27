<template>
    <div class="app-section accounts-section">
        <h2>Accounts</h2>

        <div class="accounts-list">
            <account v-for="account in accounts" :account="account" :key="account.id" />
        </div>
    </div>
</template>

<script>
    import Account from './account.vue';

    export default {
        components: { Account },
        props: ['app-state'],
        computed: {
            accounts() {
                return this.appState.accounts;
            }
        }
    }
</script>
