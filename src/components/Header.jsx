import { useEffect, useState } from 'react'
import { PATHS, onLinkClick } from '../router.js'
import './Header.css'
import { CloseIcon } from './Icons.jsx'
import { isTouchDevice } from '../mobile/touch.js'

// S-01 상단 메뉴: 스크롤해도 화면 위에 고정됩니다.
// 첫 화면(#top)을 지나면 로고와 메뉴 글자를 기본 글자 색으로 바꿉니다.
const menus = [
  { id: 'M-01', label: '품종 도감', href: '#s04' },
  { id: 'M-02', label: '사육 가이드', href: '#s05' },
  { id: 'M-03', label: '입양', href: '#s06' },
  { id: 'M-04', label: '세트·용품', href: '#s08' },
]

const HEADER_H = 96
const HEADER_H_TOUCH = 64 // 모바일·태블릿 헤더 높이 (src/mobile/mobile.css)

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

  // 모바일·태블릿 햄버거 메뉴: 열림 상태, 메뉴를 누르면 닫고 이동합니다.
  const [menuOpen, setMenuOpen] = useState(false)
  const menuLink = (hash) => {
    const l = link(hash)
    return {
      ...l,
      onClick: (e) => {
        setMenuOpen(false)
        l.onClick?.(e)
      },
    }
  }

  // 햄버거 메뉴가 열려 있을 때 헤더 바깥을 탭하면 닫습니다.
  useEffect(() => {
    if (!menuOpen) return
    const onOutside = (e) => {
      if (!(e.target instanceof Element) || !e.target.closest('.site-header')) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onOutside)
    return () => document.removeEventListener('pointerdown', onOutside)
  }, [menuOpen])

  // 모바일·태블릿(터치 기기): 헤더 높이가 64px이라 그 기준으로 색을 바꿉니다. (데스크탑은 아래 effect가 96px 기준)
  useEffect(() => {
    if (!onMain || !isTouchDevice()) return
    const hero = document.getElementById('top')
    if (!hero) return
    const update = () => setPastHero(hero.getBoundingClientRect().bottom <= HEADER_H_TOUCH)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [onMain])

  useEffect(() => {
    if (!onMain) return
    if (isTouchDevice()) return // 터치 기기는 위 effect가 처리
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
        {/* 모바일·태블릿 전용 햄버거 버튼 (데스크탑에서는 src/mobile/mobile.css에서 숨김) */}
        <button
          type="button"
          className="site-menu-toggle"
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={menuOpen}
          aria-controls="site-menu-panel"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <CloseIcon size={20} />
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          )}
        </button>
      </div>
      {/* 모바일·태블릿 전용 서랍 메뉴의 어두운 배경: 누르면 메뉴만 닫힙니다 (뒤 화면은 눌리지 않음). */}
      {menuOpen && <div className="site-menu-scrim" aria-hidden="true" onClick={() => setMenuOpen(false)} />}
      {/* 모바일·태블릿 전용 메뉴 패널: 햄버거 버튼을 눌렀을 때만 나타납니다. */}
      {menuOpen && (
        <nav id="site-menu-panel" className="site-menu-panel" aria-label="주요 메뉴">
          <ul className="site-menu-panel__list">
            {menus.map((m) => (
              <li key={m.id}>
                <a {...menuLink(m.href)}>{m.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
