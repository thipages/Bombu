const pageListener=(listener,pageIndex)=>(event)=> listener(pageIndex,event);
const functionList=(listener,registrar,sharedData)=>registrar.map((r,index)=>r(pageListener(listener,index),sharedData));
const update=(functionList,render)=>(pageIndex,event)=>render(functionList[pageIndex](event));
export const EVENT=(type,data)=>({type,data});
export const register=(sharedData,listener,registrar, render)=>update(functionList(listener,registrar,sharedData),render);