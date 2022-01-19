
const MAX_MEMORY = 1024 * 64

type Byte = string
type Word = Number
type Register = Byte
type Flag = Byte
type Memory = Byte[]

type SixFiveOTwo = {
  programCounter: Word
  stackPointer: Word

  accumulator: Register
  registerX: Register
  registerY: Register

  carry: Flag
  zero: Flag
  decimalMode?: Flag // Not used by NES
  breakCommand: Flag

  // Reserved
  interruptDisable: Flag // FFFA - FFFB
  overflow: Flag // FFFC - FFFD
  negative: Flag // FFFE - FFFF

  mem: Memory
}

let chip: SixFiveOTwo = {
  programCounter: 0x0000,
  stackPointer: 0x0100,
  accumulator: '',
  registerX: '',
  registerY: '',
  carry: '',
  zero: '',
  decimalMode: '',
  breakCommand: '',
  interruptDisable: '',
  overflow: '',
  negative: '',
  mem: []
}

console.log("A CPU in isolation", chip)

