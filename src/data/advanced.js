// P-05 S-20 심화 콘텐츠 (F-05 아코디언)
// 수질 관리는 04-site-wireframe.md 문구, 나머지 3주제의 소제목·본문은 초안입니다.
import pouringWater from '../assets/breeding/Pouring_water.jpg'
import quarantine from '../assets/breeding/Betta_fish_in_quarantine.jpg'
import bubbleNest from '../assets/breeding/Betta_fish_guarding_bubble.jpg'
import swimming from '../assets/breeding/Betta_fish_swimming_in_aquarium.jpg'

export const advancedTopics = [
  {
    title: '수질 관리',
    lead: '베타는 고인 물에도 잘 버틴다고 알려져 있지만, 깨끗한 물에서 지느러미와 색이 가장 건강하게 유지됩니다.',
    blocks: [
      { type: 'q', q: '물은 얼마나 자주 갈아야 하나요?', a: '일주일에 한 번, 전체 물의 20~30%를 갈아 주세요.' },
      { type: 'photo', img: pouringWater, alt: '작은 어항에 새 물을 붓는 모습' },
      { type: 'q', q: '새 물은 어떻게 준비하나요?', a: '염소를 제거하고 어항 물과 같은 온도로 맞춘 뒤 넣어 주세요.' },
      { type: 'q', q: '무엇을 정기적으로 확인해야 하나요?', a: '암모니아·아질산 수치를 정기적으로 확인하고, 수온은 24~28℃로 일정하게 유지하세요.' },
    ],
  },
  {
    title: '질병 대처',
    lead: '지느러미 녹음, 백점병처럼 흔한 질병의 증상과 초기 대처 방법을 다룹니다.',
    blocks: [
      { type: 'q', q: '지느러미 끝이 녹은 것처럼 보이면 어떻게 하나요?', a: '지느러미 끝이 하얗게 변하거나 짧아지는 지느러미 녹음은 대부분 수질 악화에서 시작합니다. 환수 횟수를 늘리고, 나아지지 않으면 따로 격리해 관찰해 주세요.' },
      { type: 'photo', img: quarantine, alt: '수온계와 수초가 있는 격리 어항 속 베타' },
      { type: 'q', q: '몸에 흰 점이 생기면 어떻게 하나요?', a: '백점병일 수 있습니다. 다른 개체와 분리하고, 수온을 천천히 1~2℃ 올린 뒤 전용 약품 사용을 검토해 주세요.' },
    ],
  },
  {
    title: '번식',
    lead: '번식 준비부터 암수 합사, 거품집과 치어 관리까지 다룹니다.',
    blocks: [
      { type: 'q', q: '번식은 언제 준비하나요?', a: '생후 4~12개월의 건강한 암수를 고르고, 각각 충분히 먹여 컨디션을 올린 뒤 시작합니다.' },
      { type: 'photo', img: bubbleNest, alt: '수면의 거품집 아래를 지키는 수컷 베타' },
      { type: 'q', q: '거품집은 무엇인가요?', a: '수컷이 수면에 만드는 거품 둥지입니다. 산란 후에는 수컷이 알을 거품집으로 옮겨 돌보므로, 암컷은 따로 분리합니다.' },
      { type: 'q', q: '치어는 어떻게 돌보나요?', a: '부화 후 2~3일이 지나 헤엄치기 시작하면 인퓨소리아나 갓 부화한 브라인쉬림프를 조금씩 줍니다.' },
    ],
  },
  {
    title: '발색·컨디션 관리',
    lead: '먹이 구성, 조명, 스트레스 관리로 색을 선명하게 유지하는 방법을 다룹니다.',
    blocks: [
      { type: 'q', q: '색을 선명하게 유지하려면 무엇을 먹이나요?', a: '베타 전용 사료를 기본으로, 냉동 장구벌레나 브라인쉬림프를 번갈아 주면 영양이 고르게 들어갑니다.' },
      { type: 'photo', img: swimming, alt: '수초가 우거진 어항에서 헤엄치는 베타' },
      { type: 'q', q: '조명은 얼마나 켜 두나요?', a: '하루 8~10시간 정도 켜고 밤에는 꺼서 낮과 밤의 리듬을 만들어 주세요.' },
      { type: 'q', q: '스트레스는 어떻게 줄이나요?', a: '숨을 수 있는 수초나 은신처를 두고, 사람이 자주 지나가거나 거울에 비치는 곳에는 어항을 두지 않습니다.' },
    ],
  },
]
