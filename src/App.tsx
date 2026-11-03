import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type View = 'welcome' | 'language' | 'personalize' | 'starter' | 'intro' | 'hero' | 'feed' | 'journey' | 'world' | 'profile' | 'level' | 'lesson'
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
const goals = ['Everyday conversations', 'Work and collaboration', 'Travel and meeting people']

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
function Avatar({ className = '' }: { className?: string }) { return <img className={`avatar-img ${className}`} src={`${A}/hero-head.png`} alt="Omarito"/> }
function Wave({ active = false }: { active?: boolean }) { return <div className={`wave ${active ? 'active' : ''}`}>{Array.from({ length: 29 }, (_, i) => <i key={i} style={{ height: `${14 + (i * 19) % 70}%`, animationDelay: `${-i * 32}ms` }}/>)}</div> }

function App() {
  const [view, setView] = useState<View>('welcome')
  const [language, setLanguage] = useState('English')
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [starterAnswer, setStarterAnswer] = useState<number | null>(null)
  const [heroPart, setHeroPart] = useState(0)
  const [heroOptions, setHeroOptions] = useState([0, 0, 0, 0])
  const [heroReturn, setHeroReturn] = useState<View>('feed')
  const [activeLevel, setActiveLevel] = useState(1)
  const [missionId, setMissionId] = useState(1)
  const [lessonStep, setLessonStep] = useState(0)
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
  const recorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const audio = useRef<HTMLAudioElement | null>(null)
  const mission = missions[missionId - 1]

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
  function finishMission() { setCompleted((items) => items.includes(missionId) ? items : [...items, missionId]); setView('world') }
  function selectLevel(id: number) { setActiveLevel(id); setView('level') }

  const lessonProps = { mission, step: lessonStep, answer, onAnswer: setAnswer, recording, recorded, seconds, typed, typedText, selfChecks, audioPlaying, onRecord: toggleRecording, onRecordAgain: recordAgain, onPlay: playRecording, onTyped: () => setTyped((v) => !v), onText: setTypedText, onCheck: (index: number) => setSelfChecks((v) => v.map((x, i) => i === index ? !x : x)), onExit: () => setExitOpen(true), onNext: () => setLessonStep((v) => Math.min(8, v + 1)), onFinish: finishMission, onFeed: () => setView('feed') }

  return <main className="stage"><section className={`phone view-${view}`}>
    {view === 'welcome' && <Welcome onNext={() => setView('language')}/>}
    {view === 'language' && <Language value={language} onChange={setLanguage} onBack={() => setView('welcome')} onNext={() => setView('personalize')}/>}
    {view === 'personalize' && <Personalize name={name} goal={goal} onName={setName} onGoal={setGoal} onBack={() => setView('language')} onNext={() => setView('starter')}/>}
    {view === 'starter' && <Starter answer={starterAnswer} onAnswer={setStarterAnswer} onBack={() => setView('personalize')} onNext={() => setView('intro')}/>}
    {view === 'intro' && <Intro name={name || 'Alex'} onBack={() => setView('starter')} onNext={() => { setHeroReturn('feed'); setView('hero') }}/>}
    {view === 'hero' && <HeroBuilder part={heroPart} options={heroOptions} onOption={(option) => setHeroOptions((v) => v.map((x, i) => i === heroPart ? option : x))} onBack={() => heroPart ? setHeroPart(heroPart - 1) : setView(heroReturn === 'profile' ? 'profile' : 'intro')} onNext={() => heroPart < 3 ? setHeroPart(heroPart + 1) : setView(heroReturn)}/>}
    {view === 'feed' && <Feed name={name || 'Alex'} completed={completed} onMission={() => openMission(completed.length >= 20 ? 1 : completed.length + 1)} onNav={setView}/>}
    {view === 'journey' && <Journey completed={completed} onWorld={() => setView('world')} onNav={setView}/>}
    {view === 'world' && <WorldOverview completed={completed} onBack={() => setView('journey')} onLevel={selectLevel}/>}
    {view === 'profile' && <Profile name={name || 'Alex'} language={language} completed={completed} onEdit={() => { setHeroPart(0); setHeroReturn('profile'); setView('hero') }} onNav={setView}/>}
    {view === 'level' && <LevelScreen levelId={activeLevel} completed={completed} onBack={() => setView('world')} onMission={openMission}/>}
    {view === 'lesson' && <Lesson {...lessonProps}/>}
    {exitOpen && <ExitModal onStay={() => setExitOpen(false)} onLeave={() => { setExitOpen(false); setView('feed') }}/>}
  </section></main>
}

