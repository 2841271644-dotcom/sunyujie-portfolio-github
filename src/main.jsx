import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const assetUrl = (path) => `${import.meta.env.BASE_URL}assets/${path}`
const projectNameText = {
  'operations-1.png': '2026年中盛典活动',
  'operations-2.png': '海外宰牲节',
  'operations-3.png': '其他活动与练习',
  'ui-1.png': '幸运礼物玩法设计',
  'material-1.png': '物料及动画设计',
  'material-2.png': '财富等级标签更新',
  'material-3.png': '中东SVIP等级物料设计',
  'other-1.png': '实习产出',
  'other-2.png': 'AI工作流及工作复盘',
}
const projectContents = {
  operations: {
    5: ['第一个文件/内容一/5.png', '第一个文件/内容一/7.mp4'],
    8: ['第一个文件/内容二/8.png', '第一个文件/内容二/9.png', '第一个文件/内容二/10.png', '第一个文件/内容二/11.png'],
    12: ['第一个文件/内容三/12.png'],
  },
  ui: {
    14: ['第二个文件/14.png', '第二个文件/15.png', '第二个文件/16.png', '第二个文件/17.png', '第二个文件/18.mp4'],
  },
  material: {
    20: ['第三个文件/内容一/20.mp4'],
    21: ['第三个文件/内容三/22.png'],
    22: ['第三个文件/内容/21.png', '第三个文件/内容/21.mp4'],
  },
  other: {
    24: ['第四个文件夹/内容一/24.png'],
    25: ['第四个文件夹/内容二/Frame 41.png'],
  },
}

const catalogGroups = [
  { id: 'operations', label: 'Group 310.png', paths: [
    ['outer-1.png', 5, 'inner-1-1.png', 'operations-1.png'],
    ['outer-2.png', 8, 'inner-1-2.png', 'operations-2.png'],
    ['outer-3.png', 12, 'inner-1-3.png', 'operations-3.png'],
  ] },
  { id: 'ui', label: 'Group 309.png', paths: [
    ['outer-4.png', 14, 'inner-2-1.png', 'ui-1.png'],
  ] },
  { id: 'material', label: 'Group 311.png', paths: [
    ['outer-5.png', 20, 'inner-3-1.png', 'material-1.png'],
    ['outer-6.png', 21, 'inner-3-2.png', 'material-2.png'],
    ['outer-7.png', 22, 'inner-3-3.png', 'material-3.png'],
  ] },
  { id: 'other', label: 'Group 308.png', paths: [
    ['outer-8.png', 24, 'inner-4-1.png', 'other-1.png'],
    ['outer-9.png', 25, 'inner-4-2.png', 'other-2.png'],
  ] },
]

const catalogGroupNames = {
  operations: '运营活动',
  ui: 'UI设计',
  material: '物料设计',
  other: '其他项目',
}

const selfWebsiteLinks = [
  ['闪电特效工作室', 'https://2841271644-dotcom.github.io/lightning-lab/'],
  ['动效工坊', 'https://2841271644-dotcom.github.io/Motion-lab/'],
  ['粒子特效工作室', 'https://2841271644-dotcom.github.io/motion-particle-studio/'],
]

function useRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const update = () => setHash(window.location.hash)
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  const match = hash.match(/^#project\/([^/]+)(?:\/([^/]+))?/)
  const pages = projectContents[match?.[1]]?.[match?.[2]]
  return pages ? { id: match[1], selectedPath: match[2], pages } : null
}

function ContentImage({ src, eager = false }) {
  if (src.endsWith('.mp4')) {
    const videoDimensions = {
      '第一个文件/内容一/7.mp4': '2880 / 7902',
      '第二个文件/18.mp4': '2880 / 8192',
      '第三个文件/内容一/20.mp4': '2880 / 7740',
      '第三个文件/内容/21.mp4': '2856 / 3312',
    }
    return <LoopVideo src={assetUrl(`content/${src}`)} aspectRatio={videoDimensions[src]} />
  }
  return <img className="source-page-image" src={assetUrl(`content/${src}`)} alt="" loading={eager ? 'eager' : 'lazy'} />
}

