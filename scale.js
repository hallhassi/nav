function makeTop(a, b) { a.style.top = b + "px" }
function makeLeft(a, b) { a.style.left = b + "px" }
function p(g, x) { return parseFloat(getComputedStyle(g)[x]) }
function portraitTest() { return window.matchMedia("(max-aspect-ratio:1/1)").matches }
let portrait = portraitTest()
let em = parseFloat(getComputedStyle(document.querySelector(':root')).getPropertyValue('--fg-font-size'))

let fg = {el: document.querySelector('#f')}
let bg = {el: document.querySelector('#b')}
let cursor = {el: document.querySelector('#cursor')}
let els = [fg, bg, cursor]

let win = {}
let screen = {}
let mousePos = {}

orient()
function orient() {
  win.width = document.documentElement.clientWidth 
  win.height = document.documentElement.clientHeight
  if (portrait) {
    fg.width = win.width
    fg.height = em
    bg.width = win.height * win.width / em
    bg.height = bg.fontSize = win.height
    cursor.width = fg.height * win.width / win.height
    cursor.height = fg.height
    xy = 'x'
    yx = 'y'
    widthheight = 'width'
    heightwidth = 'height'
    lefttop = 'left'
    topleft = 'top'
  } else {
    fg.width = em
    fg.height = win.height
    bg.width = bg.fontSize = win.width
    bg.height = win.width * win.height / em
    cursor.width = fg.width
    cursor.height = fg.width * win.height / win.width
    xy = 'y'
    yx = 'x'
    widthheight = 'height'
    heightwidth = 'width'
    lefttop = 'top'
    topleft = 'left'
  }
  els.forEach((x) => {
    Object.entries(x).forEach(([key, value]) => {
      x.el.style[key] = value + "px"
    })
  })
}
window.addEventListener('resize', reorient)
function reorient() {
  if (portraitTest() !== portrait) {
    els.forEach((el) => {
      moveEl(el, topleft, 0)
      moveEl(el, lefttop, 0)
    })
    portrait = portraitTest()
  }
  orient()
}
document.addEventListener('mousemove', mouse)
function mouse(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
  let m = mouse[xy]
  
  if (mouse[yx] < cursor[heightwidth] / 2) {
    moveEl(fg, topleft, 0)
  } else if (mouse[yx] < win[heightwidth] - cursor[heightwidth] / 2) {
    moveEl(fg, topleft, mouse[yx] - em/2)
  } else {
    moveEl(fg, topleft, win[heightwidth] - em)
  }

  if (m < cursor[widthheight] / 2) {
    moveEl(bg, lefttop, 0)
    moveEl(cursor, lefttop, 0)
  } else if (m < win[widthheight] - cursor[widthheight] / 2) {
    moveEl(bg, lefttop, win[widthheight]/2 - win[heightwidth] / 2 - ((m - em/2) * (bg[widthheight] - win[heightwidth]) / (win[widthheight] - em)))
    moveEl(cursor, lefttop, m - cursor[widthheight] / 2)
  } else {
    moveEl(bg, lefttop, win[widthheight] - bg[widthheight])
    moveEl(cursor, lefttop, win[widthheight] - cursor[widthheight])
  }
}
document.addEventListener('touchmove', handleMove)
function handleMove(e) {
  e.preventDefault()
  const touches = e.touches[0]
      mouse(e.touches[0])
}
function moveEl(el, prop, amt) {
  el['el']['style'][prop] = amt + "px"
}
