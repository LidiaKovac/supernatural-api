import { Router } from "express"
import { db } from "../../server.js"
import { paginate } from "../../utils/index.js"

export const quotesRouter = Router()

quotesRouter.get("/all", async (req, res, next) => {
  try {
    const data = await db.data.quotes
    let result = []
    result = paginate(data, req.query.page || 1, req.query.size || 5)

    res.send({
      data: result,
      next:
        "https://supernatural-quotes-api.cyclic.app/quotes/all?page=" +
        (isNaN((Number(req.query.page) + 1)) ? 2 : (Number(req.query.page) + 1)),
      prev:
        Number(req.query.page) > 1
          ? "https://supernatural-quotes-api.cyclic.app/quotes/all?page=" +
          (Number(req.query.page) - 1)
          : null,
      count: data.length,
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
