<template>
  <div class="dashboard-container">
    这里有图表，但是我还没开发。
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name']),
  },
  data() {
    return {
      // 检索数据
      formInline: {
        projectname: '',
        developer: '',
      },
      // 所有用户
      users: [],
      // 项目数据
      tableData: [],
      // 分页后的表格数据
      filterTableData: [],
    };
  },
  async created() {
    this.users = await this.$store.dispatch('user/getAllUserInfo');
    this.tableData = await this.$store.dispatch('project/queryProject');
  },
  activated() {},
  methods: {
    // 项目预警状态
    projecStatusData({ row, rowIndex }) {
      const toDeadLineNum = moment(new Date()).diff(row.endTime, 'days');
      if (toDeadLineNum > 0) {
        return 'fail-row';
      } else if (toDeadLineNum > -6 && toDeadLineNum <= 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
      return '';
    },
    // 跳转新增项目
    onAddProject() {
      this.$router.push({
        path: '/project/project-add',
      });
    },
    // 查看项目
    handleDelete(index, row) {
      console.log(row);
    },
    // 删除项目
    handleView(index, row) {
      this.$router.push({
        path: '/project/project-detail',
        query: {
          rowGuid: row.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 10px;
  .searh-form {
    display: flex;
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
.dashboard-text {
  font-size: 30px;
  line-height: 46px;
}
.pagination {
  width: 100%;
  text-align: center;
  margin-top: 15px;
}
</style>
<style  lang="scss">
.dashboard-container {
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-table .fail-row {
    background: #eb8f8f;
    color: #333;
  }
}
</style>