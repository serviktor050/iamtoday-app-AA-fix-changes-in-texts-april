export const getBage = function getBage({ name, BAGES, menuBadges }) {
  const bage = BAGES[name];
  if (!bage) {
    return 0
  }
  const counter = bage.reduce(((acc, cur) => acc + menuBadges[cur]), 0)
  return counter
}

export const BAGES = {
  'calendar': ['calendarTasks'],
  'trainings': ['newTrainings'],
  'questions': ['unreadPlaylistChats'],
  'admin/profiles': ['userDocsPending'],
  'admin/profiles/declined': ['userDocsRejected'],
  'admin/declinedRequests': ['userTutorRequestRejectedTutor'],
  'admin/changeRequests': ['userTutorRequestWaitingChange'],
  'admin/mentorRequests': ['userTutorRequestWaitingNew'],
  'mlm/structure': ['userTutorRequestWaitingNew', 'userTutorRequestWaitingTutor'],
  'mlm': ['userTutorRequestWaitingUser'],
}
