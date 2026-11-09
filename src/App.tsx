import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { backendConfigured, loadAppState, saveAppState, type StartingChoice } from './lib/backend'
import { changeInterfaceLocale, interfaceLocaleOptions, normalizeInterfaceLocale } from './lib/i18n'

type View = 'welcome' | 'language' | 'personalize' | 'starting' | 'level-check' | 'recommendation' | 'starter' | 'intro' | 'hero' | 'feed' | 'journey' | 'world' | 'profile' | 'level' | 'lesson' | 'short-lesson' | 'conversation' | 'boss' | 'store' | 'edit-profile' | 'language-select' | 'settings' | 'account'
type MainView = 'feed' | 'journey' | 'profile'
type IconName = 'arrow' | 'back' | 'check' | 'close' | 'edit' | 'gear' | 'home' | 'journey' | 'keyboard' | 'mic' | 'pause' | 'play' | 'profile' | 'sound' | 'spark'

type Mission = {
  id: number
  level: number
  title: string
  question: string
  answers: string[]
  correct: number
  feedback: string
  prompt: string
  example: string
  checks: string[]
  followLine: string
  followChoices: string[]
  followPrompt: string
}

const A = '/assets/figma'
const SHORT_COMPLETIONS_KEY = 'omalingo.completed-shorts.v1'
const ECONOMY_KEY = 'omalingo.economy.v1'
type EconomyState = {
  bonusLingo: number
  lingoSpent: number
  tickets: number
  ownedItems: string[]
  dailyBoxDate: string
  bossWins: number[]
}
const omaritoShorts = [
  {
    id: 'i-like-vs-id-like',
    source: '/assets/videos/i-like-vs-id-like.mp4',
    poster: '/assets/videos/i-like-vs-id-like.jpg',
    captions: '/assets/videos/i-like-vs-id-like.vtt',
    titleKey: 'shorts.likeTitle',
    takeawayKey: 'shorts.likeTakeaway',
    quiz: 'What does “I’d like a coffee” mean?',
    answers: ['I want a coffee now.', 'I enjoy coffee in general.', 'I drank coffee yesterday.'],
    correct: 0,
    ruleLeft: 'I like + thing',
    ruleLeftNote: 'a general preference',
    ruleLeftExample: 'I like coffee.',
    ruleRight: 'I’d like + thing',
    ruleRightNote: 'what you want now',
    ruleRightExample: 'I’d like a coffee, please.',
    practice: 'Order a drink politely. Use “I’d like”.',
    model: 'I’d like a cup of tea, please.',
  },
  {
    id: 'say-vs-tell',
    source: '/assets/videos/say-vs-tell.mp4',
    poster: '/assets/videos/say-vs-tell.jpg',
    captions: '/assets/videos/say-vs-tell.vtt',
    titleKey: 'shorts.sayTitle',
    takeawayKey: 'shorts.sayTakeaway',
    quiz: 'Which sentence correctly names the person receiving the information?',
    answers: ['He told me the news.', 'He said me the news.', 'He told the news.'],
    correct: 0,
    ruleLeft: 'say + words',
    ruleLeftNote: 'focus on what was said',
    ruleLeftExample: 'He said, “I’m tired.”',
    ruleRight: 'tell + person',
    ruleRightNote: 'name who receives it',
    ruleRightExample: 'He told me he was tired.',
    practice: 'Write one sentence with “say” and one with “tell”.',
    model: 'Maya said hello. Then she told me the news.',
  },
] as const
const worlds = [
  ['NOVA', 'journey.nova'], ['LEXORA', 'journey.lexora'], ['SONARA', 'journey.sonara'], ['VERBIA', 'journey.verbia'],
  ['DIALOGA', 'journey.dialoga'], ['VIVORA', 'journey.vivora'], ['FLUENTA', 'journey.fluenta'], ['OMNIA', 'journey.omnia'],
] as const
const shopItems = [
  { id: 'nova-hoodie', asset: 'clothes-hoodie.png', titleKey: 'store.novaHoodie', descriptionKey: 'store.novaHoodieDescription', price: 40 },
  { id: 'focus-headphones', asset: 'headphones.png', titleKey: 'store.focusHeadphones', descriptionKey: 'store.focusHeadphonesDescription', price: 60 },
  { id: 'gold-aura', asset: 'badge-gold.png', titleKey: 'store.goldAura', descriptionKey: 'store.goldAuraDescription', price: 90 },
] as const

function localDateKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function readShortCompletions(): number[] {
  try {
    const saved = window.localStorage.getItem(SHORT_COMPLETIONS_KEY)
    return saved ? JSON.parse(saved) as number[] : []
  } catch {
    return []
  }
}
function readEconomy(): EconomyState {
  const defaults: EconomyState = { bonusLingo: 0, lingoSpent: 0, tickets: 2, ownedItems: [], dailyBoxDate: '', bossWins: [] }
  try {
    const saved = window.localStorage.getItem(ECONOMY_KEY)
    return saved ? { ...defaults, ...JSON.parse(saved) as Partial<EconomyState> } : defaults
  } catch {
    return defaults
  }
}
const levels = [
  { id: 1, title: 'Find your voice', subtitle: 'Start simple and sound like yourself', color: '#3478ff' },
  { id: 2, title: 'Make it happen', subtitle: 'Suggest, choose and arrange plans', color: '#7b5cff' },
  { id: 3, title: 'Tell your story', subtitle: 'Explain events and clear things up', color: '#ef9f3e' },
  { id: 4, title: 'Work it out', subtitle: 'Compare options and decide together', color: '#2ebf8c' },
]

const missionSeeds = [
  ['More than your name', 'Tell a new friend one thing you usually do and one thing you are doing these days.', 'I usually read after work. At the moment, I’m learning to cook.'],
  ['A little more than “yes”', 'Would you rather spend a free evening at home or outside? Give your view and a reason.', 'I’d rather stay home because I’ve had a long week.'],
  ['Keep the door open', 'Ask a question to understand a friend’s creative weekend plan.', 'What do you mean by creative? What are you planning?'],
  ['You’re in the group', 'Suggest an activity, explain why, and ask what someone else thinks.', 'A picnic could be good because we can talk and relax. What about you, Maya?'],
  ['A new conversation', 'Introduce yourself and recommend an activity. Explain your choice.', 'I’m Sam. I usually go cycling with a local group. You could join us.'],
  ['Put an idea out there', 'Suggest a low-cost activity for two friends tomorrow afternoon.', 'We could walk by the river at three. It’s free and close to the station.'],
  ['What works for you?', 'State your preference between a restaurant and a quiet meal at home.', 'A quiet meal at home works for me because we can talk.'],
  ['Change the plan', 'Explain a conflict on Friday and suggest Saturday instead.', 'I can’t do Friday because I have an appointment. Could we meet Saturday?'],
  ['Find the overlap', 'Suggest a meeting time that works for Maya and Alex.', 'We could meet on Sunday at ten because it fits both schedules.'],
  ['Plans meet real life', 'Suggest a revised plan that works in rainy weather.', 'We could visit the museum instead. We would stay dry.'],
  ['Tell me what happened', 'Describe something that happened yesterday and what happened next.', 'I missed my bus, so I walked to the next street and caught another one.'],
  ['Not quite as planned', 'Tell a story about a plan that changed and the result.', 'I planned to bake a cake, but the oven stopped working, so I bought one.'],
  ['Let’s clear that up', 'Check which station your friend means, then clarify the place.', 'Do you mean the train station? I meant the bus station by the bridge.'],
  ['Pass the message on', 'Leave a short voice note with room, time, and what to bring.', 'The workshop is in room nine at ten. Bring your notebook.'],
  ['The story is yours', 'Explain what went wrong, what you did, and the result.', 'The road was closed, so my coach took another street. I arrived a little late.'],
  ['A way forward', 'Suggest one realistic first step for a busy friend who wants to exercise.', 'You could take a short walk after lunch three times a week.'],
  ['A different point of view', 'Acknowledge a venue, then explain your concern about cost.', 'The venue looks great, but it may be too expensive for everyone.'],
  ['Both have a good side', 'Compare taking a bus and a taxi. Give a benefit and a drawback.', 'The bus is cheaper but slower. A taxi is faster but costs more.'],
  ['Decide together', 'Recommend a venue. Explain one advantage and one concern.', 'The community room is convenient, but we should check the price.'],
  ['Out into the world', 'Recommend an activity that fits a visitor’s time and budget.', 'Visit the free exhibition near the station. It is close and affordable.'],
] as const

const missions: Mission[] = missionSeeds.map(([title, prompt, example], index) => ({
  id: index + 1,
  level: Math.floor(index / 5) + 1,
  title,
  question: index === 0 ? 'Listen to the scene. What comes after “At the moment”?' : `Which response best uses the skill from “${title}”?`,
  answers: index === 0 ? ['I learn to take better photos', 'I learned to take better photos', 'I am learning to take better photos'] : ['A clear, natural response', 'A response without a useful detail', 'No response'],
  correct: index === 0 ? 2 : 0,
  feedback: index === 0 ? '“I am learning” describes an activity in progress, not a finished event.' : 'This answer is clear, relevant, and keeps the conversation moving.',
  prompt,
  example,
  checks: ['Answer the task clearly', 'Add one useful detail', 'Keep it natural'],
  followLine: index === 0 ? 'That sounds interesting. Do you prefer doing things alone or with other people?' : 'That sounds good. Tell me a little more.',
  followChoices: index === 0 ? ['With other people', 'Usually on my own'] : ['I can add a detail', 'Let me explain why'],
  followPrompt: index === 0 ? 'Tell me who you would invite and why.' : 'Reply naturally and add one useful detail.',
}))

const languages = [
  ['flag-uk.png', 'English'], ['flag-es.png', 'Spanish'], ['flag-pt.png', 'Portuguese'],
  ['flag-id.png', 'Indonesian'], ['flag-kz.png', 'Kazakh'], ['flag-ru.png', 'Russian'],
]
const goals = [
  { value: 'Everyday conversations', labelKey: 'onboarding.goalEveryday' },
  { value: 'Work and collaboration', labelKey: 'onboarding.goalWork' },
  { value: 'Travel and meeting people', labelKey: 'onboarding.goalTravel' },
]
const levelCheckTasks = [
  { title: 'Choose the word for the picture.', prompt: '☕', options: ['Coffee', 'Tea', 'Water'], correct: 0 },
  { title: 'Choose the missing word.', prompt: 'Alex and Sam ___ friends.', options: ['is', 'are', 'am'], correct: 1 },
  { title: 'Listen and choose what you hear.', prompt: 'audio', options: ['My name is Alex.', 'My name is Anna.', 'My name is Sam.'], correct: 0 },
  { title: 'Choose the opposite.', prompt: 'Hot', options: ['Cold', 'Large', 'Fast'], correct: 0 },
  { title: 'Choose the missing word.', prompt: 'Yesterday, I ___ to school.', options: ['go', 'went', 'going'], correct: 1 },
]

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const p: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    back: <path d="m15 18-6-6 6-6"/>, check: <path d="m5 12 4 4L19 6"/>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    edit: <><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z"/><path d="m13.5 7.5 3 3"/></>,
    gear: <><circle cx="12" cy="12" r="3"/><path d="M19 15l2 2-4 4-2-2a7 7 0 0 1-2 1v3H8v-3a7 7 0 0 1-2-1l-2 2-4-4 2-2a7 7 0 0 1-1-2H-2V8h3a7 7 0 0 1 1-2L0 4l4-4 2 2a7 7 0 0 1 2-1v-3h5v3a7 7 0 0 1 2 1l2-2 4 4-2 2a7 7 0 0 1 1 2h3v5h-3a7 7 0 0 1-1 2z"/></>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    journey: <><circle cx="12" cy="12" r="3"/><path d="M3 12c0-5 4-9 9-9M21 12c0 5-4 9-9 9M12 3c5 0 9 4 9 9M12 21c-5 0-9-4-9-9"/></>,
    keyboard: <><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M18 10h.01M7 14h.01M10 14h7"/></>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/></>,
    pause: <><path d="M9 5v14"/><path d="M15 5v14"/></>, play: <path d="m8 5 11 7-11 7z" fill="currentColor" stroke="none"/>,
    profile: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    sound: <><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></>,
    spark: <><path d="m12 3 1.2 4.1L17 9l-3.8 1.9L12 15l-1.2-4.1L7 9l3.8-1.9z"/><path d="m19 15 .6 2.1L22 18l-2.4.9L19 21l-.6-2.1L16 18l2.4-.9z"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{p[name]}</svg>
}

