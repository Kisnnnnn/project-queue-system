<template>
  <div class="dashboard-container">
    <el-row>
      <el-col v-if="teamLeader!=''"
        :span="24">
        <el-form :inline="true"
          size="small"
          class="searh-form">
          <el-form-item label="小组">
            <el-select v-model="teamIndex"
              clearable
              @change="queryGroupList"
              placeholder="请选择">
              <el-option v-for="(item, index) in teamData"
                :key="index"
                :label="item.name"
                :value="item.index"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <h2 class="tag">小组条线项目统计</h2>
    <div id="project-team-pie-echarts"
      class="allproject-pie-echarts"></div>
    <el-row>
      <el-col :span="12">
        <h2 class="tag">小组项目本周风险状态</h2>
        <div id="dealine-team-bar-echarts"
          class="dealine-bar-echarts"></div>
      </el-col>
      <!-- 工作量 -->
      <el-col :span="12">
        <h2 class="tag">小组项目本周预计工作量</h2>
        <div id="workload-team-bar-echarts"
          class="dealine-bar-echarts"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  renderAllProjectDate,
  renderDeanlineDate,
  renderWorkloadDate,
} from '../dashboard/allproject-data.js';
import moment from 'moment';
import echarts from 'echarts';

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name', 'teamLeader', 'groupIndex']),
  },
  data() {
    return {
      // 所有用户
      users: [],
      // 项目数据
      tableData: [],
      // 团队小组
      teamIndex: '',
      //   小组
      teamData: [],
      allEcharts: null,
      deadlineEcharts: null,
      workloadEcharts: null,
    };
  },
  async created() {},
  async mounted() {
    this.users = await this.$store.dispatch('user/getAllUserInfo');
    this.teamData = await this.$store.dispatch('user/getGroups');
    if (this.teamLeader == 4) {
      this.tableData = await this.$store.dispatch('project/queryProject');
    } else {
      this.tableData = await this.$store.dispatch('project/queryTeamProject');
    }

    this.allEcharts = echarts.init(
      document.getElementById('project-team-pie-echarts')
    );
    this.deadlineEcharts = echarts.init(
      document.getElementById('dealine-team-bar-echarts')
    );
    this.workloadEcharts = echarts.init(
      document.getElementById('workload-team-bar-echarts')
    );
    // 图表初始化
    this.renderEcharts();
  },
  methods: {
    renderEcharts(groupIndex) {
      const tableData = this.tableData;
      // init all project data pie Echarts
      const allOption = renderAllProjectDate(this.tableData);

      this.allEcharts.setOption(allOption);

      // // init dealine data pie Echarts
      const deadlineOption = renderDeanlineDate(this.tableData);

      this.deadlineEcharts.setOption(deadlineOption);

      // init workload data line Echarts
      let workloadOption = null;

      if (this.teamLeader == 4 && !groupIndex && groupIndex !== 0) {
        workloadOption = renderWorkloadDate(this.tableData, 1);
      } else {
        workloadOption =
          groupIndex || groupIndex === 0
            ? renderWorkloadDate(tableData, 2, groupIndex)
            : renderWorkloadDate(tableData, 2, this.groupIndex);
      }

      this.workloadEcharts.setOption(workloadOption);
    },
    // 根据分组检索
    async queryGroupList(groupIndex) {
      this.tableData = await this.$store.dispatch('project/queryTeamProject', {
        groupIndex: groupIndex.toString(),
      });

      // 如果是领导则销毁示例 重新建立
      if (this.teamLeader != '') {
        this.workloadEcharts.dispose();
        this.workloadEcharts = echarts.init(
          document.getElementById('workload-team-bar-echarts')
        );
      }

      this.renderEcharts(groupIndex);
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