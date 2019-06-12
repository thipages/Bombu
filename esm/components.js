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
export const table = (model)=> {
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

export const button=(model)=>html`<button disabled=${model.disabled} data=${model.data} onclick=${model.onclick}>OK</button>`
export const div=(model)=> html`<div class=${model.class} data=${model.data} onclick=${model.onclick}>${model.content}</div>`;
export const input=()=>html`<input size="2" />`;
export const span=(model)=>html`<span class=${model.class}>${model.content}</span>`;