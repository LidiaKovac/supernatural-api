import { Router } from "express"
import { db } from "../../server.js"
import stringSimilarity from "string-similarity"
export const charRouter = Router()

charRouter.get("/all", async (req, res, next) => {
  try {
    const data = await db.data.characters
    res.send(data)
  } catch (error) {
    next(error)
    console.error(error)
  }
})

charRouter.get("/:id", async (req, res, next) => {
  try {
    const data = await db.data.characters.find(
      (char) => char.id === req.params.id
    )
    if (data) res.send(data)
    else res.sendStatus(404)
  } catch (error) {
    next(error)
    console.error(error)
  }
})

charRouter.put("/connect", async (req, res, next) => {
  try {
    const chars = await db.data.characters
    const quotes = await db.data.quotes

    const quotesWithIds = quotes.map((quote) => {
      Object.keys(quote).forEach((key) => {
        Object.keys(quote[key]).forEach((line) => {
          if (line === "character") {
            const name = quote[key][line]
            const allchars = chars
              .filter((pg) =>
                pg.name.toLowerCase().includes(name.toLowerCase())
              )
              .map((pg) => pg.name)
            if (allchars.length > 0) {
              let { bestMatch: found } = stringSimilarity.findBestMatch(
                name.toLowerCase(),
                allchars
              )
              quote[key][line] = {
                name,
                id: chars.find(
                  (pg) => pg.name.toLowerCase() === found.target.toLowerCase()
                ).id,
              }
            }
          }
        })
      })
      return quote
    })
    res.send(quotesWithIds)
  } catch (error) {
    next(error)
    console.log(error)
  }
})
