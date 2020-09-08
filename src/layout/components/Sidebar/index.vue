<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo"
      :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu v-if="show"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical">
        <sidebar-item v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/styles/variables.scss';

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar', 'name', 'teamLeader']),
    routes() {
      let paths = this.$router.options.routes,
        igonreIndex = 0;

      if (this.name === '项目人员') {
        paths = paths.filter(
          (item, index) =>
            item.name !== 'project' &&
            item.name !== 'team' &&
            item.name !== 'archive'
        );
      }
      // if (!this.teamLeader) {
      //   paths = paths.filter((item, index) => item.name !== 'team');
      // }

      return paths;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },

    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  data() {
    return {
      show: true,
    };
  },
};
</script>
