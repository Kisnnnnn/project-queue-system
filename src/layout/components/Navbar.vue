<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div class="right-name">{{name}}</div>
      <el-dropdown class="avatar-container"
        trigger="click">
        <div class="avatar-wrapper">
          <img src="data:image/png;base64,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"
            class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown"
          class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided
            @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name']),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    display: flex;
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .right-name {
      margin-right: 10px;
      font-size: 16px;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
