import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// 가로 카드 줄 아래의 작은 스크롤 막대 (품종 도감 S-04와 같은 모양, index.css .mini-bar)
// - 카드 줄의 스크롤 위치를 보여 주고, 잡고 좌우로 끌거나 빈 곳을 눌러 이동할 수 있습니다.
// - loop: 카드 줄이 3벌 반복될 때는 가운데 한 벌 안에서의 위치를 보여 주고, 끌면 그 범위에서 움직입니다.
// - 반복하지 않는데 카드가 한 화면에 다 들어가 넘길 것이 없으면 자리만 남기고 숨깁니다.

const TRACK_W = 160
const THUMB_W = 40

function MiniScrollbar({ targetRef, loop = false, getLoopWidth, onDragChange }) {
  const trackRef = useRef(null)
  const drag = useRef(null)
  const opts = useRef({ loop, getLoopWidth })
  useLayoutEffect(() => {
    opts.current = { loop, getLoopWidth }
  })
  const [progress, setProgress] = useState(0)
  const [scrollable, setScrollable] = useState(true)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const row = targetRef.current
    if (!row) return
    const update = () => {
      const { loop: isLoop, getLoopWidth: getW } = opts.current
      if (isLoop) {
        const w = getW()
        let p = w > 0 ? ((row.scrollLeft - w) / w) % 1 : 0
        if (p < 0) p += 1
        setScrollable(true)
        setProgress(p)
        return
      }
      const max = row.scrollWidth - row.clientWidth
      setScrollable(max > 1)
      setProgress(max > 0 ? row.scrollLeft / max : 0)
    }
    update()
    row.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(row)
    // 찾기 옵션으로 카드 수가 바뀌는 경우
    const mo = new MutationObserver(update)
    mo.observe(row, { childList: true })
    return () => {
      row.removeEventListener('scroll', update)
      ro.disconnect()
      mo.disconnect()
    }
  }, [targetRef, loop])

  const dragTo = (clientX) => {
    const row = targetRef.current
    const left = trackRef.current.getBoundingClientRect().left
    const p = Math.min(TRACK_W - THUMB_W, Math.max(0, clientX - left - drag.current.offset)) / (TRACK_W - THUMB_W)
    if (loop) {
      const w = getLoopWidth()
      row.scrollLeft = w + p * w
    } else {
      row.scrollLeft = p * (row.scrollWidth - row.clientWidth)
    }
  }

  const onPointerDown = (e) => {
    if (e.button !== 0 || !scrollable) return
    e.preventDefault()
    const thumbLeft = progress * (TRACK_W - THUMB_W)
    const x = e.clientX - trackRef.current.getBoundingClientRect().left
    const onThumb = x >= thumbLeft && x <= thumbLeft + THUMB_W
    drag.current = { offset: onThumb ? x - thumbLeft : THUMB_W / 2 }
    setDragging(true)
    onDragChange?.(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    dragTo(e.clientX)
  }

  const onPointerMove = (e) => {
    if (drag.current) dragTo(e.clientX)
  }

  const onPointerUp = () => {
    if (!drag.current) return
    drag.current = null
    setDragging(false)
    onDragChange?.(false)
  }

  return (
    <div
      ref={trackRef}
      className={`mini-bar${dragging ? ' mini-bar--dragging' : ''}`}
      style={scrollable ? undefined : { visibility: 'hidden' }}
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="mini-bar__rail">
        <span className="mini-bar__thumb" style={{ transform: `translateX(${progress * (TRACK_W - THUMB_W)}px)` }} />
      </div>
    </div>
  )
}

export default MiniScrollbar
