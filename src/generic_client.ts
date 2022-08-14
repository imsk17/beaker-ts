import algosdk, { getApplicationAddress, TransactionSigner } from 'algosdk'


export default class GenericApplicationClient {
    appId: number
    appAddress: string
    signer?: TransactionSigner 

    constructor(opts: {appId: number, signer?: TransactionSigner}){
        this.appId = opts.appId
        this.appAddress = getApplicationAddress(opts.appId)
        this.signer = opts.signer
    }

    async create(){

    }

    async delete(){

    }

    async update(){

    }

    async optIn(){

    }

    async closeOut(){

    }

    async clearState(){

    }

    async call(){

    }

    async addMethodCall(){

    }



} 