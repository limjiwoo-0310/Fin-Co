import { useEffect, useState } from 'react'
import './ToBreedButton.css'
import { isTouchDevice } from '../mobile/touch.js'

const HEADER_H = 96
const HEADER_H_TOUCH = 64 // 모바일·태블릿 헤더 높이 (src/mobile/mobile.css)

// 화면 오른쪽 아래 원형 버튼: '다양한 베타 모아보기'(S-04)로 바로 올라갑니다.
// S-04를 지나 아래로 내려왔을 때만 나타납니다.
function ToBreedButton() {
  const [visible, setVisible] = useState(false)

  // 모바일·태블릿(터치 기기): 헤더 높이가 64px이라 그 기준으로 나타납니다. (데스크탑은 아래 effect가 96px 기준)
  useEffect(() => {
    if (!isTouchDevice()) return
    const target = document.getElementById('s04')
    if (!target) return
    const update = () => setVisible(target.getBoundingClientRect().bottom <= HEADER_H_TOUCH)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (isTouchDevice()) return // 터치 기기는 위 effect가 처리
    const target = document.getElementById('s04')
    if (!target) return
    const update = () => setVisible(target.getBoundingClientRect().bottom <= HEADER_H)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <a
      className={`to-breed${visible ? ' to-breed--visible' : ''}`}
      href="#s04"
      aria-label="다양한 베타 모아보기로 이동"
      title="다양한 베타 모아보기"
      tabIndex={visible ? undefined : -1}
      aria-hidden={!visible || undefined}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 16V4M5 9l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </a>
  )
}

export default ToBreedButton
