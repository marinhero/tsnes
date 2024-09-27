.org $8000         ; NES programs usually start at $8000

RESET:
    SEI                ; Disable interrupts
    CLD                ; Clear decimal mode
    LDX #$40           ; Set up stack
    TXS

    LDA #$05       ; Load 5 into the accumulator
    CLC            ; Clear the carry flag (important before addition)
    ADC #$03       ; Add 3 to the accumulator
    STA $0200      ; Store the result (8) into memory address $0200
    BRK            ; Break (end the program)