function Welcome({ onNext }: { onNext: () => void }) { return <div className="onboarding welcome"><Logo/><div className="welcome-art"><span/><img src={`${A}/welcome-leopard.png`} alt="Snow leopard holding a globe"/></div><h1>Learn languages.<br/>Build <em>your legend.</em></h1><p>Complete missions, explore new worlds, and grow with your own leopard.</p><button className="primary" onClick={onNext}>Get started <Icon name="arrow"/></button><small>By continuing, you agree to our Terms of Service and Privacy Policy</small></div> }
function Top({ title, onBack, step }: { title: string; onBack: () => void; step?: string }) { return <header className="top"><button onClick={onBack} aria-label="Back"><Icon name="back"/></button><span>{step || title}</span><i/></header> }
function Language({ value, onChange, onBack, onNext }: { value: string; onChange: (v: string) => void; onBack: () => void; onNext: () => void }) { return <div className="onboarding form-screen"><Top title="Your starting point" onBack={onBack}/><div className="form-copy"><span className="kicker">STEP 1 OF 2</span><h1>Choose your language</h1><p>What would you like to learn?</p></div><div className="choice-list">{languages.map(([flag, label]) => <button className={value === label ? 'selected' : ''} onClick={() => onChange(label)} key={label}><img src={`${A}/${flag}`} alt=""/><span>{label}</span><i>{value === label && <Icon name="check" size={15}/>}</i></button>)}</div><button className="primary pinned" onClick={onNext}>Continue</button></div> }
function Personalize({ name, goal, onName, onGoal, onBack, onNext }: { name: string; goal: string; onName: (v: string) => void; onGoal: (v: string) => void; onBack: () => void; onNext: () => void }) { return <div className="onboarding form-screen"><Top title="Your starting point" onBack={onBack}/><div className="form-copy"><span className="kicker">STEP 2 OF 2</span><h1>Make it personal</h1><label>Your name<input value={name} onChange={(e) => onName(e.target.value)} placeholder="Your name"/></label><p>Where would more English help?</p></div><div className="choice-list goal-list">{goals.map((item) => <button className={goal === item ? 'selected' : ''} onClick={() => onGoal(item)} key={item}><span>{item}</span><i>{goal === item && <Icon name="check" size={15}/>}</i></button>)}</div><button className="primary pinned" disabled={!name.trim() || !goal} onClick={onNext}>Try a tiny listening check</button></div> }

function Scene({ compact = false }: { compact?: boolean }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className="scene-unavailable"><Icon name="sound" size={30}/><h3>Scene unavailable</h3><p>Read the dialogue instead:<br/>“I usually play football with friends. At the moment, I am learning to take better photos.”</p><button className="secondary" onClick={() => setFailed(false)}>Try again</button></div>
  return <div className={`video ${compact ? 'compact' : ''}`}><img src={`${A}/actor-scene.png`} alt="Speaker in the learning scene" onError={() => setFailed(true)}/><button className="scene-play" aria-label="Play scene"><Icon name="play" size={21}/></button><div className="video-progress"><i/></div></div>
}
function Answer({ label, state, onClick }: { label: string; state?: string; onClick: () => void }) { return <button className={`lesson-option ${state || ''}`} onClick={onClick}>{label}{state === 'right' && <Icon name="check" size={17}/>} {state === 'wrong' && <Icon name="close" size={17}/>}</button> }
function Starter({ answer, onAnswer, onBack, onNext }: { answer: number | null; onAnswer: (v: number) => void; onBack: () => void; onNext: () => void }) { const options = ['Playing football', 'Learning photography', 'Starting a new job']; return <div className="starter"><Top title="Your starting point" onBack={onBack}/><Scene/><div className="sheet"><span className="kicker">A TINY LISTENING CHECK</span><h2>What is new in his life?</h2>{options.map((item, i) => <Answer key={item} label={item} state={answer === i ? i === 1 ? 'right' : 'wrong' : answer !== null ? 'dim' : ''} onClick={() => onAnswer(i)}/>)}{answer !== null && <p className={answer === 1 ? 'success-copy' : 'retry-copy'}>{answer === 1 ? 'Correct · nice listening!' : 'Try again · listen for “photography”.'}</p>}<button className="primary" disabled={answer !== 1} onClick={onNext}>Continue</button></div></div> }
function Intro({ name, onBack, onNext }: { name: string; onBack: () => void; onNext: () => void }) { return <div className="intro"><Top title="A place to begin" onBack={onBack}/><img className="intro-hero" src={`${A}/hero-jump.png`} alt="Omarito jumping"/><span className="kicker">A PLACE TO BEGIN</span><h1>Find your voice</h1><p>First short missions introduce an interest, give choices, and start learning fast.</p><div className="intro-card"><small>Mission 01</small><strong>More than your name</strong></div><button className="primary" onClick={onNext}>Create my hero</button><small className="hint">Great start, {name}. Your first mission is ready.</small></div> }

