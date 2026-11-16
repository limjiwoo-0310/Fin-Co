import { PATHS, onLinkClick } from '../router.js'
import './Footer.css'

// S-10 푸터
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__text">
          <span className="footer__brand">Fin&amp;Co. 핀앤코 — 알고 고르는 베타</span>
          <span>베타 전문 어항 브랜드 · 입양 가능한 베타, 베타 전용 어항 세트, 용품</span>
          <span>© Fin&amp;Co.</span>
        </div>
        <a className="footer__link" href={PATHS.advanced} onClick={(e) => onLinkClick(e, PATHS.advanced)}>
          심화 사육 정보 →
        </a>
      </div>
    </footer>
  )
}

export default Footer
