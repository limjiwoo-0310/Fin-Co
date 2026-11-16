import { useEffect, useRef } from 'react'
import './CursorMark.css'

// 마우스를 따라다니는 로고 마크 (반원 + 점, assets/logos/finco-mark-*.svg와 같은 도형)
// - 커서 오른쪽 아래에서 살짝 늦게 따라옵니다. 기본 마우스 포인터는 그대로 보입니다.
// - 마크의 둥근 쪽(반원이 볼록한 쪽)이 항상 마우스를 바라보도록 부드럽게 돕니다.
// - 남색 첫 화면과 팝업 뒤 어두운 배경 위에서는 흰색, 그 밖에서는 남색입니다.
// - 터치 기기와 움직임 줄이기 설정에서는 나타나지 않습니다.

const OFFSET_X = 16 // 커서 끝을 가리지 않도록 오른쪽 아래로 띄움
const OFFSET_Y = 18
const FOLLOW = 0.18 // 프레임마다 따라붙는 비율 (작을수록 느리게 따라옴)
const TURN = 0.2 // 프레임마다 마우스 쪽으로 도는 비율 (작을수록 천천히 돎)

// 마크 도형에서 둥근 쪽은 오른쪽(0°)을 향합니다. 각도 차이는 -180~180으로 맞춰 짧은 쪽으로 돕니다.
const angleDiff = (a, b) => ((((b - a) % 360) + 540) % 360) - 180
const DARK_AREAS = '.hero, .modal-scrim'

function CursorMark() {
  const ref = useRef(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = ref.current
    if (!finePointer || reduceMotion || !el) return

    const s = { tx: 0, ty: 0, x: 0, y: 0, angle: 0, shown: false, last: 0 }
    let raf = 0

    // 마크 자리에서 실제 커서 끝을 바라보는 각도
    const facing = () => (Math.atan2(s.ty - OFFSET_Y - s.y, s.tx - OFFSET_X - s.x) * 180) / Math.PI

    const render = () => {
      el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.angle}deg)`
    }

    const tick = (now) => {
      raf = 0
      const dx = s.tx - s.x
      const dy = s.ty - s.y
      s.x += dx * FOLLOW
      s.y += dy * FOLLOW
      const turn = angleDiff(s.angle, facing())
      s.angle += turn * TURN
      render()
      const moving = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || Math.abs(turn) > 0.2
      if (moving || now - s.last < 100) raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      s.tx = e.clientX + OFFSET_X
      s.ty = e.clientY + OFFSET_Y
      s.last = performance.now()
      if (!s.shown) {
        // 처음 나타날 때는 커서 자리에서 바로 시작
        s.x = s.tx
        s.y = s.ty
        s.angle = facing()
        s.shown = true
        el.classList.add('cursor-mark--visible')
      }
      updateColor(e.target)
      wake()
    }

    // 커서 아래가 어두운 영역(첫 화면·팝업 배경)이면 흰색
    const updateColor = (target) => {
      const onDark = target instanceof Element && target.closest(DARK_AREAS)
      el.classList.toggle('cursor-mark--light', Boolean(onDark))
    }

    // 마우스를 멈춘 채 스크롤하면 커서 아래 영역이 바뀌므로 색을 다시 확인합니다.
    const onScroll = () => {
      if (!s.shown) return
      updateColor(document.elementFromPoint(s.tx - OFFSET_X, s.ty - OFFSET_Y))
    }

    const onLeave = () => {
      s.shown = false
      el.classList.remove('cursor-mark--visible')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [])

  return (
    <div className="cursor-mark" ref={ref} aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 26 26">
        <path d="M5 3 A10 10 0 0 1 5 23 Z" fill="currentColor" />
        <line x1="5" y1="3" x2="5" y2="23" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="19.5" cy="13" r="1.6" fill="currentColor" />
      </svg>
    </div>
  )
}

export default CursorMark
