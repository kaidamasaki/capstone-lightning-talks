"use strict";

function Timer(target) {
  this.minutes = 5;
  this.tens = 0;
  this.ones = 0;

  this.target = target;
  this.timeLeft = true;
}

Timer.prototype.start = function() {
  this.elems = {};
  this.elems.minutes = document.createTextNode(this.minutes);

  this.elems.tens = document.createTextNode(this.tens);
  var tensWrapper = document.createElement("span");
  tensWrapper.classList.add("tens");
  tensWrapper.appendChild(this.elems.tens);

  this.elems.ones = document.createTextNode(this.ones);
  var onesWrapper = document.createElement("span");
  onesWrapper.classList.add("ones");
  onesWrapper.appendChild(this.elems.ones);
  var colon = document.createTextNode(":");

  this.target.appendChild(this.elems.minutes);
  this.target.appendChild(colon);
  this.target.appendChild(tensWrapper);
  this.target.appendChild(onesWrapper);

  window.setInterval(this.tick.bind(this), 1000);
}

Timer.prototype.display = function() {
  this.elems.minutes.nodeValue = this.minutes;
  this.elems.tens.nodeValue = this.tens;
  this.elems.ones.nodeValue = this.ones;
}

Timer.prototype.tick = function() {
  if (this.minutes == 0 && this.tens == 3 && this.ones == 0) {
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

function startTimer() {
  var timer = new Timer(document.getElementById("timer"))
  timer.start()
  timer.display();
}

function nextSlide(slides) {
  var current = slides.findIndex(
    slide =>
      "#" + slide.id == window.location.hash);
  if (current < 0) {
    current = 0;
  }
  
  let next = slides[(current + 1) % slides.length]

  window.location.href = "#" + next.id;
  
  window.setTimeout(() => next.scrollIntoView(true), 10);
}

// Only add the button if JS is on.
window.addEventListener('DOMContentLoaded', (event) => {
  var timerElem = document.getElementById("timer");
  var button = document.createElement("button");
  button.textContent = "start";
  button.type = "button";

  timerElem.appendChild(button);

  let slides = Array.from(document.getElementById("slideshow").children);

  button.addEventListener("click", () => {
    button.remove();
    startTimer();
    document.documentElement.requestFullscreen();
    window.location = "#" + slides[0].id;
  });

  document.addEventListener("keypress", (event) => {
    if (event.key == " ") {
      event.stopPropagation();
      nextSlide(slides);
    }
  });
});
