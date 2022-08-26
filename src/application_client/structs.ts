import algosdk, { ABIValue } from "algosdk";
import { MethodArg } from "./application_client";

export interface Struct {
  encode(): MethodArg[]
  decode(val: algosdk.ABIValue): Struct
}

 //   const proto = Object.getPrototypeOf(this)
 //   console.log(proto)
 //   console.log(Object.getOwnPropertyNames(this))
 //   console.log(Object.keys(this))
 //   //console.log(proto)
 //   //console.log(Object.keys(proto))

 //   //const obj = Object.fromEntries(
 //   //    Object.keys(this).map(function (k, idx) { return [k, args[idx]]; })
 //   //)

 //   //return new Struct(obj)
 //   return
 // }

 // encode(): MethodArg[] { return Object.values(this); }
