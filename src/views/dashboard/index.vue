<template>
  <div class="dashboard-container">
    <el-row type="flex"
      justify="space-between">
      <el-col :span="4">
        <el-button icon="el-icon-plus"
          size="small"
          style="margin-bottom:10px;"
          @click="onAddProject"
          type="success">新增项目</el-button>
      </el-col>
      <el-col :span="20">
        <!-- 检索框 -->
        <el-form :inline="true"
          :model="formInline"
          size="small"
          class="searh-form">
          <el-form-item label="项目名称">
            <el-input v-model="formInline.projectname"
              placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="开发者">
            <el-select v-model="formInline.developer"
              placeholder="请选择">
              <el-option v-for="(item, index) in users"
                :key="index"
                :label="item.displayName"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
              size="small"
              @click="onSrhPorject">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table :data="tableData"
      style="width: 100%"
      border
      :row-class-name="projecStatusData">
      <el-table-column prop="projectName"
        label="项目名称"
        fixed>
      </el-table-column>
      <el-table-column prop="developer"
        label="开发负责人"
        width="120">
      </el-table-column>
      <el-table-column prop="startTime"
        label="开始时间"
        width="120">
      </el-table-column>
      <el-table-column prop="endTime"
        label="结束时间"
        width="120">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

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
      tableData: [
        {
          startTime: '2016-05-02',
          endTime: '2016-05-02',
          developer: '王小虎',
          projectName: '上海市普陀区金沙江路 1518 弄',
        },
        {
          startTime: '2016-05-02',
          endTime: '2016-05-02',
          developer: '王小虎',
          projectName: '上海市普陀区金沙江路 1518 弄',
        },
        {
          startTime: '2016-05-02',
          endTime: '2016-05-02',
          developer: '王小虎',
          projectName: '上海市普陀区金沙江路 1518 弄',
        },
        {
          startTime: '2016-05-02',
          endTime: '2016-05-02',
          developer: '王小虎',
          projectName: '上海市普陀区金沙江路 1518 弄',
        },
      ],
    };
  },
  async created() {
    this.users = await this.$store.dispatch('user/getAllUserInfo');
    this.tableData = await this.$store.dispatch('project/queryProject');
  },
  activated() {},
  methods: {
    // 检索项目
    queryProject() {},
    // 项目预警状态
    projecStatusData({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    // 检索项目
    onSrhPorject() {},
    // 跳转新增项目
    onAddProject() {
      this.$router.push({
        path: '/project/project-add',
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
</style>
<style  lang="scss">
.dashboard-container {
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
}
</style>