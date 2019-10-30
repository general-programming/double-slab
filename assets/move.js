// by opl
const baseRotation = { x: -34, y: 42 };
let targetRotation = { x: -34, y: 42 };
let currentRotation = { x: -34, y: 42 };
let initialAccelerometerPosition;

const config = {
  speed: 0.05,
  scale: 2,
  accelerometerScale: 0.5
};
const baseElement = document.querySelector(".block");

function setRotation({ x, y }) {
  baseElement.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
}

function positionToRotation({ x, y }) {
  return {
    x: baseRotation.x + config.scale * (2 * (x - 0.5)),
    y: baseRotation.y + config.scale * (2 * (y - 0.5))
  };
}

function updateRotation({clientY, clientX}) {
  const targetPosition = {
    x: 1 - clientY / window.innerHeight,
    y: clientX / window.innerWidth
  };
  targetRotation = positionToRotation(targetPosition);
}

function motion({accelerationIncludingGravity}) {
  if (!initialAccelerometerPosition) {
    initialAccelerometerPosition = {
      x: accelerationIncludingGravity.y,
      y: accelerationIncludingGravity.x
    }
  }
  
  const targetPosition = {
    x: (accelerationIncludingGravity.y - initialAccelerometerPosition.y) * config.accelerometerScale,
    y: (accelerationIncludingGravity.x - initialAccelerometerPosition.x) * config.accelerometerScale
  };
  targetRotation = positionToRotation(targetPosition);
}

document.addEventListener("mousemove", updateRotation);
document.addEventListener("touchmove", ({touches}) => {
  updateRotation(touches[0]);
});
document.addEventListener("touchend", e => {
  targetRotation = baseRotation;
});
window.addEventListener("devicemotion", motion, false);

function step() {
  currentRotation.x += config.speed * (targetRotation.x - currentRotation.x);
  currentRotation.y += config.speed * (targetRotation.y - currentRotation.y);
  setRotation(currentRotation);
  window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
