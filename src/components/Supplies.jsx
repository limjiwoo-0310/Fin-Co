import { products } from '../data/products.js'
import './Supplies.css'

// S-08 세트·용품
function Supplies({ onBuy }) {
  return (
    <section id="s08" className="supplies" aria-label="세트·용품">
      <div className="container supplies__inner">
        <div className="section-head">
          <p className="eyebrow">04 / SETS &amp; SUPPLIES</p>
          <h2 className="section-title">어항 세트와 관련 용품</h2>
          <p className="body-lg">베타와 함께할 환경을 준비하는 데 필요한 구성입니다.</p>
        </div>
        <div className="supplies__grid">
          {products.map((p) => (
            <div key={p.id} className="pcard">
              <div className="pcard__photo">
                <img className="photo" src={p.img} alt={p.name} loading="lazy" />
              </div>
              <span className="pcard__name">{p.name}</span>
              <span className="pcard__desc">{p.desc}</span>
              <span className="pcard__extra">{p.extra}</span>
              <button type="button" className="btn-secondary pcard__buy" onClick={onBuy}>
                구매
              </button>
            </div>
          ))}
        </div>
        <div className="actions-end">
          <a className="btn-secondary" href="#s06">
            입양 가능 개체 보기
          </a>
        </div>
      </div>
    </section>
  )
}

export default Supplies
