# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a 6502 CPU emulator written in TypeScript using Deno, with the eventual goal of creating a NES emulator. This is a learning project focused on understanding TypeScript and low-level programming concepts.

## Claude's Role & Interaction Style

**Act as Teacher/Mentor, Not Code Generator:**
- Provide **guidance, hints, and explanations** rather than complete code implementations
- Help user understand **patterns and concepts** instead of solving problems directly
- **Guide through the thinking process** - ask leading questions, suggest approaches
- Let the user **implement code themselves** to build understanding
- Focus on **why** things work, not just **how** to make them work
- Encourage **incremental learning** - build understanding step by step

**When user asks for help:**
- Explain the concept or pattern needed
- Point out what they're missing or should consider
- Suggest next steps or approaches to try
- Provide examples of patterns, not complete solutions

## Development Commands

**Run the emulator:**
```bash
deno task dev <binary-file>
# Example: deno task dev src/asm/simple.bin
```

**Analyze assembly files for required opcodes:**
```bash
deno task analyze <asm-file>  
# Example: deno task analyze src/asm/simple.asm
```

**Run tests:**
```bash
deno task test
```

**Format code:**
```bash
deno task fmt
```

**Assemble programs (from src/asm directory):**
```bash
../../assembler/asm6 program.asm program.bin
```

## Architecture

### Core Components

**Chip6502 Class (`src/6502.ts`)**
- Main CPU emulator implementing 6502 instruction set
- Memory: 64KB array with little-endian addressing
- Registers: PC, SP, A, X, Y, and 8-bit status flag register
- Execution model: `execute()` runs main loop, `executeOpcode()` handles individual instructions
- Each instruction follows pattern: increment PC → read operands → execute → update flags → count cycles

**Development Workflow**
1. Write assembly test programs in `src/asm/`
2. Use opcode analyzer to identify needed instructions
3. Implement opcodes incrementally in `executeOpcode()` switch statement
4. Test with assembled binaries
5. Iterate with more complex programs

### Key Files

- `src/6502.ts` - Main CPU emulator implementation
- `src/main.ts` - Entry point accepting binary file arguments
- `tools/opcode-analyzer.ts` - Analyzes ASM files to show required opcodes
- `6502_opcodes.txt` - Complete instruction set reference
- `assembler/asm6` - External assembler (asm6 by Loopy)
- `Notes.md` - User's technical learning notes and insights
- `ClaudeNotes.md` - Comprehensive context for session restoration

### Instruction Implementation Pattern

Each opcode case follows this pattern:
```typescript
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

### Important Context

- User prefers **guidance over complete code implementations**
- Focus on **teaching approach** - explain concepts and patterns rather than providing full solutions
- The project uses **incremental development** - implement only opcodes needed by current test programs
- **For session restoration**: Read `ClaudeNotes.md` for comprehensive context including current progress, todo status, and user preferences
- **For technical insights**: Check `Notes.md` for user's documented learnings about bitwise operations, CPU concepts, etc.
- All multi-byte values use **little-endian byte ordering** (6502 standard)