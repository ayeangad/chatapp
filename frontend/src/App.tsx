import { useState, useRef } from 'react'
import './App.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL
const WEBSOCKET = import.meta.env.VITE_WS_URL

interface Messages {
  user: string,
  msg: string
}


function App() {

  const ws = useRef<WebSocket | null>(null)
  const [messages, setMessages] = useState<Messages[]>([])
  const [token, setToken] = useState("")
  const [room, setRoom] = useState("")
  const [joined, setJoined] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [text, setText] = useState("")

  const auth = async (path: string) => {
    const res = await fetch(`${BACKEND}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (data.token) {
      setToken(data.token)
    } else {
      console.log(data.error)
    }
  }

  const join = () => {
    ws.current = new WebSocket(`${WEBSOCKET}?token=${token}`)
    ws.current.onopen = () => {
      if (!ws.current) throw new Error("undefined")
      ws.current.send(JSON.stringify({ type: "join", room }))
    }
    ws.current.onmessage = (e) => setMessages((m) => [...m, JSON.parse(e.data)])
    ws.current.onclose = () => { console.log("Connection closed") }
    setJoined(true)
  }

  const send = () => {
    if (!ws.current) throw new Error("Undefined")
    ws.current.send(JSON.stringify({ type: "message", text }))
    setText("")
  }



  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 500, margin: "50px auto" }}>
      <h1> Chat rooms </h1>

      {!token && (
        <div>
          <input placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} />
          <input placeholder='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => auth("signup")}>Sign up</button>
          <button onClick={() => auth("signin")}>Sign in</button>
        </div>

      )}

      {token && !joined && (
        <div>
          <input placeholder='room' value={room} onChange={(e) => setRoom(e.target.value)} />
          <button onClick={join}> Join </button>
        </div>
      )}

      {token && joined && (
        <div>
          <h2>Your room: {room}</h2>
          <div style={{ border: '2px solid', height: 300, padding: 8, overflowY: "auto", borderRadius: '10px' }}>
            {messages.map((m, i) => (
              <div key={i}><b>{m.user}:</b> {m.msg}</div>
            ))}
          </div>
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
          <button onClick={send}> Send </button>
        </div>
      )}


    </div >
  )
}

export default App
