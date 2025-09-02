// ASM Opcode Analyzer - Identifies opcodes needed for implementation
// Usage: deno run --allow-read tools/opcode-analyzer.ts <asm-file>

const OPCODE_MAP: Record<string, { opcode: string, description: string, bytes: number, cycles: number }> = {
  // Load/Store
  'LDA #': { opcode: '0xA9', description: 'Load A Immediate', bytes: 2, cycles: 2 },
  'LDA': { opcode: '0xA5/AD/BD/B9/A1/B1', description: 'Load A (various modes)', bytes: 2-3, cycles: 3-6 },
  'LDX #': { opcode: '0xA2', description: 'Load X Immediate', bytes: 2, cycles: 2 },
  'LDX': { opcode: '0xA6/B6/AE/BE', description: 'Load X (various modes)', bytes: 2-3, cycles: 3-4 },
  'LDY #': { opcode: '0xA0', description: 'Load Y Immediate', bytes: 2, cycles: 2 },
  'STA': { opcode: '0x8D', description: 'Store A Absolute', bytes: 3, cycles: 4 },
  'STX': { opcode: '0x86/96/8E', description: 'Store X', bytes: 2-3, cycles: 3-4 },
  'STY': { opcode: '0x84/94/8C', description: 'Store Y', bytes: 2-3, cycles: 3-4 },
  
  // Transfers
  'TAX': { opcode: '0xAA', description: 'Transfer A to X', bytes: 1, cycles: 2 },
  'TAY': { opcode: '0xA8', description: 'Transfer A to Y', bytes: 1, cycles: 2 },
  'TXA': { opcode: '0x8A', description: 'Transfer X to A', bytes: 1, cycles: 2 },
  'TYA': { opcode: '0x98', description: 'Transfer Y to A', bytes: 1, cycles: 2 },
  'TXS': { opcode: '0x9A', description: 'Transfer X to Stack', bytes: 1, cycles: 2 },
  'TSX': { opcode: '0xBA', description: 'Transfer Stack to X', bytes: 1, cycles: 2 },
  
  // Stack
  'PHA': { opcode: '0x48', description: 'Push A', bytes: 1, cycles: 3 },
  'PHP': { opcode: '0x08', description: 'Push Status', bytes: 1, cycles: 3 },
  'PLA': { opcode: '0x68', description: 'Pull A', bytes: 1, cycles: 4 },
  'PLP': { opcode: '0x28', description: 'Pull Status', bytes: 1, cycles: 4 },
  
  // Arithmetic
  'ADC #': { opcode: '0x69', description: 'Add with Carry Immediate', bytes: 2, cycles: 2 },
  'ADC': { opcode: '0x65/75/6D/7D/79/61/71', description: 'Add with Carry (various modes)', bytes: 2-3, cycles: 3-6 },
  'SBC #': { opcode: '0xE9', description: 'Subtract with Carry Immediate', bytes: 2, cycles: 2 },
  'SBC': { opcode: '0xE5/F5/ED/FD/F9/E1/F1', description: 'Subtract with Carry (various)', bytes: 2-3, cycles: 3-6 },
  
  // Compare
  'CMP #': { opcode: '0xC9', description: 'Compare A Immediate', bytes: 2, cycles: 2 },
  'CMP': { opcode: '0xC5/D5/CD/DD/D9/C1/D1', description: 'Compare A (various modes)', bytes: 2-3, cycles: 3-6 },
  'CPX #': { opcode: '0xE0', description: 'Compare X Immediate', bytes: 2, cycles: 2 },
  'CPX': { opcode: '0xE4/EC', description: 'Compare X', bytes: 2-3, cycles: 3-4 },
  'CPY #': { opcode: '0xC0', description: 'Compare Y Immediate', bytes: 2, cycles: 2 },
  'CPY': { opcode: '0xC4/CC', description: 'Compare Y', bytes: 2-3, cycles: 3-4 },
  
  // Logical
  'AND #': { opcode: '0x29', description: 'AND Immediate', bytes: 2, cycles: 2 },
  'AND': { opcode: '0x25/35/2D/3D/39/21/31', description: 'AND (various modes)', bytes: 2-3, cycles: 3-6 },
  'ORA #': { opcode: '0x09', description: 'OR Immediate', bytes: 2, cycles: 2 },
  'ORA': { opcode: '0x05/15/0D/1D/19/01/11', description: 'OR (various modes)', bytes: 2-3, cycles: 3-6 },
  'EOR #': { opcode: '0x49', description: 'XOR Immediate', bytes: 2, cycles: 2 },
  'EOR': { opcode: '0x45/55/4D/5D/59/41/51', description: 'XOR (various modes)', bytes: 2-3, cycles: 3-6 },
  'BIT': { opcode: '0x24/2C', description: 'Bit Test', bytes: 2-3, cycles: 3-4 },
  
  // Shifts/Rotates
  'ASL A': { opcode: '0x0A', description: 'Arithmetic Shift Left A', bytes: 1, cycles: 2 },
  'ASL': { opcode: '0x06/16/0E/1E', description: 'Arithmetic Shift Left', bytes: 2-3, cycles: 5-7 },
  'LSR A': { opcode: '0x4A', description: 'Logical Shift Right A', bytes: 1, cycles: 2 },
  'LSR': { opcode: '0x46/56/4E/5E', description: 'Logical Shift Right', bytes: 2-3, cycles: 5-7 },
  'ROL A': { opcode: '0x2A', description: 'Rotate Left A', bytes: 1, cycles: 2 },
  'ROL': { opcode: '0x26/36/2E/3E', description: 'Rotate Left', bytes: 2-3, cycles: 5-7 },
  'ROR A': { opcode: '0x6A', description: 'Rotate Right A', bytes: 1, cycles: 2 },
  'ROR': { opcode: '0x66/76/6E/7E', description: 'Rotate Right', bytes: 2-3, cycles: 5-7 },
  
  // Increments/Decrements
  'INC': { opcode: '0xE6/F6/EE/FE', description: 'Increment Memory', bytes: 2-3, cycles: 5-7 },
  'INX': { opcode: '0xE8', description: 'Increment X', bytes: 1, cycles: 2 },
  'INY': { opcode: '0xC8', description: 'Increment Y', bytes: 1, cycles: 2 },
  'DEC': { opcode: '0xC6/D6/CE/DE', description: 'Decrement Memory', bytes: 2-3, cycles: 5-7 },
  'DEX': { opcode: '0xCA', description: 'Decrement X', bytes: 1, cycles: 2 },
  'DEY': { opcode: '0x88', description: 'Decrement Y', bytes: 1, cycles: 2 },
  
  // Jumps/Calls
  'JMP': { opcode: '0x4C/6C', description: 'Jump', bytes: 3, cycles: 3-5 },
  'JSR': { opcode: '0x20', description: 'Jump to Subroutine', bytes: 3, cycles: 6 },
  'RTS': { opcode: '0x60', description: 'Return from Subroutine', bytes: 1, cycles: 6 },
  'RTI': { opcode: '0x40', description: 'Return from Interrupt', bytes: 1, cycles: 6 },
  
  // Branches
  'BPL': { opcode: '0x10', description: 'Branch if Positive', bytes: 2, cycles: 2 },
  'BMI': { opcode: '0x30', description: 'Branch if Negative', bytes: 2, cycles: 2 },
  'BVC': { opcode: '0x50', description: 'Branch if Overflow Clear', bytes: 2, cycles: 2 },
  'BVS': { opcode: '0x70', description: 'Branch if Overflow Set', bytes: 2, cycles: 2 },
  'BCC': { opcode: '0x90', description: 'Branch if Carry Clear', bytes: 2, cycles: 2 },
  'BCS': { opcode: '0xB0', description: 'Branch if Carry Set', bytes: 2, cycles: 2 },
  'BNE': { opcode: '0xD0', description: 'Branch if Not Equal', bytes: 2, cycles: 2 },
  'BEQ': { opcode: '0xF0', description: 'Branch if Equal', bytes: 2, cycles: 2 },
  
  // Flags
  'CLC': { opcode: '0x18', description: 'Clear Carry', bytes: 1, cycles: 2 },
  'SEC': { opcode: '0x38', description: 'Set Carry', bytes: 1, cycles: 2 },
  'CLI': { opcode: '0x58', description: 'Clear Interrupt Disable', bytes: 1, cycles: 2 },
  'SEI': { opcode: '0x78', description: 'Set Interrupt Disable', bytes: 1, cycles: 2 },
  'CLV': { opcode: '0xB8', description: 'Clear Overflow', bytes: 1, cycles: 2 },
  'CLD': { opcode: '0xD8', description: 'Clear Decimal', bytes: 1, cycles: 2 },
  'SED': { opcode: '0xF8', description: 'Set Decimal', bytes: 1, cycles: 2 },
  
  // System
  'BRK': { opcode: '0x00', description: 'Break', bytes: 1, cycles: 7 },
  'NOP': { opcode: '0xEA', description: 'No Operation', bytes: 1, cycles: 2 },
}