function Logo() { return <div className="logo"><span><i/><i/><i/></span><strong>OmalinGO</strong></div> }

function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const { t, i18n } = useTranslation()
  const activeLocale = normalizeInterfaceLocale(i18n.resolvedLanguage || i18n.language)
  return <div className={`locale-switcher ${compact ? 'compact' : ''}`} role="group" aria-label={t('locale.label')}>
    {interfaceLocaleOptions.map((locale) => <button
      aria-pressed={activeLocale === locale.code}
      className={activeLocale === locale.code ? 'active' : ''}
      key={locale.code}
      onClick={() => void changeInterfaceLocale(locale.code)}
      title={t(locale.labelKey)}
      type="button"
    >{compact ? locale.short : t(locale.labelKey)}</button>)}
  </div>
}
const heroFeatureAssets = {
  eyes: ['eyes-1.png', 'eyes-2.png', 'eyes-3.png', 'eyes-4.png', 'eyes-2.png', 'eyes-1.png'],
  nose: ['nose-1.png', 'nose-2.png', 'nose-3.png', 'nose-4.png', 'nose-5.png', 'nose-6.png'],
  mouth: ['mouth-1.png', 'mouth-2.png', 'mouth-3.png', 'mouth-4.png', 'mouth-5.png', 'mouth-6.png'],
}

function Avatar({ className = '', options = [0, 0, 0, 0] }: { className?: string; options?: number[] }) {
  return <span className={`avatar-img ${className}`}>
    <img className="avatar-base" src={`${A}/hero-head.png`} alt="Omarito"/>
    {options[0] > 0 && <img className={`avatar-feature avatar-eyes option-${options[0]}`} src={`${A}/${heroFeatureAssets.eyes[options[0]]}`} alt=""/>}
    {options[1] > 0 && <img className={`avatar-feature avatar-nose option-${options[1]}`} src={`${A}/${heroFeatureAssets.nose[options[1]]}`} alt=""/>}
    {options[2] > 0 && <img className={`avatar-feature avatar-mouth option-${options[2]}`} src={`${A}/${heroFeatureAssets.mouth[options[2]]}`} alt=""/>}
  </span>
}

function HeroVisual({ options }: { options: number[] }) {
  return <div className={`hero-visual outfit-${options[3]}`}>
    <img className="hero-base" src={`${A}/hero-standing.png`} alt="Your snow leopard hero"/>
    {options[3] > 0 && <img className={`hero-outfit-tint option-${options[3]}`} src={`${A}/hero-standing.png`} alt=""/>}
  </div>
}
function Wave({ active = false }: { active?: boolean }) { return <div className={`wave ${active ? 'active' : ''}`}>{Array.from({ length: 29 }, (_, i) => <i key={i} style={{ height: `${14 + (i * 19) % 70}%`, animationDelay: `${-i * 32}ms` }}/>)}</div> }

function App() {
  const { t } = useTranslation()
  const [view, setView] = useState<View>('welcome')
  const [appReady, setAppReady] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [language, setLanguage] = useState('English')
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [startingChoice, setStartingChoice] = useState<StartingChoice>('')
  const [checkStep, setCheckStep] = useState(0)
  const [checkAnswers, setCheckAnswers] = useState<(number | null)[]>([null, null, null, null, null])
  const [starterAnswer, setStarterAnswer] = useState<number | null>(null)
  const [heroPart, setHeroPart] = useState(0)
  const [heroOptions, setHeroOptions] = useState([0, 0, 0, 0])
  const [heroReturn, setHeroReturn] = useState<View>('feed')
  const [introReturn, setIntroReturn] = useState<View>('starter')
  const [activeLevel, setActiveLevel] = useState(1)
  const [missionId, setMissionId] = useState(1)
  const [lessonStep, setLessonStep] = useState(0)
  const [shortLessonId, setShortLessonId] = useState(0)
  const [shortStep, setShortStep] = useState(0)
  const [shortAnswer, setShortAnswer] = useState<number | null>(null)
  const [shortCompleted, setShortCompleted] = useState<number[]>(readShortCompletions)
  const [economy, setEconomy] = useState<EconomyState>(readEconomy)
  const [answer, setAnswer] = useState<number | null>(null)
  const [completed, setCompleted] = useState<number[]>([])
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [typed, setTyped] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [selfChecks, setSelfChecks] = useState([false, false, false])
  const [exitOpen, setExitOpen] = useState(false)
  const [audioUrl, setAudioUrl] = useState('')
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [conversationDone, setConversationDone] = useState(false)
  const [soundEffects, setSoundEffects] = useState(true)
  const [practiceReminders, setPracticeReminders] = useState(false)
  const recorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const audio = useRef<HTMLAudioElement | null>(null)
  const mission = missions[missionId - 1]
  const accountXp = 500 + completed.length * 50 + shortCompleted.length * 20 + economy.bossWins.length * 60 + (conversationDone ? 20 : 0)
  const lingo = Math.max(0, 120 + shortCompleted.length * 5 + economy.bossWins.length * 20 + economy.bonusLingo - economy.lingoSpent + (conversationDone ? 5 : 0))
  const dailyDone = Math.min(3, Number(shortCompleted.length > 0) + Number(completed.length > 0) + Number(conversationDone))
  const dailyBoxClaimed = economy.dailyBoxDate === localDateKey()

  useEffect(() => {
    let active = true
    void loadAppState().then((state) => {
      if (!active) return
      if (state) {
        setName(state.name)
        setLanguage(state.language)
        setGoal(state.goal)
        setStartingChoice(state.startingChoice)
        setCheckAnswers(state.checkAnswers)
        setStarterAnswer(state.starterAnswer)
        setHeroOptions(state.heroOptions)
        setActiveLevel(state.activeLevel)
        setCompleted(state.completed)
        setConversationDone(state.conversationDone)
        setSoundEffects(state.soundEffects)
        setPracticeReminders(state.practiceReminders)
        setOnboardingComplete(state.onboardingComplete)
        setView(state.onboardingComplete ? 'feed' : 'welcome')
      }
      setAppReady(true)
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!appReady) return
    const timer = window.setTimeout(() => {
      void saveAppState({
        name,
        language,
        goal,
        startingChoice,
        checkAnswers,
        starterAnswer,
        heroOptions,
        activeLevel,
        completed,
        conversationDone,
        soundEffects,
        practiceReminders,
        onboardingComplete,
      })
    }, 350)
    return () => window.clearTimeout(timer)
  }, [activeLevel, appReady, checkAnswers, completed, conversationDone, goal, heroOptions, language, name, onboardingComplete, practiceReminders, soundEffects, starterAnswer, startingChoice])

  useEffect(() => {
    try { window.localStorage.setItem(SHORT_COMPLETIONS_KEY, JSON.stringify(shortCompleted)) } catch { /* Local rewards must not block learning. */ }
  }, [shortCompleted])

  useEffect(() => {
    try { window.localStorage.setItem(ECONOMY_KEY, JSON.stringify(economy)) } catch { /* Local rewards must not block learning. */ }
  }, [economy])

  useEffect(() => {
    if (!recording) return
    const timer = window.setInterval(() => setSeconds((v) => v + 1), 1000)
    return () => window.clearInterval(timer)
  }, [recording])

  useEffect(() => {
    setAnswer(null); setRecording(false); setRecorded(false); setSeconds(0); setTyped(false); setTypedText(''); setSelfChecks([false, false, false]); setAudioPlaying(false)
  }, [lessonStep, missionId])

  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl) }, [audioUrl])

  async function toggleRecording() {
    if (recording) { recorder.current?.stop(); setRecording(false); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const next = new MediaRecorder(stream)
      chunks.current = []
      next.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data) }
      next.onstop = () => {
        const url = URL.createObjectURL(new Blob(chunks.current, { type: next.mimeType || 'audio/webm' }))
        setAudioUrl(url); setRecorded(true); stream.getTracks().forEach((track) => track.stop())
      }
      next.start(); recorder.current = next; setSeconds(0); setRecording(true)
    } catch { setRecording(false); setRecorded(false) }
  }

  function recordAgain() { audio.current?.pause(); setAudioPlaying(false); setRecorded(false); setSeconds(0); setAudioUrl('') }
  function playRecording() {
    if (!audioUrl) return
    if (!audio.current || audio.current.src !== audioUrl) { audio.current = new Audio(audioUrl); audio.current.onended = () => setAudioPlaying(false) }
    if (audioPlaying) audio.current.pause(); else void audio.current.play()
    setAudioPlaying((v) => !v)
  }
  function openMission(id: number) { setMissionId(id); setLessonStep(0); setView('lesson') }
  function openShortLesson(id: number) {
    setShortLessonId(id); setShortStep(0); setShortAnswer(null); setTypedText(''); setRecorded(false); setRecording(false); setSeconds(0); setAudioUrl(''); setView('short-lesson')
  }
  function finishShortLesson() {
    setShortCompleted((items) => items.includes(shortLessonId) ? items : [...items, shortLessonId])
    setView('feed')
  }
  function claimDailyBox() {
    if (dailyBoxClaimed) return
    setEconomy((value) => ({ ...value, bonusLingo: value.bonusLingo + 15, tickets: value.tickets + 1, dailyBoxDate: localDateKey() }))
  }
  function buyStoreItem(id: string, price: number) {
    if (economy.ownedItems.includes(id)) return 'owned' as const
    if (lingo < price) return 'insufficient' as const
    setEconomy((value) => ({ ...value, lingoSpent: value.lingoSpent + price, ownedItems: [...value.ownedItems, id] }))
    return 'bought' as const
  }
  function finishBoss(levelId: number) {
    setEconomy((value) => value.bossWins.includes(levelId) ? value : { ...value, bossWins: [...value.bossWins, levelId] })
    setView('level')
  }
  function finishMission() { setCompleted((items) => items.includes(missionId) ? items : [...items, missionId]); setView('world') }
  function selectLevel(id: number) { setActiveLevel(id); setView('level') }
  function startLevelCheck() { setCheckStep(0); setCheckAnswers([null, null, null, null, null]); setView('level-check') }

  const lessonProps = { mission, step: lessonStep, answer, onAnswer: setAnswer, recording, recorded, seconds, typed, typedText, selfChecks, audioPlaying, onRecord: toggleRecording, onRecordAgain: recordAgain, onPlay: playRecording, onTyped: () => setTyped((v) => !v), onText: setTypedText, onCheck: (index: number) => setSelfChecks((v) => v.map((x, i) => i === index ? !x : x)), onExit: () => setExitOpen(true), onNext: () => setLessonStep((v) => Math.min(8, v + 1)), onFinish: finishMission, onFeed: () => setView('feed') }

  if (!appReady) return <main className="stage"><section className="phone"><div className="sync-splash"><Logo/><span>{t('common.loadingProgress')}</span></div></section></main>

  return <main className="stage"><section className={`phone view-${view}`}>
    {view === 'welcome' && <Welcome onNext={() => setView('language')}/>}
    {view === 'language' && <Language value={language} onChange={setLanguage} onBack={() => setView('welcome')} onNext={() => setView('personalize')}/>}
    {view === 'personalize' && <Personalize name={name} goal={goal} onName={setName} onGoal={setGoal} onBack={() => setView('language')} onNext={() => setView('starting')}/>}
    {view === 'starting' && <StartingPoint choice={startingChoice} onChoice={setStartingChoice} onBack={() => setView('personalize')} onNext={() => startingChoice === 'check' ? startLevelCheck() : setView('starter')}/>}
    {view === 'level-check' && <LevelCheck step={checkStep} answer={checkAnswers[checkStep]} onAnswer={(value) => setCheckAnswers((items) => items.map((item, index) => index === checkStep ? value : item))} onBack={() => setView('starting')} onNext={() => checkStep < levelCheckTasks.length - 1 ? setCheckStep((value) => value + 1) : setView('recommendation')}/>}
    {view === 'recommendation' && <Recommendation onBack={() => setView('starting')} onNext={() => { setIntroReturn('recommendation'); setView('intro') }}/>}
    {view === 'starter' && <Starter answer={starterAnswer} onAnswer={setStarterAnswer} onBack={() => setView('starting')} onNext={() => { setIntroReturn('starter'); setView('intro') }}/>}
    {view === 'intro' && <Intro name={name || 'Alex'} onBack={() => setView(introReturn)} onNext={() => { setHeroReturn('feed'); setView('hero') }}/>}
    {view === 'hero' && <HeroBuilder
      part={heroPart}
      options={heroOptions}
      onOption={(option) => setHeroOptions((v) => v.map((x, i) => i === heroPart ? option : x))}
      onBack={() => heroPart ? setHeroPart(heroPart - 1) : setView(heroReturn === 'profile' ? 'profile' : 'intro')}
      onNext={() => {
        if (heroPart < 3) { setHeroPart(heroPart + 1); return }
        if (heroReturn === 'feed') setOnboardingComplete(true)
        setView(heroReturn)
      }}
    />}
    {view === 'feed' && <Feed name={name || 'Alex'} completed={completed} shortCompleted={shortCompleted} dailyDone={dailyDone} coins={lingo} boxClaimed={dailyBoxClaimed} onClaimBox={claimDailyBox} onShortLesson={openShortLesson} onStore={() => setView('store')} onMission={() => openMission(completed.length >= 20 ? 1 : completed.length + 1)} onNav={setView}/>}
    {view === 'journey' && <Journey completed={completed} coins={lingo} onWorld={() => setView('world')} onStore={() => setView('store')} onNav={setView}/>}
    {view === 'world' && <WorldOverview completed={completed} onBack={() => setView('journey')} onLevel={selectLevel}/>}
    {view === 'profile' && <Profile name={name || 'Alex'} language={language} completed={completed} shortCompleted={shortCompleted} heroOptions={heroOptions} conversationDone={conversationDone} xp={accountXp} lingo={lingo} ownedCount={economy.ownedItems.length} onEditProfile={() => setView('edit-profile')} onLanguage={() => setView('language-select')} onSettings={() => setView('settings')} onEditHero={() => { setHeroPart(0); setHeroReturn('profile'); setView('hero') }} onNav={setView}/>}
    {view === 'edit-profile' && <EditProfile name={name || 'Alex'} onBack={() => setView('profile')} onSave={(value) => { setName(value); setView('profile') }}/>}
    {view === 'language-select' && <LanguageSelect value={language} onBack={() => setView('profile')} onSave={(value) => { setLanguage(value); setView('profile') }}/>}
    {view === 'settings' && <Settings soundEffects={soundEffects} reminders={practiceReminders} onSound={setSoundEffects} onReminders={setPracticeReminders} onBack={() => setView('profile')} onAccount={() => setView('account')}/>}
    {view === 'account' && <AccountSettings onBack={() => setView('settings')}/>}
    {view === 'level' && <LevelScreen levelId={activeLevel} completed={completed} conversationDone={conversationDone} bossDone={economy.bossWins.includes(activeLevel)} onBack={() => setView('world')} onMission={openMission} onConversation={() => setView('conversation')} onBoss={() => setView('boss')}/>}
    {view === 'boss' && <BossMission levelId={activeLevel} onBack={() => setView('level')} onFinish={() => finishBoss(activeLevel)}/>}
    {view === 'conversation' && <MentorConversation name={name || 'Alex'} onBack={() => setView('level')} onDone={() => { setConversationDone(true); setView('level') }}/>}
    {view === 'lesson' && <Lesson {...lessonProps}/>}
    {view === 'short-lesson' && <ShortLesson short={omaritoShorts[shortLessonId]} step={shortStep} answer={shortAnswer} response={typedText} recording={recording} recorded={recorded} seconds={seconds} audioPlaying={audioPlaying} onAnswer={setShortAnswer} onResponse={setTypedText} onRecord={toggleRecording} onPlay={playRecording} onRecordAgain={recordAgain} onBack={() => setView('feed')} onNext={() => { setShortAnswer(null); setShortStep((value) => Math.min(4, value + 1)) }} onFinish={finishShortLesson}/>}
    {view === 'store' && <Store coins={lingo} tickets={economy.tickets} xp={accountXp} ownedItems={economy.ownedItems} seasonDays={Math.min(30, completed.length + shortCompleted.length + economy.bossWins.length)} onBuy={buyStoreItem} onBack={() => setView('feed')}/>}
    {exitOpen && <ExitModal onStay={() => setExitOpen(false)} onLeave={() => { setExitOpen(false); setView('feed') }}/>}
  </section></main>
}

