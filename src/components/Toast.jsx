import './Toast.css'

// B-07 구매 안내 메시지
function Toast({ message }) {
  return (
    <div className="toast" role="status">
      {message}
    </div>
  )
}

export default Toast
