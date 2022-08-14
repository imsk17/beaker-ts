import algosdk, {TransactionWithSigner, ABIMethod, ABIMethodParams, getMethodByName} from "algosdk";
import GenericApplicationClient from "./generic_client";
import {Schema} from "./generate/appspec";
export default class ConstantProductAMM extends GenericApplicationClient {
    desc: string = "";
    appSchema: Schema = {
        declared: {
            asset_b: { type: "uint64", key: "b", desc: "", static: false },
            governor: { type: "bytes", key: "g", desc: "", static: false },
            asset_a: { type: "uint64", key: "a", desc: "", static: false },
            ratio: { type: "uint64", key: "r", desc: "", static: false },
            pool_token: { type: "uint64", key: "p", desc: "", static: false }
        },
        dynamic: {}
    };
    acctSchema: Schema = {
        declared: {},
        dynamic: {}
    };
    approvalProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDcKaW50Y2Jsb2NrIDAgMSAxMDAwIDQgMTAwMDAwMDAwMDAKYnl0ZWNibG9jayAweDYxIDB4NjIgMHg3MCAweDY3IDB4NzIKdHhuIE51bUFwcEFyZ3MKaW50Y18wIC8vIDAKPT0KYm56IG1haW5fbDEyCnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4NWNiZjFlMmQgLy8gIm1pbnQoYXhmZXIsYXhmZXIsYXNzZXQsYXNzZXQsYXNzZXQpdm9pZCIKPT0KYm56IG1haW5fbDExCnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4MTQzNmMyYWMgLy8gImJ1cm4oYXhmZXIsYXNzZXQsYXNzZXQsYXNzZXQpdm9pZCIKPT0KYm56IG1haW5fbDEwCnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4MDhhOTU2ZjcgLy8gInNldF9nb3Zlcm5vcihhY2NvdW50KXZvaWQiCj09CmJueiBtYWluX2w5CnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4NmI1OWQ5NjUgLy8gImJvb3RzdHJhcChwYXksYXNzZXQsYXNzZXQpdWludDY0Igo9PQpibnogbWFpbl9sOAp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweDRhODhlMDU1IC8vICJzd2FwKGF4ZmVyLGFzc2V0LGFzc2V0KXZvaWQiCj09CmJueiBtYWluX2w3CmVycgptYWluX2w3Ogp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CiYmCmFzc2VydAp0eG5hIEFwcGxpY2F0aW9uQXJncyAxCmludGNfMCAvLyAwCmdldGJ5dGUKc3RvcmUgMjMKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgppbnRjXzAgLy8gMApnZXRieXRlCnN0b3JlIDI0CnR4biBHcm91cEluZGV4CmludGNfMSAvLyAxCi0Kc3RvcmUgMjIKbG9hZCAyMgpndHhucyBUeXBlRW51bQppbnRjXzMgLy8gYXhmZXIKPT0KYXNzZXJ0CmxvYWQgMjIKbG9hZCAyMwpsb2FkIDI0CmNhbGxzdWIgc3dhcF8xMwppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sODoKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQppbnRjXzAgLy8gMApnZXRieXRlCnN0b3JlIDEwCnR4bmEgQXBwbGljYXRpb25BcmdzIDIKaW50Y18wIC8vIDAKZ2V0Ynl0ZQpzdG9yZSAxMQp0eG4gR3JvdXBJbmRleAppbnRjXzEgLy8gMQotCnN0b3JlIDkKbG9hZCA5Cmd0eG5zIFR5cGVFbnVtCmludGNfMSAvLyBwYXkKPT0KYXNzZXJ0CmxvYWQgOQpsb2FkIDEwCmxvYWQgMTEKY2FsbHN1YiBib290c3RyYXBfMTEKc3RvcmUgMTIKcHVzaGJ5dGVzIDB4MTUxZjdjNzUgLy8gMHgxNTFmN2M3NQpsb2FkIDEyCml0b2IKY29uY2F0CmxvZwppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sOToKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQppbnRjXzAgLy8gMApnZXRieXRlCmNhbGxzdWIgc2V0Z292ZXJub3JfMTAKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDEwOgp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CiYmCmFzc2VydAp0eG5hIEFwcGxpY2F0aW9uQXJncyAxCmludGNfMCAvLyAwCmdldGJ5dGUKc3RvcmUgNgp0eG5hIEFwcGxpY2F0aW9uQXJncyAyCmludGNfMCAvLyAwCmdldGJ5dGUKc3RvcmUgNwp0eG5hIEFwcGxpY2F0aW9uQXJncyAzCmludGNfMCAvLyAwCmdldGJ5dGUKc3RvcmUgOAp0eG4gR3JvdXBJbmRleAppbnRjXzEgLy8gMQotCnN0b3JlIDUKbG9hZCA1Cmd0eG5zIFR5cGVFbnVtCmludGNfMyAvLyBheGZlcgo9PQphc3NlcnQKbG9hZCA1CmxvYWQgNgpsb2FkIDcKbG9hZCA4CmNhbGxzdWIgYnVybl80CmludGNfMSAvLyAxCnJldHVybgptYWluX2wxMToKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQppbnRjXzAgLy8gMApnZXRieXRlCnN0b3JlIDIKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgppbnRjXzAgLy8gMApnZXRieXRlCnN0b3JlIDMKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwppbnRjXzAgLy8gMApnZXRieXRlCnN0b3JlIDQKdHhuIEdyb3VwSW5kZXgKcHVzaGludCAyIC8vIDIKLQpzdG9yZSAwCmxvYWQgMApndHhucyBUeXBlRW51bQppbnRjXzMgLy8gYXhmZXIKPT0KYXNzZXJ0CnR4biBHcm91cEluZGV4CmludGNfMSAvLyAxCi0Kc3RvcmUgMQpsb2FkIDEKZ3R4bnMgVHlwZUVudW0KaW50Y18zIC8vIGF4ZmVyCj09CmFzc2VydApsb2FkIDAKbG9hZCAxCmxvYWQgMgpsb2FkIDMKbG9hZCA0CmNhbGxzdWIgbWludF8zCmludGNfMSAvLyAxCnJldHVybgptYWluX2wxMjoKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQpibnogbWFpbl9sMTQKZXJyCm1haW5fbDE0Ogp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAo9PQphc3NlcnQKY2FsbHN1YiBjcmVhdGVfMAppbnRjXzEgLy8gMQpyZXR1cm4KCi8vIGNyZWF0ZQpjcmVhdGVfMDoKYnl0ZWNfMyAvLyAiZyIKZ2xvYmFsIENyZWF0b3JBZGRyZXNzCmFwcF9nbG9iYWxfcHV0CmJ5dGVjIDQgLy8gInIiCmludGNfMCAvLyAwCmFwcF9nbG9iYWxfcHV0CnJldHN1YgoKLy8gYXV0aF9vbmx5CmF1dGhvbmx5XzE6CmJ5dGVjXzMgLy8gImciCmFwcF9nbG9iYWxfZ2V0Cj09CnJldHN1YgoKLy8gYXV0aF9vbmx5CmF1dGhvbmx5XzI6CmJ5dGVjXzMgLy8gImciCmFwcF9nbG9iYWxfZ2V0Cj09CnJldHN1YgoKLy8gbWludAptaW50XzM6CnN0b3JlIDI5CnN0b3JlIDI4CnN0b3JlIDI3CnN0b3JlIDI2CnN0b3JlIDI1CmxvYWQgMjgKdHhuYXMgQXNzZXRzCmJ5dGVjXzAgLy8gImEiCmFwcF9nbG9iYWxfZ2V0Cj09CmFzc2VydApsb2FkIDI5CnR4bmFzIEFzc2V0cwpieXRlY18xIC8vICJiIgphcHBfZ2xvYmFsX2dldAo9PQphc3NlcnQKbG9hZCAyNwp0eG5hcyBBc3NldHMKYnl0ZWNfMiAvLyAicCIKYXBwX2dsb2JhbF9nZXQKPT0KYXNzZXJ0CmxvYWQgMjUKZ3R4bnMgQXNzZXRSZWNlaXZlcgpnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwo9PQphc3NlcnQKbG9hZCAyNQpndHhucyBYZmVyQXNzZXQKYnl0ZWNfMCAvLyAiYSIKYXBwX2dsb2JhbF9nZXQKPT0KYXNzZXJ0CmxvYWQgMjUKZ3R4bnMgQXNzZXRBbW91bnQKaW50Y18wIC8vIDAKPgphc3NlcnQKbG9hZCAyNQpndHhucyBTZW5kZXIKdHhuIFNlbmRlcgo9PQphc3NlcnQKbG9hZCAyNgpndHhucyBBc3NldFJlY2VpdmVyCmdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCj09CmFzc2VydApsb2FkIDI2Cmd0eG5zIFhmZXJBc3NldApieXRlY18xIC8vICJiIgphcHBfZ2xvYmFsX2dldAo9PQphc3NlcnQKbG9hZCAyNgpndHhucyBBc3NldEFtb3VudAppbnRjXzAgLy8gMAo+CmFzc2VydApsb2FkIDI2Cmd0eG5zIFNlbmRlcgp0eG4gU2VuZGVyCj09CmFzc2VydApnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwpsb2FkIDI3CmFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQpzdG9yZSAzMQpzdG9yZSAzMApnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwpsb2FkIDI4CmFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQpzdG9yZSAzMwpzdG9yZSAzMgpnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwpsb2FkIDI5CmFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQpzdG9yZSAzNQpzdG9yZSAzNApsb2FkIDMxCmxvYWQgMzMKJiYKbG9hZCAzNQomJgphc3NlcnQKdHhuIFNlbmRlcgpieXRlY18yIC8vICJwIgphcHBfZ2xvYmFsX2dldApsb2FkIDMyCmxvYWQgMjUKZ3R4bnMgQXNzZXRBbW91bnQKPT0KbG9hZCAzNApsb2FkIDI2Cmd0eG5zIEFzc2V0QW1vdW50Cj09CiYmCmJueiBtaW50XzNfbDIKaW50YyA0IC8vIDEwMDAwMDAwMDAwCmxvYWQgMzAKLQpsb2FkIDMyCmxvYWQgMjUKZ3R4bnMgQXNzZXRBbW91bnQKLQpsb2FkIDM0CmxvYWQgMjYKZ3R4bnMgQXNzZXRBbW91bnQKLQpsb2FkIDI1Cmd0eG5zIEFzc2V0QW1vdW50CmxvYWQgMjYKZ3R4bnMgQXNzZXRBbW91bnQKY2FsbHN1YiB0b2tlbnN0b21pbnRfMTIKYiBtaW50XzNfbDMKbWludF8zX2wyOgpsb2FkIDI1Cmd0eG5zIEFzc2V0QW1vdW50CmxvYWQgMjYKZ3R4bnMgQXNzZXRBbW91bnQKY2FsbHN1YiB0b2tlbnN0b21pbnRpbml0aWFsXzUKbWludF8zX2wzOgpjYWxsc3ViIGRvYXhmZXJfNgpieXRlYyA0IC8vICJyIgpjYWxsc3ViIGdldHJhdGlvXzkKYXBwX2dsb2JhbF9wdXQKcmV0c3ViCgovLyBidXJuCmJ1cm5fNDoKc3RvcmUgNTMKc3RvcmUgNTIKc3RvcmUgNTEKc3RvcmUgNTAKbG9hZCA1MQp0eG5hcyBBc3NldHMKYnl0ZWNfMiAvLyAicCIKYXBwX2dsb2JhbF9nZXQKPT0KYXNzZXJ0CmxvYWQgNTIKdHhuYXMgQXNzZXRzCmJ5dGVjXzAgLy8gImEiCmFwcF9nbG9iYWxfZ2V0Cj09CmFzc2VydApsb2FkIDUzCnR4bmFzIEFzc2V0cwpieXRlY18xIC8vICJiIgphcHBfZ2xvYmFsX2dldAo9PQphc3NlcnQKbG9hZCA1MApndHhucyBBc3NldFJlY2VpdmVyCmdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCj09CmFzc2VydApsb2FkIDUwCmd0eG5zIEFzc2V0QW1vdW50CmludGNfMCAvLyAwCj4KYXNzZXJ0CmxvYWQgNTAKZ3R4bnMgWGZlckFzc2V0CmJ5dGVjXzIgLy8gInAiCmFwcF9nbG9iYWxfZ2V0Cj09CmFzc2VydApsb2FkIDUwCmd0eG5zIFNlbmRlcgp0eG4gU2VuZGVyCj09CmFzc2VydApnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwpsb2FkIDUxCmFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQpzdG9yZSA1NQpzdG9yZSA1NApnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwpsb2FkIDUyCmFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQpzdG9yZSA1NwpzdG9yZSA1NgpnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwpsb2FkIDUzCmFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQpzdG9yZSA1OQpzdG9yZSA1OApsb2FkIDU1CmxvYWQgNTcKJiYKbG9hZCA1OQomJgphc3NlcnQKaW50YyA0IC8vIDEwMDAwMDAwMDAwCmxvYWQgNTQKbG9hZCA1MApndHhucyBBc3NldEFtb3VudAotCi0Kc3RvcmUgNjAKdHhuIFNlbmRlcgpieXRlY18wIC8vICJhIgphcHBfZ2xvYmFsX2dldApsb2FkIDYwCmxvYWQgNTYKbG9hZCA1MApndHhucyBBc3NldEFtb3VudApjYWxsc3ViIHRva2Vuc3RvYnVybl83CmNhbGxzdWIgZG9heGZlcl82CnR4biBTZW5kZXIKYnl0ZWNfMSAvLyAiYiIKYXBwX2dsb2JhbF9nZXQKbG9hZCA2MApsb2FkIDU4CmxvYWQgNTAKZ3R4bnMgQXNzZXRBbW91bnQKY2FsbHN1YiB0b2tlbnN0b2J1cm5fNwpjYWxsc3ViIGRvYXhmZXJfNgpieXRlYyA0IC8vICJyIgpjYWxsc3ViIGdldHJhdGlvXzkKYXBwX2dsb2JhbF9wdXQKcmV0c3ViCgovLyB0b2tlbnNfdG9fbWludF9pbml0aWFsCnRva2Vuc3RvbWludGluaXRpYWxfNToKKgpzcXJ0CmludGNfMiAvLyAxMDAwCi0KcmV0c3ViCgovLyBkb19heGZlcgpkb2F4ZmVyXzY6CnN0b3JlIDM4CnN0b3JlIDM3CnN0b3JlIDM2Cml0eG5fYmVnaW4KaW50Y18zIC8vIGF4ZmVyCml0eG5fZmllbGQgVHlwZUVudW0KbG9hZCAzNwppdHhuX2ZpZWxkIFhmZXJBc3NldApsb2FkIDM4Cml0eG5fZmllbGQgQXNzZXRBbW91bnQKbG9hZCAzNgppdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKaXR4bl9zdWJtaXQKcmV0c3ViCgovLyB0b2tlbnNfdG9fYnVybgp0b2tlbnN0b2J1cm5fNzoKc3RvcmUgNjMKc3RvcmUgNjIKc3RvcmUgNjEKbG9hZCA2Mgpsb2FkIDYzCm11bHcKaW50Y18wIC8vIDAKbG9hZCA2MQpkaXZtb2R3CnBvcApwb3AKc3dhcAohCmFzc2VydApyZXRzdWIKCi8vIGRvX29wdF9pbgpkb29wdGluXzg6CnN0b3JlIDY1Cmdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCmxvYWQgNjUKaW50Y18wIC8vIDAKY2FsbHN1YiBkb2F4ZmVyXzYKcmV0c3ViCgovLyBnZXRfcmF0aW8KZ2V0cmF0aW9fOToKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKYnl0ZWNfMCAvLyAiYSIKYXBwX2dsb2JhbF9nZXQKYXNzZXRfaG9sZGluZ19nZXQgQXNzZXRCYWxhbmNlCnN0b3JlIDQwCnN0b3JlIDM5Cmdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCmJ5dGVjXzEgLy8gImIiCmFwcF9nbG9iYWxfZ2V0CmFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQpzdG9yZSA0MgpzdG9yZSA0MQpsb2FkIDQwCmxvYWQgNDIKJiYKYXNzZXJ0CmxvYWQgMzkKaW50Y18yIC8vIDEwMDAKbXVsdwppbnRjXzAgLy8gMApsb2FkIDQxCmRpdm1vZHcKcG9wCnBvcApzd2FwCiEKYXNzZXJ0CnJldHN1YgoKLy8gc2V0X2dvdmVybm9yCnNldGdvdmVybm9yXzEwOgpzdG9yZSA2NAp0eG4gU2VuZGVyCmNhbGxzdWIgYXV0aG9ubHlfMQphc3NlcnQKYnl0ZWNfMyAvLyAiZyIKbG9hZCA2NAp0eG5hcyBBY2NvdW50cwphcHBfZ2xvYmFsX3B1dApyZXRzdWIKCi8vIGJvb3RzdHJhcApib290c3RyYXBfMTE6CnN0b3JlIDE1CnN0b3JlIDE0CnN0b3JlIDEzCnR4biBTZW5kZXIKY2FsbHN1YiBhdXRob25seV8yCmFzc2VydApnbG9iYWwgR3JvdXBTaXplCnB1c2hpbnQgMiAvLyAyCj09CmFzc2VydApsb2FkIDEzCmd0eG5zIFJlY2VpdmVyCmdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCj09CmFzc2VydApsb2FkIDEzCmd0eG5zIEFtb3VudApwdXNoaW50IDMwMDAwMCAvLyAzMDAwMDAKPj0KYXNzZXJ0CmxvYWQgMTQKdHhuYXMgQXNzZXRzCmxvYWQgMTUKdHhuYXMgQXNzZXRzCjwKYXNzZXJ0CmludGNfMCAvLyAwCmJ5dGVjXzAgLy8gImEiCmFwcF9nbG9iYWxfZ2V0X2V4CnN0b3JlIDE3CnN0b3JlIDE2CmxvYWQgMTcKIQphc3NlcnQKYnl0ZWNfMCAvLyAiYSIKbG9hZCAxNAp0eG5hcyBBc3NldHMKYXBwX2dsb2JhbF9wdXQKaW50Y18wIC8vIDAKYnl0ZWNfMSAvLyAiYiIKYXBwX2dsb2JhbF9nZXRfZXgKc3RvcmUgMTkKc3RvcmUgMTgKbG9hZCAxOQohCmFzc2VydApieXRlY18xIC8vICJiIgpsb2FkIDE1CnR4bmFzIEFzc2V0cwphcHBfZ2xvYmFsX3B1dAppbnRjXzAgLy8gMApieXRlY18yIC8vICJwIgphcHBfZ2xvYmFsX2dldF9leApzdG9yZSAyMQpzdG9yZSAyMApsb2FkIDIxCiEKYXNzZXJ0CmJ5dGVjXzIgLy8gInAiCmJ5dGVjXzAgLy8gImEiCmFwcF9nbG9iYWxfZ2V0CmJ5dGVjXzEgLy8gImIiCmFwcF9nbG9iYWxfZ2V0CmNhbGxzdWIgZG9jcmVhdGVwb29sdG9rZW5fMTQKYXBwX2dsb2JhbF9wdXQKYnl0ZWNfMCAvLyAiYSIKYXBwX2dsb2JhbF9nZXQKY2FsbHN1YiBkb29wdGluXzgKYnl0ZWNfMSAvLyAiYiIKYXBwX2dsb2JhbF9nZXQKY2FsbHN1YiBkb29wdGluXzgKYnl0ZWNfMiAvLyAicCIKYXBwX2dsb2JhbF9nZXQKcmV0c3ViCgovLyB0b2tlbnNfdG9fbWludAp0b2tlbnN0b21pbnRfMTI6CnN0b3JlIDQ3CnN0b3JlIDQ2CnN0b3JlIDQ1CnN0b3JlIDQ0CnN0b3JlIDQzCmxvYWQgNDYKaW50Y18yIC8vIDEwMDAKbXVsdwppbnRjXzAgLy8gMApsb2FkIDQ0CmRpdm1vZHcKcG9wCnBvcApzd2FwCiEKYXNzZXJ0CnN0b3JlIDQ4CmxvYWQgNDcKaW50Y18yIC8vIDEwMDAKbXVsdwppbnRjXzAgLy8gMApsb2FkIDQ1CmRpdm1vZHcKcG9wCnBvcApzd2FwCiEKYXNzZXJ0CnN0b3JlIDQ5CmxvYWQgNDgKbG9hZCA0OQo8CmJueiB0b2tlbnN0b21pbnRfMTJfbDIKbG9hZCA0OQpiIHRva2Vuc3RvbWludF8xMl9sMwp0b2tlbnN0b21pbnRfMTJfbDI6CmxvYWQgNDgKdG9rZW5zdG9taW50XzEyX2wzOgpsb2FkIDQzCm11bHcKaW50Y18wIC8vIDAKaW50Y18yIC8vIDEwMDAKZGl2bW9kdwpwb3AKcG9wCnN3YXAKIQphc3NlcnQKcmV0c3ViCgovLyBzd2FwCnN3YXBfMTM6CnN0b3JlIDczCnN0b3JlIDcyCnN0b3JlIDcxCmxvYWQgNzIKdHhuYXMgQXNzZXRzCmJ5dGVjXzAgLy8gImEiCmFwcF9nbG9iYWxfZ2V0Cj09CmFzc2VydApsb2FkIDczCnR4bmFzIEFzc2V0cwpieXRlY18xIC8vICJiIgphcHBfZ2xvYmFsX2dldAo9PQphc3NlcnQKbG9hZCA3MQpndHhucyBYZmVyQXNzZXQKYnl0ZWNfMCAvLyAiYSIKYXBwX2dsb2JhbF9nZXQKPT0KbG9hZCA3MQpndHhucyBYZmVyQXNzZXQKYnl0ZWNfMSAvLyAiYiIKYXBwX2dsb2JhbF9nZXQKPT0KfHwKYXNzZXJ0CmxvYWQgNzEKZ3R4bnMgQXNzZXRBbW91bnQKaW50Y18wIC8vIDAKPgphc3NlcnQKbG9hZCA3MQpndHhucyBTZW5kZXIKdHhuIFNlbmRlcgo9PQphc3NlcnQKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKbG9hZCA3MQpndHhucyBYZmVyQXNzZXQKYXNzZXRfaG9sZGluZ19nZXQgQXNzZXRCYWxhbmNlCnN0b3JlIDc1CnN0b3JlIDc0Cmdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCmxvYWQgNzEKZ3R4bnMgWGZlckFzc2V0CmJ5dGVjXzAgLy8gImEiCmFwcF9nbG9iYWxfZ2V0Cj09CmJueiBzd2FwXzEzX2w1CmJ5dGVjXzAgLy8gImEiCmFwcF9nbG9iYWxfZ2V0CnN3YXBfMTNfbDI6CmFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQpzdG9yZSA3NwpzdG9yZSA3Ngpsb2FkIDc1CmxvYWQgNzcKJiYKYXNzZXJ0CnR4biBTZW5kZXIKbG9hZCA3MQpndHhucyBYZmVyQXNzZXQKYnl0ZWNfMCAvLyAiYSIKYXBwX2dsb2JhbF9nZXQKPT0KYm56IHN3YXBfMTNfbDQKYnl0ZWNfMCAvLyAiYSIKYXBwX2dsb2JhbF9nZXQKYiBzd2FwXzEzX2w2CnN3YXBfMTNfbDQ6CmJ5dGVjXzEgLy8gImIiCmFwcF9nbG9iYWxfZ2V0CmIgc3dhcF8xM19sNgpzd2FwXzEzX2w1OgpieXRlY18xIC8vICJiIgphcHBfZ2xvYmFsX2dldApiIHN3YXBfMTNfbDIKc3dhcF8xM19sNjoKbG9hZCA3MQpndHhucyBBc3NldEFtb3VudApsb2FkIDc0CmxvYWQgNzEKZ3R4bnMgQXNzZXRBbW91bnQKLQpsb2FkIDc2CmNhbGxzdWIgdG9rZW5zdG9zd2FwXzE1CmNhbGxzdWIgZG9heGZlcl82CmJ5dGVjIDQgLy8gInIiCmNhbGxzdWIgZ2V0cmF0aW9fOQphcHBfZ2xvYmFsX3B1dApyZXRzdWIKCi8vIGRvX2NyZWF0ZV9wb29sX3Rva2VuCmRvY3JlYXRlcG9vbHRva2VuXzE0OgpzdG9yZSA2Ngphc3NldF9wYXJhbXNfZ2V0IEFzc2V0VW5pdE5hbWUKc3RvcmUgNjgKc3RvcmUgNjcKbG9hZCA2Ngphc3NldF9wYXJhbXNfZ2V0IEFzc2V0VW5pdE5hbWUKc3RvcmUgNzAKc3RvcmUgNjkKbG9hZCA2OApsb2FkIDcwCiYmCmFzc2VydAppdHhuX2JlZ2luCnB1c2hpbnQgMyAvLyBhY2ZnCml0eG5fZmllbGQgVHlwZUVudW0KcHVzaGJ5dGVzIDB4NDQ1MDU0MmQgLy8gIkRQVC0iCmxvYWQgNjcKY29uY2F0CnB1c2hieXRlcyAweDJkIC8vICItIgpjb25jYXQKbG9hZCA2OQpjb25jYXQKaXR4bl9maWVsZCBDb25maWdBc3NldE5hbWUKcHVzaGJ5dGVzIDB4NjQ3MDc0IC8vICJkcHQiCml0eG5fZmllbGQgQ29uZmlnQXNzZXRVbml0TmFtZQppbnRjIDQgLy8gMTAwMDAwMDAwMDAKaXR4bl9maWVsZCBDb25maWdBc3NldFRvdGFsCnB1c2hpbnQgMyAvLyAzCml0eG5fZmllbGQgQ29uZmlnQXNzZXREZWNpbWFscwpnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwppdHhuX2ZpZWxkIENvbmZpZ0Fzc2V0TWFuYWdlcgpnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwppdHhuX2ZpZWxkIENvbmZpZ0Fzc2V0UmVzZXJ2ZQppdHhuX3N1Ym1pdAppdHhuIENyZWF0ZWRBc3NldElECnJldHN1YgoKLy8gdG9rZW5zX3RvX3N3YXAKdG9rZW5zdG9zd2FwXzE1OgpzdG9yZSA4MApzdG9yZSA3OQpzdG9yZSA3OApsb2FkIDc4CmludGNfMiAvLyAxMDAwCnB1c2hpbnQgNSAvLyA1Ci0KbXVsdwpsb2FkIDgwCnVuY292ZXIgMgpkaWcgMQoqCmNvdmVyIDIKbXVsdwpjb3ZlciAyCisKc3dhcAppbnRjXzAgLy8gMApsb2FkIDc5CmludGNfMiAvLyAxMDAwCioKbG9hZCA3OAppbnRjXzIgLy8gMTAwMApwdXNoaW50IDUgLy8gNQotCioKKwpkaXZtb2R3CnBvcApwb3AKc3dhcAohCmFzc2VydApyZXRzdWI=";
    clearProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDcKcHVzaGludCAwIC8vIDAKcmV0dXJu";
    methods: ABIMethod[] = [
        new ABIMethod({
            name: "mint",
            desc: "",
            args: [
                { type: "axfer", name: "a_xfer", desc: "" },
                { type: "axfer", name: "b_xfer", desc: "" },
                { type: "asset", name: "pool_asset", desc: "" },
                { type: "asset", name: "a_asset", desc: "" },
                { type: "asset", name: "b_asset", desc: "" }
            ],
            returns: { type: "void", desc: "" }
        }),
        new ABIMethod({
            name: "burn",
            desc: "",
            args: [
                { type: "axfer", name: "pool_xfer", desc: "" },
                { type: "asset", name: "pool_asset", desc: "" },
                { type: "asset", name: "a_asset", desc: "" },
                { type: "asset", name: "b_asset", desc: "" }
            ],
            returns: { type: "void", desc: "" }
        }),
        new ABIMethod({
            name: "set_governor",
            desc: "",
            args: [
                { type: "account", name: "new_governor", desc: "" }
            ],
            returns: { type: "void", desc: "" }
        }),
        new ABIMethod({
            name: "bootstrap",
            desc: "",
            args: [
                { type: "pay", name: "seed", desc: "" },
                { type: "asset", name: "a_asset", desc: "" },
                { type: "asset", name: "b_asset", desc: "" }
            ],
            returns: { type: "uint64", desc: "" }
        }),
        new ABIMethod({
            name: "swap",
            desc: "",
            args: [
                { type: "axfer", name: "swap_xfer", desc: "" },
                { type: "asset", name: "a_asset", desc: "" },
                { type: "asset", name: "b_asset", desc: "" }
            ],
            returns: { type: "void", desc: "" }
        })
    ];
    mint(a_xfer: TransactionWithSigner, b_xfer: TransactionWithSigner, pool_asset: number, a_asset: number, b_asset: number) {
        return this.call(getMethodByName(this.methods, "mint"), { a_xfer: a_xfer, b_xfer: b_xfer, pool_asset: pool_asset, a_asset: a_asset, b_asset: b_asset });
    }
    burn(pool_xfer: TransactionWithSigner, pool_asset: number, a_asset: number, b_asset: number) {
        return this.call(getMethodByName(this.methods, "burn"), { pool_xfer: pool_xfer, pool_asset: pool_asset, a_asset: a_asset, b_asset: b_asset });
    }
    set_governor(new_governor: string) {
        return this.call(getMethodByName(this.methods, "set_governor"), { new_governor: new_governor });
    }
    bootstrap(seed: TransactionWithSigner, a_asset: number, b_asset: number) {
        return this.call(getMethodByName(this.methods, "bootstrap"), { seed: seed, a_asset: a_asset, b_asset: b_asset });
    }
    swap(swap_xfer: TransactionWithSigner, a_asset: number, b_asset: number) {
        return this.call(getMethodByName(this.methods, "swap"), { swap_xfer: swap_xfer, a_asset: a_asset, b_asset: b_asset });
    }
}