function Welcome({ onNext }: { onNext: () => void }) { const { t } = useTranslation(); return <div className="onboarding welcome"><div className="welcome-toolbar"><Logo/><LocaleSwitcher compact/></div><div className="welcome-art"><span/><img src={`${A}/welcome-leopard.png`} alt=""/></div><h1>{t('welcome.title')}<br/><em>{t('welcome.emphasis')}</em></h1><p>{t('welcome.description')}</p><button className="primary" onClick={onNext}>{t('welcome.getStarted')} <Icon name="arrow"/></button><small>{t('welcome.terms')}</small></div> }
function Top({ title, onBack, step }: { title: string; onBack: () => void; step?: string }) { const { t } = useTranslation(); return <header className="top"><button onClick={onBack} aria-label={t('common.back')}><Icon name="back"/></button><span>{step || title}</span><i/></header> }
function Language({ value, onChange, onBack, onNext }: { value: string; onChange: (v: string) => void; onBack: () => void; onNext: () => void }) { const { t } = useTranslation(); return <div className="onboarding form-screen"><Top title={t('onboarding.startingPoint')} onBack={onBack}/><div className="form-copy"><span className="kicker">{t('onboarding.step1')}</span><h1>{t('onboarding.chooseLanguage')}</h1><p>{t('onboarding.whatLearn')}</p></div><div className="choice-list">{languages.map(([flag, label]) => <button className={value === label ? 'selected' : ''} onClick={() => onChange(label)} key={label}><img src={`${A}/${flag}`} alt=""/><span>{t(`learningLanguages.${label}`)}</span><i>{value === label && <Icon name="check" size={15}/>}</i></button>)}</div><button className="primary pinned" onClick={onNext}>{t('common.continue')}</button></div> }
function Personalize({ name, goal, onName, onGoal, onBack, onNext }: { name: string; goal: string; onName: (v: string) => void; onGoal: (v: string) => void; onBack: () => void; onNext: () => void }) { const { t } = useTranslation(); return <div className="onboarding form-screen"><Top title={t('onboarding.startingPoint')} onBack={onBack}/><div className="form-copy"><span className="kicker">{t('onboarding.step2')}</span><h1>{t('onboarding.makePersonal')}</h1><label>{t('onboarding.yourName')}<input value={name} onChange={(e) => onName(e.target.value)} placeholder={t('onboarding.yourName')}/></label><p>{t('onboarding.whereHelp')}</p></div><div className="choice-list goal-list">{goals.map((item) => <button className={goal === item.value ? 'selected' : ''} onClick={() => onGoal(item.value)} key={item.value}><span>{t(item.labelKey)}</span><i>{goal === item.value && <Icon name="check" size={15}/>}</i></button>)}</div><button className="primary pinned" disabled={!name.trim() || !goal} onClick={onNext}>{t('common.continue')}</button></div> }

function StartingPoint({ choice, onChoice, onBack, onNext }: { choice: 'scratch' | 'check' | ''; onChoice: (value: 'scratch' | 'check') => void; onBack: () => void; onNext: () => void }) {
  const { t } = useTranslation()
  return <div className="concept-screen starting-point"><div className="concept-hero"><Top title={t('starting.course')} onBack={onBack}/><h1>{t('starting.title')}</h1><p>🇬🇧 {t('starting.course')}</p></div><div className="start-options"><button className={choice === 'scratch' ? 'selected' : ''} onClick={() => onChoice('scratch')}><span>⚑</span><div><b>{t('starting.scratch')}</b><small>{t('starting.scratchDescription')}</small></div><i>{choice === 'scratch' && <Icon name="check" size={14}/>}</i></button><button className={choice === 'check' ? 'selected' : ''} onClick={() => onChoice('check')}><span>☷</span><div><b>{t('starting.check')}</b><small>{t('starting.checkDescription')}</small></div><i>{choice === 'check' && <Icon name="check" size={14}/>}</i></button></div><small className="concept-note">{t('starting.optional')}</small><button className="primary concept-foot" disabled={!choice} onClick={onNext}>{t('common.continue')}</button></div>
}

