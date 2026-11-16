import { useState } from 'react'
import { latestNews, pastNews } from '../data/news.js'
import './News.css'

// S-09 입고 소식
function News() {
  const [moreOpen, setMoreOpen] = useState(false)
  const list = moreOpen ? latestNews.concat(pastNews) : latestNews

  return (
    <section id="s09" className="news" aria-label="입고 소식">
      <div className="container news__inner">
        <div className="section-head">
          <p className="eyebrow">05 / NEW ARRIVALS</p>
          <h2 className="section-title">새로 들어온 베타</h2>
        </div>
        <ul className="news__list">
          {list.map((n) => (
            <li key={n.id} className="news__item">
              <div className="news__thumb">
                <img className="photo" src={n.img} alt="" loading="lazy" />
              </div>
              <div className="news__text">
                {n.rare && <span className="news__rare">희귀 품종</span>}
                <span className="news__title">{n.title}</span>
                <span className="news__body">{n.body}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="news__actions">
          <button
            type="button"
            className="news__more"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((v) => !v)}
          >
            {moreOpen ? '접기 －' : '더보기 ＋'}
          </button>
          <a className="btn-secondary" href="#s06">
            입양 가능 개체 보기
          </a>
        </div>
      </div>
    </section>
  )
}

export default News
