import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

const A = '/assets/figma'

function FIcon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    back: <path d="m15 18-6-6 6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    gift: <><rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9H7.5a2.5 2.5 0 1 1 2.2-3.7L12 9Zm0 0h4.5a2.5 2.5 0 1 0-2.2-3.7L12 9Z"/></>,
    spark: <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z"/>,
    people: <><circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 2.4-6 6-6s6 2 6 6M16 5a3 3 0 0 1 0 6M18 14c2 .8 3 2.8 3 6"/></>,
    shield: <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/>,
    box: <><path d="m4 8 8-4 8 4-8 4-8-4Z"/><path d="M4 8v9l8 4 8-4V8M12 12v9"/></>,
    crown: <path d="m3 7 4 4 5-7 5 7 4-4-2 11H5L3 7Z"/>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    book: <><path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4V4Z"/><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6V4Z"/></>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.spark}</svg>
}

function FeatureTop({ title, onBack }: { title: string; onBack: () => void }) {
  return <header className="top"><button onClick={onBack} aria-label="Back"><FIcon name="back"/></button><span>{title}</span><i/></header>
}

function useCopy() {
  const { i18n } = useTranslation()
  const locale = i18n.resolvedLanguage?.split('-')[0]
  const en = {
    rewards: 'Rewards', achievements: 'Achievements', weekly: 'Weekly', chests: 'Chests', drops: 'Drops', claim: 'Claim', claimed: 'Claimed', locked: 'Locked', ready: 'Ready',
    rewardLead: 'Everything is earned by learning', firstStep: 'First step', firstStepHint: 'Complete one mission', voiceOn: 'Voice on', voiceOnHint: 'Finish a speaking practice', steady: 'Steady learner', steadyHint: 'Reach a 3-day streak', nova: 'NOVA finisher', novaHint: 'Complete all 20 missions',
    weekTitle: 'This week', weekHint: 'Resets every Monday', weekLesson: 'Complete 3 missions', weekVoice: 'Do 2 speaking practices', weekStreak: 'Keep a 3-day streak', teamChest: 'Learning chest', chestHint: 'Open a chest earned from weekly progress.', open: 'Open chest', chestEmpty: 'Next chest unlocks after another weekly mission.', youFound: 'You found', limited: 'LIMITED', dropTitle: 'Aurora badge', dropHint: 'Available this season. One per learner.',
    den: 'Omarito DEN', denLead: 'Build a small home for your hero', room: 'Room', decor: 'Decor', emotes: 'Emotes', effects: 'Effects', placed: 'Placed', place: 'Place', remove: 'Remove', wave: 'Wave', celebrate: 'Celebrate', focus: 'Focus', aurora: 'Aurora', confetti: 'Confetti', calm: 'Calm light', preview: 'Preview',
    community: 'Community', activity: 'Activity', league: 'League', clan: 'Clan', invites: 'Invites', cheer: 'Cheer', cheered: 'Cheered', today: 'today', completedMission: 'Completed Mission 04 · You’re in the group', reachedStreak: 'Reached a 7-day streak', learnerLevel: 'A1 · English', leagueTitle: 'Silver League', leagueHint: 'Similar-level learners · 4 days left', you: 'You', clanTitle: 'NOVA Explorers', clanHint: 'Complete team missions. Everyone receives the chest.', joinClan: 'Join clan', leaveClan: 'Leave clan', teamProgress: 'Team progress', inviteTitle: 'Wants to learn together', accept: 'Accept', accepted: 'Friend', noInvites: 'No new invites', fair: 'Rankings use weekly learning XP. Purchases never affect position.',
    products: 'More ways to learn', productsLead: 'Choose a focused OMALINGO product', courses: 'Special courses', coursesHint: 'Travel, work, exams and speaking tracks', ai: 'Omarito AI packs', aiHint: 'Extra roleplays and detailed feedback', experience: 'Omarito Experience', experienceHint: 'Interactive stories with choices', family: 'Family plan', familyHint: 'Up to 5 profiles, separate progress', gifts: 'Gifts', giftsHint: 'Send learning access to someone', schools: 'Schools & business', schoolsHint: 'Cohorts, assignments and reporting', included: 'What is included', choose: 'Choose', activate: 'Activate preview', activated: 'Added', contact: 'Request demo', backProducts: 'All products', recipientEmail: 'Recipient email', familyEmail: 'Family member email', workEmail: 'Work email', frontend: 'Interactive frontend preview. Store billing and delivery connect at backend stage.',
  }
  const ru = {
    rewards: 'Награды', achievements: 'Достижения', weekly: 'Неделя', chests: 'Сундуки', drops: 'Дропы', claim: 'Забрать', claimed: 'Получено', locked: 'Закрыто', ready: 'Готово',
    rewardLead: 'Всё зарабатывается обучением', firstStep: 'Первый шаг', firstStepHint: 'Завершите одну миссию', voiceOn: 'Есть голос', voiceOnHint: 'Пройдите разговорную практику', steady: 'Стабильный ученик', steadyHint: 'Серия 3 дня', nova: 'Финишер NOVA', novaHint: 'Завершите все 20 миссий',
    weekTitle: 'Эта неделя', weekHint: 'Обновление каждый понедельник', weekLesson: 'Завершить 3 миссии', weekVoice: 'Пройти 2 разговорные практики', weekStreak: 'Сохранить серию 3 дня', teamChest: 'Учебный сундук', chestHint: 'Откройте сундук, заработанный недельным прогрессом.', open: 'Открыть сундук', chestEmpty: 'Следующий сундук откроется после новой недельной миссии.', youFound: 'Вы получили', limited: 'ОГРАНИЧЕНО', dropTitle: 'Значок Aurora', dropHint: 'Доступен в этом сезоне. Один на ученика.',
    den: 'DEN Омарито', denLead: 'Создайте маленький дом для героя', room: 'Комната', decor: 'Декор', emotes: 'Эмоции', effects: 'Эффекты', placed: 'Добавлено', place: 'Добавить', remove: 'Убрать', wave: 'Приветствие', celebrate: 'Праздник', focus: 'Фокус', aurora: 'Сияние', confetti: 'Конфетти', calm: 'Мягкий свет', preview: 'Просмотр',
    community: 'Сообщество', activity: 'Лента', league: 'Лига', clan: 'Клан', invites: 'Инвайты', cheer: 'Поддержать', cheered: 'Поддержано', today: 'сегодня', completedMission: 'Завершила миссию 04 · Ты в группе', reachedStreak: 'Достиг серии в 7 дней', learnerLevel: 'A1 · Английский', leagueTitle: 'Серебряная лига', leagueHint: 'Ученики вашего уровня · осталось 4 дня', you: 'Вы', clanTitle: 'Исследователи NOVA', clanHint: 'Выполняйте командные миссии. Сундук получат все.', joinClan: 'Вступить', leaveClan: 'Выйти', teamProgress: 'Прогресс команды', inviteTitle: 'Хочет учиться вместе', accept: 'Принять', accepted: 'Друг', noInvites: 'Новых приглашений нет', fair: 'Место зависит от учебного XP за неделю. Покупки не влияют.',
    products: 'Больше способов учиться', productsLead: 'Выберите отдельный продукт OMALINGO', courses: 'Спецкурсы', coursesHint: 'Путешествия, работа, экзамены и разговорные треки', ai: 'Пакеты Omarito AI', aiHint: 'Дополнительные ролевые игры и детальный разбор', experience: 'Omarito Experience', experienceHint: 'Интерактивные истории с выбором', family: 'Семейный план', familyHint: 'До 5 профилей с отдельным прогрессом', gifts: 'Подарки', giftsHint: 'Подарите доступ к обучению', schools: 'Школам и бизнесу', schoolsHint: 'Группы, задания и отчёты', included: 'Что входит', choose: 'Выбрать', activate: 'Активировать демо', activated: 'Добавлено', contact: 'Запросить демо', backProducts: 'Все продукты', recipientEmail: 'Email получателя', familyEmail: 'Email члена семьи', workEmail: 'Рабочий email', frontend: 'Интерактивный фронтенд. Оплата и выдача доступа подключаются на этапе бэкенда.',
  }
  const kk = {
    rewards: 'Марапаттар', achievements: 'Жетістіктер', weekly: 'Апта', chests: 'Сандықтар', drops: 'Дроптар', claim: 'Алу', claimed: 'Алынды', locked: 'Жабық', ready: 'Дайын',
    rewardLead: 'Барлығы оқу арқылы жиналады', firstStep: 'Алғашқы қадам', firstStepHint: 'Бір миссияны аяқтаңыз', voiceOn: 'Дауыс бар', voiceOnHint: 'Сөйлеу жаттығуын аяқтаңыз', steady: 'Тұрақты оқушы', steadyHint: '3 күндік серияға жетіңіз', nova: 'NOVA финишері', novaHint: '20 миссияны аяқтаңыз',
    weekTitle: 'Осы апта', weekHint: 'Әр дүйсенбі жаңарады', weekLesson: '3 миссияны аяқтау', weekVoice: '2 сөйлеу жаттығуы', weekStreak: '3 күндік серияны сақтау', teamChest: 'Оқу сандығы', chestHint: 'Апталық прогресс үшін сандықты ашыңыз.', open: 'Сандықты ашу', chestEmpty: 'Келесі сандық жаңа апталық миссиядан кейін ашылады.', youFound: 'Сіз алдыңыз', limited: 'ШЕКТЕУЛІ', dropTitle: 'Aurora белгісі', dropHint: 'Осы маусымда қолжетімді. Бір оқушыға біреу.',
    den: 'Omarito DEN', denLead: 'Кейіпкерге шағын үй жасаңыз', room: 'Бөлме', decor: 'Декор', emotes: 'Эмоциялар', effects: 'Әсерлер', placed: 'Қосылды', place: 'Қосу', remove: 'Алып тастау', wave: 'Сәлемдесу', celebrate: 'Мереке', focus: 'Фокус', aurora: 'Шұғыла', confetti: 'Конфетти', calm: 'Жұмсақ жарық', preview: 'Көру',
    community: 'Қауымдастық', activity: 'Лента', league: 'Лига', clan: 'Клан', invites: 'Шақырулар', cheer: 'Қолдау', cheered: 'Қолданды', today: 'бүгін', completedMission: '04 миссияны аяқтады · Сен топтасың', reachedStreak: '7 күндік серияға жетті', learnerLevel: 'A1 · Ағылшын тілі', leagueTitle: 'Күміс лига', leagueHint: 'Сіздің деңгейіңіздегі оқушылар · 4 күн қалды', you: 'Сіз', clanTitle: 'NOVA зерттеушілері', clanHint: 'Командалық миссияларды орындаңыз. Сандықты бәрі алады.', joinClan: 'Қосылу', leaveClan: 'Шығу', teamProgress: 'Команда прогресі', inviteTitle: 'Бірге оқығысы келеді', accept: 'Қабылдау', accepted: 'Дос', noInvites: 'Жаңа шақыру жоқ', fair: 'Орын апталық оқу XP-іне байланысты. Сатып алу әсер етпейді.',
    products: 'Оқудың көбірек жолы', productsLead: 'OMALINGO өнімін таңдаңыз', courses: 'Арнайы курстар', coursesHint: 'Саяхат, жұмыс, емтихан және сөйлеу', ai: 'Omarito AI пакеттері', aiHint: 'Қосымша рөлдік ойын және толық талдау', experience: 'Omarito Experience', experienceHint: 'Таңдауы бар интерактивті оқиғалар', family: 'Отбасылық жоспар', familyHint: '5 профильге дейін, бөлек прогресс', gifts: 'Сыйлықтар', giftsHint: 'Оқу мүмкіндігін сыйлаңыз', schools: 'Мектептер мен бизнеске', schoolsHint: 'Топтар, тапсырмалар және есептер', included: 'Не кіреді', choose: 'Таңдау', activate: 'Демоны іске қосу', activated: 'Қосылды', contact: 'Демо сұрау', backProducts: 'Барлық өнімдер', recipientEmail: 'Алушының email-ы', familyEmail: 'Отбасы мүшесінің email-ы', workEmail: 'Жұмыс email-ы', frontend: 'Интерактивті фронтенд. Төлем мен қолжетімділік бэкенд кезеңінде қосылады.',
  }
  return locale === 'ru' ? ru : locale === 'kk' ? kk : en
}