function HeroBuilder({ part, options, onOption, onBack, onNext }: { part: number; options: number[]; onOption: (v: number) => void; onBack: () => void; onNext: () => void }) {
  const labels = ['Choose your eyes', 'Choose your nose', 'Choose your smile', 'Choose your clothes']
  const optionSets = [
    ['eyes-1.png','eyes-2.png','eyes-3.png','eyes-4.png','eyes-2.png','eyes-1.png'],
    ['nose-1.png','nose-2.png','nose-3.png','nose-4.png','nose-5.png','nose-6.png'],
    ['mouth-1.png','mouth-2.png','mouth-3.png','mouth-4.png','mouth-5.png','mouth-6.png'],
    ['clothes-hoodie.png','clothes-shirt.png','clothes-pants.png','clothes-shoes.png','clothes-shirt.png','clothes-hoodie.png'],
  ]
  return <div className="hero-builder"><Top title="Create your hero" onBack={onBack} step={`${part + 1}/4`}/><h1>{labels[part]}</h1><div className="hero-preview"><div className={`hero-halo tone-${options[3]}`}/><img src={`${A}/hero-full.png`} alt="Your snow leopard hero"/></div><div className="custom-tabs">{['eyes-1.png','nose-1.png','mouth-1.png','clothes-hoodie.png'].map((asset, i) => <span className={part === i ? 'active' : ''} key={asset}><img src={`${A}/${asset}`} alt=""/></span>)}</div><div className="custom-grid">{optionSets[part].map((asset, i) => <button className={options[part] === i ? 'selected' : ''} key={`${asset}-${i}`} onClick={() => onOption(i)}><img src={`${A}/${asset}`} alt={`${labels[part]} option ${i + 1}`}/></button>)}</div><div className="builder-actions"><button className="secondary" onClick={onBack}>Back</button><button className="primary" onClick={onNext}>{part === 3 ? 'Continue' : 'Next'}</button></div></div>
}

function AppHeader({ subtitle }: { subtitle: string }) { return <header className="app-header"><Avatar/><div><b>Omarito</b><small>{subtitle}</small></div><span><img src={`${A}/coin.png`} alt=""/> 500</span></header> }
function BottomNav({ active, onNav }: { active: MainView; onNav: (v: View) => void }) { return <nav className="bottom-nav"><button className={active === 'feed' ? 'active' : ''} onClick={() => onNav('feed')}><Icon name="home"/><span>Feed</span></button><button className={active === 'journey' ? 'active' : ''} onClick={() => onNav('journey')}><Icon name="journey"/><span>Journey</span></button><button className={active === 'profile' ? 'active' : ''} onClick={() => onNav('profile')}><Icon name="profile"/><span>Profile</span></button></nav> }
function Feed({ name, completed, onMission, onNav }: { name: string; completed: number[]; onMission: () => void; onNav: (v: View) => void }) { const next = missions[Math.min(completed.length, 19)]; return <div className="app-view feed"><AppHeader subtitle="Your story starts here"/><div className="feed-media"><img src={`${A}/actor-scene.png`} alt="Omarito learning video"/><button className="big-play"><Icon name="play" size={24}/></button><div className="social"><span>♡<small>1.2K</small></span><span>◌<small>489</small></span></div></div><div className="feed-sheet"><span className="kicker">UP NEXT · MISSION {String(next.id).padStart(2,'0')}</span><h1>{completed.length ? `Keep going, ${name}` : 'More than your name'}</h1><p>{completed.length ? next.title : 'Introduce yourself, add one real detail, and start speaking from day one.'}</p><button className="primary" onClick={onMission}>{completed.length ? 'Continue learning' : 'Start today’s mission'} <Icon name="arrow"/></button></div><BottomNav active="feed" onNav={onNav}/></div> }

