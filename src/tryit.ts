import {generateClient, AppSpec} from  './generate' 
import fs from 'fs'

(async function(){
    const appSpec = JSON.parse(fs.readFileSync("amm.json").toString());
    const client = generateClient(appSpec as AppSpec)

    console.log(client)
    /*
    client.mint({
        txParams:{coverInners: 3}, 
        args: {
            assetA: 10, 
            assetB: 20,
            amount: 20,
        }
    }) 
    */

})()