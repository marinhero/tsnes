import { Chip6502 } from "./6502.ts"
import { Logger } from "./logger.ts"

const l = new Logger()
l.log('Chime ON')

const main = () => {
  const cpu = new Chip6502()
  cpu.load('./asm/first.asm')
  l.log(cpu.showStatus())
}

main()

l.log('OFF')