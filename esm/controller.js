const {render,html} = lighterhtml;
const pages=(pageIndex,htmlList,cssClass, style)=> htmlList.map((h,index)=>
    html`<div class="${cssClass}" style=${[pageIndex===index?'display:block':'display:none',style].join(";")}>${h}</div>`);
export const EVENT=(type,data)=>({type,data});
const pageListener=(listener,pageNum)=>(args)=> listener(pageNum,args);
const functionList=(listener,registrar,sharedData)=>registrar.map((item,index)=>item(pageListener(listener,index),sharedData));
const htmlList=(fList)=>fList.map(f=>f());
const update=(htmlList,functionList,selector, cssClass, style)=>(pageNum,args)=> {
    if (pageNum===undefined)
        pageNum=0;
    else
        htmlList[pageNum]=functionList[pageNum](args);
    render(
        selector,
        ()=>html`${pages(pageNum,htmlList,cssClass, style)}`
    );
};
export const register=(sharedData,listener,registrar,selector, cssClass, style)=>{
    let _functionList=functionList(listener,registrar,sharedData);
    return update(htmlList(_functionList),_functionList,selector, cssClass, style);
};
