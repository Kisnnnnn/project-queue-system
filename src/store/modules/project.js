import {
  insertProject,
  queryProject,
  updateProject,
  deleteProject,
  queryProjectDetail
} from '@/api/project'
const getDefaultState = () => {
  return {
    projectLines: ['电子政务', '数字建设', '建筑企业', 'OA', '电子交易', '政务服务', '移动执法', 'GA'],
    projectTypes: ['EJS3.x', 'EJS2.x', '微信公众号', 'H5', '微信小程序', '支付宝小程序', '第三方'],
    frameworkTypes: ['M6', 'M7', 'M8', '其他'],
    appTypes: ['iOS&Android', 'iOS', 'Android', 'H5', 'Pad']
  }
}

const state = getDefaultState()

const mutations = {

}

const actions = {
  insertProject({
    commit
  }, data) {
    return insertProject(data).then(res => {
      return res
    })
  },
  queryProject({
    commit
  }, data) {
    return queryProject(data).then(res => {
      return res
    })
  },
  searchProject({
    commit
  }, data) {
    return queryProjectDetail(data).then(res => {
      return res
    })
  },
  updateProject({
    commit
  }, data) {
    return updateProject(data).then(res => {
      return res
    })
  },
  deleteProject({
    commit
  }, data) {
    return deleteProject(data).then(res => {
      return res
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
