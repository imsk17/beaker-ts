export interface StateValue {
    key: string;
    value: {
        bytes: string;
        uint: number;
        type?: number;
        action?: number;
    };
}
export interface State {
    [key: string]: string | number | Uint8Array;
}
export declare function decodeState(state: StateValue[], raw?: boolean): State;
export declare type ApplicationState = State;
export declare type AccountState = State;
//# sourceMappingURL=state.d.ts.map