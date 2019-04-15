"use strict";

function Timer(target) {
  this.minutes = 5;
  this.tens = 0;
  this.ones = 0;

  this.paused = false;
  this.started = false;
  this.target = target;
  this.timeLeft = true;
}

Timer.prototype.start = function() {
  if (this.started) {
    this.paused = false;
  } else {
    this.started = true;
    this.elems = {};
    this.elems.minutes = document.createTextNode(this.minutes);

    this.elems.tens = document.createTextNode(this.tens);
    let tensWrapper = document.createElement("span");
    tensWrapper.classList.add("tens");
    tensWrapper.appendChild(this.elems.tens);

    this.elems.ones = document.createTextNode(this.ones);
    let onesWrapper = document.createElement("span");
    onesWrapper.classList.add("ones");
    onesWrapper.appendChild(this.elems.ones);
    let colon = document.createTextNode(":");

    this.target.appendChild(this.elems.minutes);
    this.target.appendChild(colon);
    this.target.appendChild(tensWrapper);
    this.target.appendChild(onesWrapper);

    window.setInterval(this.tick.bind(this), 1000);

    this.display();
  }
}

Timer.prototype.pause = function() {
  this.paused = true;
}

Timer.prototype.display = function() {
  this.elems.minutes.nodeValue = this.minutes;
  this.elems.tens.nodeValue = this.tens;
  this.elems.ones.nodeValue = this.ones;
}

Timer.prototype.tick = function() {
  if (this.paused) {
    return;
  }

  if (this.minutes == 1 && this.tens == 0 && this.ones == 0) {
    this.target.classList.add("urgent");
  }

  if (this.minutes == 0 && this.tens == 0 && this.ones == 0) {
    this.timeLeft = false;
    this.minutes = 0;
    this.tens = 0;
    this.ones = 0;

    this.target.classList.add("overtime");
  }

  if (this.timeLeft) {
    if (this.ones == 0) {
      if (this.tens == 0) {
        this.minutes -= 1;
        this.tens = 5;
        this.ones = 9;
      } else {
        this.tens -= 1;
        this.ones = 9;
      }
    } else {
      this.ones -= 1;
    }
  } else {
    if (this.ones == 9) {
      if (this.tens == 5) {
        this.minutes += 1;
        this.tens = 0;
        this.ones = 0;
      } else {
        this.tens += 1;
        this.ones = 0;
      }
    } else {
      this.ones += 1;
    }
  }

  this.display();
}

function SlideShow(target) {
  this.target = target;
  this.all = Array.from(this.target.children);

  let current = this.all.findIndex(
    slide =>
      "#" + slide.id == window.location.hash);

  if (current < 0) {
    this.current = 0;
  } else {
    this.current = current;
  }
}

SlideShow.prototype.show = function(index) {
  let len = this.all.length;
  // Workaround for negative % results.
  let modIndex = ((index % len) + len) % len

  window.location.href = "#" + this.all[modIndex].id;
}

SlideShow.prototype.prev = function() {
  this.current -= 1;

  this.show(this.current);
}

SlideShow.prototype.next = function() {
  this.current += 1;

  this.show(this.current);
}

// Only add the button if JS is on.
window.addEventListener('DOMContentLoaded', (event) => {
  let timerElem = document.getElementById("timer");
  let timer = new Timer(document.getElementById("timer"))

  let button = document.createElement("button");
  button.textContent = "start";
  button.type = "button";

  timerElem.appendChild(button);

  let slideShow = new SlideShow(document.getElementById("slideshow"))

  button.addEventListener("click", () => {
    button.remove();
    timer.start();
    document.documentElement.requestFullscreen();
  });

  document.addEventListener("keydown", (event) => {
    if (
      (event.code == "Space" && event.shiftKey)
        || event.code == "ArrowUp"
        || event.code == "ArrowLeft") {
      event.stopPropagation();
      event.preventDefault();

      slideShow.prev()
    } else if (
      (event.code == "Space" && !event.shiftKey
       || event.code == "ArrowDown"
       || event.code == "ArrowRight")) {
      event.stopPropagation();
      event.preventDefault();

      slideShow.next()
    }
  });

  document.onfullscreenchange = (event) => {
    if (!document.fullscreenElement) {
      timer.pause();
      button.textContent = "resume";
      timerElem.appendChild(button);
    }
  };
});