function LoopVideo({ src, aspectRatio }) {
  const firstRef = useRef(null)
  const secondRef = useRef(null)
  const [active, setActive] = useState(0)
  const transitioningRef = useRef(false)
  const videos = [firstRef, secondRef]

  useEffect(() => {
    const first = firstRef.current
    const second = secondRef.current
    if (!first || !second) return undefined
    setActive(0)
    transitioningRef.current = false
    first.currentTime = 0
    second.currentTime = 0
    second.pause()
    const start = () => first.play().catch(() => {})
    if (first.readyState >= 2) start()
    else first.addEventListener('canplay', start, { once: true })
    return () => {
      first.removeEventListener('canplay', start)
      first.pause()
      second.pause()
    }
  }, [src])

  useEffect(() => {
    const current = videos[active].current
    if (!current) return undefined
    const handleTimeUpdate = () => {
      if (!current.duration || transitioningRef.current || current.currentTime < current.duration - 0.16) return
      transitioningRef.current = true
      const nextIndex = active === 0 ? 1 : 0
      const next = videos[nextIndex].current
      if (!next) return
      next.currentTime = 0
      next.play().catch(() => {})
      setActive(nextIndex)
      current.pause()
      current.currentTime = 0
      transitioningRef.current = false
    }
    current.addEventListener('timeupdate', handleTimeUpdate)
    return () => current.removeEventListener('timeupdate', handleTimeUpdate)
  }, [active])

  return <div className="source-page-video-loop" style={aspectRatio ? { aspectRatio } : undefined} aria-label="Portfolio project animation">
    <video ref={firstRef} className="source-page-video-loop-item" style={{ opacity: active === 0 ? 1 : 0 }} src={src} muted playsInline preload="auto" />
    <video ref={secondRef} className="source-page-video-loop-item" style={{ opacity: active === 1 ? 1 : 0 }} src={src} muted playsInline preload="auto" />
  </div>
}

function IntroVideo({ src, aspectRatio }) {
  const videoRef = useRef(null)
  const [isFading, setIsFading] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined
    const start = () => video.play().catch(() => {})
    const handleTimeUpdate = () => {
      if (video.currentTime >= 9) setIsFading(true)
      if (video.currentTime >= 11) {
        video.pause()
        setIsDone(true)
      }
    }
    const handleEnded = () => setIsDone(true)
    if (video.readyState >= 2) start()
    else video.addEventListener('canplay', start, { once: true })
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    return () => {
      video.removeEventListener('canplay', start)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.pause()
    }
  }, [src])

  if (isDone) return null
  return <div className={`project-intro-animation${isFading ? ' is-fading' : ''}`} style={{ aspectRatio }} aria-label="Project entrance animation">
    <video ref={videoRef} src={src} muted playsInline preload="auto" autoPlay />
  </div>
}

