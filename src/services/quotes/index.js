import { Router } from "express"
import { db } from "../../server.js"

export const quotesRouter = Router()

quotesRouter.get("/all", async (req, res, next) => {
  try {
    const data = await db.data.quotes
    res.send(data)
  } catch (error) {
    next(error)
    console.error(error)
  }
})

quotesRouter.get("/random", async (req, res, next) => {
  try {
    const data = await db.data.quotes
    const random = Math.floor(Math.random() * data.length)
    res.send(data[random])
  } catch (error) {
    next(error)
    console.error(error)
  }
})