function LevelCheck({ step, answer, onAnswer, onBack, onNext }: { step: number; answer: number | null; onAnswer: (value: number) => void; onBack: () => void; onNext: () => void }) {
  const { t } = useTranslation()
  const [exitOpen, setExitOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const task = levelCheckTasks[step]
  function playPrompt() {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel(); setPlaying(true)
    const utterance = new SpeechSynthesisUtterance('My name is Alex.')
    utterance.lang = 'en-US'; utterance.onend = () => setPlaying(false); window.speechSynthesis.speak(utterance)
  }
  return <div className="concept-screen level-check"><header className="check-top"><button onClick={() => setExitOpen(true)}><Icon name="back"/></button><span>{t('levelCheck.title')}</span><small>{t('levelCheck.progress', { current: step + 1, total: levelCheckTasks.length })}</small></header><div className="check-progress"><i style={{ width: `${(step + 1) / levelCheckTasks.length * 100}%` }}/></div><h2>{task.title}</h2><div className={`check-prompt ${task.prompt === 'audio' ? 'audio' : ''}`}>{task.prompt === 'audio' ? <button onClick={playPrompt}><Icon name={playing ? 'pause' : 'play'}/><Wave active={playing}/></button> : task.prompt}</div><div className="check-options">{task.options.map((option, index) => <button className={answer === index ? 'selected' : ''} onClick={() => onAnswer(index)} key={option}>{option}{answer === index && <Icon name="check" size={15}/>}</button>)}</div><button className={`unsure ${answer === -1 ? 'selected' : ''}`} onClick={() => onAnswer(-1)}>{t('levelCheck.unsure')}</button><button className="primary concept-foot" disabled={answer === null} onClick={onNext}>{t('common.continue')}</button>{exitOpen && <div className="modal-backdrop"><div className="exit-modal"><h2>{t('levelCheck.leaveTitle')}</h2><p>{t('levelCheck.saved')}</p><button className="primary" onClick={() => setExitOpen(false)}>{t('levelCheck.keepGoing')}</button><button className="secondary" onClick={onBack}>{t('common.leave')}</button></div></div>}</div>
}

function Recommendation({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 850); return () => window.clearTimeout(timer) }, [])
  if (loading) return <div className="concept-screen recommendation"><Top title={t('levelCheck.title')} onBack={onBack}/><div className="recommend-loading"><i/><h1>{t('recommendation.finding')}</h1><p>{t('recommendation.findingDescription')}</p></div></div>
  return <div className="concept-screen recommendation"><Top title={t('onboarding.startingPoint')} onBack={onBack}/><div className="recommend-card"><small>{t('recommendation.suggested')}</small><span>🌱</span><h1>NOVA</h1><p>{t('recommendation.cardDescription')}</p></div><p className="recommend-copy">{t('recommendation.description')}</p><button className="primary concept-foot" onClick={onNext}>{t('recommendation.start')}</button></div>
}

