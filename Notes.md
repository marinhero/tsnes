# 6502 Emulator Development Notes

## Bitwise Operations & Magic Numbers

### Understanding Flag Bit Positions

The 6502 designers chose specific bit positions in the status register:

```
Bit:  7 6 5 4 3 2 1 0
Flag: N V - B D I Z C
```

- **Bit 0 = Carry** (0x01 = `00000001`)
- **Bit 1 = Zero** (0x02 = `00000010`)  
- **Bit 7 = Negative** (0x80 = `10000000`)

### Why These Numbers?

**0x80 for bit 7:** 
- Binary: `10000000` 
- Only the leftmost bit is set
- 128 in decimal (2^7)

**Powers of 2 pattern:**
- Bit 0 = 2^0 = 1 = 0x01
- Bit 1 = 2^1 = 2 = 0x02  
- Bit 2 = 2^2 = 4 = 0x04
- Bit 3 = 2^3 = 8 = 0x08
- Bit 4 = 2^4 = 16 = 0x10
- Bit 5 = 2^5 = 32 = 0x20
- Bit 6 = 2^6 = 64 = 0x40
- Bit 7 = 2^7 = 128 = 0x80

### Bitwise Tricks for 6502 Development

**Check specific bit:**
```typescript
const bit7IsSet = (value & 0x80) !== 0  // Check if bit 7 is set
```

**Why this works:** 
- `0x80` in binary is `10000000` (bit 7 set, all others clear)
- `&` does bitwise AND - only bit 7 survives the operation
- If bit 7 was set, result is non-zero
- If bit 7 was clear, result is zero

**Examples:**
- Value 66 (`01000010`) & 0x80 = `00000000` = 0 → bit 7 is clear
- Value 200 (`11001000`) & 0x80 = `10000000` = 128 → bit 7 is set

**Other useful bitwise operations:**
- Check multiple bits: `(value & 0b11000000)` checks bits 6 and 7
- Set specific bit: `value |= 0x10` sets bit 4  
- Clear specific bit: `value &= ~0x08` clears bit 3
- Toggle bit: `value ^= 0x20` flips bit 5

**Pro tip:** Use constants instead of magic numbers:
```typescript
const bit7Mask = (1 << NEGATIVE_FLAG)  // More readable than 0x80
```

### Flag Setting Best Practices

Always set AND clear flags based on conditions:
```typescript
// Good - sets or clears based on condition
this.setFlag(ZERO_FLAG, this.accumulator === 0)
this.setFlag(NEGATIVE_FLAG, (this.accumulator & 0x80) !== 0)

// Bad - only sets, never clears
if (this.accumulator === 0) this.setFlag(ZERO_FLAG, true)
```

## CPU Architecture Insights

### Fetch-Decode-Execute Cycle

Every CPU instruction follows this pattern:
1. **Fetch**: Read opcode from memory at PC
2. **Decode**: Figure out what instruction it is  
3. **Execute**: Do the actual work (read operands, modify registers/memory)
4. **Update**: Set flags, advance PC, count cycles

### Memory vs File System

The 6502 has no concept of files - it only reads from memory addresses:
- Program gets loaded into memory once at startup
- CPU reads instructions from wherever PC points
- PC advances as instructions consume bytes
- Real programs can jump around in memory (JMP, branches, etc.)

### Little-Endian Byte Order

The 6502 stores multi-byte values with least significant byte first:
- Address $1234 is stored as: `34 12` (low byte, high byte)
- When reading 16-bit address: `lowByte | (highByte << 8)`

## Development Workflow

### The Binary Analysis Loop

1. **Write Assembly** → `simple.asm`
2. **Assemble to Binary** → `asm6 simple.asm simple.bin`  
3. **Analyze Opcodes** → `deno task analyze simple.asm`
4. **Implement Instructions** → Add opcodes to `executeOpcode()`
5. **Test Program** → `deno task dev simple.bin`
6. **Repeat** with more complex programs

This approach ensures you only implement what you actually need, with concrete test cases.