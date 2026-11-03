import { useEffect, useRef, useState } from 'react'

type IconName =
  | 'arrow'
  | 'back'
  | 'book'
  | 'check'
  | 'close'
  | 'keyboard'
  | 'mic'
  | 'pause'
  | 'play'
  | 'sound'
  | 'spark'
  | 'trophy'

type StepKind = 'moment' | 'choice' | 'pattern' | 'listen' | 'speak' | 'selfcheck' | 'complete'

type MissionStep = {
  eyebrow: string
  title: string
  kind: StepKind
  prompt?: string
  actorLine?: string
}

const steps: MissionStep[] = [
  { eyebrow: 'The moment', title: 'Watch what happened', kind: 'moment', actorLine: "I can't believe the train left without us." },
  { eyebrow: 'Catch the meaning', title: 'What happened?', kind: 'choice', prompt: 'Choose the best answer.' },
  { eyebrow: 'Catch the meaning', title: 'That’s right', kind: 'choice', prompt: 'They missed the train.' },
  { eyebrow: 'Catch the meaning', title: 'Look at the clue', kind: 'choice', prompt: 'Listen for “left without us”.' },
  { eyebrow: 'A useful pattern', title: 'Tell what happened', kind: 'pattern', prompt: 'Use the past simple for a finished event.' },
  { eyebrow: 'Tune your ear', title: 'Which line do you hear?', kind: 'listen' },
  { eyebrow: 'Tune your ear', title: 'Exactly', kind: 'listen', prompt: '“The train left without us.”' },
  { eyebrow: 'Tune your ear', title: 'One more listen', kind: 'listen', prompt: 'Focus on the ending: left without us.' },
  { eyebrow: 'Make it yours', title: 'Say what happened to you', kind: 'speak', prompt: 'Start with “I missed…”' },
  { eyebrow: 'Self-check', title: 'How did that feel?', kind: 'selfcheck', prompt: 'Your answer does not need to be perfect.' },
  { eyebrow: 'Voice the scene', title: 'Repeat the line', kind: 'speak', actorLine: 'The train left without us.' },
  { eyebrow: 'Voice the scene', title: 'Hear your version', kind: 'speak', prompt: 'Compare your rhythm with the scene.' },
  { eyebrow: 'Keep it going', title: 'Add one more detail', kind: 'pattern', prompt: 'Tell us what you did next.' },
  { eyebrow: 'Conversation · A', title: 'Repeat the line', kind: 'speak', actorLine: 'So, what did you do?' },
  { eyebrow: 'Self-check', title: 'Did you keep it natural?', kind: 'selfcheck' },
  { eyebrow: 'Conversation · B', title: 'Answer Maya', kind: 'speak', actorLine: 'Did you find another way home?' },
  { eyebrow: 'Self-check', title: 'Did your answer connect?', kind: 'selfcheck' },
  { eyebrow: 'Somewhere new', title: 'Confirm a time and place', kind: 'speak', actorLine: "Let's meet at the museum entrance at ten." },
  { eyebrow: 'Self-check', title: 'Confirm a time and place', kind: 'selfcheck', prompt: "Example: Let’s meet at the museum entrance at ten." },
  { eyebrow: 'Take it with you', title: 'Mission complete', kind: 'complete', prompt: 'You told a story, reacted and kept a conversation moving.' },
]

const answers = ['They missed the train', 'They arrived too early', 'They changed their tickets']

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    keyboard: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M11 10h.01M15 10h.01M18 10h.01M7 14h.01M10 14h7" /></>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" /></>,
    pause: <><path d="M9 5v14" /><path d="M15 5v14" /></>,
    play: <path d="m8 5 11 7-11 7z" fill="currentColor" stroke="none" />,
    sound: <><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></>,
    spark: <><path d="m12 3 1.2 4.1L17 9l-3.8 1.9L12 15l-1.2-4.1L7 9l3.8-1.9z" /><path d="m19 15 .6 2.1L22 18l-2.4.9L19 21l-.6-2.1L16 18l2.4-.9z" /></>,
    trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function Waveform({ active = false }: { active?: boolean }) {
  return (
    <div className={`waveform ${active ? 'active' : ''}`} aria-label="Audio waveform">
      {Array.from({ length: 34 }, (_, index) => (
        <i key={index} style={{ height: `${12 + ((index * 17) % 32)}%`, animationDelay: `${index * -28}ms` }} />
      ))}
    </div>
  )
}

