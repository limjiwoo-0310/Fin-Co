import { useEffect } from 'react'

// S-02 첫 화면 물결 효과 (05-site-reference.md 변경 제안 D, 06-site-design.md 7장)
// - 마우스를 따라 커서 주변 물이 약하게 일렁입니다.
// - 베타를 포함한 이미지 전체가 물결에 따라 함께 일렁입니다.
// - 터치 기기, 움직임 줄이기 설정, WebGL2 미지원 환경에서는 실행하지 않고 정지 이미지(<img>)를 그대로 둡니다.

const CELL = 6.0 // 물결 계산 격자 한 칸 크기(CSS px). 작을수록 물결 간격이 촘촘해집니다.
const WAVE_SPEED = 0.16 // 물결이 퍼지는 속도(0~0.5). 작을수록 꾸덕하게 천천히 움직입니다.
const DAMPING = 0.955 // 물결이 잦아드는 정도(작을수록 빨리 사라짐 → 커서 주변에만 남음)
const SETTLE = 0.975 // 물이 원래 높이로 돌아오는 정도(1에 가까울수록 오래 남음)
const DROP = 4.0 // 마우스가 지날 때 물을 누르는 세기
const DROP_RADIUS = 5 // 누르는 범위(칸). 클수록 물결이 넓고 둥글게 부풉니다.
const REFRACTION = 26.0 // 물결에 따라 이미지가 휘는 정도(px)
const HIGHLIGHT = 0.05 // 물결 면의 반사광 세기. 작을수록 물결 선이 덜 보입니다.
const MAX_DPR = 1.5

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uImg;
uniform sampler2D uHeight;
uniform vec2 uRes;      // 캔버스 크기(px)
uniform vec2 uImgSize;  // 원본 이미지 크기(px)
uniform vec2 uCell;     // 격자 한 칸(높이 텍스처 좌표)
uniform float uRefraction;
uniform float uHighlight;
out vec4 outColor;

