import { Router } from "express"
import { db } from "../../server.js"

export const quotesRouter = Router()

quotesRouter.get("/all", async (req, res, next) => {
  try {
    const data = await db.data
    res.send(data)
  } catch (error) {
    next(error)
    console.error(error)
  }
})

quotesRouter.get("/random", async (req, res, next) => {
  try {
    const data = await db.data
    const random = Math.floor(Math.random() * data.length)
    console.log(data[random])
    res.send(data[random])
  } catch (error) {
    next(error)
    console.error(error)
  }
})
