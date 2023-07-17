import { Logger } from "./logger.ts"

// 6502 is a little endian system.
// Little-endian is a byte-ordering architecture used in computer systems, including the 6502 processor.
// In a little-endian architecture, the least significant byte of a multi-byte value is stored at the
// lowest memory address, while the most significant byte is stored at the highest memory address.
// This means that the bytes you write can be read from left to right.
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

type Byte = number // 8 bits
type Word = number // 16 bits
type Register = Byte // 8 bits

// Flags bits
export const CARRY_FLAG = 0 // Carry
export const ZERO_FLAG = 1 // Zero
export const INTERRUPT_DISABLE_FLAG = 2 // Interrupt Disable
export const DECIMAL_MODE_FLAG = 3 // Decimal Mode (Not used in NES)
export const BREAK_COMMAND_FLAG = 4 // Break Command
export const UNUSED_FLAG = 5 // Unused
export const OVERFLOW_FLAG = 6 // Overflow
export const NEGATIVE_FLAG = 7 // Negative

// Memory Cap
// 64 Kilobytes
// 8 bits in 1 byte.
// 1024 bytes in a Kilo
// 64 * 1024
export const MAX_MEMORY = 64 * 1024

// The NES has a specific memory map, which designates different regions of memory for various purposes.
// For example, certain memory locations store the program code, while others hold data or act as memory-mapped I/O
// registers for interacting with hardware components.
type Memory = Byte[]

export interface SixFiveZeroTwo {
    programCounter: Word // 16 bits
    stackPointer: Byte

    accumulator: Register
    registerX: Register
    registerY: Register

    // Status represents the following flags. Flags denote a status and they can be on/off
    // 7 6 5 4 3 2 1 0
    // N V _ B D I Z C

    // N - Negative
    // V - Overflow
    // _ - Unused (always 1)
    // B - Break command
    // D - Decimal mode
    // I - Interrupt disable
    // Z - Zero
    // C - Carry

    status: Byte
    memory: Memory // 64KB

    logger: Logger
}

export class Chip6502 implements SixFiveZeroTwo {
    programCounter: Word // 16 bits
    stackPointer: Byte
    accumulator: Register
    registerX: Register
    registerY: Register
    status: Byte
    memory: Memory // 64KB
    logger: Logger

    constructor() {
        this.logger = new Logger()
        this.programCounter = 0
        this.stackPointer = 0
        this.accumulator = 0
        this.registerX = 0
        this.registerY = 0
        this.status = 0
        this.memory = new Array(MAX_MEMORY).fill(0)

        this.logger.log('BOOT')
    }

    setFlag(bit: number, value: boolean) {
        if (value) {
            this.status |= (1 << bit);
        } else {
            this.status &= ~(1 << bit);
        }
    }

    isFlagSet(bit: number): boolean {
        return (this.status & (1 << bit)) !== 0;
    }
}