function Journey({ completed, onWorld, onNav }: { completed: number[]; onWorld: () => void; onNav: (v: View) => void }) { return <div className="app-view journey"><AppHeader subtitle="Map your progress"/><div className="view-title"><h1>Your journey</h1><p>Explore worlds. Build real-life language skills.</p></div><div className="world-orbit"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="orbit orbit-c"/><div className="orbit-center"><img src={`${A}/hero-standing.png`} alt="Your hero"/></div><button className="world-node noma" onClick={onWorld}><span>01</span><b>NOMA</b><small>{completed.length}/20</small></button><button className="world-node world-2" disabled><img src={`${A}/rocket.png`} alt=""/><b>World 2</b><small>Coming soon</small></button><button className="world-node world-3" disabled><span>✦</span><b>World 3</b><small>Locked</small></button><button className="world-node world-4" disabled><span>◌</span><b>World 4</b><small>Locked</small></button></div><div className="journey-summary"><span>World progress</span><b>{Math.round(completed.length / 20 * 100)}%</b><div><i style={{ width: `${completed.length / 20 * 100}%` }}/></div><small>NOMA · {completed.length} of 20 missions</small></div><BottomNav active="journey" onNav={onNav}/></div> }
function WorldOverview({ completed, onBack, onLevel }: { completed: number[]; onBack: () => void; onLevel: (id: number) => void }) { return <div className="world-screen"><div className="world-hero"><Top title="NOMA" onBack={onBack}/><span className="kicker light">WORLD 01</span><h1>NOMA</h1><p>Find your voice. Make plans. Tell stories. Work things out.</p><div className="world-progress"><span>World progress</span><b>{completed.length}/20</b><div><i style={{ width: `${completed.length / 20 * 100}%` }}/></div></div></div><section className="level-cards"><h2>Levels</h2>{levels.map((level) => { const done = missions.filter((m) => m.level === level.id && completed.includes(m.id)).length; return <button key={level.id} onClick={() => onLevel(level.id)} style={{ '--level-color': level.color } as CSSProperties}><span>{level.id}</span><div><small>LEVEL {level.id}</small><b>{level.title}</b><p>{level.subtitle}</p><i><em style={{ width: `${done * 20}%` }}/></i></div><strong>+{[12,18,24,30][level.id - 1]}%</strong><Icon name="arrow" size={18}/></button>})}</section></div> }
function LevelScreen({ levelId, completed, onBack, onMission }: { levelId: number; completed: number[]; onBack: () => void; onMission: (id: number) => void }) { const level = levels[levelId - 1]; const items = missions.filter((m) => m.level === levelId); const completeCount = items.filter((m) => completed.includes(m.id)).length; const medals = ['badge-bronze.png','badge-silver.png','badge-gold.png','badge-legend.png']; return <div className="level-screen"><div className="level-hero" style={{ '--level-color': level.color } as CSSProperties}><Top title={`Level ${level.id}`} onBack={onBack}/><span className="kicker light">LEVEL {level.id}</span><h1>{level.title}</h1><p>{level.subtitle}</p><div className="level-progress-label"><span>Level progress</span><b>{1000 + completeCount * 160} / 1800</b></div><div className="level-progress"><i style={{ width: `${Math.min(100, 55 + completeCount * 9)}%` }}/></div><div className="medals">{['Bronze','Silver','Gold','Legend'].map((label, i) => <span key={label}><img src={`${A}/${medals[i]}`} alt=""/><small>{label}</small></span>)}</div></div><div className="mission-list"><h2>Missions <small>{completeCount}/5</small></h2>{items.map((item, i) => { const done = completed.includes(item.id); const percent = done ? 100 : [64,52,40,28,12][i]; return <button key={item.id} onClick={() => onMission(item.id)}><span className={done ? 'done' : ''}>{done ? <Icon name="check" size={15}/> : String(i + 1).padStart(2,'0')}</span><div><b>{item.title}</b><small>Listen · Speak · Practice</small></div><em>{percent}%</em><strong>+{[12,15,18,21,24][i]}%</strong></button>})}</div></div> }

