import {players} from "../model";
import {div} from "../components";
const {render,html} = lighterhtml;
export const title=(subTitle,sub2Title)=> html`
    <div class="menu top-menu">
        <img src="king.jpg" alt="king"/>
        <h3 class="title">Le Bombu</h3>
        <h5 class="subtitle">${subTitle}</h5>
    </div>
    ${sub2Title?div({content:sub2Title,class:"sub2Title"}):''}
`;
export const data=(rowType,gIndex,pIndex)=> ({rowType:rowType,gIndex:gIndex,pIndex:pIndex});
export const tr=(content)=>({content:content});
export const td=(content,rowType,pIndex,gIndex,onclick,css)=>
    ({
        content:html`${div({
            data:data(rowType,gIndex,pIndex),
            content:content,
            onclick:onclick,
            class:css
        })}`
    });
export const THEAD=()=>(
    {content:[{content:['', ...players].map(ctd=>td(ctd,"header",-1,-1))}]}
);