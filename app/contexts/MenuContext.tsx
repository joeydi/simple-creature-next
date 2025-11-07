"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface MenuContextType {
  isActive: boolean
  setIsActive: (active: boolean) => void
  toggleMenu: () => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false)

  const toggleMenu = () => {
    setIsActive(!isActive)
  }

  return (
    <MenuContext.Provider value={{ isActive, setIsActive, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}
