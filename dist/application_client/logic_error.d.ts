import type algosdk from 'algosdk';
interface LogicErrorDetails {
    txId: string;
    pc: number;
    msg: string;
}
export declare function parseLogicError(errMsg: string): LogicErrorDetails;
export declare class LogicError extends Error {
    led: LogicErrorDetails;
    program: string[];
    lines: number;
    teal_line: number;
    stack?: string;
    constructor(led: LogicErrorDetails, program: string[], map: algosdk.SourceMap);
}
export {};
//# sourceMappingURL=logic_error.d.ts.map