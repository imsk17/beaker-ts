import type algosdk from 'algosdk';
export interface AppSpec {
    hints: HintSpec;
    schema: SchemaSpec;
    source: AppSources;
    contract: algosdk.ABIContract;
}
export declare type HintSpec = Record<string, Hint>;
export interface SchemaSpec {
    local: Schema;
    global: Schema;
}
export interface AppSources {
    approval: string;
    clear: string;
}
export interface Hint {
    structs: Record<string, Struct>;
    readonly: boolean;
    default_arguments: Record<string, DefaultArgument>;
}
declare type StructElement = [string, string];
export interface Struct {
    name: string;
    elements: StructElement[];
}
export interface DefaultArgument {
    source: string;
    data: string | bigint | number;
}
export declare enum AVMType {
    uint64 = 0,
    bytes = 1
}
export interface DeclaredSchemaValueSpec {
    type: AVMType;
    key: string;
    desc: string;
    static: boolean;
}
export interface ReservedSchemaValueSpec {
    type: AVMType;
    desc: string;
    max_keys: number;
}
export interface Schema {
    declared: Record<string, DeclaredSchemaValueSpec>;
    reserved: Record<string, ReservedSchemaValueSpec>;
}
export declare type StateSchema = {
    uints: number;
    bytes: number;
};
export declare function getStateSchema(s: Schema): StateSchema;
export {};
//# sourceMappingURL=appspec.d.ts.map