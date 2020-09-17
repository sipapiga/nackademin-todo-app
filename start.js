const app = require('./app')
const port = process.env.PORT || 3000;
const Database = require('./database')

Database.connect().then(() =>
  app.listen(port, () => console.log(`Server running on ${port}`))
)
