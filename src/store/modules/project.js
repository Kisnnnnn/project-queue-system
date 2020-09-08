import {
  insertProject,
  queryProject,
  updateProject,
  deleteProject,
  queryProjectDetail,
  deleteArchiveProject,
  searchArchiveProject,
  queryArchiveProject,
  updateArchiveProject,
  insertArchiveProject
} from '@/api/project'

import store from '../index';

const getDefaultState = () => {
  return {
    projectLines: ['电子政务', '数字建设', '建筑软件', '大数据', '电子交易', '政务服务', '公共安全', '智能设备'],
    projectTypes: ['EJS3.x', 'EJS2.x', '微信公众号', 'H5', '微信小程序', '支付宝小程序', '第三方'],
    frameworkTypes: ['M6', 'M7', 'M8', '微信小程序', 'taro', '其他'],
    appTypes: ['iOS&Android', 'iOS', 'Android', 'H5', '微信小程序', 'Pad']
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
  // 所有项目
  queryProject({
    commit
  }, data) {
    return queryProject(data).then(res => {
      return res
    })
  },
  // 检索项目
  searchProject({
    commit
  }, data) {
    return queryProjectDetail(data).then(async res => {
      if (data && 'groupIndex' in data && data['groupIndex'].toString() != '') {
        const users = await store.dispatch('user/getAllUserInfo');
        const rtn = users.filter(item => item.groupIndex == data.groupIndex);
        return res.filter(item => rtn.find(userItem => userItem.displayName == item.developer))
      }

      return res
    })
  },
  // 检索小组项目
  queryTeamProject({
    commit
  }, data) {
    return queryProject().then(async res => {
      let teamLeader = '';

      if (data && data['groupIndex'] && data['groupIndex'].toString()) {
        // 如果存在groupIndex,贼返回groupIndex
        teamLeader = data.groupIndex;
      } else if (store.getters.teamLeader == 4) {
        // 如果是leader ，则直接返回全部
        return res;
      } else if (store.getters.teamLeader == '') {
        // 如果是普通 ，则直接返回对应小组
        teamLeader = Number(store.getters.groupIndex);
      } else {
        // 否则返回小组长
        teamLeader = store.getters.teamLeader;
      }


      const users = await store.dispatch('user/getAllUserInfo');
      const rtn = users.filter(item => item.groupIndex == teamLeader);

      return res.filter(item => rtn.find(userItem => userItem.displayName == item.developer))
    });
  },
  // 更新项目
  updateProject({
    commit
  }, data) {
    return updateProject(data).then(res => {
      return res
    })
  },
  // 删除项目
  deleteProject({
    commit
  }, data) {
    return deleteProject(data).then(res => {
      return res
    })
  },
  // 归档
  // 搜索项目
  insertArchiveProject({
    commit
  }, data) {
    return insertArchiveProject(data).then(res => {
      return res
    })
  },
  // 搜索项目
  searchArchiveProject({
    commit
  }, data) {
    return searchArchiveProject(data).then(res => {
      return res
    })
  },
  // 所有项目
  queryArchiveProject({
    commit
  }, data) {
    return queryArchiveProject(data).then(res => {
      return res
    })
  },
  // 删除项目
  deleteArchiveProject({
    commit
  }, data) {
    return deleteArchiveProject(data).then(res => {
      return res
    })
  },
  // 更新项目
  updateArchiveProject({
    commit
  }, data) {
    return updateArchiveProject(data).then(res => {
      return res
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
