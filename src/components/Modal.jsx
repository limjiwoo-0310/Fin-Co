import './Modal.css'

// P-02 · P-03 · P-04 공통: scrim 위 가운데 모달. fixed라서 닫으면 페이지 위치가 그대로 유지됩니다.
// 팝업 바깥(회색 배경)을 누르면 닫힙니다.
function Modal({ label, width, onClose, children }) {
  // 팝업 안에서 눌러 바깥에서 뗀 경우(글자 선택 등)는 닫지 않도록 누른 곳과 뗀 곳이 모두 배경일 때만 닫습니다.
  const onScrimPointerDown = (e) => {
    e.currentTarget.dataset.downOnScrim = e.target === e.currentTarget ? 'true' : 'false'
  }
  const onScrimClick = (e) => {
    const downOnScrim = e.currentTarget.dataset.downOnScrim === 'true'
    if (downOnScrim && e.target === e.currentTarget) onClose?.()
  }

  return (
    <div className="modal-scrim" onPointerDown={onScrimPointerDown} onClick={onScrimClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={label} style={{ width }}>
        {children}
      </div>
    </div>
  )
}

export default Modal
