import { utilService } from "./util.service.js"

const url = "/api/bug/"

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
}

function query(filterBy = {}) {
  return axios.get("/api/bug", { params: filterBy }).then((res) => res.data)
}

function getById(bugId) {
  return axios
    .get(url + bugId)
    .then((res) => res.data)
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