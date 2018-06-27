<template>
    <div class="app-section codes-section">
        <account-code v-for="account in accounts" :account="account" :key="account.id" />
    </div>
</template>

<script>
    import AccountCode from './account-code.vue';

    export default {
        components: { AccountCode },
        props: ['app-state'],
        computed: {
            accounts() {
                return this.appState.accounts;
            }
        }
    }
</script>
