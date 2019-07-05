let registrar = new Map(), reg;
const l=(id)=>(data)=>reg.listener(id,data);
const updateView=(id, data)=> reg.render(registrar.get(id)(data));
export const initRegistry=(model, listener, render, access)=> {
    if (!reg) {
        reg={model,listener,render,access};
        return updateView;
    }
};
export const register=(id, updater)=> {
    registrar.set(id,updater);
    return ()=>({
        sharedData:reg.access && reg.access(id)
            ?filterModel(reg.model,reg.access(id))
            :reg.model,
        listener:l(id)
    });
};
// todo : propose it as a separated feature
export const filterModel = (model,keyAllowed)=> Object.keys(model)
    .filter(key => keyAllowed.includes(key))
    .reduce((obj, key) => {
        obj[key] = model[key];
        return obj;
    }, {});