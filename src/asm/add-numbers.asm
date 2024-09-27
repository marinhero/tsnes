.org $8000         ; NES programs usually start at $8000
RESET:
    SEI                ; Disable interrupts
    CLD                ; Clear decimal mode
    LDX #$40           ; Set up stack
    TXS

    ; Code to load numbers into memory and perform addition
    LDA #$0A           ; Load 10 into the accumulator
    STA $0200          ; Store 10 into RAM address $0200
    LDA #$08           ; Load 8 into the accumulator
    STA $0201          ; Store 8 into RAM address $0201

    CLC                ; Clear the carry flag

    LDA $0200          ; Load the value at $0200 (10)
    ADC $0201          ; Add the value at $0201 (8)

    CMP #$12           ; Compare the result with 18 (hex $12)
    BEQ SUCCESS        ; Branch to SUCCESS if equal

FAIL:
    LDA #$00           ; Load 0 into the accumulator
    STA $2000          ; Write to PPU (to simulate failure state)
    JMP FAIL           ; Infinite loop

SUCCESS:
    LDA #$FF           ; Load 255 into the accumulator
    STA $2000          ; Write to PPU (to simulate success state)
    JMP SUCCESS        ; Infinite loop

    .org $FFFC         ; Vector location for the reset vector
    .dw RESET          ; Set the reset vector to point to the RESET label
