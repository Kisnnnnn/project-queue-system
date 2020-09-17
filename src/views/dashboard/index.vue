<template>
  <div class="dashboard-container">
    <el-table :data="statisticsData"
      border
      size="samll"
      row-class-name="statis-row"
      style="width: 100%">
      <el-table-column prop="indepData"
        header-align="center"
        align="center"
        label="部门在开发项目数量">
      </el-table-column>
      <el-table-column prop="totalWeekTime"
        header-align="center"
        align="center"
        label="本周预计总工时"
        width="180">
      </el-table-column>
      <el-table-column prop="averageNum"
        header-align="center"
        align="center"
        label="本周人均预计总工时">
      </el-table-column>
      <el-table-column prop="dangerNum"
        class-name="warning-col-row"
        header-align="center"
        align="center"
        label="临近交付节点项目数量">
      </el-table-column>
      <el-table-column prop="overNum"
        header-align="center"
        class-name="fail-col-row"
        align="center"
        label="超期项目数量">
      </el-table-column>

    </el-table>
    <h2 class="tag">总体条线项目统计</h2>
    <div id="allproject-pie-echarts"
      class="allproject-pie-echarts"></div>
    <h2 class="tag">项目本周风险状态</h2>
    <div id="dealine-bar-echarts"
      class="dealine-bar-echarts"></div>
    <h2 class="tag">项目本周预计工作量</h2>
    <div id="workload-bar-echarts"
      class="dealine-bar-echarts"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import _ from 'lodash';
import {
  renderAllProjectDate,
  renderDeanlineDate,
  renderWorkloadDate,
} from './allproject-data.js';
import moment from 'moment';
import echarts from 'echarts';

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name']),
    statisticsData() {
      return [
        {
          totalWeekTime: this.totalWeekTime + '小时',
          indepData: this.indepData.length + '个',
          userLen: this.users.length + '个',
          averageNum: this.averageNum.toFixed(2) + '小时',
          dangerNum:
            this.statusData.filter((item) => item === '临近交付节点').length +
            '个',
          overNum:
            this.statusData.filter((item) => item === '超期').length + '个',
        },
      ];
    },
  },
  data() {
    return {
      // 所有用户
      users: [],
      // 项目数据
      tableData: [],
      // 独立项目数据
      indepData: [],
      // 状态数据
      statusData: [],
      // 本周总体工时
      totalWeekTime: 0,
      // 本周项目
      averageNum: 0,
    };
  },
  async mounted() {
    this.users = await this.$store.dispatch('user/getAllUserInfo');
    this.tableData = await this.$store.dispatch('project/queryProject');

    this.allEcharts = echarts.init(
      document.getElementById('allproject-pie-echarts')
    );
    this.deadlineEcharts = echarts.init(
      document.getElementById('dealine-bar-echarts')
    );
    this.workloadEcharts = echarts.init(
      document.getElementById('workload-bar-echarts')
    );
    // 图表初始化
    this.renderEcharts();
    // 计算一些数据
    this.calData();
  },
  methods: {
    renderEcharts() {
      // init all project data pie Echarts
      const allOption = renderAllProjectDate(this.tableData);

      this.allEcharts.setOption(allOption);

      // // init dealine data pie Echarts
      const deadlineOption = renderDeanlineDate(this.tableData);

      this.deadlineEcharts.setOption(deadlineOption);

      // init workload data line Echarts
      const workloadOption = renderWorkloadDate(this.tableData, 1);

      this.workloadEcharts.setOption(workloadOption);
    },
    // 计算一些数据
    calData() {
      let weekTimeData = this.tableData.map(({ weekTime }) => Number(weekTime));
      let personLen = this.users.filter(({ teamLeader }) => teamLeader != '4')
        .length;

      this.totalWeekTime = weekTimeData.reduce((a, b) => a + b);
      this.indepData = this.tableData.filter((item) => !item.isAssist);
      this.statusData = this.indepData.map((item) => {
        const toDeadLineNum = moment(new Date()).diff(item.endTime, 'days');

        if (toDeadLineNum > 0) {
          return '超期';
        } else if (toDeadLineNum > -6 && toDeadLineNum <= 0) {
          return '临近交付节点';
        } else {
          return '安全';
        }
      });
      this.averageNum = this.totalWeekTime / personLen;
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
  .statis-row {
    background: #f0f9eb;
    font-size: 20px;
    text-align: center;
    color: #333;
    font-weight: 450;
  }
  .fail-col-row {
    background: #eb8f8f;
    color: #fff;
    font-weight: bold;
  }
  .warning-col-row {
    background: oldlace;
    color: #666;
    font-weight: bold;
  }
}
</style>