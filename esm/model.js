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
export const checkTrickList=(trickList)=> {
    let valid=true;
    trickList.forEach(goal => {
        if (valid) valid=checkTrickList_unitary(goal.gIndex,goal.tricks);
    });
    return valid;
};
export const checkTrickList_unitary=(gIndex, trickPerPlayer)=> {
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
const calculateScoreFromTrickList=(num,trickList)=> {
    let scores=fillArray(num,0);
    trickList.forEach (trick=> {
        trick.tricks.forEach((score,index)=> {
            scores[index]+=calculateScore(trick.gIndex,score);
        })
    });
    return scores;
};
const createTrick=(gIndex,tricks)=> ({gIndex:gIndex,tricks:tricks});
const fillWithCompletedScores=(num)=>fillArray(num).map(a=>_goals.map((goal,gIndex)=>
        goal[0]===TRAFALGAR
            ? calculateScoreFromTrickList(
                num,trafalgarGoalIndexes().map(gIndex =>
                createTrick(gIndex,fillArray(num).map((d,index)=>index===0?_goals[gIndex][1]:0)))
            )
            :goal[0]===REUSSITE
                ? calculateScoreFromTrickList(
                    num,[createTrick(gIndex,fillArray(num).map((d,index)=>index===1?1:index===2?2:0))]
                )
                : calculateScoreFromTrickList(
                    num,[createTrick(gIndex,fillArray(num).map((d,index)=>index===0&&goal[0]!==ROI?goal[1]:0))]
                )
));

const fillWithEmptyScores=(num)=>fillArray(num).map(a=>_goals.map(goal=>
    fillArray(num).map(c=>0)
));

export const states=(num,test)=> {
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
        lScores[pIndex][gIndex]=calculateScoreFromTrickList(num,trickList);
    };
    const _isOver=()=> {
        let isOver=true;
        lDone.forEach(player=>player.map(done=>{
            if (isOver && !done) isOver=false}
        ));
        return isOver;
    };

    const _reset=()=> {
        lScores=test?fillWithCompletedScores(num):fillWithEmptyScores(num);
        lDone=fillArray(num).map(p=>_goals.map(goal=>test && goal[0]!==ROI?1:0));
    };
    let lScores,lDone;
    _reset();
    return {
        isOver:()=>_isOver(),
        done:(pIndex,gIndex)=>lDone[pIndex][gIndex]===1,
        add : (pIndex,gIndex,trickList)=>addTricks(pIndex,gIndex,trickList),
        doneList:(gIndex)=>fillArray(num).map((item, pIndex)=>lDone[pIndex][gIndex]),
        scoreList:(pIndex,gIndex)=>lScores[pIndex][gIndex],
        totalScoreByPlayer:()=>getTotalScoreByPlayer(),
        scoreByGoal:(gIndex)=>getScoreByGoal(gIndex),
        reset:()=>_reset()
    }
};