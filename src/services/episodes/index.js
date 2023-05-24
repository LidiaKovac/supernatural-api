import { Router } from "express"
import { db } from "../../server.js"
import { paginate } from "../../utils/index.js"

export const episodeRouter = Router()

episodeRouter.get("/", async (req, res, next) => {
  try {
    console.log(req.query)
    // const props = ["name", "img", "actor", "episodes", "occupation"]
    const data = await db.data.episodes
    let result = []

    for (const ep of data) {
      if (
        ep.title.toLowerCase().includes(req.query.title?.toLowerCase() || "") &&
        (req.query.season
          ? ep.season?.toLowerCase() === req.query.season?.toLowerCase()
          : true) &&
        ep.ep?.toLowerCase().includes(req.query.ep?.toLowerCase() || "")
      ) {
        result.push(ep)
      }
    }
    result = paginate(result, req.query.page || 1, req.query.size || 10)
    res.send({
      data: result,
      next:
        "https://supernatural-quotes-api.cyclic.app/episodes?page=" +
        (isNaN(Number(req.query.page) + 1) ? 2 : Number(req.query.page) + 1),
      prev:
        Number(req.query.page) > 1
          ? "https://supernatural-quotes-api.cyclic.app/episodes?page=" +
            (Number(req.query.page) - 1)
          : null,
      count: data.length,
    })
  } catch (error) {
    next(error)
    console.error(error)
  }
})

episodeRouter.get("/:id", async (req, res, next) => {
  try {
    const ep = await db.data.episodes.find(el => el.id === req.params.id)
    if(ep) {
        ep.chars.forEach((c,i) => {
           ep.chars[i] = db.data.characters.find(el => el.id === c)
        })
        res.send(ep)
    } else res.sendStatus(404)





  } catch (error) {
    next(error)
  }
})
