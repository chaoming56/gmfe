import { createContext } from 'react'

interface WrapContextOptions {}

interface CellKeyContextOptions {}

const WrapContext = createContext<WrapContextOptions | null>(null)
const CellKeyContext = createContext<CellKeyContextOptions | null>(null)

export { WrapContext, CellKeyContext }
export type { WrapContextOptions, CellKeyContextOptions }
