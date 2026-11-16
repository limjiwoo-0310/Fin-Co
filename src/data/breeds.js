// S-04 품종 도감 · P-02 품종 상세
// 하프문은 04-site-wireframe.md 문구, 나머지 5품종은 초안 문구입니다. 사육 수치는 게시 전 확인이 필요합니다.
import halfmoon from '../assets/breed/halfmoon.jpg'
import plakat from '../assets/breed/plakat.jpg'
import crowntail from '../assets/breed/crowntail.jpg'
import veiltail from '../assets/breed/veiltail.jpg'
import doubletail from '../assets/breed/doubletail.jpg'
import giant from '../assets/breed/giant.jpg'

const baseEnv = [
  { k: '수온', v: '24~28℃ · 히터 사용 권장' },
  { k: '어항', v: '10L 이상 권장' },
  { k: '여과기', v: '물살이 약한 스펀지 여과기' },
  { k: '합사', v: '수컷은 한 어항에 한 마리' },
]

export const breeds = [
  {
    id: 'halfmoon',
    name: '하프문',
    en: 'Halfmoon',
    level: '보통',
    img: halfmoon,
    intro: '꼬리지느러미를 활짝 펴면 반달처럼 180도로 펼쳐지는 품종입니다.',
    points: [
      '꼬리지느러미가 넓고 길어 헤엄치는 모습이 우아합니다.',
      '지느러미가 무거워 물살이 센 곳에서는 쉽게 지칩니다.',
      '지느러미가 찢어지지 않도록 끝이 날카로운 장식물은 피하는 것이 좋습니다.',
    ],
    env: baseEnv,
  },
  {
    id: 'plakat',
    name: '플라캇',
    en: 'Plakat',
    level: '쉬움',
    img: plakat,
    intro: '지느러미가 짧고 몸이 단단해 활발하게 헤엄치는 품종입니다.',
    points: [
      '지느러미가 짧아 물살에 덜 지치고 움직임이 빠릅니다.',
      '야생 베타에 가까운 체형으로 비교적 튼튼합니다.',
      '뛰어오르는 힘이 좋아 어항 뚜껑을 덮는 것이 좋습니다.',
    ],
    env: baseEnv,
  },
  {
    id: 'crowntail',
    name: '크라운테일',
    en: 'Crowntail',
    level: '보통',
    img: crowntail,
    intro: '지느러미 끝이 왕관처럼 가늘게 갈라지는 품종입니다.',
    points: [
      '지느러미 막이 짧고 줄기가 길게 뻗어 뾰족한 윤곽을 만듭니다.',
      '수질이 나빠지면 지느러미 끝이 상하기 쉽습니다.',
      '지느러미가 걸리지 않도록 거친 장식물과 조화는 피하는 것이 좋습니다.',
    ],
    env: baseEnv,
  },
  {
    id: 'veiltail',
    name: '베일테일',
    en: 'Veiltail',
    level: '쉬움',
    img: veiltail,
    intro: '꼬리지느러미가 베일처럼 아래로 길게 늘어지는 품종입니다.',
    points: [
      '가장 널리 알려진 베타 품종으로 구하기 쉽습니다.',
      '지느러미가 길어 물살이 약한 환경이 좋습니다.',
      '비교적 튼튼해 처음 키우는 분께 알맞습니다.',
    ],
    env: baseEnv,
  },
  {
    id: 'doubletail',
    name: '더블테일',
    en: 'Double Tail',
    level: '보통',
    img: doubletail,
    intro: '꼬리지느러미가 위아래 두 갈래로 나뉘는 품종입니다.',
    points: [
      '등지느러미가 넓고 길어 꼬리와 대칭을 이룹니다.',
      '몸이 짧은 편이라 소화와 부레 상태에 주의가 필요합니다.',
      '과식하지 않도록 먹이 양을 조절하는 것이 좋습니다.',
    ],
    env: baseEnv,
  },
  {
    id: 'giant',
    name: '자이언트',
    en: 'Giant',
    level: '보통',
    img: giant,
    intro: '일반 베타보다 1.5~2배 정도 크게 자라는 품종입니다.',
    points: [
      '몸이 커서 존재감이 있고 움직임이 여유롭습니다.',
      '몸집에 맞게 넓은 어항이 필요합니다.',
      '먹는 양이 많아 수질이 빨리 나빠질 수 있습니다.',
    ],
    env: [
      { k: '수온', v: '24~28℃ · 히터 사용 권장' },
      { k: '어항', v: '20L 이상 권장' },
      { k: '여과기', v: '물살이 약한 스펀지 여과기' },
      { k: '합사', v: '수컷은 한 어항에 한 마리' },
    ],
  },
]

export const breedById = Object.fromEntries(breeds.map((b) => [b.id, b]))
