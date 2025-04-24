import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

app.get('/api/bug', (req, res) => {
  const filterBy = { txt: req.query.txt || '', minSeverity: +req.query.minSeverity, label: req.query.label || '' }
  bugService.query(filterBy)
    .then(bugs => res.json(bugs))
    .catch(err => res.status(400).send('Cant get bugs'))
})

app.post('/api/bug', (req, res) => {
  bugService.save(req.body)
    .then(bug => res.json(bug))
    .catch(err => res.status(400).send('Cant add bug'))
})

app.put('/api/bug/:bugId', (req, res) => {
  const bugToSave = { ...req.body, _id: req.params.bugId }
  bugService.save(bugToSave)
    .then(bug => res.json(bug))
    .catch(err => res.status(400).send('Cant update bug'))
})

app.delete('/api/bug/:bugId', (req, res) => {
  bugService.remove(req.params.bugId)
    .then(() => res.send('Deleted'))
    .catch(err => res.status(400).send('Cant remove bug'))
})

app.get('/api/bug/:bugId', (req, res) => {
  let visitedBugIds = JSON.parse(req.cookies.visitedBugs || '[]')

  if (!visitedBugIds.includes(req.params.bugId)) visitedBugIds.push(req.params.bugId)

  if (visitedBugIds.length > 3) return res.status(401).send('Wait for a bit')

  res.cookie('visitedBugs', JSON.stringify(visitedBugIds), { maxAge: 7000 })

  bugService.getById(req.params.bugId)
    .then(bug => res.json(bug))
    .catch(err => res.status(400).send('Cant get bug'))
})

const port = 3030
app.listen(port, () => loggerService.info(`Server ready at http://127.0.0.1:${port}`))
