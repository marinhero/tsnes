------------------------------------------------------------

USAGE:

USAGE

asm6 is a straightforward, fast assembler designed to convert 6502 assembly code into machine code suitable for systems like the NES. Here's how you can use asm6 to assemble your code:
Basic Command

bash

asm6 [options] sourcefile [outputfile] [listfile]

    sourcefile: The path to your assembly source code file (e.g., sum.asm).
    outputfile (optional): The name of the binary file to generate (e.g., output.nes).
    listfile (optional): A text file containing a detailed listing of the assembled code.

Options

    -?: Display help information.
    -l: Create a listing file showing the assembly instructions and the generated machine code.
    -L: Create a verbose listing file that expands macros and repeats (useful for debugging).
    -d<name>: Define a symbol for use in conditional assembly.
    -q: Quiet mode – suppresses output unless there is an error.

Examples
1. Basic Assembly

Assemble the source file sum.asm and generate an output file named output.nes:

bash

asm6 sum.asm output.nes

2. Create a Listing File

To generate an additional listing file (sum.lst) that contains the assembled instructions and addresses:

bash

asm6 -l sum.asm output.nes

This creates two files:

    output.nes: The assembled binary suitable for NES emulators.
    sum.lst: A listing file showing the addresses, opcodes, and assembly instructions.

3. Quiet Mode

To assemble the file quietly without outputting messages, use the -q option:

bash

asm6 -q sum.asm output.nes

Code Example for NES Development

Here's a minimal NES program to use with asm6:

asm

.org $8000         ; Start of NES program in PRG-ROM

RESET:
    SEI            ; Disable interrupts
    CLD            ; Clear decimal mode
    LDX #$FF       ; Load X register with $FF
    TXS            ; Transfer X to the stack pointer

    LDA #$01       ; Load A with 1
    STA $0200      ; Store A in memory address $0200

    JMP RESET      ; Infinite loop

    .org $FFFC     ; Set the reset vector
    .dw RESET

To assemble this code, run:

bash

asm6 mygame.asm mygame.nes

Notes

    Ensure your NES programs use .org $8000 to start, as this is the expected starting address for the PRG-ROM.
    Use .org $FFFC and .dw RESET to set the reset vector correctly.

asm6 is designed to be simple yet powerful, making it an ideal choice for beginners and experienced NES developers alike.



--------------------------------------------------------------
ASM6 (v1.6)
A 6502 assembler by loopy (loopy at mm.st)
--------------------------------------------------------------

Yes, it's another 6502 assembler.  I built it to do NES development, but you
can probably use it for just about anything.  Why use this instead of one of
the other zillion assemblers out there?  I don't know, but choice is good,
right? :)  I wrote it because I thought most others were either too finicky,
had weird syntax, took too much work to set up, or too bug-ridden to be useful.

This is free software.  You may use, modify, and / or redistribute any part
of this software in any fashion.

--------------------------------------------------------------
Command line
--------------------------------------------------------------

Usage:

        asm6 [-options] sourcefile [outputfile] [listfile]

