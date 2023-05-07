import { Router } from "express"
import { db } from "../../server.js"

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
    const data = await db.data.characters.find(char => char.id === req.params.id)
    if(data) res.send(data) 
    else res.sendStatus(404)
  } catch (error) {
    next(error)
    console.error(error)
  }
})


charRouter.put("/connect", async(req,res,next) => {
  try {
    const chars = await db.data.characters
    const quotes = await db.data.quotes

    const quotesWithIds = quotes.map(quote => {
      Object.keys(quote).forEach(key => {
        Object.keys(quote[key]).forEach(line => {
          console.log(line);
          if(line === "character") {
            const name = quote[key][line]
            console.log(chars[0]);
            quote[key][line] = {
              name,
              id: chars.find(pg => pg.name.toLowerCase() === name.toLowerCase())
            }
          }
        })
      })
      return quote
    })
  } catch (error) {
    next(error)
    console.log(error);
  }
})