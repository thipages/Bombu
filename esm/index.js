import {E_DONE, E_NOT_DONE, E_RESET, register as r0} from "./pages/page0";
import {E1_ANNULER, E1_SCORE, E1_VALIDER, register as r1} from "./pages/page1";
import {register} from "./controller";
import {players, states} from "./model";
const listener=(pageNum,args)=> {
    const same=()=>updater(pageNum,args);
    const page=(page)=>updater(page,args);
    switch (pageNum) {
        case 0:
            if (args.type===E_NOT_DONE) {
                page(1);
            } else if (args.type===E_RESET) {
                state.reset();
                same();
            } else {
                same();
            }
            break;
        case 1:
            if (args.type===E1_SCORE) {
                same();
            } else if (args.type===E1_ANNULER) {
                page(0);
            } else if (args.type===E1_VALIDER) {
                state.add(args.data.pIndex,args.data.gIndex,args.data.trickList);
                page(0);
            }
            break
    }
};
const state=states(players.length,false);
const updater=register(
    {state},
    listener,
    [r0,r1],
    document.getElementById("app")
);
updater();