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
      <el-col :span="16">
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
              clearable
              placeholder="请选择">
              <el-option v-for="(item, index) in users"
                :key="index"
                :label="item.displayName"
                :value="item.displayName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
              size="small"
              @click="onSrhPorject">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4"
        v-if="teamLeader!==''"
        style="text-align:right;">
        <el-button size="small"
          style="margin-bottom:10px;"
          @click="handleTabel2Excel"
          type="success">生成Excel表格</el-button>
      </el-col>
    </el-row>
    <el-tag type="success"
      style="margin-bottom:10px;">修改本周预计工时、项目剩余工时请移至「我的项目」模块</el-tag>
    <el-table :data="filterTableData"
      style="width: 100%"
      border
      :row-class-name="projecStatusData">
      <el-table-column prop="projectName"
        label="项目名称"
        fixed>
      </el-table-column>
      <el-table-column prop="developer"
        label="开发负责人"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column prop="projectLineValue"
        label="项目类型"
        align="center"
        width="90">
      </el-table-column>
      <el-table-column prop="frameworkTypeValue"
        label="框架版本"
        align="center"
        width="92">
      </el-table-column>
      <el-table-column prop="isAssist"
        label="是否协助"
        align="center"
        width="78">
        <template slot-scope="scope">
          <div>
            {{scope.row.isAssist ? '是':'否'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="projectTypeValue"
        label="容器版本"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column prop="frameworkTypeValue"
        label="框架版本"
        align="center"
        width="92">
      </el-table-column>
      <el-table-column prop="weekTime"
        label="本周预计工时/h"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column prop="laveTime"
        label="项目剩余工时/h"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column prop="startTime"
        label="开始时间"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column prop="endTime"
        label="结束时间"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column prop="desc"
        label="备注"
        align="center"
        width="80">
        <template slot-scope="scope">
          <el-popover placement="top-start"
            width="200"
            trigger="click"
            :content="scope.row.desc == '' ? '暂无' : scope.row.desc">
            <el-button size="mini"
              round
              type="primary"
              slot="reference">查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center"
        width="160"
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
            round
            type="primary"
            @click="handleView(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini"
            type="danger"
            round
            v-if="scope.row.developer === name"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background
      class="pagination"
      @current-change="changePageSize"
      :page-size="15"
      layout="prev, pager, next"
      :total="tableData.length">
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import Blob from '../../utils/blob';
import { export_json_to_excel } from '../../utils/export2excel.js';
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name', 'teamLeader']),
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
    this.changePageSize(1);
  },
  activated() {},
  methods: {
    // 检索项目
    changePageSize(curPage) {
      this.filterTableData = this.tableData.filter(
        (item, index) => index > (curPage - 1) * 15 - 1 && index < curPage * 15
      );
    },
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
    // 检索项目
    async onSrhPorject() {
      this.tableData = await this.$store.dispatch(
        'project/searchProject',
        this.formInline
      );
      this.changePageSize(1);
    },
    // 跳转新增项目
    onAddProject() {
      this.$router.push({
        path: '/project/project-add',
      });
    },
    // 查看项目
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('project/deleteProject', row).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.filterTableData.splice(index, 1);
        });
      });
    },
    // 查看项目
    handleView(index, row) {
      this.$router.push({
        path: '/project/project-detail',
        query: {
          rowGuid: row.id,
        },
      });
    },
    // 生成excel
    handleTabel2Excel() {
      require.ensure([], () => {
        const tHeader = [
          '项目名称',
          '是否协助',
          '开发负责人',
          '工作量评估表',
          '产品类型',
          '框架版本',
          '容器版本',
          '设备类型',
          '开始时间',
          '结束时间',
          '本周预计工时',
          '项目剩余工时',
          '是否立项',
          'svn地址',
          '备注',
        ];
        const filterVal = [
          'projectName',
          'isAssist',
          'developer',
          'assessTimeUrl',
          'projectLineValue',
          'frameworkTypeValue',
          'projectTypeValue',
          'appTypeValue',
          'startTime',
          'endTime',
          'weekTime',
          'laveTime',
          'isProject',
          'svnUrl',
          'desc',
        ];
        const list = this.tableData;
        const data = list.map((v) => filterVal.map((j) => v[j]));
        const day = moment().format('YYYY-MM-DD');

        export_json_to_excel(tHeader, data, day + '部门归档项目统计表');
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
.popper-desrc {
  width: 80px;
  padding: 10px 0;
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