import { Chip6502 } from "./6502.ts"
import { Logger } from "./logger.ts"

const main = () => {
  const l = new Logger()
  l.log('Chime')
  const cpu = new Chip6502()
  l.log(cpu.showStatus())
}

main()