type RewardProps = {
  completed: number
  speakingDone: boolean
  streak: number
  claimedAchievements: string[]
  claimedWeekly: string[]
  openedChests: number
  claimedDrops: string[]
  onClaimAchievement: (id: string) => void
  onClaimWeekly: (id: string) => void
  onOpenChest: () => void
  onClaimDrop: (id: string) => void
  onBack: () => void
}

export function RewardsHub(props: RewardProps) {
  const c = useCopy()
  const [tab, setTab] = useState<'achievements' | 'weekly' | 'chests' | 'drops'>('achievements')
  const [chestReward, setChestReward] = useState('')
  const achievements = [
    ['first', c.firstStep, c.firstStepHint, props.completed >= 1],
    ['voice', c.voiceOn, c.voiceOnHint, props.speakingDone],
    ['steady', c.steady, c.steadyHint, props.streak >= 3],
    ['nova', c.nova, c.novaHint, props.completed >= 20],
  ] as const
  const weekly = [
    ['lesson-3', c.weekLesson, Math.min(3, props.completed), 3],
    ['voice-2', c.weekVoice, props.speakingDone ? 1 : 0, 2],
    ['streak-3', c.weekStreak, Math.min(3, props.streak), 3],
  ] as const
  function openChest() {
    props.onOpenChest()
    setChestReward(props.openedChests % 2 ? '+2 Tickets' : '+25 Lingo')
  }
  return <div className="product-screen rewards-hub"><FeatureTop title={c.rewards} onBack={props.onBack}/><div className="feature-lead"><span><FIcon name="gift"/></span><div><h1>{c.rewards}</h1><p>{c.rewardLead}</p></div></div><nav className="feature-tabs">{(['achievements', 'weekly', 'chests', 'drops'] as const).map((id) => <button className={tab === id ? 'active' : ''} onClick={() => setTab(id)} key={id}>{c[id]}</button>)}</nav>
    {tab === 'achievements' && <div className="feature-list">{achievements.map(([id, title, hint, ready]) => { const claimed = props.claimedAchievements.includes(id); return <article className={ready ? 'ready' : ''} key={id}><span><FIcon name={ready ? 'spark' : 'shield'}/></span><div><b>{title}</b><small>{hint}</small></div><button disabled={!ready || claimed} onClick={() => props.onClaimAchievement(id)}>{claimed ? c.claimed : ready ? c.claim : c.locked}</button></article>})}</div>}
    {tab === 'weekly' && <><div className="feature-section-head"><div><b>{c.weekTitle}</b><small>{c.weekHint}</small></div><strong>{weekly.filter(([, , value, goal]) => value >= goal).length}/3</strong></div><div className="feature-list">{weekly.map(([id, title, value, goal]) => { const ready = value >= goal; const claimed = props.claimedWeekly.includes(id); return <article className={ready ? 'ready' : ''} key={id}><span><FIcon name={ready ? 'check' : 'spark'}/></span><div><b>{title}</b><div className="mini-progress"><i style={{ width: `${Math.min(100, value / goal * 100)}%` }}/></div><small>{value}/{goal}</small></div><button disabled={!ready || claimed} onClick={() => props.onClaimWeekly(id)}>{claimed ? c.claimed : ready ? c.claim : c.locked}</button></article>})}</div></>}
    {tab === 'chests' && <div className="chest-panel"><div className={chestReward ? 'opened' : ''}><FIcon name="box" size={62}/></div><h2>{c.teamChest}</h2><p>{chestReward ? `${c.youFound}: ${chestReward}` : props.openedChests < 1 ? c.chestHint : c.chestEmpty}</p><button className="primary" disabled={props.openedChests >= 1} onClick={openChest}>{props.openedChests >= 1 ? c.claimed : c.open}</button></div>}
    {tab === 'drops' && <article className="limited-drop"><small>{c.limited}</small><img src={`${A}/badge-gold.png`} alt=""/><h2>{c.dropTitle}</h2><p>{c.dropHint}</p><button className="primary" disabled={props.claimedDrops.includes('aurora')} onClick={() => props.onClaimDrop('aurora')}>{props.claimedDrops.includes('aurora') ? c.claimed : c.claim}</button></article>}
  </div>
}

