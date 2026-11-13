import { PATHS, usePath } from './router.js'
import MainPage from './pages/MainPage.jsx'
import AdvancedPage from './pages/AdvancedPage.jsx'
import CursorMark from './components/CursorMark.jsx'

function App() {
  const path = usePath()

  return (
    <>
      {path === PATHS.advanced ? <AdvancedPage /> : <MainPage />}
      {/* 사이트 전체: 마우스를 따라다니는 로고 마크 */}
      <CursorMark />
    </>
  )
}

export default App