// object-fit: cover; object-position: right center 와 같은 배치
vec2 coverUv(vec2 px) {
  float s = max(uRes.x / uImgSize.x, uRes.y / uImgSize.y);
  vec2 size = uImgSize * s;
  vec2 offset = vec2(uRes.x - size.x, (uRes.y - size.y) * 0.5);
  return (px - offset) / size;
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 st = px / uRes;

  float hL = texture(uHeight, st - vec2(uCell.x, 0.0)).r;
  float hR = texture(uHeight, st + vec2(uCell.x, 0.0)).r;
  float hU = texture(uHeight, st - vec2(0.0, uCell.y)).r;
  float hD = texture(uHeight, st + vec2(0.0, uCell.y)).r;
  vec2 grad = vec2(hR - hL, hD - hU);

  // 물결에 따라 베타를 포함한 이미지 전체가 휘어 보입니다.
  vec2 shifted = px + grad * uRefraction;
  vec3 color = texture(uImg, coverUv(shifted)).rgb;

  float light = clamp((grad.x - grad.y) * uHighlight, -0.12, 0.25);
  color += vec3(0.62, 0.72, 0.86) * light;

  outColor = vec4(color, 1.0);
}`

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn('[hero ripple]', gl.getShaderInfoLog(s))
    gl.deleteShader(s)
    return null
  }
  return s
}

function createProgram(gl) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const p = gl.createProgram()
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.warn('[hero ripple]', gl.getProgramInfoLog(p))
    return null
  }
  return p
}

function makeTexture(gl) {
  const t = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, t)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return t
}

export function useHeroRipple(sectionRef, canvasRef, src) {
  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduceMotion) return

    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false })
    if (!gl) return
    const program = createProgram(gl)
    if (!program) return

    gl.useProgram(program)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const u = (name) => gl.getUniformLocation(program, name)
    gl.uniform1i(u('uImg'), 0)
    gl.uniform1i(u('uHeight'), 1)
    gl.uniform1f(u('uHighlight'), HIGHLIGHT)

    const imgTex = makeTexture(gl)
    const heightTex = makeTexture(gl)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)

    let gridW = 0
    let gridH = 0
    let cur = null
    let prev = null
    let dpr = 1
    let imageReady = false
    let raf = 0
    let running = false
    let last = null
    let disposed = false

    const resize = () => {
      const rect = section.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(u('uRes'), canvas.width, canvas.height)
      gl.uniform1f(u('uRefraction'), REFRACTION * dpr)

      gridW = Math.ceil(rect.width / CELL) + 2
      gridH = Math.ceil(rect.height / CELL) + 2
      cur = new Float32Array(gridW * gridH)
      prev = new Float32Array(gridW * gridH)
      gl.uniform2f(u('uCell'), 1 / gridW, 1 / gridH)
      uploadHeight()
      draw()
    }

    const uploadHeight = () => {
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, heightTex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, gridW, gridH, 0, gl.RED, gl.FLOAT, cur)
    }

    const draw = () => {
      if (!imageReady) return
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    // 물결 한 단계 계산. 남은 물결이 거의 없으면 false를 돌려 멈춥니다.
    // cur: 물 높이, prev: 물이 움직이는 속도.
    // 퍼지는 속도(WAVE_SPEED)를 낮춰 끈적하게 천천히 번지는 물결을 만듭니다.
    const step = () => {
      if (!cur) return false // 크기 계산 전에는 아무것도 하지 않음
      let energy = 0
      for (let y = 1; y < gridH - 1; y++) {
        const row = y * gridW
        for (let x = 1; x < gridW - 1; x++) {
          const i = row + x
          const lap = cur[i - 1] + cur[i + 1] + cur[i - gridW] + cur[i + gridW] - 4 * cur[i]
          prev[i] = (prev[i] + WAVE_SPEED * lap) * DAMPING
        }
      }
      for (let i = 0; i < cur.length; i++) {
        const h = (cur[i] + prev[i]) * SETTLE // 눌린 물이 서서히 평평하게 돌아옴
        cur[i] = h
        const v = prev[i]
        energy += (v < 0 ? -v : v) + (h < 0 ? -h : h) * 0.05
      }
      return energy > 0.2
    }

    const loop = () => {
      // 어떤 이유로든 멈추면 running을 풀어 다음 마우스 움직임에 다시 시작할 수 있게 합니다.
      running = false
      if (!cur || disposed) return
      const alive = step()
      uploadHeight()
      draw()
      if (alive) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    const start = () => {
      if (running || disposed) return
      running = true
      raf = requestAnimationFrame(loop)
    }

    const drop = (cx, cy, amount) => {
      const gx = Math.round(cx / CELL) + 1
      const gy = Math.round(cy / CELL) + 1
      for (let dy = -DROP_RADIUS; dy <= DROP_RADIUS; dy++) {
        for (let dx = -DROP_RADIUS; dx <= DROP_RADIUS; dx++) {
          const x = gx + dx
          const y = gy + dy
          if (x < 1 || y < 1 || x >= gridW - 1 || y >= gridH - 1) continue
          const d = Math.sqrt(dx * dx + dy * dy) / (DROP_RADIUS + 1)
          if (d >= 1) continue
          cur[y * gridW + x] -= amount * (1 - d * d)
        }
      }
    }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      const rect = section.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      // 빠르게 움직여도 끊기지 않게 지난 위치와 사이를 이어서 누릅니다.
      if (last) {
        const dist = Math.hypot(x - last.x, y - last.y)
        const n = Math.min(12, Math.ceil(dist / CELL))
        for (let k = 1; k <= n; k++) {
          drop(last.x + ((x - last.x) * k) / n, last.y + ((y - last.y) * k) / n, DROP / n)
        }
      } else {
        drop(x, y, DROP)
      }
      last = { x, y }
      start()
    }
    const onLeave = () => {
      last = null
    }

    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (disposed) return
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, imgTex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.uniform2f(u('uImgSize'), img.naturalWidth, img.naturalHeight)
      imageReady = true
      draw()
      canvas.dataset.ready = 'true' // 첫 그림이 나온 뒤에만 정지 이미지 위에 보입니다.
    }
    img.src = src

    const ro = new ResizeObserver(resize)
    ro.observe(section)
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      delete canvas.dataset.ready
      // 같은 캔버스를 다시 쓰는 재마운트(StrictMode)가 있어 컨텍스트는 버리지 않고 자원만 정리합니다.
      gl.deleteTexture(imgTex)
      gl.deleteTexture(heightTex)
      gl.deleteBuffer(buf)
      gl.deleteProgram(program)
    }
  }, [sectionRef, canvasRef, src])
}
