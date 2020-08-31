import request from '@/utils/request'
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
        name: currentUser._serverData.displayName,
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'

      }
    }

    resolve(rtn);
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
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
