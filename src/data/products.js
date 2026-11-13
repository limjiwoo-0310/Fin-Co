// S-05 추천 세트 · S-08 세트·용품 (문구는 초안, 금액은 가상 금액)
import starterSetImg from '../assets/fishtank/fishtank-3.jpg'
import upgradeSetImg from '../assets/fishtank/fishtank-big-1.jpg'
import plantedSetImg from '../assets/fishtank/fishtank-1.jpg'
import tankSetImg from '../assets/fishtank/fishtank-2.jpg'
import heaterImg from '../assets/supplies/Aquarium_heater.jpg'
import spongeImg from '../assets/supplies/Aquarium_sponge9.jpg'

export const recommendedSets = [
  {
    id: 'starter',
    label: 'STARTER SET',
    name: '입문 세트',
    desc: '10L 큐브 어항, 스펀지 여과기, 히터, 수온계로 구성한 기본 세트입니다.',
    price: '89,000원',
    img: starterSetImg,
  },
  {
    id: 'upgrade',
    label: 'UPGRADE SET',
    name: '업그레이드 세트',
    desc: '기본 세트에 큰 어항과 조명을 더한 구성입니다.',
    price: '189,000원',
    img: upgradeSetImg,
  },
  {
    id: 'planted',
    label: 'PLANTED SET',
    name: '수초 레이아웃 세트',
    desc: '업그레이드 세트에 바닥재와 키우기 쉬운 음성 수초를 더한 구성입니다. 베타가 숨고 쉴 곳이 많아집니다.',
    price: '259,000원',
    img: plantedSetImg,
  },
]

export const products = [
  {
    id: 'tank-set',
    name: '베타 어항 세트',
    desc: '어항, 조명, 스펀지 여과기를 함께 구성한 세트입니다. 처음 베타를 들이는 분께 알맞습니다.',
    extra: '구성: 어항 · 조명 · 스펀지 여과기',
    img: tankSetImg,
  },
  {
    id: 'heater',
    name: '소형 어항용 히터',
    desc: '수온을 24~28℃로 일정하게 유지합니다. 소형 어항에 맞는 크기입니다.',
    extra: '적정 어항: 10~30L',
    img: heaterImg,
  },
  {
    id: 'sponge',
    name: '스펀지 여과기',
    desc: '물살이 약해 지느러미가 긴 베타에게 알맞습니다. 스펀지가 여과재 역할을 합니다.',
    extra: '에어펌프 별도',
    img: spongeImg,
  },
]

// B-07 구매 안내 메시지
export const buyNotice = '온라인 구매는 준비 중입니다.'
