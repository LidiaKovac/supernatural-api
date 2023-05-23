import { Router } from "express"
import { db } from "../../server.js"
import stringSimilarity from "string-similarity"
import { paginate } from "../../utils/index.js"
export const charRouter = Router()

charRouter.get("/", async (req, res, next) => {
  try {
    console.log(req.query)
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
        "https://supernatural-quotes-api.cyclic.app/characters?page=" +
        (isNaN(Number(req.query.page) + 1) ? 2 : Number(req.query.page) + 1),
      prev:
        Number(req.query.page) > 1
          ? "https://supernatural-quotes-api.cyclic.app/characters?page=" +
            (Number(req.query.page) - 1)
          : null,
      count: data.length,
    })
  } catch (error) {
    next(error)
    console.error(error)
  }
})

charRouter.put("/connect", async (req, res, next) => {
  try {
    const episodes = await db.data.episodes
    for (const char of db.data.characters) {
      char.episodes = char.episodes.map((el) => {
        // console.log(db.data.episodes);
        const foundEp = episodes.find(
          (e) => e.season + "." + e.ep === el.split(" ")[0]
        )
        // console.log(foundEp)
        return {
          title: el,
          id: foundEp?.id || "N/A",
        }
      })
      console.log(await char.episodes)
    }
    await db.write()
    res.send(db.data.characters)
  } catch (error) {
    next(error)
    console.log(error)
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
