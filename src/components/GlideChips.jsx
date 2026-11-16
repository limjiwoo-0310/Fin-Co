import { useEffect, useLayoutEffect, useRef } from 'react'
import './GlideChips.css'

// 색·패턴 찾기 옵션(F-01)용 글라이드 효과
// 참고: React Bits "Pill Nav" (hoverEffect=glide, bounce 0.75, stretch 0.86)의 움직임을
// 디자인 시스템에 맞게 다시 만든 것입니다. (모서리 직각, 남색 하나, mist 면)
// - 마우스를 올린 옵션 아래로 연한 mist 면이 미끄러지듯 따라갑니다.
// - 선택한 옵션의 남색 면도 같은 방식으로 이동합니다. 흰 글자는 남색 면이 지나가는 자리에만 보입니다.
// - 이동하는 쪽 가장자리가 먼저 가고 반대쪽이 늦게 따라와 늘어났다가(stretch), 도착하면 살짝 튕깁니다(bounce).

const BOUNCE = 0.75
const STRETCH = 0.86
const BASE_K = 520 // 스프링 세기
const ZETA = 1 - 0.55 * BOUNCE // 감쇠(작을수록 많이 튕김)
const LEAD_K = BASE_K * (1 + 0.9 * STRETCH) // 앞쪽 가장자리
const TRAIL_K = BASE_K * (1 - 0.5 * STRETCH) // 뒤쪽 가장자리

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

// 사각형 하나(왼·오른·위·아래 가장자리)를 스프링으로 목표 위치까지 움직입니다.
function createBox() {
  return { l: 0, r: 0, t: 0, b: 0, vl: 0, vr: 0, vt: 0, vb: 0, alpha: 0, pop: 1, placed: false }
}

function stepBox(box, target, visible, dt, reduce) {
  let busy = false
  if (target && visible) {
    if (!box.placed || box.alpha < 0.02) {
      // 처음 나타날 때는 그 자리에서 살짝 커지며 등장
      Object.assign(box, { l: target.l, r: target.r, t: target.t, b: target.b, vl: 0, vr: 0, vt: 0, vb: 0, placed: true })
      box.pop = reduce ? 1 : 0.9
    }
    if (reduce) {
      Object.assign(box, { l: target.l, r: target.r, t: target.t, b: target.b, vl: 0, vr: 0, vt: 0, vb: 0 })
    } else {
      const dir = Math.sign((target.l + target.r) / 2 - (box.l + box.r) / 2)
      const kl = dir < 0 ? LEAD_K : dir > 0 ? TRAIL_K : BASE_K
      const kr = dir > 0 ? LEAD_K : dir < 0 ? TRAIL_K : BASE_K
      const steps = Math.ceil(dt / (1 / 240))
      const h = dt / steps
      for (let i = 0; i < steps; i++) {
        box.vl += (-kl * (box.l - target.l) - 2 * ZETA * Math.sqrt(kl) * box.vl) * h
        box.l += box.vl * h
        box.vr += (-kr * (box.r - target.r) - 2 * ZETA * Math.sqrt(kr) * box.vr) * h
        box.r += box.vr * h
        box.vt += (-BASE_K * (box.t - target.t) - 2 * ZETA * Math.sqrt(BASE_K) * box.vt) * h
        box.t += box.vt * h
        box.vb += (-BASE_K * (box.b - target.b) - 2 * ZETA * Math.sqrt(BASE_K) * box.vb) * h
        box.b += box.vb * h
      }
    }
    box.alpha += (1 - box.alpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.06))
    busy =
      Math.abs(box.l - target.l) > 0.05 ||
      Math.abs(box.r - target.r) > 0.05 ||
      Math.abs(box.t - target.t) > 0.05 ||
      Math.abs(box.b - target.b) > 0.05 ||
      Math.abs(box.vl) + Math.abs(box.vr) + Math.abs(box.vt) + Math.abs(box.vb) > 0.5 ||
      box.alpha < 0.999
  } else {
    box.alpha += (0 - box.alpha) * (reduce ? 1 : 1 - Math.exp(-dt / 0.07))
    if (box.alpha > 0.002) busy = true
    else box.alpha = 0
  }
  box.pop += (1 - box.pop) * (reduce ? 1 : 1 - Math.exp(-dt / 0.09))
  if (Math.abs(1 - box.pop) > 0.001) busy = true
  return busy
}

// 늘어난 만큼 위아래를 살짝 눌러 탄성 있게 보이게 합니다.
function geometry(box, target) {
  const w = Math.max(0, box.r - box.l)
  const hgt = Math.max(0, box.b - box.t)
  const squash = target ? 1 - clamp((w / Math.max(target.r - target.l, 1) - 1) * 0.3, 0, 0.14) : 1
  const sx = box.pop
  const sy = box.pop * squash
  const cx = (box.l + box.r) / 2
  const cy = (box.t + box.b) / 2
  return { left: cx - (w * sx) / 2, right: cx + (w * sx) / 2, top: cy - (hgt * sy) / 2, bottom: cy + (hgt * sy) / 2 }
}

