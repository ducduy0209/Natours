import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.status(200).send('Hello from server side')
})

const PORT = 6868
app.listen(6868, () => {
  console.log(`App running on http://localhost:${PORT}`)
})