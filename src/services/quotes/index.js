import { Router } from "express"
import { db } from "../../server.js"
import { filter, paginate, populate } from "../../utils/index.js"

export const quotesRouter = Router()

quotesRouter.get("/", async (req, res, next) => {
  try {
    const data = await db.data.quotes
    const episodes = await db.data.episodes
    let populated = populate(data, "episode", episodes)
    let result = filter(populated, req.query)

    result = paginate(result, req.query.page || 1, req.query.size || 5)

    res.send({
      data: result,
      next:
        "https://supernatural-api.onrender.com/quotes?page=" +
        (isNaN(Number(req.query.page) + 1) ? 2 : Number(req.query.page) + 1),
      prev:
        Number(req.query.page) > 1
          ? "https://supernatural-api.onrender.com/quotes?page=" +
          (Number(req.query.page) - 1)
          : null,
      count: data.length,
      resultCount: result.length
    })
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
