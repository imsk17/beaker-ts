import algosdk from 'algosdk';


export interface HintSpec { }

export interface DeclaredSchemaValueSpec { 
    type: string // TODO: should be enum of uint64|bytes
    key: string // TODO: should be bytes
    desc: string
    static: boolean
}

export interface DynamicSchemaValueSpec { 
    type: string // TODO: should be enum of uint64|bytes
    desc: string
    maxKeys: number
}

export interface SchemaSpec {
    declared: {
        [key: string]: DeclaredSchemaValueSpec
    },
    dynamic: {
        [key: string]: DynamicSchemaValueSpec
    }
}


export interface AppSchemaSpec {
    local: SchemaSpec 
    global: SchemaSpec 
}

export interface AppSpec {
    hints: HintSpec
    schema: AppSchemaSpec
    contract: algosdk.ABIContract
}
