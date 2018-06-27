<template>
    <div class="account">
        <h3>{{ account.name }}</h3>
        <p>{{ account.currentCode }} - generated every {{ account.step }} seconds, next at {{ account.nextCodeTimestamp }} (in {{ nextCodeIn }} second{{ nextCodeIn === 1 ? '' : 's' }})</p>
    </div>
</template>

<script>
    export default {
        props: ['account'],
        data() {
            return {
                time: 0,
                timeout: undefined
            };
        },
        computed: {
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