function Profile({ name, language, completed, onEdit, onNav }: { name: string; language: string; completed: number[]; onEdit: () => void; onNav: (v: View) => void }) { return <div className="app-view profile"><header className="profile-top"><span/><h1>Profile</h1><button aria-label="Settings"><Icon name="gear"/></button></header><div className="profile-head"><Avatar/><div><h2>{name} <button onClick={onEdit} aria-label="Edit profile"><Icon name="edit" size={15}/></button></h2><p>Learning every day</p></div></div><div className="account-progress"><span>Account level</span><b>Level 3</b><div><i style={{ width: '62%' }}/></div><small>{500 + completed.length * 50} / 800 XP</small></div><div className="stat-row"><span><b>500</b><small>XP</small></span><span><b>120</b><small>Lingo</small></span><span><b>3</b><small>day streak</small></span></div><div className="learning-card"><span>Learning</span><h2><img src={`${A}/flag-uk.png`} alt=""/> {language}</h2><p>Beginner · A1</p><hr/><div className="learning-world"><span>NOMA</span><b>World progress 40%</b></div><div><i style={{ width: '40%' }}/></div></div><button className="edit-hero-wide" onClick={onEdit}><Avatar/>Customize your hero <Icon name="arrow"/></button><BottomNav active="profile" onNav={onNav}/></div> }

type LessonProps = { mission: Mission; step: number; answer: number | null; onAnswer: (v: number) => void; recording: boolean; recorded: boolean; seconds: number; typed: boolean; typedText: string; selfChecks: boolean[]; audioPlaying: boolean; onRecord: () => void; onRecordAgain: () => void; onPlay: () => void; onTyped: () => void; onText: (v: string) => void; onCheck: (i: number) => void; onExit: () => void; onNext: () => void; onFinish: () => void; onFeed: () => void }

function Lesson(props: LessonProps) {
  const { mission, step, answer, onAnswer, onExit, onNext, onFinish, onFeed } = props
  const [phase, setPhase] = useState(0)
  useEffect(() => setPhase(0), [step])
  return <div className="lesson"><header className="lesson-top"><button onClick={onExit}><Icon name="close"/></button><div><i style={{ width: `${(step + 1) / 9 * 100}%` }}/></div><span>{step + 1}/9</span></header>
    {step === 0 && <LessonIntro mission={mission} onNext={onNext}/>}
    {step === 1 && <FirstQuiz mission={mission} answer={answer} onAnswer={onAnswer} onNext={onNext}/>}
    {step === 2 && <PatternCard mission={mission} onNext={onNext}/>}
    {step === 3 && <QuizLayout question={mission.question} answers={mission.answers} correct={mission.correct} answer={answer} feedback={mission.feedback} onAnswer={onAnswer} onNext={onNext}/>}
    {step === 4 && phase === 0 && <Practice {...props} heading="Make it yours" prompt={mission.prompt} button="Review my response" onNext={() => setPhase(1)}/>}
    {step === 4 && phase === 1 && <SelfCheck mission={mission} checks={props.selfChecks} onCheck={props.onCheck} onNext={onNext}/>}
    {step === 5 && <RepeatLine {...props} onNext={onNext}/>}
    {step === 6 && <Conversation {...props} phase={phase} onPhase={setPhase} onNext={onNext}/>}
    {step === 7 && <Transfer {...props} phase={phase} onPhase={setPhase} onNext={onNext}/>}
    {step === 8 && <Complete mission={mission} onFinish={onFinish} onFeed={onFeed}/>}
  </div>
}