function parseAsmFile(content: string): string[] {
  const lines = content.split('\n')
  const instructions: string[] = []
  
  for (const line of lines) {
    // Remove comments and trim
    const cleanLine = line.split(';')[0].trim()
    if (cleanLine === '' || cleanLine.startsWith('.') || cleanLine.endsWith(':')) {
      continue
    }
    
    // Extract instruction (first word, may include addressing mode)
    const parts = cleanLine.split(/\s+/)
    if (parts.length > 0) {
      let instruction = parts[0]
      
      // Handle immediate mode specially
      if (parts.length > 1 && parts[1].startsWith('#')) {
        instruction = instruction + ' #'
      }
      
      // Handle accumulator mode
      if (parts.length > 1 && parts[1] === 'A') {
        instruction = instruction + ' A'
      }
      
      instructions.push(instruction)
    }
  }
  
  return instructions
}

function analyzeInstructions(instructions: string[]): void {
  console.log('🔍 ASM OPCODE ANALYSIS REPORT')
  console.log('=' .repeat(50))
  
  const foundInstructions = new Set<string>()
  const unknownInstructions: string[] = []
  
  for (const instruction of instructions) {
    if (OPCODE_MAP[instruction]) {
      foundInstructions.add(instruction)
    } else {
      // Try without addressing mode
      const baseInstruction = instruction.split(' ')[0]
      if (OPCODE_MAP[baseInstruction]) {
        foundInstructions.add(baseInstruction)
      } else {
        unknownInstructions.push(instruction)
      }
    }
  }
  
  console.log(`\n📊 INSTRUCTIONS FOUND (${foundInstructions.size} unique):`)
  console.log('-'.repeat(70))
  
  for (const instruction of Array.from(foundInstructions).sort()) {
    const info = OPCODE_MAP[instruction]
    console.log(`${instruction.padEnd(8)} ${info.opcode.padEnd(12)} ${info.description}`)
    console.log(`${''.padEnd(8)} ${`${info.bytes} bytes, ${info.cycles} cycles`.padEnd(12)}`)
    console.log()
  }
  
  if (unknownInstructions.length > 0) {
    console.log(`\n⚠️  UNKNOWN INSTRUCTIONS (${unknownInstructions.length}):`)
    console.log('-'.repeat(30))
    for (const instruction of unknownInstructions) {
      console.log(`- ${instruction}`)
    }
  }
  
  console.log('\n🎯 IMPLEMENTATION PRIORITY:')
  console.log('-'.repeat(30))
  console.log('1. Start with Load/Store: LDA #, STA')
  console.log('2. Add Control Flow: BRK, NOP') 
  console.log('3. Add Arithmetic: ADC #, CLC')
  console.log('4. Add Stack/Transfer: TXS, LDX #')
  console.log('5. Add Flags: SEI, CLD, CMP, BEQ')
  console.log('6. Add Jumps: JMP')
}

async function main() {
  const args = Deno.args
  if (args.length === 0) {
    console.log('Usage: deno run --allow-read tools/opcode-analyzer.ts <asm-file>')
    console.log('Example: deno run --allow-read tools/opcode-analyzer.ts src/asm/first.asm')
    Deno.exit(1)
  }
  
  const filename = args[0]
  
  try {
    const content = await Deno.readTextFile(filename)
    console.log(`📂 Analyzing: ${filename}`)
    
    const instructions = parseAsmFile(content)
    analyzeInstructions(instructions)
    
  } catch (error) {
    console.error(`❌ Error reading file: ${error instanceof Error ? error.message : String(error)}`)
    Deno.exit(1)
  }
}

if (import.meta.main) {
  main()
}