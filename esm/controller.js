const {render,html} = lighterhtml;
const pages=(pageIndex,htmlList,cssClass, style)=> htmlList.map((h,index)=>
    html`<div class="${cssClass}" style=${[pageIndex===index?'display:block':'display:none',style].join(";")}>${h}</div>`);
export const EVENT=(type,data)=>({type,data});
const listener=(pageNum)=>(args)=> _listener(pageNum,args);
const functionList=(registrar,sharedData)=>registrar.map((item,index)=>item(listener(index),sharedData));
const htmlList=(fList)=>fList.map(f=>f());
const update=(pageNum,args)=> {
    if (pageNum===undefined)
        pageNum=0;
    else
        _htmlList[pageNum]=_functionList[pageNum](args);
    render(
        _selector,
        ()=>html`${pages(pageNum,_htmlList,_cssClass, _style)}`
    );
};
export const register=(sharedData,listener,registrar,selector, cssClass, style)=>{
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

