"use strict";

class Timer {
  constructor(target) {
    this.seconds = 5 * 60

    this.target = target
    this.paused = false
    this.started = false
  }

  start() {
    if (this.started) {
      this.paused = false
    } else {
      this.started = true
      this.elems = {}
      this.elems.minutes = document.createTextNode(this.minutes)

      this.elems.tens = document.createTextNode(this.tens)
      let tensWrapper = document.createElement("span")
      tensWrapper.classList.add("tens")
      tensWrapper.appendChild(this.elems.tens)

      this.elems.ones = document.createTextNode(this.ones)
      let onesWrapper = document.createElement("span")
      onesWrapper.classList.add("ones")
      onesWrapper.appendChild(this.elems.ones)
      let colon = document.createTextNode(":")

      this.target.appendChild(this.elems.minutes)
      this.target.appendChild(colon)
      this.target.appendChild(tensWrapper)
      this.target.appendChild(onesWrapper)

      window.setInterval(this.tick.bind(this), 1000)

      this.display()
    }
  }

  pause() {
    this.paused = true
  }

  display() {
    const seconds = Math.abs(this.seconds)

    this.elems.minutes.nodeValue = Math.floor(seconds / 60)
    this.elems.tens.nodeValue = Math.floor((seconds % 60) / 10)
    this.elems.ones.nodeValue = seconds % 10
  }

  tick() {
    if (this.paused) {
      return
    }

    if (this.seconds <= 60) {
      this.target.classList.add("urgent")
    }

    if (this.seconds === 0) {
      this.target.classList.add("overtime")
    }

    this.seconds -= 1

    this.display()
  }
}

class SlideShow {
  constructor(target) {
    this.target = target
    this.all = Array.from(this.target.children)

    const current = this.all.findIndex(
      slide =>
      "#" + slide.id == window.location.hash)

    if (current < 0) {
      this.current = 0
    } else {
      this.current = current
    }
  }

  show(rawIndex) {
    const len = this.all.length
    // Workaround for negative % results.
    const index = ((rawIndex || this.current % len) + len) % len

    window.location.href = "#" + this.all[index].id
  }

  prev() {
    this.current -= 1

    this.show(this.current)
  }

  next() {
    this.current += 1

    this.show(this.current)
  }
}

// Only add the button if JS is on.
window.addEventListener('DOMContentLoaded', () => {
  const timerElem = document.getElementById("timer")
  const timer = new Timer(timerElem)

  if (timerElem) {
    const button = document.createElement("button")
    button.textContent = "start"
    button.type = "button"

    timerElem.appendChild(button)

    button.addEventListener("click", () => {
      button.remove()
      timer.start()
      document.documentElement.requestFullscreen().then(() => {
        window.setTimeout(() => slideShow.show(), 100)
      })
    })

    document.onfullscreenchange = () => {
      if (!document.fullscreenElement) {
        timer.pause()
        button.textContent = "resume"
        timerElem.appendChild(button)

        window.setTimeout(() => slideShow.show(), 100)
      }
    }
  }

  const slideShow = new SlideShow(document.getElementById("slideshow"))

  document.addEventListener("keydown", (event) => {
    if (
      (event.code == "Space" && event.shiftKey)
        || event.code == "ArrowUp"
        || event.code == "ArrowLeft") {
      event.stopPropagation()
      event.preventDefault()

      slideShow.prev()
    } else if (
      (event.code == "Space" && !event.shiftKey
       || event.code == "ArrowDown"
       || event.code == "ArrowRight")) {
      event.stopPropagation()
      event.preventDefault()

      slideShow.next()
    }
  })
})
