//
// Instruction Set: The 6502 has a relatively small instruction set compared to modern CPUs.
// Some common instruction types are:
// Load/Store
// Arithmetic (Add, Subtract)
// Logical (AND, OR, XOR)
// Shifts (Left, Right)
// Jumps and Calls
// Push/Pop (stack operations)
// Comparison
// Branching


const MAX_MEMORY = 1024 * 64

type Byte = string
type Word = Number
type Register = Byte // 8 bits
type Flag = Byte

// The NES has a specific memory map, which designates different regions of memory for various purposes.
// For example, certain memory locations store the program code, while others hold data or act as memory-mapped I/O
// registers for interacting with hardware components.

type Memory = Byte[]

type SixFiveZeroTwo = {
  programCounter: Word // 16 bits
  stackPointer: Byte
  status: Byte

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

// 6502 is a little endian system.
// Little-endian is a byte-ordering architecture used in computer systems, including the 6502 processor.
// In a little-endian architecture, the least significant byte of a multi-byte value is stored at the
// lowest memory address, while the most significant byte is stored at the highest memory address.
// This means that the bytes you write can be read from left to right.

let chip: SixFiveZeroTwo = {
  programCounter: 0x0000,
  stackPointer: '',
  status: '',
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

