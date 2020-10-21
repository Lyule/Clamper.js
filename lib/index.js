class Clamper {
  constructor(opts) {
    if (!opts.el) {
      throw new Error('The parameter "options.el" was not found')
    }
    opts.el = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el
    opts.text = opts.text || opts.el.dataset.text || ''
    opts.ellipsis = opts.ellipsis || '...'
    opts.maxLines = opts.maxLines || 2
    opts.toggleEvent = opts.toggleEvent || function(){}
    opts.toggleBtnTexts = opts.toggleBtnTexts || ['expand', 'up']
    this.options = opts
    this.offset = opts.text.length
    this.localExpanded = false
    this.clamperContentEl =
    this.clamperTextEl =
    this.clamperToggleBtnEl = null
    this.init()
  }

  init() {
    const clamperContentEl = this.clamperContentEl = document.createElement('span')
    clamperContentEl.className = 'clamper-content'
    clamperContentEl.style.wordWrap = 'break-word'
    const clamperTextEl = this.clamperTextEl = document.createElement('span')
    clamperTextEl.className = 'clamper-text'
    clamperTextEl.setAttribute('aria-label', this.options.text)
    clamperTextEl.innerHTML = this.options.text
    const clamperToggleBtnEl = this.clamperToggleBtnEl = document.createElement('button')
    clamperToggleBtnEl.className = 'clamper-toggle-btn'
    clamperToggleBtnEl.innerHTML = this.options.toggleBtnTexts[0]
    clamperContentEl.appendChild(clamperTextEl)
    clamperContentEl.appendChild(clamperToggleBtnEl)
    this.options.el.appendChild(clamperContentEl)
    this.bindEvent()
    this.update()
  }

  bindEvent() {
    this.clamperToggleBtnEl.addEventListener('click', (e) => {
      e.stopPropagation()
      this.options.toggleEvent(e)
      if (this.localExpanded) {
        this.localExpanded = !this.localExpanded
        this.update()
        this.clamperToggleBtnEl.innerHTML = this.options.toggleBtnTexts[0]
      } else {
        this.localExpanded = !this.localExpanded
        this.clampAt(this.options.text.length)
        this.clamperToggleBtnEl.innerHTML = this.options.toggleBtnTexts[1]
      }
    })
  }

  applyChange() {
    if (this.localExpanded || this.isClamped()) {
      this.clamperToggleBtnEl.style.display = 'inline-block'
    } else {
      this.clamperToggleBtnEl.style.display = 'none'
    }

    this.clamperTextEl.textContent = this.options.text.length === this.offset ? this.options.text : this.options.text.slice(0, this.offset) + this.options.ellipsis
  }
  isClamped () {
    if (!this.options.text) {
      return false
    }
    return this.offset !== this.options.text.length
  }

  getClientRectsLength(clientRects) {
    const arr = [];
    for(let i =0;i < clientRects.length;i++) {
      if (arr.indexOf(clientRects[i].top) == -1) {
        arr.push(clientRects[i].top)
      }
    }
    return arr.length
  }
  isOverflow() {
    if (!this.options.maxLines) {
      return false
    }

    if (this.options.maxLines) {
      // getClientRects() safari表现的和chrome不一致
      const actualLines = this.getClientRectsLength(this.clamperContentEl.getClientRects())
      if (actualLines > this.options.maxLines) {
        return true
      }
    }

    return false
  }
  update () {
    this.applyChange()
    if (this.isOverflow()) {
      this.search()
    }
  }
  search (...range) {
    let [ from = 0, to = this.offset ] = range
    if (to - from <= 3) {
      this.stepToFit()
      return
    }
    const target = Math.floor((to + from) / 2)
    this.clampAt(target)
    if (this.isOverflow()) {
      this.search(from, target)
    } else {
      this.search(target, to)
    }
  }
  stepToFit () {
    this.fill()
    this.clamp()
  }
  fill () {
    while (!this.isOverflow() && this.offset < this.options.text.length) {
      this.moveEdge(1)
    }
  }
  clamp () {
    while (this.isOverflow() && this.offset > 0) {
      this.moveEdge(-1)
    }
  }
  moveEdge (steps) {
    this.clampAt(this.offset + steps)
  }
  clampAt (ofst) {
    this.offset = ofst
    this.applyChange()
  }
}

export default Clamper
