import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import Redis from "ioredis";
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client";
import { envFiles } from "../env";


const pool = new Pool({ connectionString: envFiles.databaseUrl })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter });

interface UserTokenPayload {
  username: string;
}


const pub = new Redis(envFiles.redisUrl)
const sub = new Redis(envFiles.redisUrl)

const rooms = new Map()

sub.on("message", (channel, message) => {
  const room = channel.replace("room:", "")
  for (const ws of rooms.get(room) || []) ws.send(message)
  console.log(message)
});

const wss = new WebSocketServer({ port: 8080 })

wss.on("connection", (ws, req: any) => {
  const token = new URL(req.url, "http://x").searchParams.get("token")
  if (token === null) {
    throw new Error("Token is null")
  }
  let user: string;
  try {
    const decoded = jwt.verify(token, envFiles.jwtSecret) as { username: string }
    console.log(decoded)
    user = decoded.username
  } catch {
    return ws.close()
  }

  prisma.user.findUnique({ where: { username: user } })
    .then((found) => {
      if (!found) ws.close()
    })


  let room: any = null;
  ws.on("message", (data: string) => {
    const msg = JSON.parse(data);
    if (msg.type === "join") {
      room = msg.room
      if (!rooms.has(room)) {
        rooms.set(room, new Set())
        sub.subscribe("room:" + room)
      }
      rooms.get(room).add(ws);
    } else if (msg.type === "message" && room) {
      console.log(msg)
      console.log(msg.text)
      pub.publish("room:" + room, JSON.stringify({ user, msg: msg.text }))
    }
  })

  ws.on("close", () => rooms.get(room)?.delete(ws))
});

console.log(`websocket server listening on 3005`)
