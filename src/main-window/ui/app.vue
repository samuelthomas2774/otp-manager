<template>
    <div class="app-root" :data-active-item="activeItem ? activeItem.name : undefined">
        <div class="app-sidebar-wrapper">
            <sidebar :sidebar="sidebar" :active-item="activeItem" @select="item => appState.activeItem = item" />
        </div>

        <div class="app-section-wrapper">
            <transition name="active-item">
                <component v-if="activeItem" :is="activeItem.component" :app-state="appState" />
            </transition>
        </div>
    </div>
</template>

<script>
    import Sidebar from './components/sidebar.vue';

    export default {
        components: { Sidebar },
        props: ['app-state'],
        computed: {
            activeItem() {
                return this.appState.activeItem;
            },
            sidebar() {
                return this.appState.sidebar;
            }
        }
    }
</script>
