import algosdk from "algosdk";

export enum AVMType {
  uint64,
  bytes,
}

export interface HintSpec {}

export interface DeclaredSchemaValueSpec {
  type: AVMType;
  key: string;
  desc: string;
  static: boolean;
}

export interface DynamicSchemaValueSpec {
  type: AVMType;
  desc: string;
  maxKeys: number;
}

export interface Schema {
  declared: {
    [key: string]: DeclaredSchemaValueSpec;
  };
  dynamic: {
    [key: string]: DynamicSchemaValueSpec;
  };
}

export type StateSchema = {
  uints: number;
  bytes: number;
};

export function getStateSchema(s: Schema): StateSchema {
  let uints = 0;
  let bytes = 0;

  for (const item of Object.entries(s.declared)) {
    if (item[1].type == AVMType.bytes) bytes += 1;
    if (item[1].type == AVMType.uint64) uints += 1;
  }

  for (const item of Object.entries(s.dynamic)) {
    if (item[1].type == AVMType.bytes) bytes += item[1].maxKeys;
    if (item[1].type == AVMType.uint64) uints += item[1].maxKeys;
  }

  return { uints: uints, bytes: bytes };
}

export interface SchemaSpec {
  local: Schema;
  global: Schema;
}

export interface AppSources {
  approval: string;
  clear: string;
}

export interface AppSpec {
  hints: HintSpec;
  schema: SchemaSpec;
  source: AppSources;
  contract: algosdk.ABIContract;
}
