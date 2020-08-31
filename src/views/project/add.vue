<template>
  <div class="app-container">
    <el-form ref="form"
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
            :value="item.id"></el-option>
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
      @click="onValidData">立即创建</el-button>
    <el-button>取消</el-button>
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
      users: [],
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
          trigger: 'change',
          validator: (rule, value, callback) => {
            if (value == '') {
              callback(new Error('请输入项目预计交付节点'));
            } else {
              if (typeof this.form.startTime === 'string') {
                callback(new Error('请输入项目预计交付节点'));
              } else if (moment(this.form.startTime).isAfter(value)) {
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
    this.users = await this.$store.dispatch('user/getAllUserInfo');
  },
  computed: {
    ...mapGetters([
      'projectTypes',
      'projectLines',
      'frameworkTypes',
      'appTypes',
    ]),
  },
  methods: {
    // 验证参数
    onValidData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitPorject();
        } else {
          return false;
        }
      });
    },
    // 插入项目
    submitPorject() {
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
      formData.developer = this.users.find(
        (item) => item.id === formData.developer
      ).displayName;

      this.$store.dispatch('project/insertProject', formData).then((rtn) => {
        this.listLoading = false;
        // 成功保存之后，执行其他逻辑
        this.$alert('新增项目成功！！！', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$router.go(0);
          },
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>