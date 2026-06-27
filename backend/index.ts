import express from "express";
import jwt from "jsonwebtoken"
import cors from "cors"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client";
import { envFiles } from "../env.ts"

const pool = new Pool({ connectionString: envFiles.databaseUrl })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
const app = express()

app.use(express.json())
app.use(cors())


app.post("/signup", async (req, res) => {
  const { username, password } = req.body

  if (await prisma.user.findUnique({ where: { username } })) return res.status(409).json({ error: "user already exists" })
  await prisma.user.create({
    data: {
      username,
      password
    }
  })

  res.status(200).json({ message: "You've signed up!" })
})

app.post("/signin", async (req, res) => {
  const { username, password } = req.body
  const userExists = await prisma.user.findUnique({ where: { username } })

  if (!userExists) {
    res.status(403).json({ error: "This user doesnt exists" });
    return;
  }

  if (!userExists.password === password) {
    res.status(403).json({ error: "Incorrect password" })
    return;
  }

  const token = jwt.sign({
    username: userExists.username
  }, envFiles.jwtSecret)

  res.status(200).json({ token })
})



app.listen(envFiles.PORT, () => console.log(`backend listening on ${envFiles.PORT}`))
