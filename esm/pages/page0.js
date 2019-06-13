import {fillArray} from "../utils";
import {_goals, players} from "../model";
import {button, table} from "../components";
import {EVENT} from "../controller";
import {tr,td,} from "./common.js";
import {THEAD, title} from "./common";
const {render,html} = lighterhtml;
export const E_DONE=0;
export const E_NOT_DONE=1;
export const E_ALL=2;
export const E_RESET=2;
const doneCss=(rowIndex,gIndex,states)=> rowIndex===0?"" :states.done(rowIndex-1,gIndex)?"circle":"empty";
const fillCell=(ctd,pIndex,gIndex,states)=>ctd===0 && !states.done(pIndex,gIndex) ?'\xa0':ctd;
const getBody=(players,goals, states)=> {
    const table=()=> {
            let bodyContent=[];
            goals.map((goal,_gIndex) => [goal[0], ...states.scoreByGoal(_gIndex)]).forEach((row, gIndex) => {
                bodyContent.push(
                    tr(row.map((ctd,rowIndex)=>td(fillCell(ctd,rowIndex-1,gIndex,mStates),"main",rowIndex-1,gIndex,onclick,doneCss(rowIndex,gIndex,mStates))))
                );
            });

        return bodyContent;
    };
    return {
        table:()=>table(),
    }
};
const messageOver=(btnModel)=>html`<div style="text-align: right">Partie Terminée ${button(btnModel)}</div>`;

const onclick=event=> {
    let data=event.target.data;
    if (data==='reset') {
        _listener(EVENT(E_RESET, null));
    } else if (data.pIndex===-1) {
        if (data.rowType==='main') _listener(EVENT(E_ALL, data));
    } else {
        if (data.rowType === 'main') {
            if (mStates.done(data.pIndex, data.gIndex)) {
                _listener(EVENT(E_DONE, data));
            } else {
                _listener(EVENT(E_NOT_DONE, data));
            }
        }
    }
};
const model=(mStates)=> ({
    tbody:{content:getBody(players,_goals,mStates).table()},
    thead:THEAD(),
    tfoot: {content:[tr(['Total', ...mStates.totalScoreByPlayer()].map(ctd=>td(ctd,"footer",-1,-1)))]}
});
const update=(event)=> {
    const mButtonOver= {
        onclick:onclick,
        data:'reset',
        content:'REJOUER',
        class:'button'
    };
    const over=true;
    return html`
        ${title("Scores")}
        ${mStates.isOver()?messageOver(mButtonOver):''}
        ${table(model(mStates))}
    `;
};

let mStates, shownGoal;
let _listener,_sharedData;
export const register=(listener, sharedData)=> {
    _listener=listener;
    _sharedData=sharedData;
    mStates=_sharedData.state;
    return update;
};