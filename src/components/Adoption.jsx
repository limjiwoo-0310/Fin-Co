import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { colorFilters, fishList } from '../data/fish.js'
import GlideChips from './GlideChips.jsx'
import MiniScrollbar from './MiniScrollbar.jsx'
import './Adoption.css'

// S-06 입양 가능 개체
// - 카드가 한 화면보다 많으면 3벌 이어 붙여 끝없이 반복합니다(품종 도감과 같은 방식).
//   찾기 결과가 적어 한 화면에 다 들어가면 반복하지 않습니다.
// - '전체'에서는 일정 시간마다 다음 개체로 자동으로 넘어갑니다.
//   마우스를 올리거나, 키보드로 카드에 있거나, 막대를 끌거나, 팝업이 열려 있거나,
//   섹션이 화면 밖이거나, 움직임 줄이기 설정이면 멈춥니다.

const CARD_W = 306
const GAP = 12
const COPIES = 3
const MIDDLE = 1
const AUTO_MS = 3500 // 다음 개체로 넘어가는 간격
const SLIDE_MS = 900 // 한 칸 이동 시간 (품종 도감과 같음)

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Adoption({ onOpen, paused = false }) {
  const [filter, setFilter] = useState('all')
  const rowRef = useRef(null)
  const [rowWidth, setRowWidth] = useState(0)
  const busy = useRef(false) // 자동 이동 중이거나 막대를 끄는 중이면 반복 위치 보정을 미룹니다.
  const animFrame = useRef(0)
  const hold = useRef({ hover: false, focus: false, drag: false, offscreen: false })
  const pausedRef = useRef(paused)

  const visible = fishList.filter((f) => filter === 'all' || f.color === filter)
  const loop = rowWidth > 0 && visible.length * (CARD_W + GAP) - GAP > rowWidth
  const copies = loop ? COPIES : 1
  const cards = Array.from({ length: copies }, (_, copy) => visible.map((f) => ({ ...f, copy }))).flat()

  // 한 벌의 폭 = 두 번째 벌 첫 카드의 위치
  const setWidth = () => {
    const first = rowRef.current.children[visible.length]
    return first ? first.offsetLeft : 0
  }

  useLayoutEffect(() => {
    const row = rowRef.current
    const measure = () => setRowWidth(row.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(row)
    return () => ro.disconnect()
  }, [])

  // 찾기 옵션이 바뀌면 처음 위치로 (반복할 때는 가운데 벌의 첫 카드)
  useLayoutEffect(() => {
    cancelAnimationFrame(animFrame.current)
    busy.current = false
    rowRef.current.scrollLeft = loop ? setWidth() : 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, loop])

  const wrap = () => {
    if (!loop) return
    const row = rowRef.current
    const w = setWidth()
    if (row.scrollLeft < w * 0.25) row.scrollLeft += w
    else if (row.scrollLeft > w * 1.75) row.scrollLeft -= w
  }
  const wrapRef = useRef(wrap)
  // 자동 이동 타이머가 항상 최신 값과 함수를 쓰도록 렌더 후에 갱신합니다.
  useLayoutEffect(() => {
    pausedRef.current = paused
    wrapRef.current = wrap
  })

  const onScroll = () => {
    if (!busy.current) wrap()
  }

  // 자동으로 다음 개체 보여 주기 ('전체'에서만)
  useEffect(() => {
    if (filter !== 'all' || !loop || reduceMotion()) return
    const row = rowRef.current

    const io = new IntersectionObserver(([entry]) => {
      hold.current.offscreen = !entry.isIntersecting
    }, { threshold: 0.3 })
    io.observe(row)

    const next = () => {
      wrapRef.current() // 끝에 가까우면 먼저 같은 화면의 다른 벌로 옮긴 뒤 이동
      const from = row.scrollLeft
      const target = [...row.children].map((c) => c.offsetLeft).find((x) => x > from + 2)
      if (target == null) return
      busy.current = true
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / SLIDE_MS)
        row.scrollLeft = from + (target - from) * easeInOutCubic(t)
        if (t < 1) {
          animFrame.current = requestAnimationFrame(tick)
        } else {
          busy.current = false
          wrapRef.current()
        }
      }
      animFrame.current = requestAnimationFrame(tick)
    }

    const timer = setInterval(() => {
      const h = hold.current
      if (h.hover || h.focus || h.drag || h.offscreen || document.hidden || pausedRef.current || busy.current) return
      next()
    }, AUTO_MS)

    return () => {
      clearInterval(timer)
      io.disconnect()
      cancelAnimationFrame(animFrame.current)
      busy.current = false
    }
  }, [filter, loop])

  const onDragChange = (dragging) => {
    hold.current.drag = dragging
    if (dragging) {
      cancelAnimationFrame(animFrame.current)
      busy.current = true
    } else {
      busy.current = false
      wrap()
    }
  }

  return (
    <section id="s06" className="adoption" aria-label="입양 가능 개체">
      <div className="container section-head">
        <p className="eyebrow">03 / ADOPTION</p>
        <h2 className="section-title">함께할 베타 찾기</h2>
        <p className="body-lg">색·패턴으로 걸러 보고, 카드를 선택하면 개체 정보와 입양 신청서를 확인할 수 있습니다.</p>
        <div className="adoption__filters">
          <GlideChips label="색·패턴별 찾기" options={colorFilters} value={filter} onChange={setFilter} />
        </div>
      </div>
      <div
        className="row fish-row"
        ref={rowRef}
        onScroll={onScroll}
        onPointerEnter={(e) => e.pointerType === 'mouse' && (hold.current.hover = true)}
        onPointerLeave={() => (hold.current.hover = false)}
        // 키보드로 들어온 경우만 멈춤 (마우스 클릭으로 생긴 포커스 때문에 계속 멈춰 있지 않도록)
        onFocus={(e) => (hold.current.focus = e.target.matches(':focus-visible'))}
        onBlur={() => (hold.current.focus = false)}
      >
        {cards.map((f) => {
          const isCopy = loop && f.copy !== MIDDLE
          return (
            <button
              key={`${f.copy}-${f.id}`}
              type="button"
              className="fcard"
              onClick={() => onOpen(f.id)}
              // 반복용 복제 카드는 화면 읽기·탭 이동에서 뺍니다.
              tabIndex={isCopy ? -1 : undefined}
              aria-hidden={isCopy || undefined}
            >
              <div className="fcard__photo">
                <img className="photo" src={f.card} alt={isCopy ? '' : `${f.name} 베타`} loading="lazy" />
                <span className="fcard__tag">{f.tag}</span>
              </div>
              <span className="fcard__name">{f.name}</span>
              <span className="fcard__desc">{f.desc}</span>
              <span className="fcard__meta">{f.meta}</span>
            </button>
          )
        })}
      </div>
      <MiniScrollbar targetRef={rowRef} loop={loop} getLoopWidth={setWidth} onDragChange={onDragChange} />
    </section>
  )
}

export default Adoption
