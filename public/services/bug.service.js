import { utilService } from "./util.service.js"

const url = "/api/bug/"

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  _setNextPrevBugId,
}

function query(filterBy = {}) {
  return axios.get("/api/bug", { params: filterBy }).then((res) => res.data)
}

function getById(bugId) {
  return axios
    .get(url + bugId)
    .then((res) => res.data)
    .then((bug) => _setNextPrevBugId(bug))
}

function remove(bugId) {
  return axios.delete(url + bugId).then((res) => res.data)
}

function save(bug) {
  if (bug._id) {
    return axios.put(url + bug._id, bug).then((res) => res.data)
  } else {
    return axios.post(url, bug).then((res) => res.data)
  }
}

function getDefaultFilter() {
  return {
    txt: "",
    minSeverity: 0,
    sortBy: "title",
    sortDir: 1,
    labels: [],
    pageIdx: 0,
  }
}

function _setNextPrevBugId(bugId) {
  return axios.get(url).then((res) => {
    const bugs = res.data
    const idx = bugs.findIndex((bug) => String(bug._id) === String(bugId))

    if (idx === -1) {
      return null
    }

    const nextBug = bugs[idx + 1] || bugs[0]
    const prevBug = bugs[idx - 1] || bugs[bugs.length - 1]

    return {
      ...bugs[idx],
      nextBugId: nextBug._id,
      prevBugId: prevBug._id,
    }
  })
}