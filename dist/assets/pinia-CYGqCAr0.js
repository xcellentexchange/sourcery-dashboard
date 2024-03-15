import{V as F,r as H,W as B,X as G,i as $,t as D,C as x,Y as L,l as A,b as T,k as tt,R as et,S as st,n as nt,Z as ot,a as ct}from"./@vue-DfHtGlmf.js";var rt=!1;/*!
 * pinia v2.1.6
 * (c) 2023 Eduardo San Martin Morote
 * @license MIT
 */let J;const p=t=>J=t,N=Symbol();function E(t){return t&&typeof t=="object"&&Object.prototype.toString.call(t)==="[object Object]"&&typeof t.toJSON!="function"}var k;(function(t){t.direct="direct",t.patchObject="patch object",t.patchFunction="patch function"})(k||(k={}));function bt(){const t=F(!0),n=t.run(()=>H({}));let s=[],e=[];const r=B({install(u){p(r),r._a=u,u.provide(N,r),u.config.globalProperties.$pinia=r,e.forEach(a=>s.push(a)),e=[]},use(u){return!this._a&&!rt?e.push(u):s.push(u),this},_p:s,_a:null,_e:t,_s:new Map,state:n});return r}const X=()=>{};function V(t,n,s,e=X){t.push(n);const r=()=>{const u=t.indexOf(n);u>-1&&(t.splice(u,1),e())};return!s&&et()&&st(r),r}function P(t,...n){t.slice().forEach(s=>{s(...n)})}const ut=t=>t();function I(t,n){t instanceof Map&&n instanceof Map&&n.forEach((s,e)=>t.set(e,s)),t instanceof Set&&n instanceof Set&&n.forEach(t.add,t);for(const s in n){if(!n.hasOwnProperty(s))continue;const e=n[s],r=t[s];E(r)&&E(e)&&t.hasOwnProperty(s)&&!x(e)&&!L(e)?t[s]=I(r,e):t[s]=e}return t}const ft=Symbol();function at(t){return!E(t)||!t.hasOwnProperty(ft)}const{assign:v}=Object;function it(t){return!!(x(t)&&t.effect)}function lt(t,n,s,e){const{state:r,actions:u,getters:a}=n,f=s.state.value[t];let g;function b(){f||(s.state.value[t]=r?r():{});const y=ot(s.state.value[t]);return v(y,u,Object.keys(a||{}).reduce((_,d)=>(_[d]=B(ct(()=>{p(s);const m=s._s.get(t);return a[d].call(m,m)})),_),{}))}return g=Y(t,b,n,s,e,!0),g}function Y(t,n,s={},e,r,u){let a;const f=v({actions:{}},s),g={deep:!0};let b,y,_=[],d=[],m;const j=e.state.value[t];!u&&!j&&(e.state.value[t]={}),H({});let W;function O(c){let o;b=y=!1,typeof c=="function"?(c(e.state.value[t]),o={type:k.patchFunction,storeId:t,events:m}):(I(e.state.value[t],c),o={type:k.patchObject,payload:c,storeId:t,events:m});const h=W=Symbol();nt().then(()=>{W===h&&(b=!0)}),y=!0,P(_,o,e.state.value[t])}const Z=u?function(){const{state:o}=s,h=o?o():{};this.$patch(S=>{v(S,h)})}:X;function q(){a.stop(),_=[],d=[],e._s.delete(t)}function z(c,o){return function(){p(e);const h=Array.from(arguments),S=[],C=[];function Q(i){S.push(i)}function U(i){C.push(i)}P(d,{args:h,name:c,store:l,after:Q,onError:U});let R;try{R=o.apply(this&&this.$id===t?this:l,h)}catch(i){throw P(C,i),i}return R instanceof Promise?R.then(i=>(P(S,i),i)).catch(i=>(P(C,i),Promise.reject(i))):(P(S,R),R)}}const K={_p:e,$id:t,$onAction:V.bind(null,d),$patch:O,$reset:Z,$subscribe(c,o={}){const h=V(_,c,o.detached,()=>S()),S=a.run(()=>T(()=>e.state.value[t],C=>{(o.flush==="sync"?y:b)&&c({storeId:t,type:k.direct,events:m},C)},v({},g,o)));return h},$dispose:q},l=tt(K);e._s.set(t,l);const M=e._a&&e._a.runWithContext||ut,w=e._e.run(()=>(a=F(),M(()=>a.run(n))));for(const c in w){const o=w[c];if(x(o)&&!it(o)||L(o))u||(j&&at(o)&&(x(o)?o.value=j[c]:I(o,j[c])),e.state.value[t][c]=o);else if(typeof o=="function"){const h=z(c,o);w[c]=h,f.actions[c]=o}}return v(l,w),v(D(l),w),Object.defineProperty(l,"$state",{get:()=>e.state.value[t],set:c=>{O(o=>{v(o,c)})}}),e._p.forEach(c=>{v(l,a.run(()=>c({store:l,app:e._a,pinia:e,options:f})))}),j&&u&&s.hydrate&&s.hydrate(l.$state,j),b=!0,y=!0,l}function vt(t,n,s){let e,r;const u=typeof n=="function";typeof t=="string"?(e=t,r=u?s:n):(r=t,e=t.id);function a(f,g){const b=G();return f=f||(b?$(N,null):null),f&&p(f),f=J,f._s.has(e)||(u?Y(e,n,r,f):lt(e,r,f)),f._s.get(e)}return a.$id=e,a}function yt(t){{t=D(t);const n={};for(const s in t){const e=t[s];(x(e)||L(e))&&(n[s]=A(t,s))}return n}}export{bt as c,vt as d,yt as s};