function HorizontalScrubVideo({ src, poster, aspectRatio = '16 / 9', id, className = 'hero-frame', ariaLabel = '横向拖动控制视频进度' }) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)
  const initialFramePendingRef = useRef(false)
  const targetTimeRef = useRef(null)
  const rafRef = useRef(null)
  const lastSeekAtRef = useRef(0)
  const pointerInsideRef = useRef(false)
  const draggingRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video) return undefined

    // Keep the initial frame stable while the browser prepares the final
    // reveal frame. The first visible frame should already show the gift
    // artwork fully, rather than briefly flashing the start of the video.
    setVideoReady(false)
    initialFramePendingRef.current = false
    let isInViewport = false

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

    const seekAtFrameRate = (now) => {
      rafRef.current = null
      const targetTime = targetTimeRef.current
      const duration = video.duration
      if (targetTime == null || !Number.isFinite(duration) || duration <= 0) return

      // Keep the latest pointer target, but do not issue a second seek while
      // the previous one is still being resolved by the browser.
      if (video.seeking || now - lastSeekAtRef.current < 24) {
        rafRef.current = requestAnimationFrame(seekAtFrameRate)
        return
      }

      const nextTime = clamp(targetTime, 0, duration)
      if (Math.abs(video.currentTime - nextTime) > 0.006) {
        video.currentTime = nextTime
        lastSeekAtRef.current = now
      }
      targetTimeRef.current = null
    }

    const scheduleSeek = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(seekAtFrameRate)
    }

    const updateTargetFromClientX = (clientX, clientY) => {
      if (!isInViewport) return
      const rect = container.getBoundingClientRect()
      if (!rect.width) return

      const isInside = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
      // A hover should only scrub while the pointer is over the hero. During
      // an active drag, pointer capture lets touch/mouse movement continue
      // outside the box so the formula below can clamp to either endpoint.
      if (!draggingRef.current && (!pointerInsideRef.current || !isInside)) return

      const duration = video.duration
      if (!Number.isFinite(duration) || duration <= 0) return

      const progress = clamp((clientX - rect.left) / rect.width, 0, 1)
      targetTimeRef.current = progress * duration
      scheduleSeek()
    }

    const stopPointerInteraction = (event) => {
      pointerInsideRef.current = false
      draggingRef.current = false
      if (event?.pointerId != null && container.hasPointerCapture?.(event.pointerId)) {
        container.releasePointerCapture(event.pointerId)
      }
    }

    const handlePointerEnter = () => { pointerInsideRef.current = true }
    const handlePointerLeave = (event) => {
      // Keep a captured pointer drag alive until pointerup/pointercancel;
      // ordinary hover interaction stops as soon as the pointer leaves.
      if (!draggingRef.current) stopPointerInteraction(event)
    }
    const handlePointerDown = (event) => {
      if (!isInViewport) return
      pointerInsideRef.current = true
      draggingRef.current = true
      try {
        container.setPointerCapture?.(event.pointerId)
      } catch {
        // Some browsers can reject capture if the pointer was already lost.
      }
      event.preventDefault()
      updateTargetFromClientX(event.clientX, event.clientY)
    }
    const handlePointerMove = (event) => {
      if (!isInViewport || (event.pointerType !== 'mouse' && !draggingRef.current)) return
      if (draggingRef.current) event.preventDefault()
      updateTargetFromClientX(event.clientX, event.clientY)
    }
    const handlePointerUp = (event) => stopPointerInteraction(event)
    const handlePointerCancel = (event) => stopPointerInteraction(event)
    const handleInitialSeeked = () => {
      if (!initialFramePendingRef.current) return
      initialFramePendingRef.current = false
      setVideoReady(true)
    }
    const handleLoadedMetadata = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return
      // Both covers open on the fully revealed artwork. Scrubbing only starts
      // changing the frame after the pointer moves over the interaction area.
      const initialTime = Math.max(video.duration - 0.02, 0)
      initialFramePendingRef.current = initialTime > 0
      video.currentTime = initialTime
      if (!initialFramePendingRef.current && video.readyState >= 2) setVideoReady(true)
    }

    const observer = new IntersectionObserver(([entry]) => {
      isInViewport = entry.isIntersecting
      if (!isInViewport) {
        stopPointerInteraction()
        targetTimeRef.current = null
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
      }
    }, { threshold: 0.01 })

    container.addEventListener('pointerenter', handlePointerEnter)
    container.addEventListener('pointerleave', handlePointerLeave)
    container.addEventListener('pointerdown', handlePointerDown)
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerup', handlePointerUp)
    container.addEventListener('pointercancel', handlePointerCancel)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('seeked', handleInitialSeeked)
    observer.observe(container)
    if (video.readyState >= 1) handleLoadedMetadata()

    return () => {
      observer.disconnect()
      container.removeEventListener('pointerenter', handlePointerEnter)
      container.removeEventListener('pointerleave', handlePointerLeave)
      container.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerup', handlePointerUp)
      container.removeEventListener('pointercancel', handlePointerCancel)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('seeked', handleInitialSeeked)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      targetTimeRef.current = null
      video.pause()
    }
  }, [src])

  return <section ref={containerRef} id={id} className={`${className} interactive-hero`} style={{ aspectRatio }} aria-label={ariaLabel}>
    <img className="interactive-hero-poster" src={poster} alt="" aria-hidden="true" />
    <video ref={videoRef} src={src} poster={poster} muted playsInline preload="auto" controls={false} style={{ opacity: videoReady ? 1 : 0 }} />
  </section>
}

function playNavSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return
  const context = new AudioContextClass()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(520, context.currentTime)
  gain.gain.setValueAtTime(0.035, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.055)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.06)
  oscillator.onended = () => context.close()
}

function SiteNav({ project, onLongImage, isLongImageMode, audioEnabled, onAudioToggle }) {
  const [projectMenuOpen, setProjectMenuOpen] = useState(false)
  const [openProjectGroup, setOpenProjectGroup] = useState(null)
  const interactionSound = () => { if (audioEnabled) playNavSound() }
  const sectionLink = (id) => (event) => {
    interactionSound()
    if (!project) return
    event.preventDefault()
    window.location.hash = id
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 40)
  }
  const toggleProjectMenu = (event) => {
    event.preventDefault()
    interactionSound()
    if (projectMenuOpen) setOpenProjectGroup(null)
    setProjectMenuOpen(!projectMenuOpen)
  }
  const toggleProjectGroup = (event, groupId) => {
    event.preventDefault()
    interactionSound()
    setOpenProjectGroup((current) => current === groupId ? null : groupId)
  }
  const projectLink = () => {
    interactionSound()
    setOpenProjectGroup(null)
    setProjectMenuOpen(false)
  }
  return <nav className="site-nav" aria-label="主导航">
    <button className="nav-back" type="button" aria-label="返回上一级" title="返回上一级" onClick={() => { interactionSound(); if (window.history.length > 1) window.history.back(); else window.location.hash = '#contents' }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5 7.5 12l7 7M8 12h10" /></svg>
    </button>
    <div className="nav-links">
      <a href="#home" onClick={sectionLink('home')}>主页</a>
      <a href="#resume" onClick={sectionLink('resume')}>个人简介</a>
      <details className="nav-project-menu" open={projectMenuOpen}>
        <summary onClick={toggleProjectMenu}>项目内容</summary>
        <div className="nav-project-panel">
          {catalogGroups.map((group) => <details className="nav-project-group" open={openProjectGroup === group.id} key={group.id}>
            <summary onClick={(event) => toggleProjectGroup(event, group.id)}>{catalogGroupNames[group.id] ?? group.id}</summary>
            <div className="nav-project-items">
              {group.paths.map(([, page, , name]) => <a href={`#project/${group.id}/${page}`} key={page} onClick={projectLink}>{projectNameText[name]}</a>)}
            </div>
          </details>)}
        </div>
      </details>
      <details className="nav-project-menu nav-site-menu">
        <summary onClick={interactionSound}>自研网站</summary>
        <div className="nav-project-panel nav-site-panel">
          <div className="nav-site-links">
            {selfWebsiteLinks.map(([name, url]) => <a key={url} href={url} target="_blank" rel="noopener noreferrer">{name}</a>)}
          </div>
        </div>
      </details>
      <button className="nav-long-image" type="button" aria-pressed={isLongImageMode} onClick={() => { interactionSound(); onLongImage() }}>长图模式</button>
    </div>
    <button className="nav-audio" type="button" aria-pressed={audioEnabled} onClick={() => { const enabled = !audioEnabled; onAudioToggle(enabled); if (enabled) playNavSound() }}>
      <span>开启音效</span><span className="audio-switch" aria-hidden="true"><span /></span>
    </button>
  </nav>
}

