# Claude Context Notes - 6502 Emulator Project

## Project Overview
Building a 6502 CPU emulator in TypeScript using Deno, with the eventual goal of creating a NES emulator. This is a learning project focused on understanding TypeScript and low-level programming concepts.

## User Learning Style & Preferences
- **Guidance over code**: User prefers explanations and hints rather than complete code implementations
- **Teacher role**: I act as a teacher/mentor, not a code generator
- **Self-reliance**: User wants to build their own knowledge base to reduce dependency
- **Iterative learning**: User learns by implementing, testing, and understanding patterns

## Project Structure
```
/home/marin/Code/tsnes/
├── src/
│   ├── 6502.ts          # Main CPU emulator class
│   ├── main.ts          # Entry point with command-line args
│   ├── logger.ts        # Colored logging utility
│   └── asm/
│       ├── simple.asm   # Basic test program (LDA #$42, STA $0200, NOP, BRK)
│       ├── simple.bin   # Assembled version of simple.asm
│       ├── first.asm    # More complex program with arithmetic
│       └── first.bin    # Assembled version of first.asm
├── tools/
│   └── opcode-analyzer.ts # Tool to analyze ASM files for required opcodes
├── tests/src/
│   └── 6502.test.ts     # Tests for flag operations
├── assembler/asm6       # External assembler tool (asm6 by Loopy)
├── deno.json           # Deno config with tasks
├── 6502_opcodes.txt    # Complete 6502 instruction reference
├── Notes.md            # User's learning notes about bitwise operations, etc.
└── ClaudeNotes.md      # This context file
```

## Development Workflow
1. **Write Assembly** programs to test specific CPU features
2. **Analyze with tool**: `deno task analyze src/asm/program.asm`
3. **Implement opcodes** in the CPU emulator one by one
4. **Test programs**: `deno task dev src/asm/program.bin`
5. **Iterate and learn** with increasingly complex programs

## Current Implementation Status

### Chip6502 Class Architecture
- **Registers**: programCounter, stackPointer, accumulator, registerX, registerY
- **Memory**: 64KB array (MAX_MEMORY = 64 * 1024)
- **Status flags**: 8-bit register with individual flag constants
- **Cycle counter**: Tracks CPU cycles for accuracy
- **Logger**: Integrated colored logging

### Implemented Opcodes (Working)
- **0xEA (NOP)**: No operation - 1 byte, 2 cycles
- **0xA9 (LDA Immediate)**: Load accumulator with immediate value - 2 bytes, 2 cycles
  - Properly updates Zero and Negative flags
  - Uses bitwise operations: `(value & 0x80) !== 0` for negative flag

### Partially Implemented Opcodes
- **0x8D (STA Absolute)**: Store accumulator - needs implementation
- **0x00 (BRK)**: Break instruction - needs proper stopping mechanism

### Skeleton Opcodes (Need Implementation)
Multiple opcodes have PC/cycle handling but no actual functionality:
- 0x78 (SEI), 0xD8 (CLD), 0xA2 (LDX), 0x18 (CLC), 0xF0 (BEQ)
- 0x4C (JMP), 0xC9 (CMP), 0x69 (ADC), 0x9A (TXS)

### Key Implementation Patterns Established
```typescript
// Instruction pattern:
case 0xA9: { // LDA Immediate Mode
    this.incPC(1)  // Move past opcode
    this.accumulator = this.memory[this.programCounter]  // Read operand

    // Update flags
    const setZeroFlag = this.accumulator === 0
    const bit7set = (this.accumulator & 0x80) !== 0
    this.setFlag(ZERO_FLAG, setZeroFlag)
    this.setFlag(NEGATIVE_FLAG, bit7set)

    this.incPC(1)  // Move past operand
    this.incCycle(2)  // Count cycles
    break
}
```

### Execution Loop Architecture
- **execute()**: Main loop that reads from memory[programCounter] and calls executeOpcode()
- **executeOpcode(opcode)**: Handles individual instruction execution
- **Uses while(true)** loop to follow program counter properly
- **Missing**: Proper stopping conditions (currently infinite loop)

## Current Todo Status
1. ✅ Build ASM opcode analyzer tool
2. ✅ Fix execute() loop to follow program counter properly
3. ✅ Implement LDA immediate mode (0xA9)
4. ⏳ Implement STA absolute mode (0x8D)
5. ⏳ Implement BRK instruction (0x00)
6. ⏳ Add proper stopping conditions to execution loop
7. ⏳ Test simple.bin program
8. ⏳ Implement opcodes for first.bin

## Key Technical Insights Learned
- **Bitwise operations**: Using `(value & 0x80) !== 0` to check bit 7 for negative flag
- **Flag management**: Always set AND clear flags, not just set them
- **PC advancement**: Must follow actual program counter, not iterate through memory
- **Fetch-decode-execute cycle**: Pattern for all CPU instructions
- **Little-endian**: 6502 stores multi-byte values with low byte first

## Development Tools Setup
- **deno.json tasks**:
  - `deno task dev <binary-file>` - Run emulator
  - `deno task analyze <asm-file>` - Analyze opcodes needed
  - `deno task test` - Run tests
- **VSCode debug configs** for simple.bin and first.bin
- **Opcode analyzer tool** automatically identifies required instructions

## Next Steps Context
User was working on implementing the core opcodes for simple.bin:
- LDA immediate (✅ completed)
- STA absolute (⏳ next priority)
- BRK (⏳ for stopping execution)
- NOP (✅ already working)

The goal is to get simple.bin running end-to-end, then expand to first.bin with more complex instructions.

## Important Files to Check
- `src/6502.ts` - Main implementation file
- `src/asm/simple.asm` - Current test program
- `Notes.md` - User's technical learning notes
- `6502_opcodes.txt` - Complete instruction reference

## User's Learning Philosophy
"I want to act as a teacher and we iterate together in the project" - User wants to implement code themselves with guidance, building understanding rather than getting solutions.
