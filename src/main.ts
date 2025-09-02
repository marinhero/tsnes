import { Chip6502 } from "./6502.ts"
import { Logger } from "./logger.ts"

const l = new Logger()

const main = () => {
  const args = Deno.args
  if (args.length === 0) {
    l.log('Usage: deno run --allow-read src/main.ts <binary-file>')
    l.log('Example: deno run --allow-read src/main.ts src/asm/simple.bin')
    Deno.exit(1)
  }

  l.log('Chime ON')

  const binaryFile = args[0]
  const cpu = new Chip6502()
  cpu.load(binaryFile)
  l.log('PROGRAM LOADED SUCCESSFULLY')

  cpu.execute()

  l.log(cpu.showStatus())
}

main()

l.log('OFF')
