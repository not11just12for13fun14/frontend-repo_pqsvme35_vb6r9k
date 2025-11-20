import React, { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Lobby() {
  const [stake, setStake] = useState(100)
  const [time, setTime] = useState('3+2')
  const [wallet, setWallet] = useState(null)
  const [match, setMatch] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/me/wallet`).then(r=>r.json()).then(setWallet).catch(()=>{})
  }, [])

  const joinQueue = async () => {
    const r = await fetch(`${API_BASE}/queue/join`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({stake, time_control: time})})
    const data = await r.json()
    setMatch(data)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/UGnf9D1Hp3OG8vSG/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black pointer-events-none" />

      <header className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">StakeChess</h1>
        <button className="px-4 py-2 rounded-md bg-white text-black hover:bg-gray-200 transition">Sign in with Google</button>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
        <section>
          <h2 className="text-3xl font-bold mb-4">Raise the stakes. Play real chess.</h2>
          <p className="text-gray-300 mb-6">FIDE-legal chess with a twist: alternate a Raise Token to increase the pot mid-game. Refuse a raise and you instantly lose.</p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-gray-300">Stake</span>
              <span className="font-semibold">{stake} VC</span>
            </div>
            <input type="range" min={50} max={500} step={50} value={stake} onChange={(e)=>setStake(parseInt(e.target.value))} className="w-full" />

            <div className="mt-6">
              <label className="block text-gray-300 mb-2">Time control</label>
              <select value={time} onChange={(e)=>setTime(e.target.value)} className="w-full bg-black border border-white/10 rounded-md p-2">
                <option>3+2</option>
                <option>5+0</option>
                <option>10+5</option>
              </select>
            </div>

            <button onClick={joinQueue} className="mt-6 w-full px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold">Find match</button>

            {wallet && (
              <p className="mt-4 text-sm text-gray-400">Wallet: {wallet.soft_balance} VC</p>
            )}

            {match && (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-emerald-300">Matched! Match ID: {match.matchId}</p>
                <p className="text-gray-300">Stake: {match.stake} VC · {match.time_control}</p>
              </div>
            )}
          </div>
        </section>

        <section className="hidden md:block">
          <div className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-xl">Board preview</p>
              <p className="text-gray-400 mt-2">Full board, raises, timers, and sockets coming next.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function App(){
  return <Lobby />
}
