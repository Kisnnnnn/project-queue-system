<template>
  <div class="app-container">
    <el-form ref="form"
      :disabled="!isEditStatus"
      :rules="rules"
      :model="form"
      size="small"
      label-width="80px">
      <el-form-item label="项目名称"
        prop="projectName">
        <el-input placeholder="请输入"
          v-model="form.projectName"></el-input>
      </el-form-item>
      <el-form-item label="开发人员"
        prop="developer">
        <el-select v-model="form.developer"
          placeholder="请选择">
          <el-option v-for="(item, index) in users"
            :key="index"
            :label="item.displayName"
            :value="item.displayName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="projectLineValue"
        label-width="110px"
        label="项目所属条线">
        <el-select v-model="form.projectLineValue"
          placeholder="请选择">
          <el-option v-for="(item, index) in projectLines"
            :key="index"
            :label="item"
            :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="frameworkTypeValue"
        label="开发框架">
        <el-radio-group v-model="form.frameworkTypeValue">
          <el-radio :label="item"
            v-for="(item, index) in frameworkTypes"
            :key="index"></el-radio>
        </el-radio-group>
        <el-input v-model="form.farmeworkDetail"
          v-if="form.frameworkTypeValue==='其他'"
          placeholder="请输入框架"
          size="small"
          style="width:20%;margin-left:15px;"></el-input>
      </el-form-item>
      <el-form-item prop="projectTypeValue"
        label="项目类型">
        <el-select v-model="form.projectTypeValue"
          placeholder="请选择">
          <el-option v-for="(item, index) in projectTypes"
            :key="index"
            :label="item"
            :value="item"></el-option>
        </el-select>
        <el-input v-model="form.projectTypeDetail"
          v-if="form.projectTypeValue==='第三方'"
          placeholder="请输入项目类型"
          style="width:20%;margin-left:15px;"></el-input>
      </el-form-item>
      <el-form-item prop="appTypeValue"
        label="设备类型">
        <el-radio-group v-model="form.appTypeValue">
          <el-radio v-for="(item, index) in appTypes"
            :key="index"
            :label="item"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="assessTimeUrl"
        label-width="110px"
        label="工作量评估表">
        <el-input placeholder="请输入在线文档地址"
          v-model="form.assessTimeUrl"></el-input>
      </el-form-item>
      <el-form-item prop="PMName"
        label="项目经理">
        <el-input placeholder="请输入姓名"
          v-model="form.PMName"
          style="width:20%;"></el-input>
        <el-input placeholder="请输入所属部门"
          v-model="form.PMDep"
          style="width:30%; margin-left:20px;"></el-input>
      </el-form-item>
      <el-form-item prop="startTime"
        label="开始时间">
        <el-date-picker type="date"
          placeholder="选择日期"
          v-model="form.startTime"
          style="width: 30%;"></el-date-picker>
      </el-form-item>
      <el-form-item prop="endTime"
        label-width="140px"
        label="项目交付预计节点">
        <el-date-picker type="date"
          placeholder="选择日期"
          v-model="form.endTime"
          style="width: 30%;"></el-date-picker>
      </el-form-item>
      <el-form-item label="是否协助">
        <el-switch v-model="form.isAssist"></el-switch>
      </el-form-item>
      <el-form-item label="是否立项">
        <el-switch v-model="form.isProject"></el-switch>
      </el-form-item>
      <el-form-item prop="svnUrl"
        label="SVN地址">
        <el-input placeholder="请输入"
          v-model="form.svnUrl"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea"
          v-model="form.desc"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary"
      v-show="isEdit&&!isEditStatus"
      @click="isEditStatus=true">修改</el-button>
    <el-button type="success"
      v-show="isEdit&&!isEditStatus"
      @click="handleArchive">取消归档</el-button>
    <el-button type="primary"
      v-show="isEditStatus"
      @click="onValidData">完成修改</el-button>
  </div>
</template>

