import algosdk from "algosdk"

const LOGIC_ERROR = /TransactionPool.Remember: transaction ([A-Z0-9]+): logic eval error: (.*). Details: pc=([0-9]+), opcodes=.*/

interface LogicErrorDetails {
    txId: string
    pc: number
    msg: string
}

export function parseLogicError(errMsg: string): LogicErrorDetails {
    const res = LOGIC_ERROR.exec(errMsg)
    if(res.length<=3){
        return {} as LogicErrorDetails
    }

    return {
        txId: res[1],
        msg: res[2],
        pc: parseInt(res[3]),
    } as LogicErrorDetails
}

export class LogicError extends Error {
    led: LogicErrorDetails;
    program: string[];
    lines: number = 5;
    stack?: string;

    constructor(led: LogicErrorDetails, program: string[], map: algosdk.SourceMap){
        super()
        this.led = led
        this.program = program

        const line = map.getLineForPc(led.pc)
        this.message = `Logic Exception at line ${line}`

        if(line>0){

            const start = line>this.lines?line-this.lines:0
            const stop = program.length>line+this.lines?line+this.lines:program.length

            const stack_lines = program.slice(start,stop)

            stack_lines[stack_lines.length/2] += " <--- Error"

            this.stack = stack_lines.join("\n")
        }
    }

}