function Catalog() {
  const [openId, setOpenId] = useState(null)
  const active = catalogGroups.find((group) => group.id === openId)
  return <section id="contents" className="catalog-section">
    <div className="catalog-canvas">
      <img className="catalog-background" src={assetUrl('catalog/catalog-bg.webp')} width="2880" height="1620" alt="" loading="lazy" />
      {!active && <div className="folder-grid">{catalogGroups.map((group) => <button key={group.id} className="folder-card" onClick={() => setOpenId(group.id)} aria-label={`Folder ${group.id}`}>
        <span className="folder-previews">{group.paths.map(([image]) => <img key={image} src={assetUrl(`catalog/paths/${image}`)} alt="" />)}</span>
        <img className="folder-shape" src={assetUrl('catalog/folders/Union.png')} alt="" />
        <img className="folder-glass" src={assetUrl('catalog/folders/Rectangle 229.png')} alt="" />
        <img className="folder-label" src={assetUrl(`catalog/labels/${group.label}`)} alt="" />
      </button>)}</div>}
    </div>
    {active && <div className="folder-popup-layer" onClick={() => setOpenId(null)}>
      <div className="folder-popup" onClick={(event) => event.stopPropagation()}>
        <div className="popup-paths">{active.paths.map(([image, page, preview = image, name]) => <a className="popup-path" href={`#project/${active.id}/${page}`} key={image} aria-label={`Open project page ${page}`}><img className="popup-thumbnail" src={assetUrl(`catalog/square-previews/${preview}`)} alt="" /><span className="popup-path-name">{projectNameText[name]}</span></a>)}</div>
      </div>
    </div>}
  </section>
}

function Home() {
  return <main className="site-shell" id="home">
    <HorizontalScrubVideo src={assetUrl('hero-scrub.mp4')} poster={assetUrl('hero.webp')} />
    <section className="profile-frame" id="resume">
      <img className="source-page-image" src={assetUrl('2.webp')} width="1920" height="2341" alt="Portfolio page 2" loading="lazy" />
    </section>
    <Catalog />
    <HorizontalScrubVideo
      id="contact"
      className="closing-frame"
      src={assetUrl('closing-scrub.mp4')}
      poster={assetUrl('closing.webp')}
      ariaLabel="底部封面横向拖动控制视频进度"
    />
  </main>
}

function ProjectDetail({ project }) {
  return <main className="site-shell project-shell">
    {project.id === 'operations' && project.selectedPath === '5' && <IntroVideo src={assetUrl('content/第一个文件/内容一/000.mp4')} aspectRatio="976 / 2116" />}
    <section className="project-pages">{project.pages.map((src, index) => <div className={src.endsWith('.mp4') ? 'project-page-video' : undefined} key={src}><ContentImage src={src} eager={index === 0} /></div>)}</section>
  </main>
}

function BackgroundMusic({ audioRef, enabled }) {
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined
    audio.volume = 0.18
    audio.autoplay = true
    audio.loop = true
    audio.preload = 'auto'
    audio.muted = false

    // Try to start as soon as the page is entered. Browsers that allow
    // autoplay will begin immediately; browsers that wait for a gesture
    // will be retried on the first user interaction below.
    const tryPlay = () => {
      if (!audio.paused) return
      audio.play().catch(() => {})
    }
    const unlock = () => tryPlay()

    audio.addEventListener('loadeddata', tryPlay)
    audio.addEventListener('canplay', tryPlay)
    audio.addEventListener('canplaythrough', tryPlay)
    audio.load()
    tryPlay()
    window.addEventListener('pointerdown', unlock, { passive: true })
    window.addEventListener('mousedown', unlock, { passive: true })
    window.addEventListener('click', unlock, { passive: true })
    window.addEventListener('pointermove', unlock, { passive: true })
    window.addEventListener('keydown', unlock)
    window.addEventListener('touchstart', unlock, { passive: true })
    return () => {
      audio.removeEventListener('loadeddata', tryPlay)
      audio.removeEventListener('canplay', tryPlay)
      audio.removeEventListener('canplaythrough', tryPlay)
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('mousedown', unlock)
      window.removeEventListener('click', unlock)
      window.removeEventListener('pointermove', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
      audio.pause()
    }
  }, [audioRef])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined
    if (enabled) audio.play().catch(() => {})
    else audio.pause()
    return undefined
  }, [audioRef, enabled])

  return <audio ref={audioRef} src={assetUrl('portfolio-background.mp3')} autoPlay loop preload="auto" playsInline aria-hidden="true" />
}

