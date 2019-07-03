export const EVENT=(type,data)=>({type,data});
const pageListener=(listener,pageNum)=>(args)=> listener(pageNum,args);
const functionList=(listener,registrar,sharedData)=>registrar.map((r,index)=>r(pageListener(listener,index),sharedData));
const htmlList=(fList)=>fList.map(f=>f());
const update=(htmlList,functionList,render)=>(pageNum,args)=>
    (pageNum===undefined)
        ? render(functionList[0](args))
        : render(functionList[pageNum](args));
export const register=(sharedData,listener,registrar, render)=>{
    let _functionList=functionList(listener,registrar,sharedData);
    return update(htmlList(_functionList),_functionList, render);
};
