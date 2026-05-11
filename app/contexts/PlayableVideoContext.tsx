"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

type PlayableVideoContextType = {
  ownerId: string | null
  claim: (id: string) => void
  release: (id: string) => void
}

const PlayableVideoContext = createContext<PlayableVideoContextType | undefined>(undefined)

export function PlayableVideoProvider({ children }: { children: ReactNode }) {
  const [ownerId, setOwnerId] = useState<string | null>(null)

  const claim = useCallback((id: string) => setOwnerId(id), [])
  const release = useCallback((id: string) => {
    setOwnerId((prev) => (prev === id ? null : prev))
  }, [])

  return (
    <PlayableVideoContext.Provider value={{ ownerId, claim, release }}>{children}</PlayableVideoContext.Provider>
  )
}

export function usePlayableVideoAudio() {
  const ctx = useContext(PlayableVideoContext)
  if (!ctx) throw new Error("usePlayableVideoAudio must be used within a PlayableVideoProvider")
  return ctx
}
