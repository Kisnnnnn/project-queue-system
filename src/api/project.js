import AV from 'leancloud-storage'
import {
  Notification
} from 'element-ui';
// 新增项目
export function insertProject(requestData) {
  const porjectOB = AV.Object.extend('projectList');
  const porjectAPI = new porjectOB();

  porjectAPI.set(requestData);
  // 将对象保存到云端
  return porjectAPI.save().then((reponse) => {

    return reponse
  }, (error) => {
    // 异常处理
    Notification({
      title: '提示',
      message: error,
      duration: 3000
    })
  });
}
// 删除项目
export function deleteProject(requestData) {
  const id = requestData.id;
  const projectAPI = AV.Object.createWithoutData('projectList', id);

  return projectAPI.destroy();
}
// 更新项目
export function updateProject(requestData) {
  const id = requestData.id;
  const projectAPI = AV.Object.createWithoutData('projectList', id);

  delete requestData.id;
  projectAPI.set(requestData);
  return projectAPI.save();
}
// 查询所以项目
export function queryProject(requestData) {
  const porjectAPI = new AV.Query('projectList');

  return porjectAPI.find().then((reponse) => {
    return reponse.map(item => Object.assign({}, {
      id: item.id
    }, item._serverData))
  }, (error) => {
    // 异常处理
    Notification({
      title: '提示',
      message: error,
      duration: 3000
    })
  });
}

// 搜索某个项目
export function queryProjectDetail(requestData) {
  const porjectAPI = new AV.Query('projectList');
  console.log(requestData.rowGuid);
  if (requestData.rowGuid && requestData.rowGuid != '') {
    porjectAPI.equalTo('objectId', requestData.rowGuid);
  } else {
    if (requestData.projectname != '') {
      porjectAPI.contains('projectName', requestData.projectname);
    }
    if (requestData.developer != '') {
      porjectAPI.equalTo('developer', requestData.developer);
    }
  }

  return porjectAPI.find().then((reponse) => {
    return reponse.map(item => Object.assign({}, {
      id: item.id
    }, item._serverData))
  }, (error) => {
    // 异常处理
    Notification({
      title: '提示',
      message: error,
      duration: 3000
    })
  });
}
