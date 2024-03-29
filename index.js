(function () {
    'use strict';

    const fillArray=(num, fill)=>Array(num).fill(fill);

    //
    const PLIS='Plis';
    const COEURS='Coeurs';
    const DAMES='Dames';
    const ROI='Roi coeur';
    const REUSSITE='Réussite';
    const TRAFALGAR='Trafalgar';
    const _goals=[
        [PLIS,8,5,1],
        [COEURS,8,5,1],
        [DAMES,4,15,1],
        [ROI,1,70,1],
        [REUSSITE,2,[-100,-50],0],
        [TRAFALGAR,0,0,0]
    ];

    const players=['ben','sev','sss','tit'];
    const countZero=(resultList)=>resultList.reduce((a,c)=> (c===0)?a+1:a,0);
    const sum=(trickList)=>trickList.reduce((a,c)=>a+c);
    const trafalgarGoalIndexes=()=> {
        return _goals.reduce((a,c,i)=> c[3]===1?a.concat(i):a,[]);
    };
    const checkTrickList=(trickList)=> {
        let valid=true;
        trickList.forEach(goal => {
            if (valid) valid=checkTrickList_unitary(goal.gIndex,goal.tricks);
        });
        return valid;
    };
    const checkTrickList_unitary=(gIndex, trickPerPlayer)=> {
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
            });
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

    const states=(num,test)=> {
        const getTotalScoreByPlayer=()=> {
            let total=fillArray(players.length,0);
            lScores.forEach(player=>player.forEach(goal=>goal.forEach((score,pgIndex)=>total[pgIndex]+=score)));
            return total;
        };
        const getScoreByGoal=(gIndex)=> {
            let total=fillArray(players.length,0);
            lScores.forEach(player=>{
                player.forEach((goal,index)=>{
                    if (index===gIndex) goal.forEach((score,index)=>total[index]+=score);
                });
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
                if (isOver && !done) isOver=false;}
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
            isDone:(pIndex, gIndex)=>lDone[pIndex][gIndex]===1,
            add : (pIndex,gIndex,trickList)=>addTricks(pIndex,gIndex,trickList),
            getDoneList:(gIndex)=>fillArray(num).map((item, pIndex)=>lDone[pIndex][gIndex]),
            getScoreList:(pIndex, gIndex)=>lScores[pIndex][gIndex],
            getTotalScoreByPlayer:()=>getTotalScoreByPlayer(),
            getScoreByGoal:(gIndex)=>getScoreByGoal(gIndex),
            reset:()=>_reset()
        }
    };

    const {render,html} = lighterhtml;


    const td=(model)=>html`${model.content.map(
    tr=>html`<tr>${tr.content.map(
        x=>html`<td onclick=${x.onclick} data=${x.data}>${x.content}</td>`)}</tr>`)}`;
    const th=(model)=>html`${model.content.map(
    tr=>html`<tr>${tr.content.map(
        x=>html`<th onclick=${x.onclick} data=${x.data}>${x.content}</th>`)}</tr>`)}`;
    const thead=(model) =>html`<thead>${th(model)}</thead>`;
    const tfoot=(model)=>html`<tfoot>${th(model)}</tfoot>`;
    const tbody=(model)=>html`<tbody>${td(model)}</tbody>`;
    const table = (model)=> {
        const _thead=model.thead?thead(model.thead):'';
        const _tfoot=model.tfoot?tfoot(model.tfoot):'';
        const _tbody=model.tbody?tbody(model.tbody):'';
        return html`
        <table style=${model.style}>
        <caption>${model.caption}</caption>
        ${_thead}
        ${_tbody}
        ${_tfoot}
        </table>`;
    };

    const button=(model)=>html`<button class="${model.class}" disabled=${model.disabled} data=${model.data} onclick=${model.onclick}>${model.content}</button>`;
    const div=(model)=> html`<div class=${model.class} data=${model.data} onclick=${model.onclick}>${model.content}</div>`;

    const {render: render$1,html: html$1} = lighterhtml;
    const pages=(pageIndex,htmlList,cssClass, style)=> htmlList.map((h,index)=>
        html$1`<div class="${cssClass}" style=${[pageIndex===index?'display:block':'display:none',style].join(";")}>${h}</div>`);
    const EVENT=(type,data)=>({type,data});
    const listener=(pageNum)=>(args)=> _listener(pageNum,args);
    const functionList=(registrar,sharedData)=>registrar.map((item,index)=>item(listener(index),sharedData));
    const htmlList=(fList)=>fList.map(f=>f());
    const update=(pageNum,args)=> {
        if (pageNum===undefined)
            pageNum=0;
        else
            _htmlList[pageNum]=_functionList[pageNum](args);
        render$1(
            _selector,
            ()=>html$1`${pages(pageNum,_htmlList,_cssClass, _style)}`
        );
    };
    const register=(sharedData,listener,registrar,selector, cssClass, style)=>{
        _cssClass=cssClass;
        _style=style;
        _listener=listener;
        _selector=selector;
        _functionList=functionList(registrar,sharedData);
        _htmlList=htmlList(_functionList);
        return update;
    };
    let _functionList,
        _htmlList,
        _cssClass,
        _style,
        _selector,
        _listener;

    const {render: render$2,html: html$2} = lighterhtml;
    const title=(subTitle,sub2Title)=> html$2`
    <div class="menu top-menu">
        <img src="king.jpg" alt="king"/>
        <h3 class="title">El Bombu</h3>
        <h5 class="subtitle">${subTitle}</h5>
    </div>
    ${sub2Title?div({content:sub2Title,class:"sub2Title"}):''}
`;
    const data=(rowType,gIndex,pIndex)=> ({rowType:rowType,gIndex:gIndex,pIndex:pIndex});
    const tr=(content)=>({content:content});
    const td$1=(content,rowType,pIndex,gIndex,onclick,css)=>
        ({
            content:html$2`${div({
            data:data(rowType,gIndex,pIndex),
            content:content,
            onclick:onclick,
            class:css
        })}`
        });
    const THEAD=()=>(
        {content:[{content:['', ...players].map(ctd=>td$1(ctd,"header",-1,-1))}]}
    );

    const {render: render$3,html: html$3} = lighterhtml;
    const E_DONE=0;
    const E_NOT_DONE=1;
    const E_ALL=2;
    const E_RESET=2;
    const doneCss=(rowIndex,gIndex,states)=> rowIndex===0?"" :states.isDone(rowIndex-1,gIndex)?"circle":"empty";
    const fillCell=(ctd,pIndex,gIndex,states)=>ctd===0 && !states.isDone(pIndex,gIndex) ?'\xa0':ctd;
    const getBody=(players,goals, states)=> {
        const table=()=> {
                let bodyContent=[];
                goals.map((goal,_gIndex) => [goal[0], ...states.getScoreByGoal(_gIndex)]).forEach((row, gIndex) => {
                    bodyContent.push(
                        tr(row.map((ctd,rowIndex)=>td$1(fillCell(ctd,rowIndex-1,gIndex,mStates),"main",rowIndex-1,gIndex,onclick,doneCss(rowIndex,gIndex,mStates))))
                    );
                });

            return bodyContent;
        };
        return {
            table:()=>table(),
        }
    };
    const messageOver=(btnModel)=>html$3`<div style="text-align: right">Partie Terminée ${button(btnModel)}</div>`;

    const onclick=event=> {
        let data=event.target.data;
        if (data==='reset') {
            _listener$1(EVENT(E_RESET, null));
        } else if (data.pIndex===-1) {
            if (data.rowType==='main') _listener$1(EVENT(E_ALL, data));
        } else {
            if (data.rowType === 'main') {
                if (mStates.isDone(data.pIndex, data.gIndex)) {
                    _listener$1(EVENT(E_DONE, data));
                } else {
                    _listener$1(EVENT(E_NOT_DONE, data));
                }
            }
        }
    };
    const model=(mStates)=> ({
        tbody:{content:getBody(players,_goals,mStates).table()},
        thead:THEAD(),
        tfoot: {content:[tr(['Total', ...mStates.getTotalScoreByPlayer()].map(ctd=>td$1(ctd,"footer",-1,-1)))]}
    });
    const update$1=(event)=> {
        const mButtonOver= {
            onclick:onclick,
            data:'reset',
            content:'REJOUER',
            class:'button'
        };
        return html$3`
        ${title("Scores")}
        ${mStates.isOver()?messageOver(mButtonOver):''}
        ${table(model(mStates))}
    `;
    };

    let mStates;
    let _listener$1,_sharedData;
    const register$1=(listener, sharedData)=> {
        _listener$1=listener;
        _sharedData=sharedData;
        mStates=_sharedData.state;
        return update$1;
    };

    const {render: render$4,html: html$4} = lighterhtml;
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
        onclick:onclick$1
    });
    const getBodyContent=(gIndex)=>{
        let bodyContent=[];
        if (_goals[gIndex][0]===TRAFALGAR) {
            bodyContent.push(...trafalgarModel());
        } else {
            bodyContent.push(tr(goalModel(gIndex)));
        }
        return bodyContent;
    };
    const E1_SCORE=0;
    const E1_VALIDER=1;
    const E1_ANNULER=2;
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
            }
        } else if (!isCompleted_unitary(gIndex)) {
            tricks[pgIndex]++;
        } else {
            tricks[pgIndex]=0;
        }
    };
    const onclick$1=(event)=> {
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
        _listener$2(EVENT(type,transfer));
    };
    const update$2=(args)=>{
        if (!args) return html$4``;
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
        return html$4`
        ${title("Saisie",_goals[gIndex][0]+" annoncé par "+players[pIndex])}
        ${table(
            {
                tbody:{content:getBodyContent(gIndex)},
                thead:THEAD()
            }
        )}
        <div class="menu bottom-menu">
            <button class="button button-cancel" data=${'annuler'} onclick=${onclick$1}>Annuler</button>
            <button class=${bClass} data=${'valider'} onclick=${onclick$1} disabled=${!isCompleted_all()}>Valider</button>
        </div>
        <div style="font-size:12px;margin-right:10px">version 1.41</div>
    `;
    };
    let gIndex,pIndex;
    let trickList;
    let _listener$2;
    const register$2=(listener, sharedData)=> {
        _listener$2=listener;
        return update$2;
    };

    const listener$1=(pageNum,args)=> {
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
        listener$1,
        [register$1,register$2],
        document.getElementById("app")
    );
    updater();

}());
