import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type NavigationState = {
  currentRoute: string
  navigate: (route: string) => void
}

const NavigationContext = createContext<NavigationState | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState('/dashboard')

  const navigate = (route: string) => {
    setCurrentRoute(route)
  }

  return (
    <NavigationContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}