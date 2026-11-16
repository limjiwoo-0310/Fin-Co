import { useEffect, useState } from 'react'
import './ToBreedButton.css'

const HEADER_H = 96

// 화면 오른쪽 아래 원형 버튼: '다양한 베타 모아보기'(S-04)로 바로 올라갑니다.
// S-04를 지나 아래로 내려왔을 때만 나타납니다.
function ToBreedButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
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
