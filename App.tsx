import { useEffect, useRef, useState } from 'react'
import { artwork, crochet } from './data/gallery'
import { reminders } from './data/reminders'
import './App.css'

const navigation = [
  { label: 'Home', id: 'home' },
  { label: 'Your worth', id: 'worth' },
  { label: 'Art gallery', id: 'gallery' },
  { label: 'Coffee & books', id: 'coffee' },
  { label: 'Difficult days', id: 'difficult-days' },
  { label: 'Little joys', id: 'little-joys' },
  { label: 'Your letter', id: 'letter' },
]

const joys = [
  { title: 'A slow cup of coffee', detail: 'The first warm sip. A moment that belongs only to you.', icon: 'cup' },
  { title: 'Making something', detail: 'A pencil line, a loop of yarn, a colour you had to try.', icon: 'flower' },
  { title: 'A quiet morning', detail: 'Soft light finding its way into the room, with nowhere you need to be just yet.', icon: 'sun' },
  { title: 'Being outside', detail: 'A little patch of green, a breeze, or a leaf doing its own thing.', icon: 'leaf' },
  { title: 'A story to wander into', detail: 'A few pages, a familiar world, or a story waiting to be found.', icon: 'book' },
  { title: 'A small thing finished', detail: 'Even the smallest step counts. And rest counts, too.', icon: 'spark' },
  { title: 'Rain against the window', detail: 'The gentle reminder that you can stay in and take your time.', icon: 'rain' },
  { title: 'A colour that feels like you', detail: 'Today, maybe it is the calm of teal. Tomorrow, it can be something else.', icon: 'art' },
]

const comforts = [
  'You do not have to solve the whole day right now. Just this next minute is enough.',
  'You are allowed to ask someone kind to sit with you, even if you do not know what to say.',
  'There is no prize for carrying everything alone. Let someone help you hold a little of it.',
  'A hard feeling is real, but it is not the whole story of you.',
  'Rest is not something you have to deserve first.',
]

const groundingPrompts = [
  { sense: 'See', prompt: 'Notice five things around you. Let your eyes rest on each one for a moment.' },
  { sense: 'Touch', prompt: 'Notice four things you can feel: your feet on the floor, fabric, a cool surface.' },
  { sense: 'Hear', prompt: 'Listen for three sounds, near or far. There is no need to name them perfectly.' },
  { sense: 'Smell', prompt: 'Notice two scents, or simply the air around you.' },
  { sense: 'Taste', prompt: 'Notice one taste, or take a small sip of water and feel it as you do.' },
]

type GalleryItem = {
  title: string
  category: string
  image: string
  alt: string
  description: string
}

const letterParagraphs = [
  'I hope you remember that you matter, even on the days when everything feels difficult.',
  "You don't have to be perfect. You don't have to have everything figured out. You don't have to be cheerful all the time.",
  'There is something genuinely beautiful about the way you create things, the way you bring ideas to life and the little things that make you who you are.',
  'Your drawings, your paintings, your crochet, your interests and your imagination are all wonderful parts of you.',
  "But even on the days when you don't feel creative, motivated or particularly happy, you are still just as deserving of kindness.",
  'Please give yourself the same patience and care that you would give someone you love.',
  'Take things one day at a time.',
  'You deserve good things, support, peace and people who remind you that you are not alone.',
  'And whenever you need a little reminder, this place will be here.',
]

