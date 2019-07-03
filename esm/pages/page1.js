import {bottomMenu, div, table} from "../components";
import {
    checkTrickList,
    sum,
    _goals,
    players,
    REUSSITE,
    TRAFALGAR,
    trafalgarGoalIndexes,
    checkTrickList_unitary
} from "../model";
import {fillArray} from "../utils";
import {EVENT} from "../controller";
import {tr,data} from "./common.js";
import {THEAD, title} from "./common";
const {render,html} = lighterhtml;
const leftContent=(gIndex,goal)=> (isCompleted_unitary(gIndex)?"\u2714":"\xa0\xa0\xa0")+goal;
const goalModel=(gIndex)=>[
        {
            content:leftContent(gIndex,_goals[gIndex][0])
        },
        ...fillArray(players.length).map((e,i)=>({content:iDiv(gIndex,i)}))
];
const trafalgarModel=()=> {
    let model = [];
    trafalgarGoalIndexes().forEach((gIndex) => {
        model.push(tr(goalModel(gIndex)));
    });
    return model;
};
const iDiv=(gIndex,index)=>div({
    data:data("saisie",gIndex,index),
    content:filterTrick(gIndex)[0].tricks[index],
    onclick:onclick
});
const getBodyContent=(gIndex)=>{
    let bodyContent=[];
    if (_goals[gIndex][0]===TRAFALGAR) {
        bodyContent.push(...trafalgarModel())
    } else {
        bodyContent.push(tr(goalModel(gIndex)))
    }
    return bodyContent;
};
export const E1_SCORE=0;
export const E1_VALIDER=1;
export const E1_ANNULER=2;
const fillZero=()=>fillArray(players.length,0);
const isCompleted_all=()=>checkTrickList(trickList);
const isCompleted_unitary=(gIndex)=>checkTrickList_unitary(gIndex,filterTrick(gIndex)[0].tricks);
const filterTrick=(gIndex)=>trickList.filter(trick=>trick.gIndex===gIndex);
const updateTrickList=(pgIndex,gIndex)=> {
    let tricks=filterTrick(gIndex)[0].tricks;
    if (_goals[gIndex][0]===REUSSITE) {
        if (tricks[pgIndex] === 0) {
            if (sum(tricks) === 1) {
                tricks[pgIndex] = 2;
            } else {
                for (let i=0;i<tricks.length;i++) tricks[i]=0;
                tricks[pgIndex] = 1;
            }
        } else if (tricks[pgIndex] === 2) {
            for (let i=0;i<tricks.length;i++) tricks[i]=0;
            tricks[pgIndex] = 1;
        } else {

        }
    } else if (!isCompleted_unitary(gIndex)) {
        tricks[pgIndex]++;
    } else {
        tricks[pgIndex]=0;
    }
};
const onclick=(event)=> {
    let type, transfer,data;
    data=event.target.data;
    transfer={gIndex,pIndex};
    if (data==='valider') {
        type=E1_VALIDER;
        transfer.trickList=trickList;
    } else if (data==='annuler') {
        type=E1_ANNULER;
    } else {
        updateTrickList(data.pIndex,data.gIndex);
        type=E1_SCORE;
    }
    reg.listener(EVENT(type,transfer));
};
const update=(args)=>{
    if (!args) return html``;
    if (pIndex!==args.data.pIndex || gIndex!==args.data.gIndex) {
        gIndex=args.data.gIndex;
        pIndex=args.data.pIndex;
        trickList=[];
        if (gIndex!==undefined && _goals[gIndex][0]===TRAFALGAR){
            trafalgarGoalIndexes().forEach(gIndex=>{
                trickList.push({gIndex:gIndex,tricks:fillZero()});
            });
        } else {
            trickList.push({gIndex:gIndex,tricks:fillZero()});
        }
    }
    gIndex=args.data.gIndex;
    pIndex=args.data.pIndex;
    let bClass=["button",isCompleted_all()?"button-validate":"button-disabled"].join(" ");
    return html`
        ${title("Saisie",_goals[gIndex][0]+" annoncé par "+players[pIndex])}
        ${table(
            {
                tbody:{content:getBodyContent(gIndex)},
                thead:THEAD()
            }
        )}
        ${bottomMenu(bClass,onclick, !isCompleted_all(),reg.sharedData.getVersion())}
    `;
};
let gIndex,pIndex;
let trickList;
let reg;
export const register=(listener, sharedData)=> {
    reg={listener,sharedData};
    return update;
};