// variant="form": 입양 신청서(P-03 F-02)의 선택 옵션. 높이 44px, 선택 면은 ink 색, 처음에는 선택 없음.
function GlideChips({ label, options, value, onChange, variant }) {
  const isForm = variant === 'form'
  const groupRef = useRef(null)
  const chipRefs = useRef([])
  const hoverRef = useRef(null)
  const activeRef = useRef(null)
  const inkRef = useRef(null)
  const engineRef = useRef(null)
  const activeIndex = options.findIndex((o) => o.id === value)

  useEffect(() => {
    const group = groupRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rects = []
    const hoverBox = createBox()
    const activeBox = createBox()
    const state = { hover: -1, active: activeIndex }
    let raf = 0
    let last = 0

    const measure = () => {
      chipRefs.current.forEach((el, i) => {
        if (!el) return
        rects[i] = { l: el.offsetLeft, r: el.offsetLeft + el.offsetWidth, t: el.offsetTop, b: el.offsetTop + el.offsetHeight }
      })
    }

    const paint = (el, g, alpha) => {
      el.style.transform = `translate3d(${g.left}px, ${g.top}px, 0)`
      el.style.width = `${g.right - g.left}px`
      el.style.height = `${g.bottom - g.top}px`
      el.style.opacity = `${alpha}`
    }

    const render = () => {
      const hg = geometry(hoverBox, rects[state.hover])
      paint(hoverRef.current, hg, hoverBox.alpha)
      const ag = geometry(activeBox, rects[state.active])
      paint(activeRef.current, ag, activeBox.alpha)
      // 흰 글자: 남색 면이 있는 자리만 보이도록 잘라냅니다.
      const W = group.clientWidth
      const H = group.clientHeight
      const round = Math.max(0, (ag.bottom - ag.top) / 2) // 알약형 모서리에 맞춰 잘라냄
      inkRef.current.style.clipPath = `inset(${ag.top}px ${W - ag.right}px ${H - ag.bottom}px ${ag.left}px round ${round}px)`
      inkRef.current.style.opacity = `${activeBox.alpha}`
    }

    const tick = (now) => {
      raf = 0
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      const busyHover = stepBox(hoverBox, rects[state.hover], state.hover >= 0, dt, reduce)
      const busyActive = stepBox(activeBox, rects[state.active], state.active >= 0, dt, reduce)
      render()
      if (busyHover || busyActive) raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (!raf) {
        last = 0
        raf = requestAnimationFrame(tick)
      }
    }

    engineRef.current = {
      hover: (i) => {
        state.hover = i
        wake()
      },
      active: (i) => {
        state.active = i
        measure() // 선택에 따라 글자 굵기가 바뀌어 폭이 달라질 수 있음
        wake()
      },
    }

    measure()
    // 첫 화면에서는 선택된 옵션 위에 남색 면을 바로 둡니다.
    stepBox(activeBox, rects[state.active], true, 1, true)
    render()

    const ro = new ResizeObserver(() => {
      measure()
      render()
      wake()
    })
    ro.observe(group)
    document.fonts?.ready?.then(() => {
      measure()
      wake()
    })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      engineRef.current = null
    }
    // 처음 한 번만 설정하고, 이후 선택 변화는 아래 effect에서 엔진에 전달합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    engineRef.current?.active(activeIndex)
  }, [activeIndex])

  const onEnter = (e, i) => {
    if (e.pointerType === 'touch') return
    engineRef.current?.hover(i)
  }

  return (
    <div className={`glide-chips${isForm ? ' glide-chips--form' : ''}`} role="group" aria-label={label} ref={groupRef} onPointerLeave={() => engineRef.current?.hover(-1)}>
      <span className="glide-chips__hover" ref={hoverRef} aria-hidden="true" />
      <span className="glide-chips__active" ref={activeRef} aria-hidden="true" />
      {options.map((o, i) => (
        <button
          key={o.id}
          ref={(el) => (chipRefs.current[i] = el)}
          type="button"
          className={`chip glide-chips__chip${isForm ? ' chip--form' : ''}`}
          aria-pressed={value === o.id}
          onPointerEnter={(e) => onEnter(e, i)}
          onFocus={(e) => e.currentTarget.matches(':focus-visible') && engineRef.current?.hover(i)}
          onBlur={() => engineRef.current?.hover(-1)}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
      {/* 남색 면 위에 보일 흰 글자 (위 버튼과 같은 배치) */}
      <div className="glide-chips__ink" ref={inkRef} aria-hidden="true">
        {options.map((o) => (
          <span key={o.id} className={`chip glide-chips__chip${isForm ? ' chip--form' : ''}${value === o.id ? ' is-selected' : ''}`}>
            {o.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default GlideChips
