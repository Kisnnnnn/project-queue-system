import AV from 'leancloud-storage'
import {
  Notification
} from 'element-ui';

export function login(data) {
  return AV.User.logIn(data.username, data.password).then((user) => {
    // 登录成功
    return user
  }, (error) => {
    Notification({
      title: '提示',
      message: error,
      duration: 3000
    })
    // 登录失败（可能是密码错误）
  })
}

export function getInfo() {
  return new Promise((resolve, reject) => {
    const currentUser = AV.User.current();
    const rtn = {
      data: {
        userGuid: currentUser.id,
        teamLeader: currentUser._serverData.teamLeader || '',
        name: currentUser._serverData.displayName,
        groupIndex: currentUser._serverData.groupIndex,
        avatar: ''
      }
    }

    resolve(rtn);
  })
}

export function logout() {
  return AV.User.logOut();
}

// 获取全部用户
export function getAllUserInfo() {
  const userQuery = new AV.Query('_User');
  return userQuery.find().then((users) => {
    let rtn = [];

    users.forEach(item => {
      if (item._serverData.username !== 'project' && item._serverData.username !== 'admin') {
        rtn.push(Object.assign({}, {
          id: item.id
        }, item._serverData))
      }
    })

    return rtn;
  })
}
// 获取全部分组
export function getGroups() {
  const groupQuery = new AV.Query('Group');
  return groupQuery.find().then((data) => {

    return data;
  })
}