export function DenStudio({ placed, onToggle, onBack }: { placed: string[]; onToggle: (id: string) => void; onBack: () => void }) {
  const c = useCopy()
  const [tab, setTab] = useState<'decor' | 'emotes' | 'effects'>('decor')
  const [emote, setEmote] = useState('wave')
  const [effect, setEffect] = useState('aurora')
  const decor = [['plant', '🪴'], ['lamp', '💡'], ['books', '📚'], ['cushion', '🛋️'], ['globe', '🌍'], ['trophy', '🏆']]
  return <div className={`product-screen den-studio den-effect-${effect}`}><FeatureTop title={c.den} onBack={onBack}/><div className="den-room"><span className="den-label">{c.room}</span><div className="den-placed">{placed.map((id) => <span key={id}>{decor.find(([key]) => key === id)?.[1]}</span>)}</div><img className={`den-hero emote-${emote}`} src={`${A}/hero-standing.png`} alt="Omarito"/><small>{c.preview}</small></div><div className="product-heading"><h1>{c.denLead}</h1></div><nav className="feature-tabs"><button className={tab === 'decor' ? 'active' : ''} onClick={() => setTab('decor')}>{c.decor}</button><button className={tab === 'emotes' ? 'active' : ''} onClick={() => setTab('emotes')}>{c.emotes}</button><button className={tab === 'effects' ? 'active' : ''} onClick={() => setTab('effects')}>{c.effects}</button></nav>
    {tab === 'decor' && <div className="den-grid">{decor.map(([id, emoji]) => { const active = placed.includes(id); return <button className={active ? 'active' : ''} onClick={() => onToggle(id)} key={id}><span>{emoji}</span><b>{id}</b><small>{active ? c.remove : c.place}</small></button>})}</div>}
    {tab === 'emotes' && <div className="choice-pills">{[['wave', c.wave], ['celebrate', c.celebrate], ['focus', c.focus]].map(([id, label]) => <button className={emote === id ? 'active' : ''} onClick={() => setEmote(id)} key={id}>{label}</button>)}</div>}
    {tab === 'effects' && <div className="choice-pills">{[['aurora', c.aurora], ['confetti', c.confetti], ['calm', c.calm]].map(([id, label]) => <button className={effect === id ? 'active' : ''} onClick={() => setEffect(id)} key={id}>{label}</button>)}</div>}
  </div>
}

