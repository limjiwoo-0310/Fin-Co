import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// 모바일·태블릿 전용 인터랙션 (터치 기기에서만 적용, 컴포넌트 CSS 뒤에 오도록 App 다음에 둡니다)
import './mobile/mobile.css'
import './mobile/touch.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
