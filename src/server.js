import { Low } from "lowdb"
import express from "express"
import endpoints from "express-list-endpoints"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { JSONFile } from "lowdb/node"
import cors from "cors"
import { quotesRouter } from "./services/quotes/index.js"
import { config } from "dotenv"
import { charRouter } from "./services/chars/index.js"
config()
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, "./db.json")
const adapter = new JSONFile(file)
console.log(file)
const defaultData = { quotes: [], characters: [] }
export const db = new Low(adapter, defaultData)

// Read data from JSON file, this will set db.data content
// If JSON file doesn't exist, defaultData is used instead
// await db.read()
export const app = express()
app.use(cors())
app.use("/quotes", quotesRouter)
app.use("/characters", charRouter)
app.use(express.static("public"))

db.read().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(
      "🌚🌝 Server is running on",
      process.env.PORT,
      " with these endpoints: "
    )
    console.table(endpoints(app))
  })
})
