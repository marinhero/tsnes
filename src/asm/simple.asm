; Simple test program for our 6502 emulator
; This program just loads a number and stores it

.org $8000          ; Start our program at address $8000

START:
    LDA #$42        ; Load the number 66 (hex $42) into register A
    STA $0200       ; Store that number into memory address $0200
    NOP             ; Do nothing (good for testing)
    BRK             ; Break/stop the program

; This tells the CPU where to start when powered on
.org $FFFC          ; Reset vector location  
.dw START           ; Point to our START label