import ConstantProductAMM from "./constantproductamm_client";

(async function(){
    const cpamm_client = new ConstantProductAMM({appId:10});
    cpamm_client.create();
})()