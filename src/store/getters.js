const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  teamUsers: state => state.user.teamUsers,
  teamData: state => state.user.teamData,
  users: state => state.user.users,
  teamLeader: state => state.user.teamLeader,
  userGuid: state => state.user.userGuid,
  groupIndex: state => state.user.groupIndex,
  projectTypes: state => state.project.projectTypes,
  frameworkTypes: state => state.project.frameworkTypes,
  appTypes: state => state.project.appTypes,
  projectLines: state => state.project.projectLines
}
export default getters