function Scene({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  if (failed) return <div className="scene-unavailable"><Icon name="sound" size={30}/><h3>{t('scene.unavailable')}</h3><p>{t('scene.readInstead')}<br/>“I usually play football with friends. At the moment, I am learning to take better photos.”</p><button className="secondary" onClick={() => setFailed(false)}>{t('scene.tryAgain')}</button></div>
  return <div className={`video ${compact ? 'compact' : ''} ${playing ? 'playing' : ''}`}><img src={`${A}/actor-scene.png`} alt="Maya" onError={() => setFailed(true)}/><button className="scene-play" aria-label={playing ? t('scene.pause') : t('scene.play')} onClick={() => setPlaying((value) => !value)}><Icon name={playing ? 'pause' : 'play'} size={21}/></button><div className="video-progress"><i className={playing ? 'playing' : ''}/></div></div>
}
function Answer({ label, state, onClick }: { label: string; state?: string; onClick: () => void }) { return <button className={`lesson-option ${state || ''}`} onClick={onClick}>{label}{state === 'right' && <Icon name="check" size={17}/>} {state === 'wrong' && <Icon name="close" size={17}/>}</button> }
function Starter({ answer, onAnswer, onBack, onNext }: { answer: number | null; onAnswer: (v: number) => void; onBack: () => void; onNext: () => void }) { const { t } = useTranslation(); const options = ['Playing football', 'Learning photography', 'Starting a new job']; return <div className="starter"><Top title={t('onboarding.startingPoint')} onBack={onBack}/><Scene/><div className="sheet"><span className="kicker">{t('lesson.tinyCheck')}</span><h2>What is new in his life?</h2>{options.map((item, i) => <Answer key={item} label={item} state={answer === i ? i === 1 ? 'right' : 'wrong' : answer !== null ? 'dim' : ''} onClick={() => onAnswer(i)}/>)}{answer !== null && <p className={answer === 1 ? 'success-copy' : 'retry-copy'}>{answer === 1 ? t('lesson.correct') : t('lesson.tryListening')}</p>}<button className="primary" disabled={answer !== 1} onClick={onNext}>{t('common.continue')}</button></div></div> }
function Intro({ name, onBack, onNext }: { name: string; onBack: () => void; onNext: () => void }) { const { t } = useTranslation(); return <div className="intro"><Top title={t('intro.top')} onBack={onBack}/><img className="intro-hero" src={`${A}/hero-jump.png`} alt="Omarito"/><span className="kicker">{t('intro.kicker')}</span><h1>{t('intro.title')}</h1><p>{t('intro.description')}</p><div className="intro-card"><small>{t('intro.mission')}</small><strong>{t('intro.missionTitle')}</strong></div><button className="primary" onClick={onNext}>{t('intro.createHero')}</button><small className="hint">{t('intro.hint', { name })}</small></div> }

function HeroBuilder({ part, options, onOption, onBack, onNext }: { part: number; options: number[]; onOption: (v: number) => void; onBack: () => void; onNext: () => void }) {
  const { t } = useTranslation()
  const labels = [t('hero.eyes'), t('hero.nose'), t('hero.smile'), t('hero.clothes')]
  const optionSets = [
    ['eyes-1.png','eyes-2.png','eyes-3.png','eyes-4.png','eyes-2.png','eyes-1.png'],
    ['nose-1.png','nose-2.png','nose-3.png','nose-4.png','nose-5.png','nose-6.png'],
    ['mouth-1.png','mouth-2.png','mouth-3.png','mouth-4.png','mouth-5.png','mouth-6.png'],
    ['clothes-hoodie.png','clothes-hoodie.png','clothes-hoodie.png','clothes-hoodie.png','clothes-hoodie.png','clothes-hoodie.png'],
  ]
  return <div className="hero-builder"><Top title={t('hero.title')} onBack={onBack} step={`${part + 1}/4`}/><h1>{labels[part]}</h1><div className={`hero-preview preview-part-${part}`}><div className={`hero-halo tone-${options[3]}`}/>{part < 3 ? <Avatar className="hero-head-avatar" options={options}/> : <HeroVisual options={options}/>}</div><div className="custom-tabs">{['eyes-1.png','nose-1.png','mouth-1.png','clothes-hoodie.png'].map((asset, i) => <span className={part === i ? 'active' : ''} key={asset}><img src={`${A}/${asset}`} alt=""/></span>)}</div><div className="custom-grid">{optionSets[part].map((asset, i) => <button className={options[part] === i ? 'selected' : ''} key={`${asset}-${i}`} onClick={() => onOption(i)}><img className={`preview-part-${part} option-${i}`} src={`${A}/${asset}`} alt={t('hero.option', { part: labels[part], number: i + 1 })}/></button>)}</div><div className="builder-actions"><button className="secondary" onClick={onBack}>{t('common.back')}</button><button className="primary" onClick={onNext}>{part === 3 ? t('common.continue') : t('common.next')}</button></div></div>
}

function AppHeader({ subtitle, coins, onStore }: { subtitle: string; coins: number; onStore: () => void }) { const { t } = useTranslation(); return <header className="app-header"><Avatar/><div><b>Omarito</b><small>{subtitle}</small></div><button className="app-coins" onClick={onStore} aria-label={t('store.open')}><img src={`${A}/coin.png`} alt=""/> {coins}</button></header> }
function BottomNav({ active, onNav }: { active: MainView; onNav: (v: View) => void }) { const { t } = useTranslation(); return <nav className="bottom-nav"><button className={active === 'feed' ? 'active' : ''} onClick={() => onNav('feed')}><Icon name="home"/><span>{t('nav.feed')}</span></button><button className={active === 'journey' ? 'active' : ''} onClick={() => onNav('journey')}><Icon name="journey"/><span>{t('nav.journey')}</span></button><button className={active === 'profile' ? 'active' : ''} onClick={() => onNav('profile')}><Icon name="profile"/><span>{t('nav.profile')}</span></button></nav> }
function Feed({ name, completed, shortCompleted, dailyDone, coins, boxClaimed, onClaimBox, onShortLesson, onStore, onMission, onNav }: { name: string; completed: number[]; shortCompleted: number[]; dailyDone: number; coins: number; boxClaimed: boolean; onClaimBox: () => void; onShortLesson: (id: number) => void; onStore: () => void; onMission: () => void; onNav: (v: View) => void }) {
  const { t } = useTranslation()
  const [playing, setPlaying] = useState(false)
  const [videoIndex, setVideoIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const next = missions[Math.min(completed.length, 19)]
  const short = omaritoShorts[videoIndex]

  useEffect(() => {
    videoRef.current?.pause()
    videoRef.current?.load()
    setPlaying(false)
  }, [videoIndex])

  function toggleVideo() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play().catch(() => setPlaying(false))
    else video.pause()
  }

  return <div className="app-view feed"><AppHeader subtitle={t('header.storyStarts')} coins={coins} onStore={onStore}/><div className={`feed-media ${playing ? 'playing' : ''}`}>
    <video key={short.id} ref={videoRef} playsInline preload="metadata" poster={short.poster}
      onPlay={(event) => { if (event.currentTarget.textTracks[0]) event.currentTarget.textTracks[0].mode = 'showing'; setPlaying(true) }}
      onPause={(event) => { if (event.currentTarget.textTracks[0]) event.currentTarget.textTracks[0].mode = 'hidden'; setPlaying(false) }}
      onEnded={(event) => { if (event.currentTarget.textTracks[0]) event.currentTarget.textTracks[0].mode = 'hidden'; setPlaying(false) }}>
      <source src={short.source} type="video/mp4"/>
      <track kind="captions" src={short.captions} srcLang="en" label="English & Russian"/>
    </video>
    <div className="short-top"><span><Icon name="spark" size={14}/> {t('shorts.badge')}</span><small>{t('shorts.counter', { current: videoIndex + 1, total: omaritoShorts.length })}</small></div>
    <button className="big-play" aria-label={playing ? t('feed.pause') : t('feed.play')} onClick={toggleVideo}><Icon name={playing ? 'pause' : 'play'} size={24}/></button>
    <div className="short-copy"><b>{t(short.titleKey)}</b><small>{t(short.takeawayKey)}</small></div>
    <div className="short-picker">{omaritoShorts.map((item, index) => <button className={index === videoIndex ? 'active' : ''} key={item.id} aria-label={t('shorts.open', { number: index + 1 })} onClick={() => setVideoIndex(index)}><i/></button>)}</div>
  </div><div className="feed-sheet"><div className="daily-loop"><span>{t('feed.dailyPlan')}</span><b>{dailyDone}/3</b><div><i style={{ width: `${dailyDone / 3 * 100}%` }}/></div></div><button className={`daily-box ${boxClaimed ? 'claimed' : ''}`} disabled={boxClaimed} onClick={onClaimBox}><span>🎁</span><div><small>{t('feed.dailyBox')}</small><b>{boxClaimed ? t('feed.boxClaimed') : t('feed.boxReward')}</b></div><strong>{boxClaimed ? <Icon name="check" size={15}/> : t('feed.claim')}</strong></button><button className="short-practice" onClick={() => onShortLesson(videoIndex)}><span><Icon name={shortCompleted.includes(videoIndex) ? 'check' : 'spark'} size={15}/></span><div><small>{t('shorts.lesson')}</small><b>{shortCompleted.includes(videoIndex) ? t('shorts.review') : t('shorts.practice')}</b></div><Icon name="arrow" size={17}/></button><span className="kicker">{t('feed.upNext', { number: String(next.id).padStart(2,'0') })}</span><h1>{completed.length ? t('feed.keepGoing', { name }) : t('feed.firstTitle')}</h1><p>{completed.length ? next.title : t('feed.firstDescription')}</p><button className="primary" onClick={onMission}>{completed.length ? t('feed.continue') : t('feed.start')} <Icon name="arrow"/></button></div><BottomNav active="feed" onNav={onNav}/></div>
}

function Journey({ completed, coins, onWorld, onStore, onNav }: { completed: number[]; coins: number; onWorld: () => void; onStore: () => void; onNav: (v: View) => void }) { const { t } = useTranslation(); return <div className="app-view journey"><AppHeader subtitle={t('header.mapProgress')} coins={coins} onStore={onStore}/><div className="view-title"><h1>{t('journey.title')}</h1><p>{t('journey.description')}</p></div><div className="world-path">{worlds.map(([name, descriptionKey], index) => <button className={index === 0 ? 'active' : ''} disabled={index > 0} onClick={index === 0 ? onWorld : undefined} key={name}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{name}</b><small>{t(descriptionKey)}</small></div><strong>{index === 0 ? `${completed.length}/20` : t('journey.locked')}</strong></button>)}</div><div className="journey-summary"><span>{t('journey.progress')}</span><b>{Math.round(completed.length / 20 * 100)}%</b><div><i style={{ width: `${completed.length / 20 * 100}%` }}/></div><small>{t('journey.missions', { current: completed.length, total: 20 })}</small></div><BottomNav active="journey" onNav={onNav}/></div> }
function WorldOverview({ completed, onBack, onLevel }: { completed: number[]; onBack: () => void; onLevel: (id: number) => void }) { const { t } = useTranslation(); return <div className="world-screen"><div className="world-hero"><Top title="NOVA" onBack={onBack}/><span className="kicker light">WORLD 01</span><h1>NOVA</h1><p>{t('world.description')}</p><div className="world-progress"><span>{t('world.progress')}</span><b>{completed.length}/20</b><div><i style={{ width: `${completed.length / 20 * 100}%` }}/></div></div></div><section className="level-cards"><h2>{t('world.levels')}</h2>{levels.map((level) => { const done = missions.filter((m) => m.level === level.id && completed.includes(m.id)).length; return <button key={level.id} onClick={() => onLevel(level.id)} style={{ '--level-color': level.color } as CSSProperties}><span>{level.id}</span><div><small>{t('world.level', { number: level.id }).toUpperCase()}</small><b>{level.title}</b><p>{level.subtitle}</p><i><em style={{ width: `${done * 20}%` }}/></i></div><strong>+{[12,18,24,30][level.id - 1]}%</strong><Icon name="arrow" size={18}/></button>})}</section></div> }
function LevelScreen({ levelId, completed, conversationDone, bossDone, onBack, onMission, onConversation, onBoss }: { levelId: number; completed: number[]; conversationDone: boolean; bossDone: boolean; onBack: () => void; onMission: (id: number) => void; onConversation: () => void; onBoss: () => void }) {
  const { t } = useTranslation()
  const level = levels[levelId - 1]
  const items = missions.filter((m) => m.level === levelId)
  const completeCount = items.filter((m) => completed.includes(m.id)).length
  const medals = ['badge-bronze.png','badge-silver.png','badge-gold.png','badge-legend.png']
  const medalLabels = [t('world.bronze'), t('world.silver'), t('world.gold'), t('world.legend')]
  return <div className="level-screen"><div className="level-hero" style={{ '--level-color': level.color } as CSSProperties}><Top title={t('world.level', { number: level.id })} onBack={onBack}/><span className="kicker light">{t('world.level', { number: level.id }).toUpperCase()}</span><h1>{level.title}</h1><p>{level.subtitle}</p><div className="level-progress-label"><span>{t('world.levelProgress')}</span><b>{1000 + completeCount * 160 + (conversationDone ? 20 : 0) + (bossDone ? 60 : 0)} / 1800</b></div><div className="level-progress"><i style={{ width: `${Math.min(100, 55 + completeCount * 9 + (conversationDone ? 2 : 0) + (bossDone ? 4 : 0))}%` }}/></div><div className="medals">{medalLabels.map((label, i) => <span key={label}><img src={`${A}/${medals[i]}`} alt=""/><small>{label}</small></span>)}</div></div><div className="mission-list">{levelId === 1 && <button className="mentor-card" onClick={onConversation}><img src={`${A}/hero-standing.png`} alt="Omarito"/><div><small>{t('world.speak')}</small><b>{t('world.introduce')}</b><p>{t('world.introduceDescription')}</p></div><strong>{conversationDone ? t('world.done') : t('world.startTalking')}</strong></button>}<h2>{t('world.missions')} <small>{completeCount}/5</small></h2>{items.map((item, i) => { const done = completed.includes(item.id); const percent = done ? 100 : [64,52,40,28,12][i]; return <button key={item.id} onClick={() => onMission(item.id)}><span className={done ? 'done' : ''}>{done ? <Icon name="check" size={15}/> : String(i + 1).padStart(2,'0')}</span><div><b>{item.title}</b><small>{t('world.skills')}</small></div><em>{percent}%</em><strong>+{[12,15,18,21,24][i]}%</strong></button>})}<button className={`boss-card ${bossDone ? 'done' : ''}`} disabled={completeCount < 5 || bossDone} onClick={onBoss}><img src={`${A}/badge-legend.png`} alt=""/><div><small>{t('world.bossLabel')}</small><b>{t('world.bossTitle')}</b><p>{completeCount < 5 ? t('world.bossLocked', { count: completeCount }) : bossDone ? t('world.bossDone') : t('world.bossReady')}</p></div><strong>{bossDone ? <Icon name="check" size={16}/> : '+60 XP'}</strong></button></div></div>
}

function Profile({ name, language, completed, shortCompleted, heroOptions, conversationDone, xp, lingo, ownedCount, onEditProfile, onLanguage, onSettings, onEditHero, onNav }: { name: string; language: string; completed: number[]; shortCompleted: number[]; heroOptions: number[]; conversationDone: boolean; xp: number; lingo: number; ownedCount: number; onEditProfile: () => void; onLanguage: () => void; onSettings: () => void; onEditHero: () => void; onNav: (v: View) => void }) {
  const { t } = useTranslation()
  const selectedLanguage = languages.find(([, label]) => label === language) || languages[0]
  const rank = ['CUB', 'SCOUT', 'EXPLORER', 'VOYAGER', 'GUARDIAN', 'LEGEND'][Math.min(5, Math.floor(Math.max(0, xp - 500) / 250))]
  const achievements = [
    ['🌱', 'profile.firstMission', completed.length > 0],
    ['🎬', 'profile.shortLearner', shortCompleted.length > 0],
    ['🎙️', 'profile.speakUp', conversationDone],
  ] as const
  return <div className="app-view profile"><header className="profile-top"><span/><h1>{t('profile.title')}</h1><button aria-label={t('profile.settings')} onClick={onSettings}><Icon name="gear"/></button></header><div className="profile-head"><Avatar options={heroOptions}/><div><h2>{name} <button onClick={onEditProfile} aria-label={t('profile.edit')}><Icon name="edit" size={15}/></button></h2><p>{t('profile.learningDaily')}</p></div><strong className="hero-rank">{rank}</strong></div><div className="account-progress"><span>{t('profile.accountLevel')}</span><b>{t('profile.level', { number: 3 })}</b><div><i style={{ width: `${Math.min(100, xp / 8)}%` }}/></div><small>{xp} / 800 XP</small></div><div className="stat-row"><span><b>{xp}</b><small>XP</small></span><span><b>{lingo}</b><small>Lingo</small></span><span><b>{ownedCount}</b><small>{t('profile.items')}</small></span></div><section className="achievements"><h2>{t('profile.achievements')} <small>{achievements.filter(([, , unlocked]) => unlocked).length}/3</small></h2><div>{achievements.map(([icon, key, unlocked]) => <span className={unlocked ? 'unlocked' : ''} key={key}><b>{icon}</b><small>{t(key)}</small>{unlocked && <Icon name="check" size={12}/>}</span>)}</div></section><button className="learning-card learning-button" onClick={onLanguage}><span>{t('profile.learning')}</span><h2><img src={`${A}/${selectedLanguage[0]}`} alt=""/> {t(`learningLanguages.${language}`)}<Icon name="arrow" size={16}/></h2><p>{t('profile.beginner')}</p><hr/><div className="learning-world"><span>NOVA</span><b>{t('profile.worldProgress')}</b></div><div><i style={{ width: '40%' }}/></div></button><button className="edit-hero-wide" onClick={onEditHero}><Avatar options={heroOptions}/>{t('profile.customize')} <Icon name="arrow"/></button><BottomNav active="profile" onNav={onNav}/></div>
}

function EditProfile({ name, onBack, onSave }: { name: string; onBack: () => void; onSave: (value: string) => void }) {
  const { t } = useTranslation()
  const [value, setValue] = useState(name)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  function save() { if (!value.trim()) { setError(t('editProfile.required')); return } setSaving(true); window.setTimeout(() => onSave(value.trim()), 450) }
  return <div className="concept-screen settings-screen"><Top title={t('editProfile.title')} onBack={onBack}/><div className="edit-profile-art"><Avatar/><button aria-label={t('editProfile.changeAvatar')}><Icon name="edit" size={15}/></button></div><label className="field-label">{t('editProfile.name')}<input value={value} onChange={(event) => { setValue(event.target.value); setError('') }} maxLength={32}/></label>{error && <p className="field-error">{error}</p>}<button className="primary concept-foot" disabled={saving || value.trim() === name} onClick={save}>{saving ? t('common.saving') : t('common.save')}</button><button className="secondary" onClick={onBack}>{t('common.cancel')}</button></div>
}

function LanguageSelect({ value, onBack, onSave }: { value: string; onBack: () => void; onSave: (value: string) => void }) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(value)
  return <div className="concept-screen language-select"><div className="concept-hero"><Top title={t('onboarding.chooseLanguage')} onBack={onBack}/><h1>{t('onboarding.chooseLanguage')}</h1><p>{t('onboarding.whatLearn')}</p></div><div className="language-options">{languages.map(([flag, label], index) => <button className={selected === label ? 'selected' : ''} onClick={() => setSelected(label)} key={label}><img src={`${A}/${flag}`} alt=""/><span><b>{t(`learningLanguages.${label}`)}</b><small>{index ? 'NOVA · 15%' : 'NOVA · 40%'}</small></span><i>{selected === label && <Icon name="check" size={14}/>}</i></button>)}</div><button className="primary concept-foot" onClick={() => onSave(selected)}>{t('common.continue')}</button></div>
}

