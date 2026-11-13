import { useEffect, useState } from 'react'

// 페이지가 2개(P-01 메인, P-05 심화 사육 정보)뿐이라 라이브러리 없이 History API로 이동합니다.
export const PATHS = {
  main: '/',
  advanced: '/advanced',
}

export function navigate(to) {
  if (window.location.pathname === to) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  // html의 scroll-behavior: smooth 를 따르지 않고 바로 맨 위로 (이후 섹션 이동과 겹치지 않도록)
  window.scrollTo({ top: 0, behavior: 'instant' })
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onChange = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])

  return path
}

// 새 탭 열기(⌘/Ctrl 클릭 등)는 브라우저 기본 동작에 맡깁니다.
export function onLinkClick(event, to) {
  if (event.defaultPrevented || event.button !== 0) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  navigate(to)
}
