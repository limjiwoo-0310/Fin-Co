import { useEffect, useState } from 'react'
import { PATHS, onLinkClick } from '../router.js'
import './Header.css'

// S-01 상단 메뉴: 스크롤해도 화면 위에 고정됩니다.
// 첫 화면(#top)을 지나면 로고와 메뉴 글자를 기본 글자 색으로 바꿉니다.
const menus = [
  { id: 'M-01', label: '품종 도감', href: '#s04' },
  { id: 'M-02', label: '사육 가이드', href: '#s05' },
  { id: 'M-03', label: '입양', href: '#s06' },
  { id: 'M-04', label: '세트·용품', href: '#s08' },
]

const HEADER_H = 96

// assets/logos/finco-mark-*.svg 와 같은 도형. 색은 currentColor를 따릅니다.
function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
      <path d="M5 3 A10 10 0 0 1 5 23 Z" fill="currentColor" />
      <line x1="5" y1="3" x2="5" y2="23" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="19.5" cy="13" r="1.6" fill="currentColor" />
    </svg>
  )
}

// onMain: 메인 페이지(P-01)에서는 같은 페이지 안 섹션으로 스크롤합니다.
// 다른 페이지(P-05)에서는 메인 페이지로 이동한 뒤 해당 섹션으로 갑니다. 첫 화면이 없으니 처음부터 흰 배경입니다.
function Header({ onMain = true }) {
  const [pastHero, setPastHero] = useState(!onMain)

  const link = (hash) =>
    onMain
      ? { href: hash }
      : { href: `${PATHS.main}${hash}`, onClick: (e) => onLinkClick(e, `${PATHS.main}${hash}`) }

  useEffect(() => {
    if (!onMain) return
    const hero = document.getElementById('top')
    if (!hero) return
    const update = () => setPastHero(hero.getBoundingClientRect().bottom <= HEADER_H)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [onMain])

  return (
    <header className={`site-header${pastHero ? ' site-header--past-hero' : ''}`}>
      <div className="container site-header__inner">
        <a className="logo" {...link('#top')} aria-label="Fin&Co. 첫 화면">
          <LogoMark />
          <span className="logo__text">
            Fin<span className="logo__amp">&amp;</span>Co.
          </span>
        </a>
        <nav aria-label="주요 메뉴">
          <ul className="site-nav">
            {menus.map((m) => (
              <li key={m.id}>
                <a {...link(m.href)}>{m.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