function Settings({ soundEffects, reminders, onSound, onReminders, onBack, onAccount }: { soundEffects: boolean; reminders: boolean; onSound: (value: boolean) => void; onReminders: (value: boolean) => void; onBack: () => void; onAccount: () => void }) {
  const { t } = useTranslation()
  const [logoutOpen, setLogoutOpen] = useState(false)
  return <div className="concept-screen settings-screen"><Top title={t('settings.title')} onBack={onBack}/><section className="interface-language"><span>{t('locale.label')}</span><LocaleSwitcher/></section><div className="settings-list"><label><span><Icon name="sound"/>{t('settings.sound')}</span><input type="checkbox" checked={soundEffects} onChange={(event) => onSound(event.target.checked)}/><i/></label><label><span>○ {t('settings.reminders')}</span><input type="checkbox" checked={reminders} onChange={(event) => onReminders(event.target.checked)}/><i/></label><button onClick={onAccount}><span><Icon name="profile"/>{t('settings.account')}</span><Icon name="arrow" size={16}/></button><button><span>◇ {t('settings.privacy')}</span><Icon name="arrow" size={16}/></button><button><span>□ {t('settings.terms')}</span><Icon name="arrow" size={16}/></button><button onClick={() => setLogoutOpen(true)}><span>↪ {t('settings.logout')}</span><Icon name="arrow" size={16}/></button></div>{logoutOpen && <div className="modal-backdrop"><div className="exit-modal"><h2>{t('settings.logoutTitle')}</h2><p>{t('settings.logoutDescription')}</p><button className="primary" onClick={() => setLogoutOpen(false)}>{t('settings.stay')}</button><button className="secondary" onClick={() => setLogoutOpen(false)}>{t('settings.logout')}</button></div></div>}</div>
}

function AccountSettings({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation()
  const [deleteOpen, setDeleteOpen] = useState(false)
  return <div className="concept-screen settings-screen"><Top title={t('account.title')} onBack={onBack}/><div className="account-email"><small>{t('account.label')}</small><b>{t('account.guest')}</b><p>{backendConfigured ? t('account.synced') : t('account.local')}</p></div><button className="delete-account" onClick={() => setDeleteOpen(true)}>⌫ {t('account.delete')} <Icon name="arrow" size={16}/></button>{deleteOpen && <div className="modal-backdrop"><div className="exit-modal danger-modal"><h2>{t('account.deleteTitle')}</h2><p>{t('account.deleteDescription')}</p><button className="primary" onClick={() => setDeleteOpen(false)}>{t('account.keep')}</button><button className="secondary" onClick={() => setDeleteOpen(false)}>{t('common.close')}</button></div></div>}</div>
}

type MentorPhase = 'name' | 'review-name' | 'waiting' | 'country' | 'review-country' | 'correction' | 'feeling' | 'review-feeling' | 'final' | 'complete'
type MentorKey = 'name' | 'country' | 'feeling'

function MentorConversation({ name, onBack, onDone }: { name: string; onBack: () => void; onDone: () => void }) {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<MentorPhase>('name')
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [typed, setTyped] = useState(false)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<'mic' | 'no-speech' | ''>('')
  const [audioUrl, setAudioUrl] = useState('')
  const [responses, setResponses] = useState<Record<MentorKey, string>>({ name: `Hi, I’m ${name}.`, country: 'I from Kazakhstan.', feeling: 'I’m feeling good.' })
  const mentorRecorder = useRef<MediaRecorder | null>(null)
  const mentorChunks = useRef<Blob[]>([])
  const mentorStream = useRef<MediaStream | null>(null)

  const key: MentorKey = phase.includes('country') || phase === 'correction' ? 'country' : phase.includes('feeling') || phase === 'final' ? 'feeling' : 'name'
  useEffect(() => { if (!recording) return; const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000); return () => window.clearInterval(timer) }, [recording])
  useEffect(() => () => { mentorRecorder.current?.stop(); mentorStream.current?.getTracks().forEach((track) => track.stop()); if (audioUrl) URL.revokeObjectURL(audioUrl) }, [audioUrl])

  function speak(text: string) { if (!('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-US'; window.speechSynthesis.speak(utterance) }
  function readyPhase(): MentorPhase { return key === 'name' ? 'review-name' : key === 'country' ? 'review-country' : 'review-feeling' }
  async function toggleRecord() {
    if (recording) {
      mentorRecorder.current?.stop(); setRecording(false)
      if (seconds < 1) { setError('no-speech'); return }
      setPhase(readyPhase()); return
    }
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') throw new Error('Microphone unavailable')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); mentorStream.current = stream
      const next = new MediaRecorder(stream); mentorChunks.current = []
      next.ondataavailable = (event) => { if (event.data.size) mentorChunks.current.push(event.data) }
      next.onstop = () => { if (mentorChunks.current.length) { if (audioUrl) URL.revokeObjectURL(audioUrl); setAudioUrl(URL.createObjectURL(new Blob(mentorChunks.current, { type: next.mimeType || 'audio/webm' }))) } stream.getTracks().forEach((track) => track.stop()) }
      next.start(); mentorRecorder.current = next; setSeconds(0); setError(''); setRecording(true)
    } catch { setError('mic'); setTyped(true) }
  }
  function submitTyped() { if (!draft.trim()) return; setResponses((items) => ({ ...items, [key]: draft.trim() })); setDraft(''); setTyped(false); setPhase(readyPhase()) }
  function playRecorded() { if (audioUrl) void new Audio(audioUrl).play(); else speak(responses[key]) }
  function sendReview() {
    if (phase === 'review-name') { setPhase('waiting'); window.setTimeout(() => setPhase('country'), 750); return }
    if (phase === 'review-country') { setPhase('correction'); return }
    setPhase('final')
  }
  function resetInput() { setRecording(false); setSeconds(0); setTyped(false); setDraft(''); setError(''); if (phase.startsWith('review-')) setPhase(key) }

  if (phase === 'complete') return <div className="mentor-complete"><h1>{t('mentor.complete')}</h1><div className="reward-art"><img src={`${A}/badge-gold.png`} alt=""/><img src={`${A}/coin.png`} alt=""/></div><h2>{t('mentor.introduced')}</h2><p>{t('mentor.niceWork', { name })}</p><div className="reward-row"><span>⭐ +20 XP</span><span>🪙 +5 Lingo</span></div><div className="next-time"><small>{t('mentor.nextTime')}</small><b>{t('mentor.correction')}</b></div><button className="primary" onClick={onDone}>{t('common.continue')}</button><button className="secondary" onClick={() => { setPhase('name'); resetInput() }}>{t('mentor.practiceAgain')}</button></div>

  const afterName = !['name','review-name'].includes(phase)
  const afterCountry = ['correction','feeling','review-feeling','final'].includes(phase)
  return <div className="mentor-conversation"><header className="mentor-top"><button onClick={onBack} aria-label={t('common.back')}><Icon name="back"/></button><img src={`${A}/hero-head.png`} alt="Omarito"/><div><b>Omarito</b><small>{t('mentor.introductions')}</small></div></header><div className="mentor-thread"><MentorBubble label="Omarito" text={`Hi! I’m Omarito. What’s your name?`} onReplay={() => speak(`Hi! I’m Omarito. What’s your name?`)}/>{afterName && <MentorBubble mine label={t('mentor.you')} text={responses.name} onReplay={() => speak(responses.name)}/>} {afterName && <MentorBubble label="Omarito" text={`Nice to meet you, ${name}! Where are you from?`} onReplay={() => speak(`Nice to meet you, ${name}! Where are you from?`)}/>} {afterCountry && <MentorBubble mine label={t('mentor.you')} text={responses.country} onReplay={() => speak(responses.country)}/>} {afterCountry && <MentorBubble correction label={t('mentor.try')} text={`I’m from Kazakhstan.`} onReplay={() => speak(`I’m from Kazakhstan.`)}/>} {['feeling','review-feeling','final'].includes(phase) && <MentorBubble label="Omarito" text={`How are you feeling today, ${name}?`} onReplay={() => speak(`How are you feeling today, ${name}?`)}/>} {phase === 'final' && <MentorBubble mine label={t('mentor.you')} text={responses.feeling} onReplay={() => speak(responses.feeling)}/>} {phase === 'final' && <MentorBubble label="Omarito" text={`Great! It was nice talking with you, ${name}.`} onReplay={() => speak(`Great! It was nice talking with you, ${name}.`)}/>}</div>{phase === 'waiting' ? <div className="mentor-wait"><i/><span>{t('mentor.thinking')}</span></div> : phase === 'correction' ? <div className="mentor-actions"><button className="primary" onClick={() => setPhase('feeling')}>{t('common.continue')}</button></div> : phase === 'final' ? <div className="mentor-actions"><button className="primary" onClick={() => setPhase('complete')}>{t('mentor.finish')}</button></div> : phase.startsWith('review-') ? <div className="mentor-review"><b>{t('mentor.review')}</b><button className="review-audio" onClick={playRecorded}><Icon name="play"/><Wave/><small>0:{String(Math.max(seconds, 4)).padStart(2, '0')}</small></button><p>{responses[key]}</p><div><button className="primary" onClick={sendReview}>{t('mentor.send')}</button><button className="secondary" onClick={resetInput}>{t('lesson.recordAgain')}</button></div></div> : <div className="mentor-input">{error === 'no-speech' && <p className="mentor-error">{t('mentor.noSpeech')}</p>}{error === 'mic' && <p className="mentor-error">{t('mentor.microphone')}</p>}{typed ? <div className="mentor-type"><input autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={t('mentor.typeReply')}/><button className="primary" disabled={!draft.trim()} onClick={submitTyped}>{t('mentor.send')}</button></div> : <button className={`mentor-mic ${recording ? 'recording' : ''}`} onClick={toggleRecord}><Icon name={recording ? 'pause' : 'mic'} size={28}/></button>}<b>{recording ? `${seconds}s · ${t('lesson.tapStop')}` : typed ? '' : t('mentor.tapSpeak')}</b><button className="type-toggle" onClick={() => { setTyped((value) => !value); setError('') }}><Icon name={typed ? 'mic' : 'keyboard'} size={16}/>{typed ? t('lesson.useVoice') : t('lesson.typeInstead')}</button></div>}</div>
}

function MentorBubble({ label, text, mine = false, correction = false, onReplay }: { label: string; text: string; mine?: boolean; correction?: boolean; onReplay: () => void }) { const { t } = useTranslation(); return <div className={`mentor-message ${mine ? 'mine' : ''} ${correction ? 'correction' : ''}`}><small>{label}</small><p>{text}</p><button onClick={onReplay}><Icon name="sound" size={13}/> {t(correction ? 'mentor.replayPhrase' : 'mentor.replay')}</button></div> }

type ShortLessonData = typeof omaritoShorts[number]
type ShortLessonProps = {
  short: ShortLessonData
  step: number
  answer: number | null
  response: string
  recording: boolean
  recorded: boolean
  seconds: number
  audioPlaying: boolean
  onAnswer: (value: number) => void
  onResponse: (value: string) => void
  onRecord: () => void
  onPlay: () => void
  onRecordAgain: () => void
  onBack: () => void
  onNext: () => void
  onFinish: () => void
}

function ShortLesson({ short, step, answer, response, recording, recorded, seconds, audioPlaying, onAnswer, onResponse, onRecord, onPlay, onRecordAgain, onBack, onNext, onFinish }: ShortLessonProps) {
  const { t } = useTranslation()
  return <div className="short-lesson"><header className="short-lesson-top"><button onClick={onBack} aria-label={t('common.close')}><Icon name="close"/></button><div><i style={{ width: `${(step + 1) / 5 * 100}%` }}/></div><span>{step + 1}/5</span></header>
    {step === 0 && <div className="short-watch"><video controls playsInline preload="metadata" poster={short.poster}><source src={short.source} type="video/mp4"/><track default kind="captions" src={short.captions} srcLang="en" label="English & Russian"/></video><div><span className="kicker">{t('shortLesson.watch')}</span><h1>{t(short.titleKey)}</h1><p>{t('shortLesson.watchDescription')}</p><button className="primary" onClick={onNext}>{t('shortLesson.start')} <Icon name="arrow"/></button></div></div>}
    {step === 1 && <div className="short-quiz"><span className="kicker">{t('shortLesson.check')}</span><h1>{short.quiz}</h1><div className="short-quote"><Icon name="sound"/><span>{t(short.takeawayKey)}</span></div>{short.answers.map((choice, index) => <Answer key={choice} label={choice} state={answer === index ? index === short.correct ? 'right' : 'wrong' : answer !== null ? 'dim' : ''} onClick={() => onAnswer(index)}/>)}{answer !== null && <div className={`lesson-feedback ${answer === short.correct ? 'good' : 'bad'}`}><Icon name={answer === short.correct ? 'check' : 'sound'}/><div><b>{answer === short.correct ? t('shortLesson.correct') : t('lesson.tryAgain')}</b><p>{answer === short.correct ? t('shortLesson.correctDescription') : t('shortLesson.tryDescription')}</p></div></div>}<button className="primary short-foot" disabled={answer !== short.correct} onClick={onNext}>{t('common.continue')}</button></div>}
    {step === 2 && <div className="short-rule"><span className="kicker">{t('shortLesson.rule')}</span><h1>{t('shortLesson.pattern')}</h1><div className="rule-compare"><article><strong>{short.ruleLeft}</strong><small>{short.ruleLeftNote}</small><p>{short.ruleLeftExample}</p></article><article><strong>{short.ruleRight}</strong><small>{short.ruleRightNote}</small><p>{short.ruleRightExample}</p></article></div><div className="memory-line"><Icon name="spark"/><p>{t(short.takeawayKey)}</p></div><button className="primary short-foot" onClick={onNext}>{t('shortLesson.practice')} <Icon name="arrow"/></button></div>}
    {step === 3 && <div className="short-do"><span className="kicker">{t('shortLesson.yourTurn')}</span><h1>{short.practice}</h1><textarea value={response} onChange={(event) => onResponse(event.target.value)} maxLength={220} placeholder={t('shortLesson.placeholder')}/><div className="or-line"><span>{t('shortLesson.orSpeak')}</span></div>{recorded ? <div className="record-review"><button onClick={onPlay}><Icon name={audioPlaying ? 'pause' : 'play'}/></button><Wave active={audioPlaying}/><span>0:{String(Math.max(seconds, 2)).padStart(2, '0')}</span></div> : <button className={`short-record ${recording ? 'recording' : ''}`} onClick={onRecord}><Icon name={recording ? 'pause' : 'mic'} size={24}/><span>{recording ? `${seconds}s · ${t('lesson.tapStop')}` : t('shortLesson.record')}</span></button>}{recorded && <button className="record-again" onClick={onRecordAgain}>{t('lesson.recordAgain')}</button>}<button className="primary short-foot" disabled={!response.trim() && !recorded} onClick={onNext}>{t('shortLesson.review')}</button></div>}
    {step === 4 && <div className="short-result"><div className="confetti">{Array.from({ length: 24 }, (_, index) => <i key={index} style={{ '--i': index } as CSSProperties}/>)}</div><img src={`${A}/badge-gold.png`} alt=""/><span className="kicker">{t('shortLesson.complete')}</span><h1>{t('shortLesson.resultTitle')}</h1><div className="model-answer"><small>{t('shortLesson.model')}</small><p>{short.model}</p></div><div className="reward-row"><span>⭐ +20 XP</span><span>🪙 +5 Lingo</span></div><button className="primary" onClick={onFinish}>{t('shortLesson.collect')}</button></div>}
  </div>
}

function BossMission({ levelId, onBack, onFinish }: { levelId: number; onBack: () => void; onFinish: () => void }) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [answer, setAnswer] = useState<number | null>(null)
  const challenges = [
    { question: 'You meet a new teammate. Which reply sounds natural?', answers: ['Hi, I’m Alex. I usually work from home.', 'Alex. Home.', 'I working home yesterday.'], correct: 0 },
    { question: 'Your plan changes. What keeps the conversation moving?', answers: ['No.', 'Friday is difficult. Could we meet Saturday instead?', 'Meeting Saturday.'], correct: 1 },
    { question: 'Which response adds a useful detail?', answers: ['I like it.', 'Yes.', 'I like the idea because everyone can join for free.'], correct: 2 },
  ]
  if (step >= challenges.length) return <div className="boss-screen boss-result"><div className="boss-glow"/><img src={`${A}/badge-legend.png`} alt=""/><span className="kicker">{t('boss.complete')}</span><h1>{t('boss.victory')}</h1><p>{t('boss.result', { level: levelId })}</p><div className="reward-row"><span>⭐ +60 XP</span><span>🪙 +20 Lingo</span></div><button className="primary" onClick={onFinish}>{t('boss.collect')}</button></div>
  const challenge = challenges[step]
  return <div className="boss-screen"><Top title={t('boss.title')} onBack={onBack} step={`${step + 1}/${challenges.length}`}/><div className="boss-art"><div/><img src={`${A}/hero-jump.png`} alt="Omarito"/><span>{t('boss.level', { level: levelId })}</span></div><section><span className="kicker">{t('boss.challenge')}</span><h1>{challenge.question}</h1><div className="boss-answers">{challenge.answers.map((item, index) => <button className={answer === index ? index === challenge.correct ? 'right' : 'wrong' : ''} onClick={() => setAnswer(index)} key={item}>{item}{answer === index && <Icon name={index === challenge.correct ? 'check' : 'close'} size={16}/>}</button>)}</div>{answer !== null && <p className={answer === challenge.correct ? 'good' : 'bad'}>{answer === challenge.correct ? t('boss.correct') : t('boss.tryAgain')}</p>}<button className="primary" disabled={answer !== challenge.correct} onClick={() => { setStep((value) => value + 1); setAnswer(null) }}>{step === challenges.length - 1 ? t('boss.finish') : t('common.continue')}</button></section></div>
}

