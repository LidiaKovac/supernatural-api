import { Router } from "express"
import { db } from "../../server.js"
import stringSimilarity from "string-similarity"
import { paginate } from "../../utils/index.js"
import DomParser from "dom-parser"
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
        "https://supernatural-quotes-api.cyclic.app/characters?page=" +
        (isNaN(Number(req.query.page) + 1) ? 2 : Number(req.query.page) + 1),
      prev:
        Number(req.query.page) > 1
          ? "https://supernatural-quotes-api.cyclic.app/characters?page=" +
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
// charRouter.put("/clean", async(req,res,next) => {
//   try {
//     const newA = []
//     for (const c of db.data.characters) {
//       if(!newA.map(e => e.id).includes(c.id)) {
//         newA.push(c)
//       }
//     }
//     db.data.characters = newA
//     await db.write()
//     res.send(201)
//   } catch (error) {

//   }
// })

// charRouter.put("/location", async (req, res, next) => {
//   try {
//     const chars = await db.data.characters
//     for (const char of chars) {
//       let res = await fetch(
//         "http://www.supernaturalwiki.com/" +
//           char.name.replaceAll("'", "%27").replaceAll("&", "%26").replaceAll()
//       )
//       let txt = await res.text()
//       const parsed = new DomParser().parseFromString(txt)
//       let location = parsed.getElementsByTagName("table")[0]?.getElementsByTagName("td")[
//         parsed
//           .getElementsByTagName("td")
//           .findIndex((el) => el?.innerHTML.includes("Location")) + 1
//       ]?.innerHTML
//       if(location?.includes("<a")) {
//         location = parsed.getElementsByTagName("table")[0].getElementsByTagName("td")[
//           parsed
//             .getElementsByTagName("td")
//             .findIndex((el) => el?.innerHTML.includes("Location")) + 1
//         ].getElementsByTagName("a")[0]?.innerHTML
//       }
//       console.log(char.name, location)
//       char.location = location || "Unknown"
//     }
//     db.data.characters = chars
//     db.write()
//   } catch (error) {
//     next(error)
//     console.log(error)
//   }
// })

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
