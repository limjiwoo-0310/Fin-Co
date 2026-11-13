import { useState } from 'react'
import { advancedTopics } from '../data/advanced.js'
import { PATHS, onLinkClick } from '../router.js'
import { ArrowLeft } from '../components/Icons.jsx'
import Header from '../components/Header.jsx'
import './AdvancedPage.css'

// P-05 심화 사육 정보
function AdvancedPage() {
  // F-05: 첫 항목만 펼친 상태로 시작
  const [open, setOpen] = useState({ 0: true })
  const toggle = (i) => setOpen((o) => ({ ...o, [i]: !o[i] }))

  return (
    <div className="advanced">
      <Header onMain={false} />
      {/* S-19 페이지 제목 */}
      <section className="advanced__title" aria-label="페이지 제목">
        <div className="advanced__wrap advanced__title-inner">
          <p className="eyebrow">ADVANCED CARE</p>
          <h1 className="advanced__h1">심화 사육 정보</h1>
          <p className="advanced__intro">
            베타를 오래, 건강하게 키우고 싶은 분을 위한 정보입니다. 수질부터 번식까지 한 단계 더 깊이 다룹니다.
          </p>
        </div>
      </section>

      {/* S-20 심화 콘텐츠 (F-05 아코디언) */}
      <section className="advanced__content" aria-label="심화 콘텐츠">
        <div className="advanced__wrap">
          <div className="acc__head">
            <h2 className="acc__head-title">주제</h2>
            <span className="acc__count">전체 {advancedTopics.length}개</span>
          </div>
          <div className="acc">
            {advancedTopics.map((t, i) => {
              const isOpen = !!open[i]
              const panelId = `acc-panel-${i}`
              return (
                <div key={t.title} className="acc__item">
                  <h3 className="acc__heading">
                    <button
                      type="button"
                      className="acc__trigger"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(i)}
                    >
                      <span className="acc__label">
                        <span className="acc__no">0{i + 1}</span>
                        <span className="acc__title">{t.title}</span>
                      </span>
                      {/* 아이콘만: ＋ 펼치기 / － 접기 (상태는 aria-expanded로 전달) */}
                      <span className="acc__action" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 18 18">
                          <path d="M2 9h14" stroke="currentColor" strokeWidth="1.6" />
                          <path className="acc__icon-v" d="M9 2v14" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  {isOpen && (
                    <div id={panelId} className="acc__panel">
                      <p className="acc__lead">{t.lead}</p>
                      {t.blocks.map((b, j) =>
                        b.type === 'q' ? (
                          <div key={j} className="acc__qa">
                            <h4 className="acc__q">{b.q}</h4>
                            <p className="acc__a">{b.a}</p>
                          </div>
                        ) : (
                          <div key={j} className="acc__photo">
                            {b.img ? (
                              <img className="photo" src={b.img} alt={b.alt} loading="lazy" />
                            ) : (
                              <span className="acc__photo-label">{b.label}</span>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* S-21 메인으로 돌아가기 */}
      <section className="advanced__back" aria-label="메인으로 돌아가기">
        <div className="advanced__wrap">
          <a className="btn-secondary" href={PATHS.main} onClick={(e) => onLinkClick(e, PATHS.main)}>
            <ArrowLeft />
            메인으로 돌아가기
          </a>
        </div>
      </section>
    </div>
  )
}

export default AdvancedPage
