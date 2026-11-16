import { recommendedSets } from '../data/products.js'
import { PATHS, onLinkClick } from '../router.js'
import { ArrowRight } from './Icons.jsx'
import './CareGuide.css'

// 적정 사육 환경: 큰 숫자 + 작은 설명 (값은 초안, 게시 전 확인)
const careStats = [
  { value: '24~28℃', label: '수온', note: '히터 사용 권장' },
  { value: '10L+', label: '어항', note: '10L 이상 권장' },
  { value: '약한 물살', label: '여과기', note: '스펀지 여과기' },
  { value: '1마리', label: '합사', note: '수컷은 한 어항에 한 마리' },
]

// 수온 막대: 20~32℃ 범위에서 24~28℃ 구간을 표시
const TEMP_MIN = 20
const TEMP_MAX = 32
const TEMP_LOW = 24
const TEMP_HIGH = 28
const tempPos = (t) => `${((t - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * 100}%`

function TempBar() {
  return (
    <div className="temp-bar" role="img" aria-label={`적정 수온 ${TEMP_LOW}~${TEMP_HIGH}℃ (${TEMP_MIN}~${TEMP_MAX}℃ 범위 중)`}>
      <div className="temp-bar__track">
        <span
          className="temp-bar__range"
          style={{ left: tempPos(TEMP_LOW), width: `calc(${tempPos(TEMP_HIGH)} - ${tempPos(TEMP_LOW)})` }}
        />
      </div>
      <div className="temp-bar__ticks" aria-hidden="true">
        {[TEMP_MIN, TEMP_LOW, TEMP_HIGH, TEMP_MAX].map((t) => (
          <span
            key={t}
            className={`temp-bar__tick${t === TEMP_LOW || t === TEMP_HIGH ? ' is-range' : ''}`}
            style={{ left: tempPos(t) }}
          >
            {t}℃
          </span>
        ))}
      </div>
    </div>
  )
}

// 추천 세트 카드: 마우스 위치에 따라 카드가 입체적으로 기울어집니다.
// 카드 안 위치를 -0.5~0.5로 바꿔 CSS 변수(--tx, --ty)로 넘기고, 기울기·사진 깊이·빛은 CSS가 계산합니다.
const tiltEnabled = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

function onTiltMove(e) {
  if (e.pointerType !== 'mouse' || !tiltEnabled()) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--tx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
  el.style.setProperty('--ty', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  el.classList.add('is-tilting')
}

function onTiltLeave(e) {
  const el = e.currentTarget
  el.classList.remove('is-tilting')
  el.style.setProperty('--tx', '0')
  el.style.setProperty('--ty', '0')
}

// S-05 사육 가이드
function CareGuide() {
  return (
    <section id="s05" className="care" aria-label="사육 가이드">
      <div className="container care__inner">
        {/* 섹션 제목 줄 오른쪽에 심화 사육 정보 이동 버튼 (밀도 조정) */}
        <div className="care__head">
          <div className="section-head">
            <p className="eyebrow">02 / CARE GUIDE</p>
            <h2 className="section-title">사육 환경 가이드</h2>
            <p className="body-lg">적정 사육 환경과 먹이 급여 방법을 정리했습니다.</p>
          </div>
          <a className="btn-secondary" href={PATHS.advanced} onClick={(e) => onLinkClick(e, PATHS.advanced)}>
            심화 사육 정보 보기
            <ArrowRight />
          </a>
        </div>

        <div className="care__cols">
          <div className="care__box">
            <div className="care__box-head">
              <h3 className="block-title">적정 사육 환경</h3>
              <span className="care__note">초안 · 게시 전 확인</span>
            </div>
            {/* 큰 숫자로 한눈에 */}
            <dl className="care-stats">
              {careStats.map((s) => (
                <div key={s.label} className="care-stats__item">
                  <dt className="care-stats__label">
                    {s.label}
                    <span className="care-stats__note"> · {s.note}</span>
                  </dt>
                  <dd className="care-stats__value">{s.value}</dd>
                </div>
              ))}
            </dl>
            <TempBar />
          </div>
          <div className="care__box">
            <h3 className="block-title">먹이 급여 방법</h3>
            <div className="care__text">
              <p>하루 1~2회, 2~3분 안에 다 먹을 만큼만 줍니다.</p>
              <p>베타 전용 사료를 기본으로 하고, 냉동 장구벌레 같은 먹이를 일주일에 1~2번 더합니다.</p>
              <p>남은 먹이는 수질을 해치므로 바로 건져 냅니다.</p>
            </div>
          </div>
        </div>

        <div className="care__sets">
          {/* 추천 세트 제목 줄 오른쪽에 이동 버튼 (밀도 조정) */}
          <div className="care__sets-head">
            <h3 className="block-title">추천 세트</h3>
            <div className="actions-end">
              <a className="btn-secondary" href="#s08">
                세트·용품 보기
              </a>
              <a className="btn-secondary" href="#s06">
                입양 가능 개체 보기
              </a>
            </div>
          </div>
          <div className="care__set-grid">
            {recommendedSets.map((s) => (
              <div key={s.id} className="set-card" onPointerMove={onTiltMove} onPointerLeave={onTiltLeave}>
                <span className="set-card__glare" aria-hidden="true" />
                <div className="set-card__photo">
                  <img className="photo" src={s.img} alt={`${s.name} 어항`} loading="lazy" />
                </div>
                <div className="set-card__body">
                  <span className="set-card__label">{s.label}</span>
                  <span className="set-card__name">{s.name}</span>
                  <span className="set-card__desc">{s.desc}</span>
                  <span className="set-card__price">
                    <span className="set-card__price-label">총비용</span>
                    <span className="set-card__price-value">{s.price}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CareGuide
