import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'
import BreedIndex from '../components/BreedIndex.jsx'
import CareGuide from '../components/CareGuide.jsx'
import Adoption from '../components/Adoption.jsx'
import Supplies from '../components/Supplies.jsx'
import News from '../components/News.jsx'
import Footer from '../components/Footer.jsx'
import BreedModal from '../components/BreedModal.jsx'
import FishModal from '../components/FishModal.jsx'
import DoneModal from '../components/DoneModal.jsx'
import Toast from '../components/Toast.jsx'
import ToBreedButton from '../components/ToBreedButton.jsx'
import { breedById } from '../data/breeds.js'
import { fishList } from '../data/fish.js'
import { buyNotice } from '../data/products.js'

const TOAST_MS = 2400

// P-01 메인 원페이지 (+ P-02 · P-03 · P-04 팝업)
function MainPage() {
  // modal: null | { type: 'breed', id } | { type: 'fish', id } | { type: 'done', id }
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(false)
  const toastTimer = useRef(null)

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  // 다른 페이지(P-05)의 메뉴로 들어온 경우(/#s06 등) 해당 섹션으로 이동합니다.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' })
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const close = () => setModal(null)

  // 팝업을 닫고 해당 섹션으로 이동 (B-11 → S-06, B-16 → S-05)
  const goTo = (id) => {
    setModal(null)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  const buy = () => {
    setToast(true)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(false), TOAST_MS)
  }

  const fish = modal && modal.type !== 'breed' ? fishList.find((f) => f.id === modal.id) : null

  return (
    <div className="page">
      <div className="page__top">
        <Header />
        <Hero />
      </div>
      <main>
        <BreedIndex onOpen={(id) => setModal({ type: 'breed', id })} />
        <CareGuide />
        <Adoption onOpen={(id) => setModal({ type: 'fish', id })} paused={modal !== null} />
        <Supplies onBuy={buy} />
        <News />
      </main>
      <Footer />
      <ToBreedButton />

      {toast && <Toast message={buyNotice} />}

      {modal?.type === 'breed' && (
        <BreedModal breed={breedById[modal.id]} onClose={close} onToAdopt={() => goTo('s06')} />
      )}
      {modal?.type === 'fish' && (
        <FishModal
          key={fish.id}
          fish={fish}
          onClose={close}
          onSubmit={() => setModal({ type: 'done', id: fish.id })}
        />
      )}
      {modal?.type === 'done' && <DoneModal fish={fish} onClose={close} onToGuide={() => goTo('s05')} />}
    </div>
  )
}

export default MainPage
