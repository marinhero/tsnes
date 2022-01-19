import './style.css'
import './6502.ts'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>A NES running on a browser via TypeScript</h1>
  <canvas id="ninti" width="200" height="100" style="border:1px solid #000000;"></canvas>
`
