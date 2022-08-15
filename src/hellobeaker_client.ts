import algosdk, {TransactionWithSigner, ABIMethod, ABIMethodParams, getMethodByName} from "algosdk";
import GenericApplicationClient from "./application_client";
import {Schema} from "./generate/appspec";
export default class HelloBeaker extends GenericApplicationClient {
    desc: string = "";
    appSchema: Schema = {
        declared: {},
        dynamic: {}
    };
    acctSchema: Schema = {
        declared: {},
        dynamic: {}
    };
    approvalProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDcKaW50Y2Jsb2NrIDAgMQpieXRlY2Jsb2NrIDB4NDg2NTZjNmM2ZjJjMjAKdHhuIE51bUFwcEFyZ3MKaW50Y18wIC8vIDAKPT0KYm56IG1haW5fbDQKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMApwdXNoYnl0ZXMgMHgwMmJlY2UxMSAvLyAiaGVsbG8oc3RyaW5nKXN0cmluZyIKPT0KYm56IG1haW5fbDMKZXJyCm1haW5fbDM6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KJiYKYXNzZXJ0CnR4bmEgQXBwbGljYXRpb25BcmdzIDEKY2FsbHN1YiBoZWxsb18xCnN0b3JlIDAKcHVzaGJ5dGVzIDB4MTUxZjdjNzUgLy8gMHgxNTFmN2M3NQpsb2FkIDAKY29uY2F0CmxvZwppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sNDoKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQpibnogbWFpbl9sNgplcnIKbWFpbl9sNjoKdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKPT0KYXNzZXJ0CmNhbGxzdWIgY3JlYXRlXzAKaW50Y18xIC8vIDEKcmV0dXJuCgovLyBjcmVhdGUKY3JlYXRlXzA6CmludGNfMSAvLyAxCnJldHVybgoKLy8gaGVsbG8KaGVsbG9fMToKc3RvcmUgMQpieXRlY18wIC8vICJIZWxsbywgIgpsb2FkIDEKZXh0cmFjdCAyIDAKY29uY2F0CmxlbgppdG9iCmV4dHJhY3QgNiAwCmJ5dGVjXzAgLy8gIkhlbGxvLCAiCmxvYWQgMQpleHRyYWN0IDIgMApjb25jYXQKY29uY2F0CnJldHN1Yg==";
    clearProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDcKcHVzaGludCAwIC8vIDAKcmV0dXJu";
    methods: ABIMethod[] = [
        new ABIMethod({
            name: "hello",
            desc: "",
            args: [
                { type: "string", name: "name", desc: "" }
            ],
            returns: { type: "string", desc: "" }
        })
    ];
    hello(name: string) {
        return this.call(getMethodByName(this.methods, "hello"), { name: name });
    }
}
