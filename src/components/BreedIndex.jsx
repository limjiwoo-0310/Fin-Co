import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { breeds } from '../data/breeds.js'
import './BreedIndex.css'

// S-04 품종 도감
// - 품종 카드를 3벌 이어 붙이고, 양 끝에 가까워지면 같은 위치의 다른 벌로 조용히 옮겨 끝없이 반복되게 합니다.
// - 마우스를 올린 카드는 화면 가운데로 이동하며 커집니다.
// - 기본 스크롤 막대 대신 가운데에 작은 위치 표시 막대를 둡니다.

const COPIES = 3
const MIDDLE = 1
const TRACK_W = 160 // 위치 표시 막대 폭(px)
const THUMB_W = 40
const SCROLL_MS = 900 // 카드가 가운데로 이동하는 시간. 클수록 느립니다.

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const cards = Array.from({ length: COPIES }, (_, copy) => breeds.map((b, index) => ({ ...b, copy, index }))).flat()

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function BreedIndex({ onOpen }) {
  const rowRef = useRef(null)
  const animating = useRef(false)
  const animFrame = useRef(0)
  const lastPointer = useRef({ x: null, y: null })
  const [active, setActive] = useState(null) // { copy, index }
  const [progress, setProgress] = useState(0)
  const trackRef = useRef(null)
  const drag = useRef(null) // 위치 막대를 잡고 있을 때 { offset }
  const [dragging, setDragging] = useState(false)

  const setWidth = () => rowRef.current.scrollWidth / COPIES

  // 처음에는 가운데 벌의 첫 카드가 왼쪽 끝에 오도록
  useLayoutEffect(() => {
    rowRef.current.scrollLeft = setWidth()
  }, [])

  // 양 끝에 가까워지면 한 벌만큼 옮겨 반복되게 합니다. 보이는 화면은 그대로입니다.
  const wrap = useCallback(() => {
    const row = rowRef.current
    const w = setWidth()
    let shift = 0
    if (row.scrollLeft < w * 0.25) shift = 1
    else if (row.scrollLeft > w * 1.75) shift = -1
    if (!shift) return
    row.scrollLeft += shift * w
    setActive((a) => (a ? { ...a, copy: a.copy + shift } : a))
  }, [])

  useEffect(() => () => cancelAnimationFrame(animFrame.current), [])

  const onScroll = () => {
    const row = rowRef.current
    const w = setWidth()
    if (!animating.current && !drag.current) wrap()
    let p = ((row.scrollLeft - w) / w) % 1
    if (p < 0) p += 1
    setProgress(p)
  }

  const centerCard = (el, copy, index) => {
    const row = rowRef.current
    setActive({ copy, index })
    cancelAnimationFrame(animFrame.current)
    const from = row.scrollLeft
    const to = el.offsetLeft + el.offsetWidth / 2 - row.clientWidth / 2

    if (reduceMotion()) {
      row.scrollLeft = to
      return
    }

    // 브라우저 기본 smooth 스크롤은 속도를 바꿀 수 없어 직접 천천히 움직입니다.
    animating.current = true
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / SCROLL_MS)
      row.scrollLeft = from + (to - from) * easeInOutCubic(t)
      if (t < 1) {
        animFrame.current = requestAnimationFrame(tick)
      } else {
        animating.current = false
        wrap()
      }
    }
    animFrame.current = requestAnimationFrame(tick)
  }

  // 위치 막대를 잡고 좌우로 끌면 카드 줄이 따라 움직입니다. 막대의 빈 곳을 누르면 그 위치로 바로 이동합니다.
  const dragTo = (clientX) => {
    const row = rowRef.current
    const w = setWidth()
    const left = trackRef.current.getBoundingClientRect().left
    const pos = Math.min(TRACK_W - THUMB_W, Math.max(0, clientX - left - drag.current.offset))
    row.scrollLeft = w + (pos / (TRACK_W - THUMB_W)) * w
  }

  const onTrackPointerDown = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    cancelAnimationFrame(animFrame.current)
    animating.current = false
    setActive(null)
    const thumbLeft = progress * (TRACK_W - THUMB_W)
    const x = e.clientX - trackRef.current.getBoundingClientRect().left
    const onThumb = x >= thumbLeft && x <= thumbLeft + THUMB_W
    drag.current = { offset: onThumb ? x - thumbLeft : THUMB_W / 2 }
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    dragTo(e.clientX)
  }

  const onTrackPointerMove = (e) => {
    if (drag.current) dragTo(e.clientX)
  }

  const onTrackPointerUp = () => {
    if (!drag.current) return
    drag.current = null
    setDragging(false)
    wrap()
  }

  // 스크롤 때문에 커서 아래 카드가 바뀌는 경우는 무시하고, 실제로 마우스를 움직였을 때만 반응합니다.
  const onPointerMove = (e, copy, index) => {
    if (e.pointerType !== 'mouse') return
    const { x, y } = lastPointer.current
    if (x === e.clientX && y === e.clientY) return
    lastPointer.current = { x: e.clientX, y: e.clientY }
    if (active && active.copy === copy && active.index === index) return
    centerCard(e.currentTarget, copy, index)
  }

  return (
    <section id="s04" className="breed-index" aria-label="품종 도감">
      <div className="breed-index__head">
        <p className="eyebrow">01 / BREED INDEX</p>
        <h2 className="section-title">다양한 베타 모아보기</h2>
        <p className="body-lg">카드를 선택하면 품종별 특징과 적정 환경을 확인할 수 있습니다.</p>
      </div>
      <div className="breed-row-wrap">
        <div className="row breed-row" ref={rowRef} onScroll={onScroll} onPointerLeave={() => setActive(null)}>
          {cards.map((b) => {
            const isCopy = b.copy !== MIDDLE
            const isActive = active?.copy === b.copy && active?.index === b.index
            return (
              <button
                key={`${b.copy}-${b.id}`}
                type="button"
                className={`bcard${isActive ? ' bcard--active' : ''}`}
                onClick={() => onOpen(b.id)}
                onPointerMove={(e) => onPointerMove(e, b.copy, b.index)}
                onFocus={(e) => centerCard(e.currentTarget, b.copy, b.index)}
                // 반복용 복제 카드는 화면 읽기·탭 이동에서 뺍니다.
                tabIndex={isCopy ? -1 : undefined}
                aria-hidden={isCopy || undefined}
              >
                <div className="bcard__photo">
                  <img className="photo" src={b.img} alt={isCopy ? '' : `${b.name} 베타`} loading="lazy" />
                </div>
                <span className="bcard__name">{b.name}</span>
              </button>
            )
          })}
        </div>
        {/* 화면 양쪽 가장자리로 갈수록 카드가 흐려지는 효과 */}
        <div className="breed-edge breed-edge--left" aria-hidden="true" />
        <div className="breed-edge breed-edge--right" aria-hidden="true" />
      </div>
      <div
        ref={trackRef}
        className={`mini-bar${dragging ? ' mini-bar--dragging' : ''}`}
        aria-hidden="true"
        onPointerDown={onTrackPointerDown}
        onPointerMove={onTrackPointerMove}
        onPointerUp={onTrackPointerUp}
        onPointerCancel={onTrackPointerUp}
      >
        <div className="mini-bar__rail">
          <span
            className="mini-bar__thumb"
            style={{ transform: `translateX(${progress * (TRACK_W - THUMB_W)}px)` }}
          />
        </div>
      </div>
    </section>
  )
}

export default BreedIndex