type CommunityProps = { reactions: string[]; friends: string[]; clanJoined: boolean; onReact: (id: string) => void; onAccept: (id: string) => void; onClan: (joined: boolean) => void; onBack: () => void }

export function CommunityHub(props: CommunityProps) {
  const c = useCopy()
  const [tab, setTab] = useState<'activity' | 'league' | 'clan' | 'invites'>('activity')
  const people = [['maya', 'Maya', c.completedMission], ['alex', 'Alex', c.reachedStreak]]
  const ranks = [['1', 'Sofia', '820'], ['2', 'Daniyar', '760'], ['3', c.you, '710'], ['4', 'Maya', '690'], ['5', 'Leo', '640']]
  const invites = [['nora', 'Nora', c.learnerLevel], ['adil', 'Adil', c.learnerLevel]]
  return <div className="product-screen social-hub"><FeatureTop title={c.community} onBack={props.onBack}/><nav className="feature-tabs">{(['activity', 'league', 'clan', 'invites'] as const).map((id) => <button className={tab === id ? 'active' : ''} onClick={() => setTab(id)} key={id}>{c[id]}</button>)}</nav>
    {tab === 'activity' && <div className="social-feed">{people.map(([id, name, text]) => <article key={id}><span>{name[0]}</span><div><b>{name}</b><p>{text}</p><small>{c.today}</small></div><button className={props.reactions.includes(id) ? 'active' : ''} onClick={() => props.onReact(id)}>♡ {props.reactions.includes(id) ? c.cheered : c.cheer}</button></article>)}</div>}
    {tab === 'league' && <><div className="league-head"><FIcon name="crown" size={34}/><div><h2>{c.leagueTitle}</h2><p>{c.leagueHint}</p></div></div><div className="rank-list">{ranks.map(([rank, name, xp]) => <div className={name === c.you ? 'you' : ''} key={rank}><b>{rank}</b><span>{name}</span><strong>{xp} XP</strong></div>)}</div><p className="fair-note">{c.fair}</p></>}
    {tab === 'clan' && <div className="clan-panel"><span><FIcon name="shield" size={42}/></span><h2>{c.clanTitle}</h2><p>{c.clanHint}</p><div className="mini-progress"><i style={{ width: props.clanJoined ? '62%' : '0%' }}/></div><small>{c.teamProgress} · {props.clanJoined ? '31/50' : '0/50'}</small><button className={props.clanJoined ? 'secondary' : 'primary'} onClick={() => props.onClan(!props.clanJoined)}>{props.clanJoined ? c.leaveClan : c.joinClan}</button></div>}
    {tab === 'invites' && <div className="feature-list">{invites.filter(([id]) => !props.friends.includes(id)).map(([id, name, level]) => <article key={id}><span>{name[0]}</span><div><b>{name}</b><small>{c.inviteTitle}<br/>{level}</small></div><button onClick={() => props.onAccept(id)}>{c.accept}</button></article>)}{invites.every(([id]) => props.friends.includes(id)) && <div className="empty-state"><FIcon name="people" size={38}/><p>{c.noInvites}</p></div>}</div>}
  </div>
}

