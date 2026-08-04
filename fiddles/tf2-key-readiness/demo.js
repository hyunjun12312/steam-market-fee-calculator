const boxes = [...document.querySelectorAll('input[type="checkbox"]')];
const count = document.querySelector('#count');
const fill = document.querySelector('#fill');

function updateProgress() {
  const completed = boxes.filter((box) => box.checked).length;
  count.textContent = `${completed} of ${boxes.length} checks complete`;
  fill.style.width = `${(completed / boxes.length) * 100}%`;
}

for (const box of boxes) {
  box.addEventListener('change', updateProgress);
}

document.querySelector('#reset').addEventListener('click', () => {
  for (const box of boxes) {
    box.checked = false;
  }
  updateProgress();
});

updateProgress();