function App() {
  const [started, setStarted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [typedMode, setTypedMode] = useState(false)
  const [typedAnswer, setTypedAnswer] = useState('')
  const [showMap, setShowMap] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const step = steps[stepIndex]

  useEffect(() => {
    if (!recording) return
    const id = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(id)
  }, [recording])

  useEffect(() => {
    setSelectedAnswer(null)
    setPlaying(false)
    setRecording(false)
    setRecorded(false)
    setSeconds(0)
    setTypedMode(false)
    setTypedAnswer('')
  }, [stepIndex])

  async function toggleRecording() {
    if (recording) {
      mediaRecorder.current?.stop()
      setRecording(false)
      setRecorded(true)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunks.current = []
      recorder.ondataavailable = (event) => chunks.current.push(event.data)
      recorder.onstop = () => stream.getTracks().forEach((track) => track.stop())
      recorder.start()
      mediaRecorder.current = recorder
    } catch {
      mediaRecorder.current = null
    }
    setSeconds(0)
    setRecording(true)
  }

  function next() {
    if (stepIndex < steps.length - 1) setStepIndex((value) => value + 1)
  }

  function previous() {
    if (stepIndex > 0) setStepIndex((value) => value - 1)
    else setStarted(false)
  }

  function goToStep(index: number) {
    setStepIndex(index)
    setStarted(true)
    setShowMap(false)
  }

  if (!started) {
    return (
      <main className="app-shell landing-shell">
        <section className="phone landing">
          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />
          <header className="brand-row">
            <Logo />
            <button className="icon-button quiet" aria-label="Open mission map" onClick={() => setShowMap(true)}><Icon name="book" /></button>
          </header>
          <div className="landing-copy">
            <span className="eyebrow">IMMERSIVE ENGLISH</span>
            <h1>Speak like<br />you mean it.</h1>
            <p>Real scenes. Useful phrases. Your voice.</p>
          </div>
          <div className="mission-card glass-card">
            <div className="mission-meta"><span>MISSION 11</span><span>8–10 MIN</span></div>
            <div className="mission-visual"><Actor /><span className="play-badge"><Icon name="play" size={18} /></span></div>
            <h2>Tell me what happened</h2>
            <p>Describe an event, react naturally and keep the story moving.</p>
            <div className="mini-progress"><i /></div>
            <button className="primary-button" onClick={() => setStarted(true)}>Start mission <Icon name="arrow" /></button>
          </div>
          <p className="streak"><Icon name="spark" size={16} /> 4 day speaking streak</p>
        </section>
        {showMap && <MissionMap current={stepIndex} onClose={() => setShowMap(false)} onSelect={goToStep} />}
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="phone lesson-phone">
        <header className="lesson-header">
          <button className="icon-button" aria-label="Previous" onClick={previous}><Icon name="back" /></button>
          <div className="progress-wrap">
            <div className="progress-track"><i style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></div>
            <span>{stepIndex + 1}/{steps.length}</span>
          </div>
          <button className="icon-button" aria-label="Open mission map" onClick={() => setShowMap(true)}><Icon name="book" /></button>
        </header>

        <section className={`lesson-content kind-${step.kind}`} key={stepIndex}>
          {step.kind !== 'complete' && <div className="step-heading"><span>{step.eyebrow}</span><h1>{step.title}</h1>{step.prompt && <p>{step.prompt}</p>}</div>}

          {step.kind === 'moment' && <MomentScreen playing={playing} onToggle={() => setPlaying(!playing)} line={step.actorLine!} />}
          {step.kind === 'choice' && <ChoiceScreen selected={selectedAnswer} onSelect={setSelectedAnswer} />}
          {step.kind === 'pattern' && <PatternScreen />}
          {step.kind === 'listen' && <ListenScreen playing={playing} onToggle={() => setPlaying(!playing)} selected={selectedAnswer} onSelect={setSelectedAnswer} />}
          {step.kind === 'speak' && <SpeakScreen line={step.actorLine} recording={recording} recorded={recorded} seconds={seconds} typedMode={typedMode} typedAnswer={typedAnswer} onTypedChange={setTypedAnswer} onToggleMode={() => setTypedMode(!typedMode)} onRecord={toggleRecording} />}
          {step.kind === 'selfcheck' && <SelfCheck />}
          {step.kind === 'complete' && <CompleteScreen onRestart={() => setStepIndex(0)} />}

          {step.kind !== 'complete' && (
            <footer className="lesson-footer">
              <button className="primary-button" disabled={(step.kind === 'choice' || step.kind === 'listen') && selectedAnswer === null} onClick={next}>
                {stepIndex === steps.length - 2 ? 'Finish mission' : 'Continue'} <Icon name="arrow" />
              </button>
              {(step.kind === 'speak' || step.kind === 'selfcheck') && <button className="secondary-button" onClick={next}>Skip for now</button>}
            </footer>
          )}
        </section>
      </section>
      {showMap && <MissionMap current={stepIndex} onClose={() => setShowMap(false)} onSelect={goToStep} />}
    </main>
  )
}

function Logo() {
  return <div className="logo"><span><i /><i /><i /></span><strong>Omalingo</strong></div>
}

function Actor() {
  return <img className="actor-image" src="/assets/video-order.png" alt="" aria-hidden="true" />
}

function MomentScreen({ playing, onToggle, line }: { playing: boolean; onToggle: () => void; line: string }) {
  return (
    <div className="video-stage">
      <div className="video-noise" />
      <Actor />
      <div className="video-caption">{line}</div>
      <button className="video-control" onClick={onToggle} aria-label={playing ? 'Pause' : 'Play'}><Icon name={playing ? 'pause' : 'play'} size={24} /></button>
      <div className="video-timeline"><i className={playing ? 'playing' : ''} /></div>
    </div>
  )
}

function ChoiceScreen({ selected, onSelect }: { selected: number | null; onSelect: (index: number) => void }) {
  return (
    <div className="answer-list">
      {answers.map((answer, index) => {
        const state = selected === null ? '' : selected === index ? (index === 0 ? 'correct' : 'wrong') : 'muted'
        return <button key={answer} className={`answer-option ${state}`} onClick={() => onSelect(index)}><span>{String.fromCharCode(65 + index)}</span>{answer}{state === 'correct' && <Icon name="check" />}{state === 'wrong' && <Icon name="close" />}</button>
      })}
      {selected !== null && <div className={`feedback ${selected === 0 ? 'good' : 'retry'}`}><Icon name={selected === 0 ? 'spark' : 'sound'} /><div><strong>{selected === 0 ? 'Nice catch' : 'Listen once more'}</strong><p>{selected === 0 ? '“Left without us” tells you they missed it.' : 'The train left before they could get on.'}</p></div></div>}
    </div>
  )
}

function PatternScreen() {
  return (
    <div className="pattern-card glass-card">
      <div className="pattern-example"><span>WHAT?</span><strong>The train left</strong></div>
      <div className="pattern-plus">+</div>
      <div className="pattern-example"><span>DETAIL</span><strong>without us</strong></div>
      <div className="phrase-result">The train left <em>without us.</em></div>
      <p><Icon name="spark" size={18} /> Add one clear detail. Your story instantly feels real.</p>
    </div>
  )
}

function ListenScreen({ playing, onToggle, selected, onSelect }: { playing: boolean; onToggle: () => void; selected: number | null; onSelect: (index: number) => void }) {
  return (
    <div className="listen-screen">
      <button className={`audio-orb ${playing ? 'playing' : ''}`} onClick={onToggle} aria-label={playing ? 'Pause audio' : 'Play audio'}><span><Icon name={playing ? 'pause' : 'sound'} size={28} /></span></button>
      <Waveform active={playing} />
      <div className="answer-list compact">
        {["The train left without us.", "The train waited for us."].map((answer, index) => <button key={answer} className={`answer-option ${selected === index ? (index === 0 ? 'correct' : 'wrong') : ''}`} onClick={() => onSelect(index)}><span>{index + 1}</span>{answer}</button>)}
      </div>
    </div>
  )
}

type SpeakProps = {
  line?: string
  recording: boolean
  recorded: boolean
  seconds: number
  typedMode: boolean
  typedAnswer: string
  onTypedChange: (value: string) => void
  onToggleMode: () => void
  onRecord: () => void
}

function SpeakScreen({ line, recording, recorded, seconds, typedMode, typedAnswer, onTypedChange, onToggleMode, onRecord }: SpeakProps) {
  return (
    <div className="speak-screen">
      {line && <div className="line-card"><span>MAYA</span><p>{line}</p><button aria-label="Hear Maya"><Icon name="sound" /></button></div>}
      {typedMode ? (
        <div className="typing-box"><label htmlFor="answer">Your answer</label><textarea id="answer" autoFocus value={typedAnswer} onChange={(event) => onTypedChange(event.target.value)} placeholder="Type what you would say…" /><span>{typedAnswer.length}/160</span></div>
      ) : recorded ? (
        <div className="recording-review"><button className="small-play"><Icon name="play" /></button><Waveform /><span>0:{String(Math.max(seconds, 2)).padStart(2, '0')}</span></div>
      ) : (
        <button className={`mic-button ${recording ? 'recording' : ''}`} onClick={onRecord} aria-label={recording ? 'Stop recording' : 'Start recording'}><span><Icon name={recording ? 'pause' : 'mic'} size={32} /></span>{recording && <b>{seconds}s</b>}</button>
      )}
      <button className="type-toggle" onClick={onToggleMode}><Icon name={typedMode ? 'mic' : 'keyboard'} size={17} /> {typedMode ? 'Record instead' : 'Type instead'}</button>
      {recorded && <button className="record-again" onClick={onRecord}>Record again</button>}
    </div>
  )
}

function SelfCheck() {
  const [checks, setChecks] = useState([true, true])
  return (
    <div className="self-check">
      <div className="example-phrase">Let’s meet at the museum entrance at ten.</div>
      <h2>Did you…</h2>
      {['Respond to what Maya just said', 'Add a relevant detail'].map((label, index) => <button key={label} className={checks[index] ? 'checked' : ''} onClick={() => setChecks((value) => value.map((item, itemIndex) => itemIndex === index ? !item : item))}><span><Icon name="check" size={16} /></span>{label}</button>)}
      <p>Self-check · not an automatic score</p>
    </div>
  )
}

function CompleteScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="complete-screen">
      <div className="confetti">{Array.from({ length: 24 }, (_, index) => <i key={index} style={{ '--i': index } as React.CSSProperties} />)}</div>
      <div className="trophy"><Icon name="trophy" size={44} /></div>
      <span>MISSION COMPLETE</span>
      <h1>Tell me what happened</h1>
      <p>You told a story, reacted and kept a conversation moving.</p>
      <div className="skill-row"><div><Icon name="sound" /><span><b>Listening</b>7 activities</span></div><div><Icon name="mic" /><span><b>Speaking</b>6 recordings</span></div></div>
      <button className="primary-button" onClick={onRestart}>Practice again <Icon name="arrow" /></button>
    </div>
  )
}

function MissionMap({ current, onClose, onSelect }: { current: number; onClose: () => void; onSelect: (index: number) => void }) {
  return (
    <div className="map-backdrop" onClick={onClose}>
      <aside className="mission-map" onClick={(event) => event.stopPropagation()}>
        <header><div><span>MISSION 11</span><h2>Tell me what happened</h2></div><button className="icon-button" onClick={onClose}><Icon name="close" /></button></header>
        <div className="map-progress"><i style={{ width: `${((current + 1) / steps.length) * 100}%` }} /></div>
        <div className="map-steps">
          {steps.map((item, index) => <button key={`${item.eyebrow}-${index}`} className={`${index === current ? 'current' : ''} ${index < current ? 'done' : ''}`} onClick={() => onSelect(index)}><span>{index < current ? <Icon name="check" size={15} /> : index + 1}</span><div><b>{item.eyebrow}</b><small>{item.title}</small></div></button>)}
        </div>
      </aside>
    </div>
  )
}

export default App
