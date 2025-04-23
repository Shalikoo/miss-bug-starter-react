import express from "express"
import { bugService } from "./services/bug.service.js"
import { loggerService } from "./services/logger.service.js"
import cookieParser from "cookie-parser"


const app = express()

app.use(express.static("public"))
app.use(cookieParser())


app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity,
    }
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cant get bugs', err)
            res.status(400).send('Cant get bugs')
        })
})

//* Create/Edit
app.get("/api/bug/save", (req, res) => {
  const bugToSave = {
    _id: req.query._id,
    title: req.query.title,
    description: req.query.description,
    severity: +req.query.severity,
    createdAt: +req.query.createdAt,
  }
  bugService
    .save(bugToSave)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error(`Cant save bug ${bug._id}`, err)
      res.status(400).send(`Cant save bug ${bug._id}`)
    })
})

app.get("/api/bug/:bugId", (req, res) => {
  let visitedBugIds = JSON.parse(req.cookies.visitedBugs || "[]")

  if (visitedBugIds.length > 3) {
    return res.status(401).send("Wait for a bit")
  }

  if (!visitedBugIds.includes(req.params.bugId)) visitedBugIds.push(req.params.bugId)

  bugService
    .getById(req.params.bugId)
    .then(bug => {
        res.cookie("visitedBugs", JSON.stringify(visitedBugIds), { maxAge: 7000 })
        res.send(bug)
})
    .catch(err => {
      loggerService.error(`Could not get bug ${req.params.bugId}`, err)
      res.status(400).send(`Could not get bug ${req.params.bugId}`)
    })
})


//* Remove/Delete
app.get("/api/bug/:bugId/remove", (req, res) => {
  bugService
    .remove(req.params.bugId)
    .then(() => res.send(`Bug ${req.params.bugId} removed successfully`))
    .catch(err => {
      loggerService.error(`Could not remove bug ${req.params.bugId}`, err)
      res.status(400).send(`Could not remove bug ${req.params.bugId}`)
    })
})

const port = 3030

app.listen(port, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
