// 모바일·태블릿(터치 기기) 판별
// 데스크탑 화면과 동작이 바뀌지 않도록, 모바일 전용 처리는 모두 이 조건일 때만 적용합니다.
// mobile.css 의 @media 조건과 같습니다.
export const TOUCH_QUERY = '(hover: none) and (pointer: coarse)'

export const isTouchDevice = () => window.matchMedia(TOUCH_QUERY).matches

// iOS Safari는 터치 이벤트 리스너가 없으면 :active 스타일을 보여 주지 않습니다.
// 눌림 피드백(mobile.css의 :active)이 보이도록 빈 리스너를 둡니다. 마우스 환경에서는 실행되지 않습니다.
document.addEventListener('touchstart', () => {}, { passive: true })

// 품종 상세(P-02) · 입양(P-03) 팝업 시트: 팝업 안을 스크롤하기 시작하면 시트가 화면 전체로 커집니다.
// (윗부분이 90% 높이에서 잘린 채로 스크롤되지 않도록) 한 번 커지면 닫을 때까지 유지합니다.
// scroll 이벤트는 위로 전달되지 않아 capture 단계에서 받습니다. 터치 기기에서만 동작합니다.
document.addEventListener(
  'scroll',
  (e) => {
    const el = e.target
    if (!isTouchDevice() || !(el instanceof Element)) return
    if (!el.matches('.modal') || !el.querySelector('.breed-modal__body, .fish-modal__body')) return
    if (el.scrollTop > 0 && el.dataset.sheetFull !== 'true') el.dataset.sheetFull = 'true'
  },
  { capture: true, passive: true },
)
