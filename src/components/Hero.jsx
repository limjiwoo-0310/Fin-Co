import { useRef } from 'react'
import heroImg from '../assets/main/hero-2.jpg'
import { ArrowRight } from './Icons.jsx'
import { useHeroRipple } from './useHeroRipple.js'
import './Hero.css'

// S-02 첫 화면
function Hero() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  useHeroRipple(sectionRef, canvasRef, heroImg)

  return (
    <section id="top" ref={sectionRef} className="hero" aria-label="첫 화면">
      <img className="hero__img" src={heroImg} alt="" />
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
      <div className="container hero__inner">
        <p className="hero__eyebrow rise1">BETTA SPECIALIST — 베타 전문 어항 브랜드</p>
        <h1 className="hero__title">
          <span className="hero__line hero__line--light rise2">알고 고르는 베타,</span>
          <span className="hero__line hero__line--bold rise3">Fin&amp;Co.</span>
        </h1>
        <a className="hero__cta rise4" href="#s04">
          <span>품종 도감 보기</span>
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  )
}

export default Hero
