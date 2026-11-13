import Modal from './Modal.jsx'
import CloseButton from './CloseButton.jsx'

// P-02 품종 상세 팝업
function BreedModal({ breed, onClose, onToAdopt }) {
  return (
    <Modal label="품종 상세" width={880} onClose={onClose}>
      <div className="modal__close-bar">
        <CloseButton onClick={onClose} />
      </div>
      <div className="breed-modal__body">
        {/* S-11 품종 요약 */}
        <div className="breed-modal__summary">
          <div className="breed-modal__photo">
            <img className="photo" src={breed.img} alt={`${breed.name} 베타`} />
          </div>
          <div className="breed-modal__info">
            <span className="modal__eyebrow">BREED · 품종</span>
            <h2 className="modal__title">{breed.name}</h2>
            <span className="breed-modal__en">{breed.en}</span>
            <div className="breed-modal__level">
              <span className="breed-modal__level-label">키우기 난이도</span>
              <span>{breed.level}</span>
            </div>
            <p className="breed-modal__intro">{breed.intro}</p>
          </div>
        </div>

        {/* S-12 특징 */}
        <div className="breed-modal__group">
          <h3 className="modal__subtitle">특징</h3>
          <ul className="breed-modal__points">
            {breed.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        {/* S-13 적정 환경 */}
        <div className="breed-modal__group">
          <h3 className="modal__subtitle">적정 환경</h3>
          <dl className="spec-list">
            {breed.env.map((e) => (
              <div key={e.k} className="spec-list__row">
                <dt>{e.k}</dt>
                <dd>{e.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="breed-modal__footer">
          <button type="button" className="btn-secondary" onClick={onToAdopt}>
            {breed.name} 입양 가능 개체 보기
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default BreedModal