Options:

        -?         Show some help
        -l         Create listing
        -L         Create verbose listing (expand REPT, MACRO)
        -d<name>:  Define a symbol and make it equal to 1
	-q         Quiet mode (suppress all output unless there's an error)
        Default output is <sourcefile>.bin
        Default listing is <sourcefile>.lst

--------------------------------------------------------------
Syntax
--------------------------------------------------------------

Comments begin with a semicolon (;).  A colon (:) following a label is
optional.

    examples:

        lda #$00             ;hi there
        label1: jmp label2
        label2  beq label1

--------------------------------------------------------------
Numbers and expressions
--------------------------------------------------------------

Hexadecimal numbers begin with '$' or end with 'h'.  Binary numbers begin
with '%' or end with 'b'.  Characters and strings are surrounded by
single or double quotes.  The characters (' " \) within quotes must be
preceded by a backslash (\).

    examples:

        12345
        '12345'
        $ABCD
        0ABCDh
        %01010101
        01010101b

Supported operators (listed by precedence):

          ( )
 (unary)  + - ~ ! < >
          * / %
          + -
          << >>
          < > <= >=
          = == != <> 
          &
          ^
          |
          &&
          ||

'=' and '<>' are equivalent to C's '==' and '!=' operators.  The unary '<'
and '>' operators give the lower and upper byte of a 16-bit word (respectively).
All other operators function like their C equivalents.
        
--------------------------------------------------------------
Labels
--------------------------------------------------------------

Labels are case sensitive.  The special '$' label holds the current program
address.  Labels beginning with '@' are local labels. They have limited scope,
visible only between non-local labels.  Names of local labels may be reused.

        label1:
          @tmp1:
          @tmp2:
        label2:
          @tmp1:
          @tmp2:

Labels beginning with one or more '+' or '-' characters are nameless labels,
especially useful for forward and reverse branches.

    example:

      --  ldx #0
       -  lda $2002 ;loop (wait for vblank)
          bne -
       -  lda $2002 ;nameless labels are easy to reuse..
          bne -

          cpx #69
          beq +     ;forward branch..
          cpx #96
          beq +here ;use more characters to make more unique

          jmp --    ;multiple --'s handy for nested loops
       +  ldx #0
   +here  nop
        
--------------------------------------------------------------
Assembler directives (in no particular order)
--------------------------------------------------------------

All directives are case insensitive and can also be preceded by a period (.)


EQU

        For literal string replacement, similar to #define in C.

                one EQU 1
                plus EQU +
                DB one plus one ;DB 1 + 1

=

        Unlike EQU, statements with '=' are evaluated to a number first.
        Also unlike EQU, symbols created with '=' can be reused.

                i=1
                j EQU i+1
                k=i+1   ;k=1+1
                i=j+1   ;i=i+1+1
                i=k+1   ;i=2+1

INCLUDE (also INCSRC)

        Assemble another source file as if it were part of the current
        source.

                INCLUDE whatever.asm

INCBIN (also BIN)

        Add the contents of a file to the assembly output.

                moredata: INCBIN whatever.bin

	An optional file offset and size can be specified.

		INCBIN foo.bin, $400		;read foo.bin from $400 to EOF
		INCBIN foo.bin, $200, $2000	;read $2000 bytes, starting from $200

DB, DW (also BYTE/WORD, DCB/DCW, DC.B/DC.W)

        Emit byte(s) or word(s).  Multiple arguments are separated by
        commas.  Strings can be "shifted" by adding a value to them (see
        example).

                DB $01,$02,$04,$08
                DB "ABCDE"+1          ;equivalent to DB "BCDEF"
                DB "ABCDE"-"A"+32     ;equivalent to DB 32,33,34,35,36

DL, DH

        Similar to DB, outputting only the LSB or MSB of a value.

                DL a,b,c,d            ;equivalent to DB <a, <b, <c, <d
                DH a,b,c,d            ;equivalent to DB >a, >b, >c, >d

HEX

        Compact way of laying out a table of hex values.  Only raw hex values
        are allowed, no expressions.  Spaces can be used to separate numbers.

                HEX 456789ABCDEF  ;equivalent to DB $45,$67,$89,$AB,$CD,$EF
                HEX 0 1 23 4567   ;equivalent to DB $00,$01,$23,$45,$67

DSB, DSW (also DS.B/DS.W)

        Define storage (bytes or words).  The size argument may be followed
        by a fill value (default filler is 0).

                DSB 4         ;equivalent to DB 0,0,0,0
                DSB 8,1       ;equivalent to DB 1,1,1,1,1,1,1,1
                DSW 4,$ABCD   ;equivalent to DW $ABCD,$ABCD,$ABCD,$ABCD

PAD

        Fill memory from the current address to a specified address.  A fill
        value may also be specified.

                PAD $FFFA     ;equivalent to DSB $FFFA-$
                PAD $FFFA,$EA ;equivalent to DSB $FFFA-$,$EA

ORG

        Set the starting address if it hasn't been assigned yet, otherwise
        ORG functions like PAD.

                ORG $E000     ;start assembling at $E000
                .
                .
                .
                ORG $FFFA,$80 ;equivalent to PAD $FFFA,$80

ALIGN

        Fill memory from the current address to an N byte boundary.  A fill
        value may also be specified.

                ALIGN 256,$EA

FILLVALUE

        Change the default filler for PAD, ALIGN, etc.

                FILLVALUE $FF

BASE

        Set the program address.  This is useful for relocatable code,
        multiple code banks, etc.  The same can also be accomplished by
        assigning the '$' symbol directly (i.e. '$=9999').

                oldaddr=$
                BASE $6000
                stuff:
                    .
                    .
                    .
                BASE oldaddr+$-stuff

IF / ELSEIF / ELSE / ENDIF

        Process a block of code if an expression is true (nonzero).

                IF j>0
                    DB i/j
                ELSE
                    DB 0
                ENDIF

IFDEF / IFNDEF

        Process a block of code if a symbol has been defined / not defined.

                IFDEF _DEBUG_
                    .
                    .
                    .
                ENDIF

MACRO / ENDM

        MACRO name args...

        Define a macro.  Macro arguments are comma separated.
        Labels defined inside macros are local (visible only to that macro).

                MACRO setAXY x,y,z
                    LDA #x
                    LDX #y
                    LDY #z
                ENDM

                setAXY $12,$34,$56
                        ;expands to LDA #$12
                        ;           LDX #$34
                        ;           LDY #$56

REPT / ENDR

        Repeat a block of code a specified number of times.
        Labels defined inside REPT are local.

                i=0
                REPT 256
                    DB i
                    i=i+1
                ENDR

ENUM / ENDE

        Reassign PC and suppress assembly output.  Useful for defining
        variables in RAM.

                ENUM $200
                foo:    db 0
                foo2:   db 0
                ENDE

ERROR

        Stop assembly and display a message.

                IF x>100
                        ERROR "X is out of range :("
                ENDIF

        
--------------------------------------------------------------
<EOF>
