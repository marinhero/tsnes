import { assertEquals } from "./deps.ts"
import { Chip6502 } from "../../src/6502.ts"

Deno.test("setFlag with value", () => {
  const chip = new Chip6502()

  chip.setFlag(3, true)
  assertEquals(chip.showStatus(), '00101000')
  assertEquals(chip.showStatus('FULL'), '00_0D000')

  chip.setFlag(3, false)
  assertEquals(chip.showStatus(), '00100000');
  assertEquals(chip.showStatus('FULL'), '00_00000')

  chip.setFlag(7, true)
  assertEquals(chip.showStatus(), '10100000');
  assertEquals(chip.showStatus('FULL'), 'N0_00000')

  chip.setFlag(0, true)
  assertEquals(chip.showStatus(), '10100001');
  assertEquals(chip.showStatus('FULL'), 'N0_0000C')

  chip.setFlag(0, false)
  assertEquals(chip.showStatus(), '10100000');
  assertEquals(chip.showStatus('FULL'), 'N0_00000')

  chip.setFlag(4, false)
  assertEquals(chip.showStatus(), '10100000');
  assertEquals(chip.showStatus('FULL'), 'N0_00000')
})