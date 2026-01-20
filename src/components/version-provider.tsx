import { createContext, useContext, useEffect, useState } from "react"

type Version = "classic" | "enhanced"

interface VersionProviderProps {
    children: React.ReactNode
    defaultVersion?: Version
    storageKey?: string
}

interface VersionProviderState {
    version: Version
    setVersion: (version: Version) => void
}

const initialState: VersionProviderState = {
    version: "classic",
    setVersion: () => null,
}

const VersionProviderContext = createContext<VersionProviderState>(initialState)

export function VersionProvider({
    children,
    defaultVersion = "classic",
    storageKey = "vite-ui-version",
}: VersionProviderProps) {
    const [version, setVersion] = useState<Version>(
        () => (localStorage.getItem(storageKey) as Version) || defaultVersion
    )

    const value = {
        version,
        setVersion: (version: Version) => {
            localStorage.setItem(storageKey, version)
            setVersion(version)
        },
    }

    return (
        <VersionProviderContext.Provider value={value}>
            {children}
        </VersionProviderContext.Provider>
    )
}

export const useVersion = () => {
    const context = useContext(VersionProviderContext)

    if (context === undefined)
        throw new Error("useVersion must be used within a VersionProvider")

    return context
}
