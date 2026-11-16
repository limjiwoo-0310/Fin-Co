import { CloseIcon } from './Icons.jsx'

// B-12 · B-14 · B-15 닫기: ✕ 아이콘만 보이고, 화면 읽기 프로그램에는 "닫기"로 읽힙니다.
function CloseButton({ onClick }) {
  return (
    <button type="button" className="btn-close" aria-label="닫기" onClick={onClick}>
      <CloseIcon />
    </button>
  )
}

export default CloseButton
