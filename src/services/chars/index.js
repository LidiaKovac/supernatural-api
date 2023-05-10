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
        (isNaN((Number(req.query.page) + 1)) ? 2 : (Number(req.query.page) + 1)),
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

// charRouter.put("/connect", async (req, res, next) => {
//   try {
//     const chars = await db.data.characters
//     const quotes = await db.data.quotes

//     const quotesWithIds = quotes.map((quote) => {
//       Object.keys(quote).forEach((key) => {
//         Object.keys(quote[key]).forEach((line) => {
//           if (line === "character") {
//             let name = quote[key][line].name || quote[key][line]
//             if (quote[key][line].name != "") {
//               console.log(name.split("(")[0] + (name.split(")")[1] || ""))
//               const allchars = chars
//                 .filter((pg) =>
//                   pg.name
//                     .toLowerCase()
//                     .includes(
//                       (name.split("(")[0] + (name.split(")")[1] || "")).toLowerCase()
//                     )
//                 )
//                 .map((pg) => pg.name.split("(")[0] + (pg.name.split(")")[1] || ""))
//               if (allchars.length > 0) {
//                 let { bestMatch: found } = stringSimilarity.findBestMatch(
//                   name.split("(")[0] + (name.split(")")[1] || "").toLowerCase(),
//                   allchars
//                 )
//                 console.log(found);
//                 quote[key][line] = {
//                   name,
//                   id: chars.find(
//                     (pg) => pg.name.toLowerCase() === found.target.trim().toLowerCase()
//                   ).id,
//                 }
//               }
//             }
//           }
//         })
//       })
//       return quote
//     })

//     db.data.quotes = quotesWithIds
//     db.write()
//     res.send(200)
//   } catch (error) {
//     next(error)
//     console.log(error)
//   }
// })