function LessonIntro({ mission, onNext }: { mission: Mission; onNext: () => void }) { return <div className="scene-step"><Scene/><div className="scene-caption"><span className="kicker">MISSION {String(mission.id).padStart(2,'0')}</span><h1>{mission.title}</h1><div className="quote"><Avatar/><p>I usually play football with friends. At the moment, I am learning to take better photos.</p><button aria-label="Play audio"><Icon name="sound"/></button></div><button className="primary" onClick={onNext}>Let’s try it</button></div></div> }
function FirstQuiz({ mission, answer, onAnswer, onNext }: { mission: Mission; answer: number | null; onAnswer: (v: number) => void; onNext: () => void }) { const first = mission.id === 1; return <QuizLayout question={first ? 'What is new in his life?' : mission.question} answers={first ? ['Playing football','Learning photography','Meeting new friends'] : mission.answers} correct={first ? 1 : mission.correct} answer={answer} feedback={first ? 'He usually plays football. Photography is what he is learning at the moment.' : mission.feedback} onAnswer={onAnswer} onNext={onNext}/> }
function QuizLayout({ question, answers, correct, answer, feedback, onAnswer, onNext }: { question: string; answers: string[]; correct: number; answer: number | null; feedback: string; onAnswer: (v: number) => void; onNext: () => void }) { return <div className="quiz-screen"><Scene compact/><div className="quiz-sheet"><span className="kicker">CATCH THE MEANING</span><h2>{question}</h2>{answers.map((item, i) => <Answer key={item} label={item} state={answer === i ? i === correct ? 'right' : 'wrong' : answer !== null ? 'dim' : ''} onClick={() => onAnswer(i)}/>)}{answer !== null && <div className={`lesson-feedback ${answer === correct ? 'good' : 'bad'}`}><Icon name={answer === correct ? 'spark' : 'sound'}/><div><b>{answer === correct ? '+5' : 'Try again'}</b><p>{answer === correct ? feedback : 'Listen again and use the clue in the scene.'}</p></div></div>}<button className="primary" disabled={answer !== correct} onClick={onNext}>Continue</button></div></div> }
function PatternCard({ mission, onNext }: { mission: Mission; onNext: () => void }) { return <div className="pattern-screen"><div className="pattern-art"><img src={`${A}/headphones.png`} alt="Headphones"/></div><span className="kicker">A LITTLE LANGUAGE</span><h1>A lot you can say</h1><p>Use one phrase for a routine. Use the other for something happening around now.</p><div className="pattern-card"><span>I usually…</span><small>a regular routine</small><hr/><span>At the moment, I’m…</span><small>something in progress now</small></div><div className="pattern-example"><Icon name="sound"/><p>{mission.id === 1 ? 'I usually play football. At the moment, I’m learning photography.' : mission.example}</p></div><button className="primary" onClick={onNext}>Put it to use <Icon name="arrow"/></button></div> }

