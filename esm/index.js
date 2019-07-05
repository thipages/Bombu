import {E_DONE, E_NOT_DONE, E_RESET} from "./pages/page0";
import {E1_ANNULER, E1_SCORE, E1_VALIDER} from "./pages/page1";
import {players, states} from "./model";
import {initRegistry} from "./view-registrar/index.js"
const {render,html} = lighterhtml;
const listener=(pageNum,event)=> {
    const same=()=>updater(pageNum,event);
    const page=(page)=>updater(page,event);
    switch (pageNum) {
        case 0:
            if (event.type===E_NOT_DONE) {
                page(1);
            } else if (event.type===E_RESET) {
                sharedData.reset();
                same();
            } else {
                same();
            }
            break;
        case 1:
            if (event.type===E1_SCORE) {
                same();
            } else if (event.type===E1_ANNULER) {
                page(0);
            } else if (event.type===E1_VALIDER) {
                sharedData.add(event.data.pIndex,event.data.gIndex,event.data.trickList);
                page(0);
            }
            break
    }
};
const sharedData=states(players.length,false);

const renderer = (html) => render (
    document.getElementById("app"),()=>html
);

const updater=initRegistry(sharedData,listener,renderer);
updater(0);