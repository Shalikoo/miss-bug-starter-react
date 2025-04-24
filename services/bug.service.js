import fs, { readFile } from "fs"
import { utilService } from "./util.service.js"

const bugs = utilService.readJsonFile('./data/bugs.json')
const PAGE_SIZE = 4

export const bugService = {
    query,
    save,
    remove,
    getById,
}

function query(filterBy = {}, sortBy = {}) {
    let bugsForDisplay = bugs
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsForDisplay = bugsForDisplay.filter(bug => regExp.test(bug.title))
    }
    // Filtering
    if (filterBy.minSeverity) {
        bugsForDisplay = bugsForDisplay.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.label) {
        bugsForDisplay = bugsForDisplay.filter(bug => bug.labels && bug.labels.includes(filterBy.label))
    }

    // Sorting
    if (sortBy.type === 'title') {
        bugsForDisplay.sort((b1, b2) => (sortBy.desc) * (b1.title.localeCompare(b2.title)))

    } else if (sortBy.type === 'severity') {
        bugsForDisplay.sort((b1, b2) => (sortBy.desc) * (b1.severity - (b2.severity)))

    } else if (sortBy.type === 'createdAt') {
        bugsForDisplay.sort((b1, b2) => (sortBy.desc) * (b1.createdAt - (b2.createdAt)))
    }

    // Pagination
    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        bugsForDisplay = bugsForDisplay.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(bugsForDisplay)
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugs.push(bugToSave)
    }

    return _saveBugsToFile(bugToSave)
        .then(() => bugToSave)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugId === -1) return Promise.reject(`Could not remove bug ${bugId}`)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject(`Could not find bug ${bugId}`)
    return Promise.resolve(bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('./data/bugs.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}