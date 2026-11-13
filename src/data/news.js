// S-09 입고 소식 (문구는 초안)
import giantThumb from '../assets/adoption/giant.jpg'
import halfmoonBlueThumb from '../assets/adoption/halfmoon-2.jpg'
import crowntailThumb from '../assets/adoption/Crimson_crowntail-2.jpg'
import doubletailThumb from '../assets/adoption/doubletail-2.jpg'
import plakatThumb from '../assets/adoption/plakat-betta.jpg'

export const latestNews = [
  {
    id: 'n1',
    rare: true,
    title: '자이언트 · 코이 입고',
    body: '일반 베타보다 크게 자라는 자이언트 품종입니다. 레드·블랙·화이트가 섞인 코이 패턴으로, 입고 수량이 적습니다.',
    img: giantThumb,
  },
  {
    id: 'n2',
    rare: false,
    title: '하프문 · 로열 블루 입고',
    body: '꼬리지느러미가 180도로 펼쳐지는 하프문 품종입니다. 짙은 파란색 단색 개체입니다.',
    img: halfmoonBlueThumb,
  },
  {
    id: 'n3',
    rare: false,
    title: '크라운테일 · 크림슨 입고',
    body: '지느러미 끝이 왕관처럼 갈라지는 크라운테일 품종입니다. 붉은색이 선명한 단색 개체입니다.',
    img: crowntailThumb,
  },
]

export const pastNews = [
  {
    id: 'n4',
    rare: false,
    title: '더블테일 · 파스텔 핑크 입고',
    body: '꼬리지느러미가 두 갈래로 나뉜 더블테일 품종입니다. 연한 분홍빛 개체입니다.',
    img: doubletailThumb,
  },
  {
    id: 'n5',
    rare: false,
    title: '플라캇 · 스틸 블루 입고',
    body: '지느러미가 짧고 활발한 플라캇 품종입니다. 푸른 회색 바탕에 무늬가 있는 개체입니다.',
    img: plakatThumb,
  },
]
