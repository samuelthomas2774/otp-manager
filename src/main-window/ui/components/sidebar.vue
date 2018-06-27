<template>
    <div class="app-sidebar" :class="{active, animating}">
        <div class="app-sidebar-section" :class="{active: section.items.find(i => i === activeItem)}" v-for="section in sections">
            <div class="section-header" @click="active = !active">
                <span class="section-icon">{{ section.name.substr(0, 1) }}</span>
                <div class="section-name">{{ section.name }}</div>
            </div>

            <div class="sidebar-item" :class="{active: item === activeItem}" @click="$emit('select', item)" v-for="item in section.items">
                <span class="item-icon">{{ item.name.substr(0, 1) }}</span>
                <span class="item-name">{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['sidebar', 'active-item'],
        data() {
            return {
                active: false,
                animating: false,
                animationTimeout: undefined
            };
        },
        computed: {
            sections() {
                return this.sidebar.sections;
            }
        },
        watch: {
            active(active, wasActive) {
                if (!!active === !!wasActive) return;

                if (this.animationTimeout) clearTimeout(this.animationTimeout);

                this.animating = true;
                this.animationTimeout = setTimeout(() => {
                    this.animating = false;
                }, 750);
            }
        }
    }
</script>