function Leaf({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 94" fill="none" aria-hidden="true">
      <path d="M32 89C31 62 12 48 10 29 8 12 19 5 31 5c16 0 27 14 23 32-4 18-21 27-22 52Z" fill="currentColor" fillOpacity=".15" />
      <path d="M32 89c1-32 1-51-1-76M31 59 17 42m15 3 14-17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    cup: 'M6 9h12v8a6 6 0 0 1-12 0V9Zm12 2h2a3 3 0 0 1 0 6h-2M9 4c0 2 2 2 2 4m3-4c0 2 2 2 2 4M5 23h16',
    flower: 'M12 12c-4-1-5-5-2-7 2-1 4 1 4 4 2-3 5-3 6-1 1 3-2 5-5 5 3 1 4 4 2 6-3 2-5-1-5-4-1 3-4 4-6 2-1-3 1-5 4-6-3 0-5-2-4-5 2-2 5-1 6 2Z',
    sun: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42',
    leaf: 'M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-6 10-16ZM5 20c3-5 7-8 12-11',
    book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Zm0 0V22m4-15h8',
    spark: 'm12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 12 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z',
    rain: 'M7 17a4 4 0 1 1 .8-7.9A5 5 0 0 1 17 8a4.5 4.5 0 0 1 .5 9M9 20l-1 2m6-2-1 2m6-2-1 2',
    art: 'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.7-3.1 1.9 1.9 0 0 1 1.6-2.9H19a2 2 0 0 0 2-2A10 10 0 0 0 12 3ZM7.5 12h.01M10 7.5h.01M15 7.5h.01',
  }
  return (
    <svg className="joy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] ?? paths.spark} />
    </svg>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [reminderIndex, setReminderIndex] = useState(0)
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('little-reminders')
      if (!saved) return []
      const parsed: unknown = JSON.parse(saved)
      return Array.isArray(parsed) && parsed.every((value) => Number.isInteger(value) && value >= 0 && value < reminders.length)
        ? parsed
        : []
    } catch (error) {
      console.warn('Saved reminders could not be loaded.', error)
      return []
    }
  })
  const [galleryTab, setGalleryTab] = useState<'artwork' | 'crochet'>('artwork')
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)
  const [letterOpen, setLetterOpen] = useState(false)
  const [coffeeNote, setCoffeeNote] = useState('A small pause is still a real pause. Let this moment be yours.')
  const [breathing, setBreathing] = useState(false)
  const [breathPhase, setBreathPhase] = useState<'in' | 'out'>('in')
  const [timerRunning, setTimerRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [activeGrounding, setActiveGrounding] = useState<number | null>(null)
  const [activeJoy, setActiveJoy] = useState<number | null>(null)
  const [joyDiscovery, setJoyDiscovery] = useState<number | null>(null)
  const lightboxRef = useRef<HTMLDialogElement>(null)
  const currentGallery = galleryTab === 'artwork' ? artwork : crochet
  const reminderIsFavorite = favorites.includes(reminderIndex)

  useEffect(() => {
    try {
      localStorage.setItem('little-reminders', JSON.stringify(favorites))
    } catch (error) {
      console.warn('Saved reminders could not be stored.', error)
    }
  }, [favorites])

  useEffect(() => {
    const dialog = lightboxRef.current
    if (lightbox && dialog && !dialog.open) dialog.showModal()
    if (!lightbox && dialog?.open) dialog.close()
  }, [lightbox])

  useEffect(() => {
    if (!breathing) return
    const interval = window.setInterval(() => setBreathPhase((phase) => phase === 'in' ? 'out' : 'in'), breathPhase === 'in' ? 4000 : 6000)
    return () => window.clearInterval(interval)
  }, [breathing, breathPhase])

  useEffect(() => {
    if (!timerRunning) return
    const interval = window.setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          setTimerRunning(false)
          return 0
        }
        return seconds - 1
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [timerRunning])

  useEffect(() => {
    if (!lightbox) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightbox])

  function chooseAnotherReminder() {
    setReminderIndex((current) => {
      const offset = Math.floor(Math.random() * (reminders.length - 1)) + 1
      return (current + offset) % reminders.length
    })
  }

  function toggleFavorite(index: number) {
    setFavorites((current) => current.includes(index)
      ? current.filter((item) => item !== index)
      : [...current, index])
  }

  function startBreathing() {
    setBreathPhase('in')
    setBreathing(true)
  }

  function resetTimer() {
    setTimerRunning(false)
    setSecondsLeft(60)
  }

  function discoverJoy() {
    const next = Math.floor(Math.random() * joys.length)
    setJoyDiscovery(next)
    setActiveJoy(next)
  }

  function goTo(id: string) {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="A little reminder that you matter, home">
          <span className="wordmark-flower" aria-hidden="true">✳</span>
          <span>a little reminder<br /><em>that you matter</em></span>
        </a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          <span>{menuOpen ? 'Close' : 'Explore'}</span>
          <span className={`menu-lines${menuOpen ? ' is-open' : ''}`} aria-hidden="true"><i /><i /></span>
        </button>
        <nav id="primary-navigation" className={`primary-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {navigation.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
        </nav>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-sun" aria-hidden="true" />
        <Leaf className="hero-leaf hero-leaf-one" />
        <Leaf className="hero-leaf hero-leaf-two" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> A little place to come back to yourself <span /></p>
          <h1>A little reminder<br />that <em>you matter.</em></h1>
          <p className="hero-description">For the days that feel a little heavier, and for the days when you simply need a reminder that there is still so much good in you.</p>
          <button type="button" className="button button-dark" onClick={() => goTo('worth')}>Come inside <span aria-hidden="true">↗</span></button>
          <p className="handwritten hero-note">A little place to pause, breathe and remember.</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-art-sun" />
          <svg className="hero-vase" viewBox="0 0 300 360" fill="none">
            <path d="M146 99c-7 45-7 76-5 104 1 17-11 38-25 63-14 26-14 44 6 53 24 11 76 9 99 0 21-8 23-26 7-53-15-24-25-47-24-65 3-37 0-72-6-102" fill="#d5e8df" stroke="#286963" strokeWidth="2" />
            <path d="M144 102c-17-11-27-33-22-58 5-28 25-42 45-35 22 8 26 33 12 55-10 15-21 30-28 44m4-4c-9-24-8-51 8-69m-8 69c5-32 17-51 42-58m-42 58c-14-20-32-31-54-29" stroke="#286963" strokeWidth="2" strokeLinecap="round" />
            <path d="M89 51c18-21 40-20 54 3-1 20-20 34-40 29-10-4-17-17-14-32Zm89-34c24-3 38 14 32 38-12 14-34 15-45 0-6-10 0-29 13-38Zm32 33c24 6 30 26 13 44-18 7-37-4-39-22 0-12 13-24 26-22Z" fill="#a8d5cf" stroke="#286963" strokeWidth="1.7" />
            <path d="M132 112c13-8 28-8 42 0" stroke="#286963" strokeWidth="1.8" />
            <path d="M103 304c30 7 73 8 106-1" stroke="#286963" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="hero-caption">something lovely, growing<br />at its own pace</span>
          <span className="hero-sparkle sparkle-a">✳</span>
          <span className="hero-sparkle sparkle-b">✳</span>
        </div>
        <a className="scroll-cue" href="#worth"><span /> A gentle beginning</a>
      </section>

      <section className="welcome-strip">
        <p>Made with tenderness, for the days you need it.</p>
        <span aria-hidden="true">✳</span>
        <p>No fixing. No striving. Just a little room to be.</p>
      </section>

      <section className="section worth-section" id="worth">
        <div className="section-heading centered">
          <p className="eyebrow">01 - A note about your worth</p>
          <h2>You don't have to <em>earn</em><br />your place here.</h2>
          <p>Your worth isn't a reward for doing enough. It belongs to you on the productive days, the messy days, and all the ordinary ones in between.</p>
        </div>
        <div className="reminder-layout">
          <div className="reminder-intro">
            <span className="note-number">A SMALL TRUTH, TO KEEP</span>
            <p>You are a whole person, not a list of things you have or haven't done. You get to exist without proving anything first.</p>
            <span className="scribble" aria-hidden="true">↗</span>
          </div>
          <article className="reminder-card" aria-live="polite">
            <span className="quote-mark" aria-hidden="true">“</span>
            <p>{reminders[reminderIndex]}</p>
            <div className="reminder-actions">
              <button type="button" className="button button-dark" onClick={chooseAnotherReminder}>Another little reminder <span aria-hidden="true">↗</span></button>
              <button type="button" className={`save-button${reminderIsFavorite ? ' saved' : ''}`} onClick={() => toggleFavorite(reminderIndex)} aria-pressed={reminderIsFavorite}>
                <span aria-hidden="true">{reminderIsFavorite ? '♥' : '♡'}</span> {reminderIsFavorite ? 'Saved for later' : 'Keep this one'}
              </button>
            </div>
          </article>
          <div className="favorite-list">
            <div>
              <span className="note-number">YOUR LITTLE COLLECTION</span>
              <h3>Words to keep close</h3>
            </div>
            {favorites.length === 0 ? (
              <p className="empty-favorites">The reminders you save will find a home here.</p>
            ) : (
              <ul>
                {favorites.map((index) => <li key={index}><span>“{reminders[index]}”</span><button type="button" onClick={() => toggleFavorite(index)} aria-label={`Remove reminder: ${reminders[index]}`}>×</button></li>)}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="gallery-section section" id="gallery">
        <div className="gallery-header">
          <div className="section-heading">
            <p className="eyebrow">02 - A little gallery</p>
            <h2>Made by hand,<br /><em>held with love.</em></h2>
          </div>
          <p>There is something lovely about making a thing that didn't exist before. This little gallery is a place for the work, the texture, and the time behind it.</p>
        </div>
        <div className="gallery-tabs" role="tablist" aria-label="Gallery collections">
          <button type="button" role="tab" aria-selected={galleryTab === 'artwork'} className={galleryTab === 'artwork' ? 'selected' : ''} onClick={() => setGalleryTab('artwork')}>Studio work <span>03</span></button>
          <button type="button" role="tab" aria-selected={galleryTab === 'crochet'} className={galleryTab === 'crochet' ? 'selected' : ''} onClick={() => setGalleryTab('crochet')}>Crochet <span>05</span></button>
        </div>
        <div className={`gallery-grid${galleryTab === 'crochet' ? ' crochet-grid' : ''}`} role="tabpanel">
          {currentGallery.map((item, index) => (
            <button type="button" className={`gallery-item gallery-item-${index + 1}`} key={item.title} onClick={() => setLightbox(item)} aria-label={`View ${item.title}`}>
              <span className="gallery-image-wrap"><img src={item.image} alt={item.alt} loading="lazy" /></span>
              <span className="gallery-item-caption"><span><strong>{item.title}</strong><small>{item.category}</small></span><span className="gallery-arrow" aria-hidden="true">↗</span></span>
            </button>
          ))}
        </div>
        <p className="gallery-footnote"><span aria-hidden="true">✳</span> A little collection of real work and thoughtful texture.</p>
      </section>

      <section className="coffee-section" id="coffee">
        <div className="coffee-content section">
          <div className="coffee-art" aria-hidden="true">
            <div className="coffee-ring ring-one" /><div className="coffee-ring ring-two" />
            <svg className="coffee-cup" viewBox="0 0 270 250" fill="none">
              <path d="M53 88h153v72c0 37-30 67-67 67h-19c-37 0-67-30-67-67V88Z" fill="#efe1d0" stroke="#6b5543" strokeWidth="2.2" />
              <path d="M206 105h14c23 0 32 16 28 34-4 17-17 27-40 25" stroke="#6b5543" strokeWidth="8" strokeLinecap="round" />
              <path d="M66 107h126M79 204h108" stroke="#b48b69" strokeWidth="1.5" />
              <path d="M105 73c-13-15 7-20-2-38m39 38c-13-15 7-20-2-38m40 38c-13-15 7-20-2-38" stroke="#94785f" strokeWidth="2" strokeLinecap="round" />
              <path d="M40 232h190" stroke="#6b5543" strokeWidth="2" strokeLinecap="round" />
              <path d="M69 225c7-8 14-8 21 0m93-1c8-8 15-8 23 0" stroke="#a8d5cf" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="coffee-stamp">a moment<br />for you</span>
          </div>
          <div className="coffee-copy">
            <p className="eyebrow">03 - The coffee corner</p>
            <h2>Put the kettle on.<br /><em>Stay a little.</em></h2>
            <p>Imagine the warm mug between your hands. There's nothing on the other side of this moment you have to rush toward.</p>
            <div className="coffee-note" aria-live="polite"><span className="note-number">A NOTE WITH YOUR COFFEE</span><p>{coffeeNote}</p></div>
            <button type="button" className="text-button" onClick={() => setCoffeeNote((current) => {
              const nextNotes = [
                'You can begin again as many times as you need.',
                'Let this be enough for right now: you are here, and you are trying.',
                'Not every quiet moment needs to become something.',
                'A small pause is still a real pause. Let this moment be yours.',
              ]
              return nextNotes[(nextNotes.indexOf(current) + 1) % nextNotes.length]
            })}>Pour another thought <span aria-hidden="true">↗</span></button>
            <div className="book-note"><span className="book-spine" aria-hidden="true" /><p><strong>A note for the reading nook</strong><br />A story can be a lovely place to rest. If there is a book you love, there is room for it here. That detail can be updated whenever you want.</p></div>
          </div>
        </div>
      </section>

      <section className="difficult-section section" id="difficult-days">
        <div className="section-heading">
          <p className="eyebrow">04 - For the difficult days</p>
          <h2>One moment.<br /><em>Then the next.</em></h2>
          <p>This isn't a test, and there's nothing to get right. Choose whatever feels comfortable, or skip all of it. You can take things one moment at a time.</p>
        </div>
        <div className="care-grid">
          <article className="care-card breathing-card">
            <span className="note-number">A SOFT BREATHING PAUSE</span>
            <h3>Follow the little circle</h3>
            <p>This gentle rhythm is just an invitation to pause, not treatment, and not something you have to complete.</p>
            <div className={`breath-orb${breathing ? ' is-breathing phase-' + breathPhase : ''}`} aria-hidden="true"><span>{breathing ? (breathPhase === 'in' ? 'breathe in' : 'breathe out') : 'a small pause'}</span></div>
            <div className="breath-controls">
              {!breathing ? <button className="button button-dark" type="button" onClick={startBreathing}>Begin gently</button> : <button className="button button-outline" type="button" onClick={() => setBreathing(false)}>Stop whenever</button>}
            </div>
            <span className="quiet-note">There's no wrong way to do this.</span>
          </article>
          <article className="care-card grounding-card">
            <span className="note-number">FIND A LITTLE GROUND</span>
            <h3>Come back to this room</h3>
            <p>If it feels okay, notice what's around you through your senses. There is no pressure to finish every step.</p>
            <div className="grounding-list">
              {groundingPrompts.map((item, index) => (
                <button className={activeGrounding === index ? 'active' : ''} type="button" key={item.sense} onClick={() => setActiveGrounding(activeGrounding === index ? null : index)} aria-expanded={activeGrounding === index}>
                  <span>{index + 1}</span><strong>{item.sense}</strong><span aria-hidden="true">{activeGrounding === index ? '−' : '+'}</span>
                  {activeGrounding === index && <small>{item.prompt}</small>}
                </button>
              ))}
            </div>
          </article>
          <article className="care-card timer-card">
            <span className="note-number">A GENTLE LITTLE PAUSE</span>
            <h3>Take a minute</h3>
            <p>A quiet minute to unclench your shoulders, look out the window, or simply be.</p>
            <div className="timer-display" aria-live="polite">{String(Math.floor(secondsLeft / 60)).padStart(2, '0')}<span>:</span>{String(secondsLeft % 60).padStart(2, '0')}</div>
            <div className="timer-controls">
              <button type="button" className="button button-dark" onClick={() => secondsLeft > 0 && setTimerRunning(!timerRunning)}>{timerRunning ? 'Pause' : secondsLeft === 0 ? 'Finished gently' : 'Start a minute'}</button>
              <button type="button" className="text-button" onClick={resetTimer}>Reset</button>
            </div>
          </article>
          <article className="care-card comforts-card">
            <span className="note-number">IF YOU NEED A KIND WORD</span>
            <h3>You don't have to do this alone.</h3>
            {comforts.map((message) => <p className="comfort-line" key={message}><span aria-hidden="true">-</span>{message}</p>)}
          </article>
        </div>
        <aside className="support-note">
          <span className="support-mark" aria-hidden="true">✳</span>
          <div>
            <h3>This little place can sit beside you, but it can't replace real support.</h3>
            <p>If things feel overwhelming, please reach out to someone you trust. If you may be in immediate danger, contact emergency services and a trusted person who can be physically with you.</p>
            <div className="support-links"><a href="https://988lifeline.org/" target="_blank" rel="noreferrer">988 Suicide & Crisis Lifeline <span aria-hidden="true">↗</span></a><a href="tel:911">Emergency assistance: 911</a></div>
          </div>
        </aside>
      </section>

      <section className="joys-section section" id="little-joys">
        <div className="joys-header">
          <div className="section-heading">
            <p className="eyebrow">05 - A collection of small joys</p>
            <h2>Little things,<br /><em>lovingly noticed.</em></h2>
          </div>
          <div><p>A scrapbook of the gentle, ordinary things that make a day feel like your own. Pick one to open.</p><button className="button button-outline" type="button" onClick={discoverJoy}>Surprise me <span aria-hidden="true">↗</span></button></div>
        </div>
        {joyDiscovery !== null && <p className="discovery-note handwritten" aria-live="polite">A little thing to notice: {joys[joyDiscovery].title.toLowerCase()}.</p>}
        <div className="joys-grid">
          {joys.map((joy, index) => (
            <button className={`joy-card${activeJoy === index ? ' is-open' : ''}${joyDiscovery === index ? ' discovered' : ''}`} type="button" key={joy.title} onClick={() => setActiveJoy(activeJoy === index ? null : index)} aria-expanded={activeJoy === index}>
              <span className="joy-card-top"><Icon name={joy.icon} /><span aria-hidden="true">{activeJoy === index ? '−' : '+'}</span></span>
              <strong>{joy.title}</strong>
              {activeJoy === index && <span className="joy-detail">{joy.detail}</span>}
            </button>
          ))}
        </div>
      </section>

      <section className="letter-section" id="letter">
        <div className="letter-section-inner section">
          <div className="letter-intro">
            <p className="eyebrow">06 - A letter for you</p>
            <h2>A few words,<br /><em>to keep close.</em></h2>
            <p>Written by the person who made this little place, with care. Open it whenever you feel like reading.</p>
            {!letterOpen && <button className="button button-dark" type="button" onClick={() => setLetterOpen(true)}>Open your letter <span aria-hidden="true">↗</span></button>}
            {letterOpen && <button className="text-button" type="button" onClick={() => setLetterOpen(false)}>Fold it away <span aria-hidden="true">↗</span></button>}
          </div>
          <div className={`letter-object${letterOpen ? ' is-open' : ''}`}>
            {!letterOpen ? (
              <button className="envelope" type="button" aria-label="Open your letter" onClick={() => setLetterOpen(true)}>
                <span className="envelope-paper"><span className="handwritten">for you, with care</span><span className="envelope-stamp">✳</span></span>
                <span className="envelope-back" />
                <span className="envelope-flap" />
                <span className="envelope-front" />
                <span className="envelope-seal" aria-hidden="true">✳</span>
              </button>
            ) : (
              <article className="letter-paper" aria-label="A letter for you">
                <p className="letter-salutation">Hey,</p>
                {letterParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <p className="letter-closing">You matter. More than you might realise.<br /><span className="handwritten">With care, the person who made this place</span></p>
              </article>
            )}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-flower" aria-hidden="true">✳</div>
        <p className="footer-message">You matter. Even on the days when you forget.</p>
        <p className="footer-sub">A little reminder, for whenever you need one.</p>
        <div className="footer-bottom"><span>Made with care, and room to breathe.</span><a href="#home">Back to the beginning ↑</a></div>
      </footer>

      <dialog className="lightbox-dialog" ref={lightboxRef} onClick={(event) => {
        if (event.target === lightboxRef.current) setLightbox(null)
      }} onClose={() => setLightbox(null)}>
        {lightbox && <div className="lightbox-content">
          <button type="button" className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close artwork">×</button>
          <img src={lightbox.image} alt={lightbox.alt} />
          <div><p className="note-number">{lightbox.category}</p><h2>{lightbox.title}</h2><p>{lightbox.description}</p></div>
        </div>}
      </dialog>
    </main>
  )
}

export default App
