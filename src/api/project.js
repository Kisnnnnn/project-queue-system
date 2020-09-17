import AV from 'leancloud-storage'
import {
  Notification
} from 'element-ui';
// 开发中项目
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
export function queryProject() {
  const porjectAPI = new AV.Query('projectList');

  porjectAPI.equalTo('isArchive', false);
  porjectAPI.ascending('endTime');
  return porjectAPI.find().then((reponse) => {
    return reponse.map(item => Object.assign({}, item._serverData, {
      id: item.id
    }))
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

  porjectAPI.equalTo('isArchive', false);
  porjectAPI.addDescending('createdAt');
  if (requestData.rowGuid && requestData.rowGuid != '') {
    porjectAPI.equalTo('objectId', requestData.rowGuid);
  } else {
    if (requestData.projectname && requestData.projectname != '') {
      porjectAPI.contains('projectName', requestData.projectname);
    }
    if (requestData.developer && requestData.developer != '') {
      porjectAPI.equalTo('developer', requestData.developer);
    }
  }

  return porjectAPI.find().then((reponse) => {
    return reponse.map(item => Object.assign({}, item._serverData, {
      id: item.id
    }))
  }, (error) => {
    // 异常处理
    Notification({
      title: '提示',
      message: error,
      duration: 3000
    })
  });
}



// 新增项目
export function insertArchiveProject(requestData) {
  const id = requestData.id;
  const projectAPI = AV.Object.createWithoutData('projectList', id);

  // 将对象保存到云端
  projectAPI.set({
    isArchive: true
  });
  return projectAPI.save();
}
/**
 * 删除归档项目
 * @param {Object} requestData 
 */

export function deleteArchiveProject(requestData) {
  const id = requestData.id;
  const projectAPI = AV.Object.createWithoutData('projectList', id);

  // 将对象保存到云端
  projectAPI.set({
    isArchive: false
  });
  return projectAPI.save();
}

/**
 * 搜索归档项目
 * @param {Object} requestData 
 */
export function searchArchiveProject(requestData) {
  const porjectAPI = new AV.Query('projectList');

  porjectAPI.equalTo('isArchive', true);
  porjectAPI.addDescending('createdAt');
  if (requestData.rowGuid && requestData.rowGuid != '') {
    porjectAPI.equalTo('objectId', requestData.rowGuid);
  } else {
    if (requestData.projectname && requestData.projectname != '') {
      porjectAPI.contains('projectName', requestData.projectname);
    }
    if (requestData.developer && requestData.developer != '') {
      porjectAPI.equalTo('developer', requestData.developer);
    }
  }

  return porjectAPI.find().then((reponse) => {
    return reponse.map(item => Object.assign({}, item._serverData, {
      id: item.id
    }))
  }, (error) => {
    // 异常处理
    Notification({
      title: '提示',
      message: error,
      duration: 3000
    })
  });
}

/**
 * 检索所所有归档项目
 * @param {Object} requestData 
 */
export function queryArchiveProject(requestData) {
  const porjectAPI = new AV.Query('projectList');

  porjectAPI.equalTo('isArchive', true);
  porjectAPI.addDescending('createdAt');
  return porjectAPI.find().then(reponse => {
    return reponse.map(item => Object.assign({}, item._serverData, {
      id: item.id
    }))
  }, (error) => {
    // 异常处理
    Notification({
      title: '提示',
      message: error,
      duration: 3000
    })
  });

}

// 更新项目
export function updateArchiveProject(requestData) {
  const id = requestData.id;
  const projectAPI = AV.Object.createWithoutData('projectList', id);

  delete requestData.id;
  projectAPI.set(requestData);
  return projectAPI.save();
}
