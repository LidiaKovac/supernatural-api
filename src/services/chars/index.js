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

charRouter.put("/clean", async(req,res,next) => {
  try {
    const newA = []
    for (const c of db.data.characters) {
      if(!newA.map(e => e.id).includes(c.id)) {
        newA.push(c)
      }
    }
  } catch (error) {
    
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


