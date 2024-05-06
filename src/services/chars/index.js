import { Router } from "express"
import { db } from "../../server.js"
import { paginate } from "../../utils/index.js"
export const charRouter = Router()

charRouter.get("/", async (req, res, next) => {
  try {
    // const props = ["name", "img", "actor", "episodes", "occupation"]
    const data = await db.data.characters
    let result = []

    for (const char of data) {
      if (
        char.name.toLowerCase().includes(req.query.name?.toLowerCase() || "") &&
        char.actor
          ?.join()
          ?.toLowerCase()
          .includes(req.query.actor?.toLowerCase() || "") &&
        char.episodes
          .join()
          ?.toLowerCase()
          .includes(req.query.episodes?.toLowerCase() || "") &&
        char.occupation
          .join()
          ?.toLowerCase()
          .includes(req.query.occupation?.toLowerCase() || "")
      ) {
        result.push(char)
      }
    }
    result = paginate(result, req.query.page || 1, req.query.size || 10)
    res.send({
      data: result,
      next:
        "https://supernatural-api.onrender.com/characters?page=" +
        (isNaN(Number(req.query.page) + 1) ? 2 : Number(req.query.page) + 1),
      prev:
        Number(req.query.page) > 1
          ? "https://supernatural-api.onrender.com/characters?page=" +
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
