import{_ as u,u as f,s as p,c as t,a as e,b as a,F as i,i as c,h,e as v,t as r,o}from"./index.224dd6bb.js";import x from"./GoogleIcon.f50e3be3.js";const y={class:"flex h-screen items-center justify-center bg-slate-50 pt-16"},g={class:"flex w-auto max-w-4xl flex-1 rounded-xl bg-white py-8 px-8 shadow-sm"},w={class:"w-full divide-y divide-gray-200"},k={class:"w-full space-y-1"},V=e("h3",{class:"text-lg font-medium leading-6 text-slate-900"},"Profile",-1),b={class:"flex max-w-2xl items-center text-sm text-slate-500"},P=["href"],N={class:"mt-6"},j={class:"divide-y divide-gray-200"},B={class:"text-sm font-medium text-slate-500"},S={class:"mt-1 flex justify-end text-sm text-slate-900 sm:col-span-2 sm:mt-0"},U=["src","alt"],D={key:1},E={__name:"ProfileView",setup(F){const n=f(),{profile:s}=p(n),d=[{title:"Name",value:`${s.value.first_name} ${s.value.last_name}`},{title:"Email",value:s.value.email},{title:"Photo",value:s.value.picture}];return(_,T)=>(o(),t("div",y,[e("div",g,[e("div",w,[e("div",k,[V,e("p",b,[a(s).iss==="https://accounts.google.com"?(o(),t(i,{key:0},[c("Your profile information is provided by "),e("a",{href:a(s).iss,target:"_blank"},[h(a(x),{class:"ml-1 inline h-4 w-4"})],8,P)],64)):(o(),t(i,{key:1},[c("View or update your information.")],64))])]),e("div",N,[e("dl",j,[(o(),t(i,null,v(d,(l,m)=>e("div",{key:m,class:"items-center py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5"},[e("dt",B,r(l.title),1),e("dd",S,[l.title==="Photo"?(o(),t("img",{key:0,class:"h-12 w-12 rounded-full",src:a(s).picture,alt:a(s).name,referrerpolicy:"no-referrer"},null,8,U)):(o(),t("span",D,r(l.value),1))])])),64))])])])]),e("pre",null,r(_.retrievedUser),1)]))}};var G=u(E,[["__file","/Users/jason/Documents/Code/sourcery-dashboard/src/views/ProfileView.vue"]]);export{G as default};
