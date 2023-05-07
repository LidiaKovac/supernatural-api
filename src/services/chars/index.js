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
            let name = quote[key][line].name || quote[key][line]
            if (quote[key][line].name != "") {
              console.log(name.split("(")[0] + (name.split(")")[1] || ""))
              const allchars = chars
                .filter((pg) =>
                  pg.name
                    .toLowerCase()
                    .includes(
                      (name.split("(")[0] + (name.split(")")[1] || "")).toLowerCase()
                    )
                )
                .map((pg) => pg.name.split("(")[0] + (pg.name.split(")")[1] || ""))
              if (allchars.length > 0) {
                let { bestMatch: found } = stringSimilarity.findBestMatch(
                  name.split("(")[0] + (name.split(")")[1] || "").toLowerCase(),
                  allchars
                )
                console.log(found);
                quote[key][line] = {
                  name,
                  id: chars.find(
                    (pg) => pg.name.toLowerCase() === found.target.trim().toLowerCase()
                  ).id,
                }
              }
            }
          }
        })
      })
      return quote
    })

    db.data.quotes = quotesWithIds
    db.write()
    res.send(200)
  } catch (error) {
    next(error)
    console.log(error)
  }
})
