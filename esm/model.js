import {fillArray} from "./utils.js"
//
export const PLIS='Plis';
export const COEURS='Coeurs';
export const DAMES='Dames';
export const ROI='Roi coeur';
export const REUSSITE='Réussite';
export const TRAFALGAR='Trafalgar';
export const _goals=[
    [PLIS,8,5,1],
    [COEURS,8,5,1],
    [DAMES,4,15,1],
    [ROI,1,70,1],
    [REUSSITE,2,[-100,-50],0],
    [TRAFALGAR,0,0,0]
];
/*export const goals=(gIndex)=> {
    //return arr2Obj(_goals[gIndex],['name','trickNum','unitaryScore','isTrafalgar']);
    let [name,trickNum,unitaryScore,isTrafalgar]=_goals[gIndex];
    return {name,trickNum,unitaryScore,isTrafalgar};
};*/
const arr2Obj=(row, names)=> {
    let ret={};
    row.forEach((item,index)=>ret[names[index]]=item);
    return ret;
};

export const players=['ben','sev','sss','tit'];
export const countZero=(resultList)=>resultList.reduce((a,c)=> (c===0)?a+1:a,0);
export const sum=(trickList)=>trickList.reduce((a,c)=>a+c);
export const trafalgarGoalIndexes=()=> {
    return _goals.reduce((a,c,i)=> c[3]===1?a.concat(i):a,[]);
};
export const checkResults=(gIndex,trickList)=> {
    let valid=true;
    trickList.forEach(goal => {
        if (valid) valid=checkResults_unitary(goal.gIndex,goal.tricks);
    });
    return valid;
};
export const checkResults_unitary=(gIndex,trickPerPlayer)=> {
    if (_goals[gIndex][0] === REUSSITE) {
        return sum(trickPerPlayer) === 3 && countZero(trickPerPlayer) === 2;
    } else {
        return sum(trickPerPlayer)===_goals[gIndex][1];
    }
};
const calculateScore=(gIndex,result)=> {
    if (_goals[gIndex][0] === REUSSITE) {
        return (result === 1)
            ? -100
            : (result === 2) ? -50 : 0;
    } else {
        return _goals[gIndex][2]*result;
    }
};
export const states=(num)=> {
    const getTotalScoreByPlayer=()=> {
        let total=fillArray(players.length,0);
        lScores.forEach(player=>player.forEach(goal=>goal.forEach((score,pgIndex)=>total[pgIndex]+=score)));
        return total;
    };
    const getScoreByGoal=(gIndex)=> {
        let total=fillArray(players.length,0);
        lScores.forEach(player=>{
            player.forEach((goal,index)=>{
                if (index===gIndex) goal.forEach((score,index)=>total[index]+=score)
            })
        });
        return total;
    };
    const addTricks=(pIndex,gIndex,trickList)=> {
        lDone[pIndex][gIndex]=1;
        trickList.forEach (trick=> {
            trick.tricks.forEach((score,index)=>
                lScores[pIndex][gIndex][index]+=calculateScore(trick.gIndex,score));
        });
        console.log("lScores",lScores);
    };
    const lScores=fillArray(num).map(a=>_goals.map(goal=>
        players.map(c=>0)
    ));
    const lDone=fillArray(num).map(p=>_goals.map(p1=>0));
    return {
        done:(pIndex,gIndex)=>lDone[pIndex][gIndex]===1,
        add : (pIndex,gIndex,trickList)=>addTricks(pIndex,gIndex,trickList),
        doneList:(gIndex)=>fillArray(num).map((item, pIndex)=>lDone[pIndex][gIndex]),
        scoreList:(pIndex,gIndex)=>lScores[pIndex][gIndex],
        totalScoreByPlayer:()=>getTotalScoreByPlayer(),
        scoreByGoal:(gIndex)=>getScoreByGoal(gIndex)
    }
};