import{T as f,u}from"./useBarcode-6DtCM5Xe.js";import{Z as h,r as c,w as g,f as m,g as _,j as e,m as x,A as l,M as w,x as y,H as k}from"./@vue-DfHtGlmf.js";import"./bwip-js-dFbEy5mF.js";const b={class:k(["h-[1.5in] w-[1.5in]","flex flex-col items-stretch rounded bg-white p-2 shadow-sm ring-1 ring-black ring-opacity-5","break-after-page gap-2 last:break-after-avoid print:my-0 print:border-none print:shadow-none print:ring-0"])},B={class:"grid w-full grid-cols-12 justify-center gap-1"},j={class:"col-span-5 flex flex-col items-start justify-between gap-0.5"},v=e("h1",{class:"text-left text-[0.48rem] font-bold leading-tight tracking-tighter"},"Scan with the Transparency app",-1),S={class:"flex flex-grow flex-col items-center justify-between gap-2 text-center"},T={class:"flex w-full flex-col gap-1"},C={class:"max-h-1/2 line-clamp-4 flex items-center justify-center text-[0.5rem]"},E={class:"truncate"},N={class:"ml-auto whitespace-nowrap text-[0.5rem]"},D={__name:"TransparencyTemplateSmall",props:{code:String,product:Object,label:Object},setup(i){const p=i,{generateBarcode:s}=u(),{code:d,product:a,label:O}=h(p),n=c(null),o=c(null);return g(async()=>{const t=d.value,r=a.value.fnsku;s({el:o.value,type:"code128",code:r,options:{height:8}}),t&&s({el:n.value,type:"datamatrix",code:t,options:{width:12.7,height:12.7,padding:1}})}),(t,r)=>(m(),_("div",b,[e("section",B,[e("header",j,[x(l(f),{class:"w-8"}),v]),e("span",{class:"col-span-7 flex-grow self-start",ref_key:"transparencyBarcode",ref:n},null,512)]),e("section",S,[e("span",T,[e("span",{class:"w-full px-1",ref_key:"fnskuBarcode",ref:o},null,512),e("p",C,[e("span",E,w(l(a).sku),1),e("span",N,[y(t.$slots,"identifier")])])])])]))}};export{D as default};
