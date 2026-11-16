import { useState } from 'react'
import Modal from './Modal.jsx'
import CloseButton from './CloseButton.jsx'
import GlideChips from './GlideChips.jsx'

const toOptions = (labels) => labels.map((l) => ({ id: l, label: l }))
const expOptions = toOptions(['처음이에요', '키워 본 적 있어요'])
const tankOptions = toOptions(['준비했어요', '준비 중이에요', '아직이에요'])

// 신청서 선택 옵션(F-02): 색·패턴 찾기와 같은 글라이드 효과
function OptionGroup({ label, options, value, onChange }) {
  return (
    <div className="adopt-form__group">
      <span className="adopt-form__group-label" aria-hidden="true">
        {label}
      </span>
      <GlideChips variant="form" label={label} options={options} value={value} onChange={onChange} />
    </div>
  )
}

// P-03 개체 상세 팝업 · 입양 신청
function FishModal({ fish, onClose, onSubmit }) {
  const [exp, setExp] = useState(null)
  const [tank, setTank] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit() // 실제 전송 없이 P-04로 전환
  }

  return (
    <Modal label="개체 상세와 입양 신청" width={880} onClose={onClose}>
      <div className="modal__close-bar">
        <CloseButton onClick={onClose} />
      </div>
      <div className="fish-modal__body">
        {/* S-14 개체 정보: 왼쪽 1:1 사진 · 오른쪽 정보 */}
        <div className="fish-modal__summary-row">
          <div className="fish-modal__photo">
            <img className="photo" src={fish.card} alt={`${fish.name} 베타`} />
          </div>
          <div className="fish-modal__info">
            <span className="modal__eyebrow">INDIVIDUAL · 개체</span>
            <h2 className="modal__title">{fish.name}</h2>
            <dl className="spec-list">
              {fish.rows.map((r) => (
                <div key={r.k} className="spec-list__row">
                  <dt>{r.k}</dt>
                  <dd>{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* S-15 품종 난이도·환경 요약 */}
        <dl className="spec-list fish-modal__summary">
          <div className="spec-list__row">
            <dt>키우기 난이도</dt>
            <dd>{fish.level}</dd>
          </div>
          <div className="spec-list__row">
            <dt>환경 요약</dt>
            <dd>{fish.envLine}</dd>
          </div>
        </dl>

        {/* S-16 입양 신청 폼 (F-02) */}
        <form className="adopt-form" onSubmit={handleSubmit}>
          <div className="adopt-form__head">
            <h3 className="block-title">이 개체 입양 신청하기</h3>
            <p className="adopt-form__guide">아래 항목을 작성해 주세요.</p>
          </div>
          <div className="adopt-form__grid">
            <label className="adopt-form__field">
              이름
              <input className="adopt-form__control" type="text" name="name" placeholder="이름을 입력해 주세요" />
            </label>
            <label className="adopt-form__field">
              연락처
              <input className="adopt-form__control" type="tel" name="phone" placeholder="010-0000-0000" />
            </label>
          </div>
          <OptionGroup label="베타를 키워 본 적이 있나요?" options={expOptions} value={exp} onChange={setExp} />
          <OptionGroup label="어항 준비 상태" options={tankOptions} value={tank} onChange={setTank} />
          <div className="adopt-form__grid">
            <label className="adopt-form__field">
              희망 인계 방법
              <select className="adopt-form__control" name="handover" defaultValue="">
                <option value="">선택해 주세요</option>
                <option>매장 방문</option>
                <option>생물 택배</option>
              </select>
            </label>
            <label className="adopt-form__field">
              희망 날짜
              <input className="adopt-form__control" type="date" name="date" />
            </label>
          </div>
          <button type="submit" className="btn-primary">
            입양 신청하기
          </button>
        </form>
      </div>
    </Modal>
  )
}

export default FishModal
