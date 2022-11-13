"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicError = exports.parseLogicError = void 0;
const LOGIC_ERROR = /TransactionPool.Remember: transaction ([A-Z0-9]+): logic eval error: (.*). Details: pc=([0-9]+), opcodes=.*/;
function parseLogicError(errMsg) {
    const res = LOGIC_ERROR.exec(errMsg);
    if (res === null || res.length <= 3)
        return {};
    return {
        txId: res[1],
        msg: res[2],
        pc: parseInt(res[3] ? res[3] : '0'),
    };
}
exports.parseLogicError = parseLogicError;
class LogicError extends Error {
    constructor(led, program, map) {
        super();
        this.lines = 5;
        this.teal_line = 0;
        this.led = led;
        this.program = program;
        const line = map.getLineForPc(led.pc);
        this.teal_line = line === undefined ? 0 : line;
        this.message = `${this.led.msg.slice(0, 20)}... at:${line}`;
        if (this.teal_line > 0) {
            const start = this.teal_line > this.lines ? this.teal_line - this.lines : 0;
            const stop = program.length > this.teal_line + this.lines
                ? this.teal_line + this.lines
                : program.length;
            const stack_lines = program.slice(start, stop);
            stack_lines[stack_lines.length / 2] += ' <--- Error';
            this.stack = stack_lines.join('\n');
        }
    }
}
exports.LogicError = LogicError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naWNfZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwbGljYXRpb25fY2xpZW50L2xvZ2ljX2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQU0sV0FBVyxHQUNmLDZHQUE2RyxDQUFDO0FBUWhILFNBQWdCLGVBQWUsQ0FBQyxNQUFjO0lBQzVDLE1BQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckMsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQztRQUFFLE9BQU8sRUFBdUIsQ0FBQztJQUVwRSxPQUFPO1FBQ0wsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDWixHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNYLEVBQUUsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztLQUNmLENBQUM7QUFDekIsQ0FBQztBQVRELDBDQVNDO0FBRUQsTUFBYSxVQUFXLFNBQVEsS0FBSztJQU9uQyxZQUNFLEdBQXNCLEVBQ3RCLE9BQWlCLEVBQ2pCLEdBQXNCO1FBRXRCLEtBQUssRUFBRSxDQUFDO1FBVFYsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUNWLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFTWixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRXZCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7UUFFNUQsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRTtZQUN0QixNQUFNLEtBQUssR0FDVCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sSUFBSSxHQUNSLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSztnQkFDMUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUs7Z0JBQzdCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBRXJCLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRS9DLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLGFBQWEsQ0FBQztZQUVyRCxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDO0NBQ0Y7QUFwQ0QsZ0NBb0NDIn0=