function App() {
  const project = useRoute()
  const contentRef = useRef(null)
  const musicRef = useRef(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [zoomScale, setZoomScale] = useState(1)
  const [layoutSize, setLayoutSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const zoomed = zoomScale !== 1

  const setClampedZoom = (value) => {
    const next = Math.round(Math.max(0.2, Math.min(3, value)) * 100) / 100
    setZoomScale(next)
  }

  useEffect(() => {
    if (project) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [project?.id, project?.selectedPath])

  useEffect(() => {
    const content = contentRef.current
    if (!content) return undefined
    const measure = () => setLayoutSize({
      width: document.documentElement.clientWidth,
      height: Math.max(content.scrollHeight, window.innerHeight),
    })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [project?.id, project?.selectedPath])

  useEffect(() => {
    document.documentElement.classList.toggle('zoom-active', zoomed)
    document.body.classList.toggle('zoom-active', zoomed)
    return () => {
      document.documentElement.classList.remove('zoom-active')
      document.body.classList.remove('zoom-active')
    }
  }, [zoomed])

  useEffect(() => {
    const onWheel = (event) => {
      if (!event.ctrlKey || !contentRef.current?.contains(event.target)) return
      event.preventDefault()
      setZoomScale((current) => Math.round(Math.max(0.2, Math.min(3, current * Math.exp(-event.deltaY * 0.002))) * 100) / 100)
    }
    const onKeyDown = (event) => {
      if (!(event.ctrlKey || event.metaKey)) return
      if (event.key === '+' || event.key === '=') {
        event.preventDefault()
        setZoomScale((current) => Math.min(3, Math.round((current + 0.1) * 100) / 100))
      } else if (event.key === '-') {
        event.preventDefault()
        setZoomScale((current) => Math.max(0.2, Math.round((current - 0.1) * 100) / 100))
      } else if (event.key === '0') {
        event.preventDefault()
        setZoomScale(1)
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const stageWidth = Math.max(layoutSize.width, layoutSize.width * zoomScale)
  const pageOffset = Math.max(0, (layoutSize.width - layoutSize.width * zoomScale) / 2)
  const isLongImageMode = zoomScale === 0.46
  const toggleAudio = (enabled) => {
    setAudioEnabled(enabled)
    const audio = musicRef.current
    if (!audio) return
    if (enabled) audio.play().catch(() => {})
    else audio.pause()
  }

  return <>
    <BackgroundMusic audioRef={musicRef} enabled={audioEnabled} />
    <SiteNav project={project} audioEnabled={audioEnabled} onAudioToggle={toggleAudio} isLongImageMode={isLongImageMode} onLongImage={() => {
      if (isLongImageMode) setZoomScale(1)
      else {
        setZoomScale(0.46)
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }} />
    <div className="zoom-stage" style={{ width: `${stageWidth}px`, height: `${layoutSize.height * zoomScale}px` }}>
      <div className="zoom-content" ref={contentRef} style={{ width: `${layoutSize.width}px`, marginLeft: `${pageOffset}px`, transform: `scale(${zoomScale})` }}>
        {project ? <ProjectDetail project={project} /> : <Home />}
      </div>
    </div>
    {zoomed && <div className="zoom-controls" aria-label="页面缩放控制">
      <button type="button" aria-label="缩小" onClick={() => setClampedZoom(zoomScale - 0.1)}>−</button>
      <input type="range" min="20" max="300" step="1" value={Math.round(zoomScale * 100)} aria-label="页面缩放比例" onChange={(event) => setClampedZoom(Number(event.target.value) / 100)} />
      <span>{Math.round(zoomScale * 100)}%</span>
      <button type="button" aria-label="放大" onClick={() => setClampedZoom(zoomScale + 0.1)}>+</button>
      <button type="button" aria-label="恢复原始大小" title="恢复原始大小" onClick={() => setZoomScale(1)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0 2 5M20 4v7h-7" /></svg>
      </button>
    </div>}
  </>
}

createRoot(document.getElementById('root')).render(<App />)
