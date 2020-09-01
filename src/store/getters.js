const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  teamLeader: state => state.user.teamLeader,
  userGuid: state => state.user.userGuid,
  projectTypes: state => state.project.projectTypes,
  frameworkTypes: state => state.project.frameworkTypes,
  appTypes: state => state.project.appTypes,
  projectLines: state => state.project.projectLines
}
export default getters
