import {generateClient} from  './generate/generate' 
import {AppSpec} from  './generate/appspec' 

import fs from 'fs'

(async function(){
    const appSpec = JSON.parse(fs.readFileSync("amm.json").toString());
    generateClient(appSpec as AppSpec, "./")

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