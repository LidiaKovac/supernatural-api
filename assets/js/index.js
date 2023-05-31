window.onload = async () => {
  writeUrl()
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}
async function typewriteAdd(txt, el) {
  const times = [100, 154, 113, 167, 200, 184]
  el.innerText = ""
  for (const char of txt) {
    el.textContent += char
    await sleep(times[Math.floor(Math.random() * times.length)] || 100)
  }
}

async function typewriteRemove(txt, el) {
  for (const char of txt) {
    el.textContent = el.textContent.slice(0, -1)
    await sleep(100)
  }
}
const writeUrl = async (phrase) => {
  const endpoints = [
    "quotes/random",
    "quotes/all",
    "characters/all",
    "characters/:id",
    "episodes/",
    "episodes/:id",
  ]
  const tail = document.querySelector("pre strong")
  let i = 0
  while (true) {
    await typewriteAdd(endpoints[i], tail)
    await sleep(1000)
    await typewriteRemove(endpoints[i], tail)
    await sleep(1000)
    i = Math.floor(Math.random() * endpoints.length)
  }
}

