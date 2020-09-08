import {
  login,
  logout,
  getInfo,
  getAllUserInfo,
  getGroups
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    userGuid: '',
    name: '',
    avatar: '',
    teamLeader: '',
    groupIndex: 0,
    teamUsers: [],
    teamData: [],
    users: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERGUID: (state, userGuid) => {
    state.userGuid = userGuid
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ALLUSER: (state, users) => {
    state.users = users
  },
  SET_TEAMLEADER: (state, teamLeader) => {
    state.teamLeader = teamLeader
  },
  SET_GROUPINDEX: (state, groupIndex) => {
    state.groupIndex = groupIndex
  },
  SET_TEAMDATA: (state, teamData) => {
    state.teamData = teamData
  },
  SET_TEAMUSER: (state, users) => {
    state.teamUsers = users.filter(userItem => userItem.groupIndex == state.teamLeader)
  },
}

const actions = {
  // 用户登录
  login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        const data = response

        commit('SET_TOKEN', data._sessionToken);
        setToken(data._sessionToken);
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  },
  // 获取团队信息
  getGroups({
    commit
  }) {
    return new Promise((resolve, reject) => {
      if (state.teamData.length > 0) {
        resolve(state.teamData)
      } else {
        getGroups().then(res => {
          const data = res.map(item => item._serverData);

          commit('SET_TEAMDATA', data)
          resolve(data);
        });
      }
    });
  },
  // 项目组登录
  projectlogin({
    commit
  }) {
    const username = 'project'
    const password = '123321'

    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        const data = response

        commit('SET_TOKEN', data._sessionToken)
        setToken(data._sessionToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getAllUserInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      if (state.users.length < 1) {
        getAllUserInfo().then(response => {
          commit('SET_ALLUSER', response)
          commit('SET_TEAMUSER', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      } else {
        resolve(state.users)
      }
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {

      getInfo().then(response => {
        const {
          data
        } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const {
          userGuid,
          name,
          avatar,
          groupIndex,
          teamLeader
        } = data
        commit('SET_USERGUID', userGuid)
        commit('SET_NAME', name)
        commit('SET_GROUPINDEX', groupIndex)
        commit('SET_AVATAR', avatar)
        commit('SET_TEAMLEADER', teamLeader)

        resolve(data)
      }).catch(error => {
        console.log(error);
        reject(error)
      })

    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