type ProductId = 'courses' | 'ai' | 'experience' | 'family' | 'gifts' | 'schools'
export function EcosystemHub({ initial, owned, onOwn, onBack }: { initial: ProductId; owned: string[]; onOwn: (id: ProductId) => void; onBack: () => void }) {
  const c = useCopy()
  const [selected, setSelected] = useState<ProductId | ''>(initial)
  const [choice, setChoice] = useState('0')
  const [contact, setContact] = useState('')
  const products: Array<[ProductId, string, string, string]> = [
    ['courses', c.courses, c.coursesHint, 'book'], ['ai', c.ai, c.aiHint, 'mic'], ['experience', c.experience, c.experienceHint, 'spark'], ['family', c.family, c.familyHint, 'people'], ['gifts', c.gifts, c.giftsHint, 'gift'], ['schools', c.schools, c.schoolsHint, 'shield'],
  ]
  const details: Record<ProductId, string[]> = {
    courses: ['Travel English', 'English for Work', 'Speaking Sprint'], ai: ['10 AI conversations', 'Pronunciation feedback', 'Roleplay library'], experience: ['Branching story', 'Voice choices', 'Collectible ending'], family: ['5 learner profiles', 'Separate progress', 'Family challenges'], gifts: ['1–12 month access', 'Personal message', 'Scheduled delivery'], schools: ['Teacher dashboard', 'Assignments', 'Progress reports'],
  }
  const product = products.find(([id]) => id === selected)
  const needsContact = selected === 'family' || selected === 'gifts' || selected === 'schools'
  return <div className="product-screen ecosystem-hub"><FeatureTop title={selected ? c.backProducts : c.products} onBack={selected ? () => setSelected('') : onBack}/>{!selected ? <><div className="product-heading"><h1>{c.products}</h1><p>{c.productsLead}</p></div><div className="ecosystem-grid">{products.map(([id, title, hint, icon]) => <button onClick={() => { setSelected(id); setChoice('0'); setContact('') }} key={id}><span><FIcon name={icon}/></span><b>{title}</b><small>{hint}</small><FIcon name="arrow" size={16}/></button>)}</div></> : product && <div className="product-detail"><span><FIcon name={product[3]} size={36}/></span><h1>{product[1]}</h1><p>{product[2]}</p><section className="product-choices"><small>{c.included}</small>{details[selected].map((item, index) => <button className={choice === String(index) ? 'selected' : ''} onClick={() => setChoice(String(index))} key={item}><FIcon name={choice === String(index) ? 'check' : 'arrow'} size={16}/><span>{item}</span></button>)}</section>{needsContact && <label className="product-contact">{selected === 'gifts' ? c.recipientEmail : selected === 'family' ? c.familyEmail : c.workEmail}<input type="email" inputMode="email" value={contact} onChange={(event) => setContact(event.target.value)} placeholder="name@example.com"/></label>}<button className="primary" disabled={owned.includes(selected) || (needsContact && !contact.includes('@'))} onClick={() => onOwn(selected)}>{owned.includes(selected) ? c.activated : selected === 'schools' ? c.contact : c.activate}</button><p className="fair-note">{c.frontend}</p></div>}</div>
}