<script>
import { insertProject } from '@/api/project';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import { Notification } from 'element-ui';
export default {
  filters: {},
  data() {
    return {
      // 所有用户
      rowGuid: '',
      users: [],
      isEditStatus: false,
      isEdit: false,
      form: {
        projectName: '',
        developer: '',
        startTime: '',
        endTime: '',
        PMName: '',
        PMDep: '',
        isProject: true,
        projectTypeValue: '',
        projectLineValue: '',
        frameworkTypeValue: '',
        appTypeValue: '',
        // 其他值
        farmeworkDetail: '',
        projectTypeDetail: '',
        assessTimeUrl: '',
        svnUrl: '',
        desc: '',
      },
      projectData: {},
      rules: {
        projectName: {
          required: true,
          message: '请输入项目名称',
          trigger: 'change',
        },
        developer: {
          required: true,
          message: '请选择开发人员',
          trigger: 'change',
        },
        startTime: {
          required: true,
          message: '请选择项目开始时间',
          trigger: 'change',
        },
        endTime: {
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value == '') {
              callback(new Error('请输入项目预计交付节点'));
            } else {
              if (moment(this.form.startTime).isAfter(value)) {
                callback(new Error('交付节点时间不得早于开始时间'));
              } else {
                callback();
              }
            }
          },
        },
        PMName: {
          required: true,
          message: '请输入项目经理',
          trigger: 'change',
        },
        svnUrl: {
          required: true,
          message: '请输入svn地址',
          trigger: 'change',
        },
        assessTimeUrl: {
          required: true,
          message: '请输入工作评估表地址',
          trigger: 'change',
        },
        projectTypeValue: {
          required: true,
          message: '请选择项目类型',
          trigger: 'change',
        },
        projectLineValue: {
          required: true,
          message: '请选择所属条线',
          trigger: 'change',
        },
        frameworkTypeValue: {
          required: true,
          message: '请选择框架类型',
          trigger: 'change',
        },
        appTypeValue: {
          required: true,
          message: '请选择设备类型',
          trigger: 'change',
        },
      },
    };
  },
  async created() {
    this.rowGuid = this.$route.query.rowGuid;
    this.users = await this.$store.dispatch('user/getAllUserInfo');
    this.handleFormData();
  },
  computed: {
    ...mapGetters([
      'projectTypes',
      'projectLines',
      'frameworkTypes',
      'appTypes',
      'name',
      'groupIndex',
      'teamLeader',
    ]),
  },
  methods: {
    async handleFormData() {
      // 获取对应数据
      this.projectData = (
        await this.$store.dispatch('project/searchArchiveProject', {
          rowGuid: this.rowGuid,
        })
      )[0];

      if (!this.projectData) {
        this.$alert('无此项目信息', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$router.go(-1);
          },
        });
      }

      this.form = Object.assign({}, this.projectData);

      // 区分是否有编辑权限
      const userData = this.users.find(
        (item) => (item.displayName = this.form.developer)
      );

      // 对应开发者本身、组长、经理是有权限的
      if (
        this.form.developer === this.name ||
        userData.groupIndex.toString() == this.teamLeader ||
        this.teamLeader === '4'
      ) {
        this.isEdit = true;
      }
    },
    // 验证参数
    onValidData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.updateProject();
        } else {
          return false;
        }
      });
    },
    // 插入项目
    updateProject() {
      this.listLoading = true;
      let formData = Object.assign({}, this.form);

      if (formData.projectTypeValue !== '第三方') {
        formData.projectTypeDetail = '';
      }
      if (formData.frameworkTypeValue !== '其他') {
        formData.farmeworkDetail = '';
      }

      formData.startTime = moment(formData.startTime).format('YYYY-MM-DD');
      formData.endTime = moment(formData.endTime).format('YYYY-MM-DD');

      this.$store
        .dispatch('project/updateArchiveProject', formData)
        .then((rtn) => {
          this.listLoading = false;
          // 成功保存之后，执行其他逻辑
          this.$notify({
            title: '成功',
            message: '修改项目成功！！！',
            type: 'success',
          });
          this.isEditStatus = false;
        });
    },
    // 归档项目
    handleArchive() {
      this.listLoading = true;
      let formData = Object.assign({}, this.form);

      if (formData.projectTypeValue !== '第三方') {
        formData.projectTypeDetail = '';
      }
      if (formData.frameworkTypeValue !== '其他') {
        formData.farmeworkDetail = '';
      }

      formData.startTime = moment(formData.startTime).format('YYYY-MM-DD');
      formData.endTime = moment(formData.endTime).format('YYYY-MM-DD');

      this.$confirm('此操作将取消归档该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await this.$store.dispatch('project/deleteArchiveProject', formData);
        // 成功保存之后，执行其他逻辑
        this.$alert('取消归档成功！！！', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$router.go(-1);
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>