import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type StartingChoice = 'scratch' | 'check' | ''

export type AppState = {
  name: string
  language: string
  goal: string
  startingChoice: StartingChoice
  checkAnswers: (number | null)[]
  starterAnswer: number | null
  heroOptions: number[]
  activeLevel: number
  completed: number[]
  conversationDone: boolean
  soundEffects: boolean
  practiceReminders: boolean
  onboardingComplete: boolean
  updatedAt: string
}

const STORAGE_KEY = 'omalingo.app-state.v1'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const backendConfigured = Boolean(supabaseUrl && supabaseKey)

const supabase: SupabaseClient | null = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null

let userIdPromise: Promise<string | null> | null = null
let loadStatePromise: Promise<AppState | null> | null = null

type AppStateRow = {
  display_name: string
  learning_language: string
  learning_goal: string
  starting_choice: StartingChoice
  placement_answers: (number | null)[]
  starter_answer: number | null
  hero_options: number[]
  active_level: number
  completed_missions: number[]
  conversation_done: boolean
  sound_effects: boolean
  practice_reminders: boolean
  onboarding_completed: boolean
  client_updated_at: string
}

function readLocalState(): AppState | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value ? JSON.parse(value) as AppState : null
  } catch {
    return null
  }
}

function writeLocalState(state: AppState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private browsing and full storage must not block the learning flow.
  }
}

function fromRow(row: AppStateRow): AppState {
  return {
    name: row.display_name,
    language: row.learning_language,
    goal: row.learning_goal,
    startingChoice: row.starting_choice,
    checkAnswers: row.placement_answers,
    starterAnswer: row.starter_answer,
    heroOptions: row.hero_options,
    activeLevel: row.active_level,
    completed: row.completed_missions,
    conversationDone: row.conversation_done,
    soundEffects: row.sound_effects,
    practiceReminders: row.practice_reminders,
    onboardingComplete: row.onboarding_completed,
    updatedAt: row.client_updated_at,
  }
}

function toRow(userId: string, state: AppState) {
  return {
    user_id: userId,
    display_name: state.name,
    learning_language: state.language,
    learning_goal: state.goal,
    starting_choice: state.startingChoice,
    placement_answers: state.checkAnswers,
    starter_answer: state.starterAnswer,
    hero_options: state.heroOptions,
    active_level: state.activeLevel,
    completed_missions: state.completed,
    conversation_done: state.conversationDone,
    sound_effects: state.soundEffects,
    practice_reminders: state.practiceReminders,
    onboarding_completed: state.onboardingComplete,
    client_updated_at: state.updatedAt,
  }
}

async function resolveUserId(): Promise<string | null> {
  if (!supabase) return null

  const { data: sessionData } = await supabase.auth.getSession()
  if (sessionData.session?.user.id) return sessionData.session.user.id

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data.user?.id ?? null
}

function getUserId(): Promise<string | null> {
  if (!userIdPromise) {
    userIdPromise = resolveUserId().catch((error) => {
      userIdPromise = null
      throw error
    })
  }
  return userIdPromise
}

async function resolveAppState(): Promise<AppState | null> {
  const local = readLocalState()
  if (!supabase) return local

  try {
    const userId = await getUserId()
    if (!userId) return local

    const { data, error } = await supabase
      .from('user_app_state')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle<AppStateRow>()

    if (error) throw error
    const remote = data ? fromRow(data) : null
    const latest = !remote || (local && local.updatedAt > remote.updatedAt) ? local : remote

    if (latest) {
      writeLocalState(latest)
      if (!remote || latest.updatedAt > remote.updatedAt) {
        const { error: saveError } = await supabase.from('user_app_state').upsert(toRow(userId, latest))
        if (saveError) throw saveError
      }
    }

    return latest
  } catch (error) {
    console.warn('Cloud state unavailable; using local progress.', error)
    return local
  }
}

export function loadAppState(): Promise<AppState | null> {
  if (!loadStatePromise) {
    loadStatePromise = resolveAppState().catch((error) => {
      loadStatePromise = null
      throw error
    })
  }
  return loadStatePromise
}

export async function saveAppState(state: Omit<AppState, 'updatedAt'>): Promise<void> {
  const snapshot: AppState = { ...state, updatedAt: new Date().toISOString() }
  writeLocalState(snapshot)
  if (!supabase) return

  try {
    const userId = await getUserId()
    if (!userId) return
    const { error } = await supabase.from('user_app_state').upsert(toRow(userId, snapshot))
    if (error) throw error
  } catch (error) {
    console.warn('Cloud sync deferred; local progress is safe.', error)
  }
}