function Store({ coins, tickets, xp, ownedItems, seasonDays, onBuy, onBack }: { coins: number; tickets: number; xp: number; ownedItems: string[]; seasonDays: number; onBuy: (id: string, price: number) => 'owned' | 'insufficient' | 'bought'; onBack: () => void }) {
  const { t } = useTranslation()
  const [notice, setNotice] = useState('')
  const products = [
    ['🎁', 'store.drops', 'store.dropsDescription'],
    ['🎟️', 'store.seasonPass', 'store.seasonPassDescription'],
    ['🎙️', 'store.aiPacks', 'store.aiPacksDescription'],
    ['📚', 'store.courses', 'store.coursesDescription'],
    ['🎬', 'store.experience', 'store.experienceDescription'],
    ['👨‍👩‍👧', 'store.family', 'store.familyDescription'],
  ] as const
  function preview() { setNotice(t('store.previewNotice')) }
  function buy(id: string, price: number) {
    const result = onBuy(id, price)
    setNotice(t(`store.${result}`))
  }
  return <div className="store-screen"><div className="store-hero"><Top title={t('store.title')} onBack={onBack}/><span className="kicker light">OMALINGO MEMBERSHIP</span><h1>{t('store.learnEarn')}</h1><p>{t('store.description')}</p><div className="store-wallet"><span><b>{coins}</b><small>Lingo Coins</small></span><span><b>{tickets}</b><small>Tickets</small></span><span><b>{xp}</b><small>XP</small></span></div></div><section className="character-shop"><div className="section-title"><div><small>{t('store.characterShop')}</small><h2>{t('store.useRewards')}</h2></div><span>🪙 {coins}</span></div><div className="shop-items">{shopItems.map((item) => { const owned = ownedItems.includes(item.id); return <button className={owned ? 'owned' : ''} key={item.id} onClick={() => buy(item.id, item.price)}><img src={`${A}/${item.asset}`} alt=""/><b>{t(item.titleKey)}</b><small>{t(item.descriptionKey)}</small><strong>{owned ? t('store.owned') : `🪙 ${item.price}`}</strong></button> })}</div></section>{notice && <button className="store-notice" onClick={() => setNotice('')}><Icon name="spark"/><span>{notice}</span><Icon name="close" size={14}/></button>}<section className="season-progress"><span>SEASON 01</span><b>{t('store.seasonProgress', { current: seasonDays })}</b><div><i style={{ width: `${seasonDays / 30 * 100}%` }}/></div><small>{t('store.seasonHint')}</small></section><section className="subscription-card"><small>{t('store.trial')}</small><h2>{t('store.fullAccess')}</h2><div><button onClick={preview}><b>$1</b><span>{t('store.month')}</span></button><button className="featured" onClick={preview}><em>{t('store.best')}</em><b>$10</b><span>{t('store.year')}</span></button></div><p>{t('store.subscriptionIncludes')}</p></section><section className="store-products"><h2>{t('store.ecosystem')}</h2><div>{products.map(([icon, titleKey, descriptionKey]) => <button key={titleKey} onClick={preview}><span>{icon}</span><b>{t(titleKey)}</b><small>{t(descriptionKey)}</small><em>{t('store.preview')}</em></button>)}</div></section></div>
}

type LessonProps = { mission: Mission; step: number; answer: number | null; onAnswer: (v: number) => void; recording: boolean; recorded: boolean; seconds: number; typed: boolean; typedText: string; selfChecks: boolean[]; audioPlaying: boolean; onRecord: () => void; onRecordAgain: () => void; onPlay: () => void; onTyped: () => void; onText: (v: string) => void; onCheck: (i: number) => void; onExit: () => void; onNext: () => void; onFinish: () => void; onFeed: () => void }

function Lesson(props: LessonProps) {
  const { t } = useTranslation()
  const { mission, step, answer, onAnswer, onExit, onNext, onFinish, onFeed } = props
  const [phase, setPhase] = useState(0)
  useEffect(() => setPhase(0), [step])
  return <div className="lesson"><header className="lesson-top"><button onClick={onExit} aria-label={t('common.close')}><Icon name="close"/></button><div><i style={{ width: `${(step + 1) / 9 * 100}%` }}/></div><span>{step + 1}/9</span></header>
    {step === 0 && <LessonIntro mission={mission} onNext={onNext}/>}
    {step === 1 && <FirstQuiz mission={mission} answer={answer} onAnswer={onAnswer} onNext={onNext}/>}
    {step === 2 && <PatternCard mission={mission} onNext={onNext}/>}
    {step === 3 && <QuizLayout question={mission.question} answers={mission.answers} correct={mission.correct} answer={answer} feedback={mission.feedback} onAnswer={onAnswer} onNext={onNext}/>}
    {step === 4 && phase === 0 && <Practice {...props} heading={t('lesson.makeYours')} prompt={mission.prompt} button={t('lesson.reviewResponse')} onNext={() => setPhase(1)}/>}
    {step === 4 && phase === 1 && <SelfCheck mission={mission} checks={props.selfChecks} onCheck={props.onCheck} onNext={onNext}/>}
    {step === 5 && <RepeatLine {...props} onNext={onNext}/>}
    {step === 6 && <Conversation {...props} phase={phase} onPhase={setPhase} onNext={onNext}/>}
    {step === 7 && <Transfer {...props} phase={phase} onPhase={setPhase} onNext={onNext}/>}
    {step === 8 && <Complete mission={mission} onFinish={onFinish} onFeed={onFeed}/>}
  </div>
}

