export const EVENT=(type,data)=>({type,data});
const pageListener=(listener,pageIndex)=>(event)=> listener(pageIndex,event);
const functionList=(listener,registrar,sharedData)=>registrar.map((r,index)=>r(pageListener(listener,index),sharedData));
const htmlList=(fList)=>fList.map(f=>f());
const update=(htmlList,functionList,render)=>(pageIndex,event)=>render(functionList[pageIndex](event));
export const register=(sharedData,listener,registrar, render)=>{
    let _functionList=functionList(listener,registrar,sharedData);
    return update(htmlList(_functionList),_functionList, render);
};