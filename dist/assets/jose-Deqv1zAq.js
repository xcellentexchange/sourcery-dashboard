new TextEncoder;const a=new TextDecoder,d=t=>{const e=atob(t),r=new Uint8Array(e.length);for(let o=0;o<e.length;o++)r[o]=e.charCodeAt(o);return r},i=t=>{let e=t;e instanceof Uint8Array&&(e=a.decode(e)),e=e.replace(/-/g,"+").replace(/_/g,"/").replace(/\s/g,"");try{return d(e)}catch{throw new TypeError("The input to be decoded is not correctly encoded.")}};class l extends Error{static get code(){return"ERR_JOSE_GENERIC"}constructor(e){var r;super(e),this.code="ERR_JOSE_GENERIC",this.name=this.constructor.name,(r=Error.captureStackTrace)===null||r===void 0||r.call(Error,this,this.constructor)}}class c extends l{constructor(){super(...arguments),this.code="ERR_JWT_INVALID"}static get code(){return"ERR_JWT_INVALID"}}function u(t){return typeof t=="object"&&t!==null}function h(t){if(!u(t)||Object.prototype.toString.call(t)!=="[object Object]")return!1;if(Object.getPrototypeOf(t)===null)return!0;let e=t;for(;Object.getPrototypeOf(e)!==null;)e=Object.getPrototypeOf(e);return Object.getPrototypeOf(t)===e}const p=i;function y(t){if(typeof t!="string")throw new c("JWTs must use Compact JWS serialization, JWT must be a string");const{1:e,length:r}=t.split(".");if(r===5)throw new c("Only JWTs using Compact JWS serialization can be decoded");if(r!==3)throw new c("Invalid JWT");if(!e)throw new c("JWTs must contain a payload");let o;try{o=p(e)}catch{throw new c("Failed to base64url decode the payload")}let n;try{n=JSON.parse(a.decode(o))}catch{throw new c("Failed to parse the decoded payload as JSON")}if(!h(n))throw new c("Invalid JWT Claims Set");return n}export{y as d};