import Modal from './Modal.jsx'
import CloseButton from './CloseButton.jsx'

// P-04 입양 신청 완료 팝업
function DoneModal({ fish, onClose, onToGuide }) {
  return (
    <Modal label="입양 신청 완료" width={560} onClose={onClose}>
      <div className="modal__close-bar">
        <CloseButton onClick={onClose} />
      </div>
      <div className="done-modal__body">
        {/* S-17 완료 메시지 */}
        <span className="modal__eyebrow">APPLICATION RECEIVED</span>
        <h2 className="done-modal__title">입양 신청이 완료되었습니다</h2>
        <p className="done-modal__text">
          {fish.name} 개체의 입양 신청 내용이 접수되었습니다.
          <br />
          신청해 주셔서 감사합니다.
        </p>
        {/* S-18 다음 행동 */}
        <div className="done-modal__next">
          <p>입양 전, 사육 가이드에서 적정 환경을 다시 확인하세요.</p>
          <button type="button" className="btn-secondary" onClick={onToGuide}>
            사육 가이드 보기
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DoneModal
