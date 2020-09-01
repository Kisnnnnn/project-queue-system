<template>
  <div class="dashboard-container">
    <h2 class="tag">总体条线项目统计</h2>
    <div id="allproject-pie-echarts"
      class="allproject-pie-echarts"></div>
    <h2 class="tag">项目完成节点统计</h2>
    <div id="dealine-bar-echarts"
      class="dealine-bar-echarts"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { renderAllProjectDate, renderDeanlineDate } from './allproject-data.js';
import moment from 'moment';
import echarts from 'echarts';

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name']),
  },
  data() {
    return {
      // 所有用户
      users: [],
      // 项目数据
      tableData: [],
    };
  },
  async created() {
    this.users = await this.$store.dispatch('user/getAllUserInfo');
  },
  async mounted() {
    this.tableData = await this.$store.dispatch('project/queryProject');
    // 图表初始化
    this.renderEcharts();
  },
  methods: {
    renderEcharts() {
      // init all project data pie Echarts
      const allOption = renderAllProjectDate(this.tableData);
      let allEcharts = echarts.init(
        document.getElementById('allproject-pie-echarts')
      );
      allEcharts.setOption(allOption);

      // // init dealine data pie Echarts
      const deadlineOption = renderDeanlineDate(this.tableData);
      console.log(JSON.stringify(deadlineOption));
      let deadlineEcharts = echarts.init(
        document.getElementById('dealine-bar-echarts')
      );
      deadlineEcharts.setOption(deadlineOption);
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
  // 标题
  .tag {
    font-size: 20px;
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

// echarts
.allproject-pie-echarts {
  width: 100%;
  height: 400px;
}
.dealine-bar-echarts {
  width: 100%;
  height: 400px;
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