type PracticeProps = LessonProps & { heading: string; prompt: string; button?: string }
function Practice({ heading, prompt, recording, recorded, seconds, typed, typedText, audioPlaying, onRecord, onRecordAgain, onPlay, onTyped, onText, onNext, button = 'Continue' }: PracticeProps) { return <div className="practice"><div className="practice-head"><span className="kicker">{heading.toUpperCase()}</span><h1>{prompt}</h1></div>{typed ? <div className="type-box"><textarea autoFocus maxLength={240} value={typedText} onChange={(e) => onText(e.target.value)} placeholder="Type what you would say…"/><small>{typedText.length}/240</small></div> : recorded ? <div className="record-review"><button onClick={onPlay}><Icon name={audioPlaying ? 'pause' : 'play'}/></button><Wave active={audioPlaying}/><span>0:{String(Math.max(seconds,2)).padStart(2,'0')}</span></div> : <button className={`record ${recording ? 'active' : ''}`} onClick={onRecord}><span><Icon name={recording ? 'pause' : 'mic'} size={33}/></span><b>{recording ? `${seconds}s · tap to stop` : 'Tap to record'}</b></button>}<button className="type-toggle" onClick={onTyped}><Icon name={typed ? 'mic' : 'keyboard'} size={17}/>{typed ? 'Use voice' : 'Type instead'}</button>{recorded && <button className="record-again" onClick={onRecordAgain}>Record again</button>}<div className="practice-actions"><button className="primary" disabled={!recorded && !typedText.trim()} onClick={onNext}>{button} <Icon name="arrow"/></button></div></div> }
function SelfCheck({ mission, checks, onCheck, onNext }: { mission: Mission; checks: boolean[]; onCheck: (i: number) => void; onNext: () => void }) { return <div className="practice selfcheck"><div className="practice-head"><span className="kicker">REVIEW</span><h1>Check your response</h1></div><label>Example response</label><div className="example">{mission.example}</div><h2>Did you…</h2>{mission.checks.map((item, i) => <button className={checks[i] ? 'checked' : ''} onClick={() => onCheck(i)} key={item}><span><Icon name="check" size={15}/></span>{item}</button>)}<small>Self-check · not an automatic score</small><button className="primary foot" onClick={onNext}>Save practice</button></div> }
function RepeatLine(props: LessonProps) { const line = props.mission.id === 1 ? 'I usually play football with friends. At the moment, I am learning to take better photos.' : props.mission.example; return <div className="repeat-step"><div className="repeat-scene"><Scene compact/><div className="repeat-bubble"><span className="kicker">REPEAT THE LINE</span><p>{line}</p><button><Icon name="sound"/></button></div></div><Practice {...props} heading="Repeat the line" prompt="Say it in your own voice" button="Continue"/></div> }
function Conversation(props: LessonProps & { phase: number; onPhase: (v: number) => void }) { const { mission, phase, onPhase, onNext } = props; if (phase === 0) return <div className="conversation"><Scene/><div className="conversation-sheet"><span className="kicker">A CONVERSATION WITH MAYA</span><h2>{mission.followLine}</h2>{mission.followChoices.map((item, i) => <button className="dialog-choice" key={item} onClick={() => onPhase(i + 1)}>{item}<Icon name="arrow" size={17}/></button>)}</div></div>; if (phase < 3) return <Practice {...props} heading="Keep it going" prompt={mission.id === 1 ? (phase === 1 ? 'Me too! I like having someone to share it with. Tell me who you would invite and why.' : 'That makes sense. Tell me what you enjoy doing on your own.') : mission.followPrompt} button="Review my response" onNext={() => onPhase(3)}/>; return <div className="practice selfcheck"><div className="practice-head"><span className="kicker">REVIEW</span><h1>Does your reply keep the conversation going?</h1></div><label>Example response</label><div className="example">{mission.id === 1 ? 'I’d invite my sister because we both enjoy cooking.' : mission.example}</div><div className="mini-check"><Icon name="check"/>Clear answer</div><div className="mini-check"><Icon name="check"/>One useful detail</div><button className="primary foot" onClick={onNext}>Continue</button></div> }
function Transfer(props: LessonProps & { phase: number; onPhase: (v: number) => void }) { const { mission, phase, onPhase, onNext } = props; const prompt = mission.id === 1 ? 'Write a two-sentence introduction for a new hobby group. Use different details from your first answer.' : `Use the same skill somewhere new: ${mission.prompt}`; if (phase === 0) return <div className="practice transfer"><div className="practice-head"><span className="kicker">SOMEWHERE NEW</span><h1>{prompt}</h1></div><div className="type-box"><textarea autoFocus maxLength={240} value={props.typedText} onChange={(e) => props.onText(e.target.value)} placeholder="Write your response…"/><small>{props.typedText.length}/240</small></div><div className="practice-actions"><button className="primary" disabled={!props.typedText.trim()} onClick={() => onPhase(1)}>Review my response</button><button className="secondary" onClick={() => onPhase(1)}>See an example</button></div></div>; return <div className="practice selfcheck"><div className="practice-head"><span className="kicker">SOMEWHERE NEW</span><h1>Review your response</h1></div><label>Example response</label><div className="example">{mission.id === 1 ? 'I usually go cycling on Sundays. These days, I’m trying longer routes.' : mission.example}</div><h2>Did you make it new?</h2><div className="mini-check"><Icon name="check"/>Two clear sentences</div><div className="mini-check"><Icon name="check"/>Different details</div><button className="primary foot" onClick={onNext}>Finish mission</button></div> }
function Complete({ mission, onFinish, onFeed }: { mission: Mission; onFinish: () => void; onFeed: () => void }) { return <div className="complete"><div className="confetti">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties}/>)}</div><span className="kicker">CONGRATS!</span><img className="complete-badge" src={`${A}/badge-gold.png`} alt="Gold mission badge"/><h1>Mission complete</h1><h2>{mission.title}</h2><p><Icon name="check" size={17}/> Practice saved</p><button className="primary" onClick={onFinish}>Continue learning</button><button className="secondary" onClick={onFeed}>Back to feed</button></div> }
function ExitModal({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) { return <div className="modal-backdrop"><div className="exit-modal"><span>✦</span><h2>Leave this practice?</h2><p>Your progress is saved.</p><button className="primary" onClick={onStay}>Keep practicing</button><button className="secondary" onClick={onLeave}>Back to feed</button></div></div> }

export default App
