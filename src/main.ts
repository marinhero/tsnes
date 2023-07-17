import { Chip6502 } from "./6502.ts"
import { Logger } from "./logger.ts"

const main = () => {
  const l = new Logger()
  l.log('Chime')
  new Chip6502()
}

main()