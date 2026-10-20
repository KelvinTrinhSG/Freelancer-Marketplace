// Pure deck navigation. `size` is the number of cards in the current deck.

export type DeckState = {
  index: number
  skippedHistory: number[]
}

export const initialDeck: DeckState = { index: 0, skippedHistory: [] }

function next(index: number, size: number): number {
  return size === 0 ? 0 : (index + 1) % size
}

/** Skip the current card; remember it so ↶ can bring it back. Wraps after the last card. */
export function skip(state: DeckState, size: number): DeckState {
  return { index: next(state.index, size), skippedHistory: [...state.skippedHistory, state.index] }
}

/** Move on after a tick. Ticks are not undoable with ↶. */
export function advance(state: DeckState, size: number): DeckState {
  return { ...state, index: next(state.index, size) }
}

/** Return to the most recently skipped card. No-op when nothing was skipped. */
export function back(state: DeckState): DeckState {
  if (state.skippedHistory.length === 0) return state
  const history = state.skippedHistory.slice(0, -1)
  return { index: state.skippedHistory[state.skippedHistory.length - 1], skippedHistory: history }
}

export function canGoBack(state: DeckState): boolean {
  return state.skippedHistory.length > 0
}
