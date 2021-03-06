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
          <el-form-item>
            <el-button type="primary"
              size="small"
              @click="onSrhPorject">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-tag type="success"
      style="margin-bottom:10px;">点击对应单元格，修改本周预计工时、项目剩余工时</el-tag>
    <el-table :data="filterTableData"
      @cell-click="handleTableClick"
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
      <el-table-column prop="frameworkTypeValue"
        label="框架版本"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column prop="projectTypeValue"
        label="容器版本"
        align="center"
        width="120">
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
    this.tableData = await this.$store.dispatch('project/searchProject', {
      developer: this.name,
    });
    this.changePageSize(1);
  },
  activated() {},
  methods: {
    // 表格点击事件
    handleTableClick(row, column, cell) {
      switch (column.property) {
        case 'weekTime':
          this.editWeekTime(row);
          break;
        case 'laveTime':
          this.editLaveTime(row);
          break;
        default:
          break;
      }
    },
    // 编辑本周预计工时
    editWeekTime(row) {
      this.$prompt('请输入本周预计工时', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.weekTime,
        inputValidator: (val) => {
          if (val == '' || (val !== '0' && !Number(val))) {
            return false;
          }
          return true;
        },
      })
        .then(({ value }) => {
          let requestData = {
            weekTime: value,
            id: row.id,
          };

          this.updateProject(requestData).then(() => {
            row.weekTime = value;
          });
        })
        .catch(() => {});
    },
    // 处理项目剩余工时
    editLaveTime(row) {
      this.$prompt('请输入项目剩余工时', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.laveTime,
        inputValidator: (val) => {
          if (val == '' || (val !== '0' && !Number(val))) {
            return false;
          }
          return true;
        },
      })
        .then(({ value }) => {
          let requestData = {
            laveTime: value,
            id: row.id,
          };

          this.updateProject(requestData).then(() => {
            row.laveTime = value;
          });
        })
        .catch(() => {});
    },
    // 更新项目
    updateProject(requestData, row) {
      return this.$store
        .dispatch('project/updateProject', requestData)
        .then((rtn) => {
          // 成功保存之后，执行其他逻辑
          this.$message({
            message: '修改成功！',
            type: 'success',
          });
        });
    },
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
        Object.assign({}, this.formInline, { developer: this.name })
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