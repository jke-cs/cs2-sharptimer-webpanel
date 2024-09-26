import { NextResponse } from 'next/server'

let playerCountHistory = []

export async function GET() {
  return NextResponse.json(playerCountHistory)
}

export async function POST(request) {
  const { count } = await request.json()
  const now = new Date()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  
  playerCountHistory.push({ time, count })
  if (playerCountHistory.length > 30) {
    playerCountHistory = playerCountHistory.slice(-30)
  }

  return NextResponse.json({ success: true })
}