function LessonIntro({ mission, onNext }: { mission: Mission; onNext: () => void }) { const { t } = useTranslation(); return <div className="scene-step"><Scene/><div className="scene-caption"><span className="kicker">MISSION {String(mission.id).padStart(2,'0')}</span><h1>{mission.title}</h1><div className="quote"><Avatar/><p>I usually play football with friends. At the moment, I am learning to take better photos.</p><button aria-label={t('feed.play')}><Icon name="sound"/></button></div><button className="primary" onClick={onNext}>{t('lesson.putToUse')}</button></div></div> }
function FirstQuiz({ mission, answer, onAnswer, onNext }: { mission: Mission; answer: number | null; onAnswer: (v: number) => void; onNext: () => void }) { const first = mission.id === 1; return <QuizLayout question={first ? 'What is new in his life?' : mission.question} answers={first ? ['Playing football','Learning photography','Meeting new friends'] : mission.answers} correct={first ? 1 : mission.correct} answer={answer} feedback={first ? 'He usually plays football. Photography is what he is learning at the moment.' : mission.feedback} onAnswer={onAnswer} onNext={onNext}/> }
function QuizLayout({ question, answers, correct, answer, feedback, onAnswer, onNext }: { question: string; answers: string[]; correct: number; answer: number | null; feedback: string; onAnswer: (v: number) => void; onNext: () => void }) { const { t } = useTranslation(); return <div className="quiz-screen"><Scene compact/><div className="quiz-sheet"><span className="kicker">{t('lesson.catchMeaning')}</span><h2>{question}</h2>{answers.map((item, i) => <Answer key={item} label={item} state={answer === i ? i === correct ? 'right' : 'wrong' : answer !== null ? 'dim' : ''} onClick={() => onAnswer(i)}/>)}{answer !== null && <div className={`lesson-feedback ${answer === correct ? 'good' : 'bad'}`}><Icon name={answer === correct ? 'spark' : 'sound'}/><div><b>{answer === correct ? '+5' : t('lesson.tryAgain')}</b><p>{answer === correct ? feedback : t('lesson.listenAgain')}</p></div></div>}<button className="primary" disabled={answer !== correct} onClick={onNext}>{t('common.continue')}</button></div></div> }
function PatternCard({ mission, onNext }: { mission: Mission; onNext: () => void }) { const { t } = useTranslation(); return <div className="pattern-screen"><div className="pattern-art"><img src={`${A}/headphones.png`} alt=""/></div><span className="kicker">{t('lesson.littleLanguage')}</span><h1>{t('lesson.aLot')}</h1><p>{t('lesson.patternDescription')}</p><div className="pattern-card"><span>I usually…</span><small>{t('lesson.regularRoutine')}</small><hr/><span>At the moment, I’m…</span><small>{t('lesson.inProgress')}</small></div><div className="pattern-example"><Icon name="sound"/><p>{mission.id === 1 ? 'I usually play football. At the moment, I’m learning photography.' : mission.example}</p></div><button className="primary" onClick={onNext}>{t('lesson.putToUse')} <Icon name="arrow"/></button></div> }

type PracticeProps = LessonProps & { heading: string; prompt: string; button?: string }
function Practice({ heading, prompt, recording, recorded, seconds, typed, typedText, audioPlaying, onRecord, onRecordAgain, onPlay, onTyped, onText, onNext, button }: PracticeProps) { const { t } = useTranslation(); return <div className="practice"><div className="practice-head"><span className="kicker">{heading.toUpperCase()}</span><h1>{prompt}</h1></div>{typed ? <div className="type-box"><textarea autoFocus maxLength={240} value={typedText} onChange={(e) => onText(e.target.value)} placeholder={t('lesson.typeWhat')}/><small>{typedText.length}/240</small></div> : recorded ? <div className="record-review"><button onClick={onPlay}><Icon name={audioPlaying ? 'pause' : 'play'}/></button><Wave active={audioPlaying}/><span>0:{String(Math.max(seconds,2)).padStart(2,'0')}</span></div> : <button className={`record ${recording ? 'active' : ''}`} onClick={onRecord}><span><Icon name={recording ? 'pause' : 'mic'} size={33}/></span><b>{recording ? `${seconds}s · ${t('lesson.tapStop')}` : t('lesson.tapRecord')}</b></button>}<button className="type-toggle" onClick={onTyped}><Icon name={typed ? 'mic' : 'keyboard'} size={17}/>{typed ? t('lesson.useVoice') : t('lesson.typeInstead')}</button>{recorded && <button className="record-again" onClick={onRecordAgain}>{t('lesson.recordAgain')}</button>}<div className="practice-actions"><button className="primary" disabled={!recorded && !typedText.trim()} onClick={onNext}>{button || t('common.continue')} <Icon name="arrow"/></button></div></div> }
function SelfCheck({ mission, checks, onCheck, onNext }: { mission: Mission; checks: boolean[]; onCheck: (i: number) => void; onNext: () => void }) { const { t } = useTranslation(); const criteria = [t('lesson.checkClear'), t('lesson.checkDetail'), t('lesson.checkNatural')]; return <div className="practice selfcheck"><div className="practice-head"><span className="kicker">{t('lesson.review')}</span><h1>{t('lesson.checkResponse')}</h1></div><label>{t('lesson.example')}</label><div className="example">{mission.example}</div><h2>{t('lesson.didYou')}</h2>{criteria.map((item, i) => <button className={checks[i] ? 'checked' : ''} onClick={() => onCheck(i)} key={item}><span><Icon name="check" size={15}/></span>{item}</button>)}<small>{t('lesson.selfCheck')}</small><button className="primary foot" onClick={onNext}>{t('lesson.savePractice')}</button></div> }
function RepeatLine(props: LessonProps) { const { t } = useTranslation(); const line = props.mission.id === 1 ? 'I usually play football with friends. At the moment, I am learning to take better photos.' : props.mission.example; return <div className="repeat-step"><div className="repeat-scene"><Scene compact/><div className="repeat-bubble"><span className="kicker">{t('lesson.repeatLine').toUpperCase()}</span><p>{line}</p><button><Icon name="sound"/></button></div></div><Practice {...props} heading={t('lesson.repeatLine')} prompt={t('lesson.ownVoice')} button={t('common.continue')}/></div> }
function Conversation(props: LessonProps & { phase: number; onPhase: (v: number) => void }) { const { t } = useTranslation(); const { mission, phase, onPhase, onNext } = props; if (phase === 0) return <div className="conversation"><Scene/><div className="conversation-sheet"><span className="kicker">{t('lesson.conversation')}</span><h2>{mission.followLine}</h2>{mission.followChoices.map((item, i) => <button className="dialog-choice" key={item} onClick={() => onPhase(i + 1)}>{item}<Icon name="arrow" size={17}/></button>)}</div></div>; if (phase < 3) return <Practice {...props} heading={t('lesson.keepGoing')} prompt={mission.id === 1 ? (phase === 1 ? 'Me too! I like having someone to share it with. Tell me who you would invite and why.' : 'That makes sense. Tell me what you enjoy doing on your own.') : mission.followPrompt} button={t('lesson.reviewResponse')} onNext={() => onPhase(3)}/>; return <div className="practice selfcheck"><div className="practice-head"><span className="kicker">{t('lesson.review')}</span><h1>{t('lesson.keepsConversation')}</h1></div><label>{t('lesson.example')}</label><div className="example">{mission.id === 1 ? 'I’d invite my sister because we both enjoy cooking.' : mission.example}</div><div className="mini-check"><Icon name="check"/>{t('lesson.clearAnswer')}</div><div className="mini-check"><Icon name="check"/>{t('lesson.usefulDetail')}</div><button className="primary foot" onClick={onNext}>{t('common.continue')}</button></div> }
function Transfer(props: LessonProps & { phase: number; onPhase: (v: number) => void }) { const { t } = useTranslation(); const { mission, phase, onPhase, onNext } = props; const prompt = mission.id === 1 ? 'Write a two-sentence introduction for a new hobby group. Use different details from your first answer.' : `Use the same skill somewhere new: ${mission.prompt}`; if (phase === 0) return <div className="practice transfer"><div className="practice-head"><span className="kicker">{t('lesson.somewhereNew')}</span><h1>{prompt}</h1></div><div className="type-box"><textarea autoFocus maxLength={240} value={props.typedText} onChange={(e) => props.onText(e.target.value)} placeholder={t('lesson.writeResponse')}/><small>{props.typedText.length}/240</small></div><div className="practice-actions"><button className="primary" disabled={!props.typedText.trim()} onClick={() => onPhase(1)}>{t('lesson.reviewResponse')}</button><button className="secondary" onClick={() => onPhase(1)}>{t('lesson.seeExample')}</button></div></div>; return <div className="practice selfcheck"><div className="practice-head"><span className="kicker">{t('lesson.somewhereNew')}</span><h1>{t('lesson.reviewYourResponse')}</h1></div><label>{t('lesson.example')}</label><div className="example">{mission.id === 1 ? 'I usually go cycling on Sundays. These days, I’m trying longer routes.' : mission.example}</div><h2>{t('lesson.makeNew')}</h2><div className="mini-check"><Icon name="check"/>{t('lesson.twoSentences')}</div><div className="mini-check"><Icon name="check"/>{t('lesson.differentDetails')}</div><button className="primary foot" onClick={onNext}>{t('lesson.finishMission')}</button></div> }
function Complete({ mission, onFinish, onFeed }: { mission: Mission; onFinish: () => void; onFeed: () => void }) { const { t } = useTranslation(); return <div className="complete"><div className="confetti">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties}/>)}</div><span className="kicker">{t('lesson.congrats')}</span><img className="complete-badge" src={`${A}/badge-gold.png`} alt=""/><h1>{t('lesson.missionComplete')}</h1><h2>{mission.title}</h2><p><Icon name="check" size={17}/> {t('lesson.practiceSaved')}</p><button className="primary" onClick={onFinish}>{t('lesson.continueLearning')}</button><button className="secondary" onClick={onFeed}>{t('lesson.backFeed')}</button></div> }
function ExitModal({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) { const { t } = useTranslation(); return <div className="modal-backdrop"><div className="exit-modal"><span>✦</span><h2>{t('lesson.leavePractice')}</h2><p>{t('lesson.progressSaved')}</p><button className="primary" onClick={onStay}>{t('lesson.keepPracticing')}</button><button className="secondary" onClick={onLeave}>{t('lesson.backFeed')}</button></div></div> }

export default App
