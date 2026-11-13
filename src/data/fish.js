// S-06 입양 가능 개체 · P-03 개체 상세
// 첫 개체(하프문 · 로열 블루)는 04-site-wireframe.md 예시, 나머지는 사진을 보고 쓴 초안입니다.
// 입양비는 가상 금액입니다.
import { breedById } from './breeds.js'

import halfmoonBlueCard from '../assets/adoption/halfmoon-2-2.jpg'
import halfmoonBlueWide from '../assets/adoption/halfmoon-2.jpg'
import crowntailCard from '../assets/adoption/Crimson_crowntail.jpg'
import crowntailWide from '../assets/adoption/Crimson_crowntail-2.jpg'
import halfmoonWhiteCard from '../assets/adoption/hafmoon-3-2.jpg'
import halfmoonWhiteWide from '../assets/adoption/hafmoon-3.jpg'
import giantCard from '../assets/adoption/giant-2.jpg'
import giantWide from '../assets/adoption/giant.jpg'
import plakatCard from '../assets/adoption/plakat-betta-2.jpg'
import plakatWide from '../assets/adoption/plakat-betta.jpg'
import veiltailCard from '../assets/adoption/Red_veiltail_betta-2.jpg'
import veiltailWide from '../assets/adoption/Red_veiltail_betta.jpg'
import doubletailCard from '../assets/adoption/doubletail-1.jpg'
import doubletailWide from '../assets/adoption/doubletail-2.jpg'
import halfmoonMultiCard from '../assets/adoption/halfmoon1-2.jpg'
import halfmoonMultiWide from '../assets/adoption/halfmoon1.jpg'

// F-01 색·패턴별 찾기 옵션
export const colorFilters = [
  { id: 'all', label: '전체' },
  { id: 'blue', label: '블루' },
  { id: 'red', label: '레드' },
  { id: 'white', label: '화이트·파스텔' },
  { id: 'multi', label: '멀티컬러' },
]

const tagByColor = {
  blue: 'BLUE',
  red: 'RED',
  white: 'WHITE·PASTEL',
  multi: 'MULTI',
}

function envLineOf(breed) {
  const tank = breed.env.find((e) => e.k === '어항').v.replace(' 권장', '')
  return `수온 24~28℃ · 어항 ${tank} · 물살이 약한 환경에서 키우세요.`
}

const raw = [
  { id: 'f1', breed: 'halfmoon', color: 'blue', name: '하프문 · 로열 블루', pattern: '로열 블루 솔리드', sex: '수컷', age: '약 4개월', fee: '45,000원', card: halfmoonBlueCard, wide: halfmoonBlueWide },
  { id: 'f2', breed: 'crowntail', color: 'red', name: '크라운테일 · 크림슨', pattern: '크림슨 레드 솔리드', sex: '수컷', age: '약 5개월', fee: '35,000원', card: crowntailCard, wide: crowntailWide },
  { id: 'f3', breed: 'halfmoon', color: 'white', name: '하프문 · 플래티넘 화이트', pattern: '플래티넘 화이트 솔리드', sex: '수컷', age: '약 4개월', fee: '50,000원', card: halfmoonWhiteCard, wide: halfmoonWhiteWide },
  { id: 'f4', breed: 'giant', color: 'multi', name: '자이언트 · 코이', pattern: '레드·블랙·화이트 코이', sex: '수컷', age: '약 6개월', fee: '60,000원', card: giantCard, wide: giantWide },
  { id: 'f5', breed: 'plakat', color: 'blue', name: '플라캇 · 스틸 블루', pattern: '스틸 블루 마블', sex: '수컷', age: '약 4개월', fee: '30,000원', card: plakatCard, wide: plakatWide },
  { id: 'f6', breed: 'veiltail', color: 'red', name: '베일테일 · 레드', pattern: '레드 솔리드', sex: '수컷', age: '약 5개월', fee: '20,000원', card: veiltailCard, wide: veiltailWide },
  { id: 'f7', breed: 'doubletail', color: 'white', name: '더블테일 · 파스텔 핑크', pattern: '파스텔 핑크', sex: '수컷', age: '약 4개월', fee: '40,000원', card: doubletailCard, wide: doubletailWide },
  { id: 'f8', breed: 'halfmoon', color: 'multi', name: '하프문 · 멀티컬러', pattern: '레드·블루·옐로 멀티컬러', sex: '수컷', age: '약 5개월', fee: '55,000원', card: halfmoonMultiCard, wide: halfmoonMultiWide },
]

export const fishList = raw.map((f) => {
  const breed = breedById[f.breed]
  return {
    ...f,
    tag: tagByColor[f.color],
    desc: `${breed.name} · ${f.pattern}`,
    meta: `${f.sex} · ${f.age}`, // 카드 아래 짧은 정보 (가격은 카드에 넣지 않음)
    level: breed.level,
    envLine: envLineOf(breed),
    rows: [
      { k: '품종', v: breed.name },
      { k: '색·패턴', v: f.pattern },
      { k: '성별', v: f.sex },
      { k: '나이', v: f.age },
      { k: '입양비', v: f.fee },
    ],
  }
})
