(this["webpackJsonpreact-response"]=this["webpackJsonpreact-response"]||[]).push([[0],{14:function(e,t,n){},15:function(e,t,n){},16:function(e,t,n){"use strict";n.r(t);var c=n(0),r=n(1),i=n.n(r),o=n(8),a=n.n(o),l=(n(14),n(15),n(2));function s(e){var t=Object(r.useRef)(null),n=e.text,i=e.click,o=e.keyname;return Object(r.useEffect)((function(){var e,n,c=t.current;function r(){n=setInterval(i,60)}function o(t){c.setPointerCapture(t.pointerId),e=setTimeout(r,250),i()}function a(t){c.releasePointerCapture(t.pointerId),clearTimeout(e),clearInterval(n)}return c.addEventListener("pointerdown",o),c.addEventListener("pointerup",a),function(){c.removeEventListener("pointerdown",o),c.removeEventListener("pointerup",a)}}),[]),Object(c.jsxs)("div",{ref:t,className:"button",role:"button",children:[""!==n?n+" ":"",Object(c.jsx)("span",{className:"keyname",children:o})]})}function u(e){var t=Object(r.useRef)(null),n=e.text,i=e.click,o=e.keyname;return Object(c.jsxs)("div",{ref:t,className:"button",role:"button",onClick:i,children:[""!==n?n+" ":"",Object(c.jsx)("span",{className:"keyname",children:o})]})}function v(e){var t=Object(r.useRef)(null),n=e.text,i=e.click,o=e.keyname,a=e.compare;return Object(c.jsxs)("div",{ref:t,className:"button toggle ".concat(a?"active":""),role:"button",onClick:i,children:[""!==n?n+" ":"",Object(c.jsx)("span",{className:"keyname",children:o})]})}var d=n(3),j=n(4);function b(e,t,n){var c=t[0],r=t[1],i=t[2],o=t[3],a=t[4],l=t[5],s=t[6],u=t[7],v=t[8],d=t[9],j=t[10],b=t[11],f=t[12],m=t[13],h=t[14],p=t[15],w=n[0],x=n[1],O=n[2],g=n[3];return e[0]=w*c+x*a+O*v+g*f,e[1]=w*r+x*l+O*d+g*m,e[2]=w*i+x*s+O*j+g*h,e[3]=w*o+x*u+O*b+g*p,w=n[4],x=n[5],O=n[6],g=n[7],e[4]=w*c+x*a+O*v+g*f,e[5]=w*r+x*l+O*d+g*m,e[6]=w*i+x*s+O*j+g*h,e[7]=w*o+x*u+O*b+g*p,w=n[8],x=n[9],O=n[10],g=n[11],e[8]=w*c+x*a+O*v+g*f,e[9]=w*r+x*l+O*d+g*m,e[10]=w*i+x*s+O*j+g*h,e[11]=w*o+x*u+O*b+g*p,w=n[12],x=n[13],O=n[14],g=n[15],e[12]=w*c+x*a+O*v+g*f,e[13]=w*r+x*l+O*d+g*m,e[14]=w*i+x*s+O*j+g*h,e[15]=w*o+x*u+O*b+g*p,e}function f(e,t,n,c){var r,i,o,a,l,s,u,v,d,j,b=t[0],f=t[1],m=t[2],h=c[0],p=c[1],w=c[2],x=n[0],O=n[1],g=n[2];return Math.abs(b-x)<1e-6&&Math.abs(f-O)<1e-6&&Math.abs(m-g)<1e-6?function(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}(e):(u=b-x,v=f-O,d=m-g,r=p*(d*=j=1/Math.sqrt(u*u+v*v+d*d))-w*(v*=j),i=w*(u*=j)-h*d,o=h*v-p*u,(j=Math.sqrt(r*r+i*i+o*o))?(r*=j=1/j,i*=j,o*=j):(r=0,i=0,o=0),a=v*o-d*i,l=d*r-u*o,s=u*i-v*r,(j=Math.sqrt(a*a+l*l+s*s))?(a*=j=1/j,l*=j,s*=j):(a=0,l=0,s=0),e[0]=r,e[1]=a,e[2]=u,e[3]=0,e[4]=i,e[5]=l,e[6]=v,e[7]=0,e[8]=o,e[9]=s,e[10]=d,e[11]=0,e[12]=-(r*b+i*f+o*m),e[13]=-(a*b+l*f+s*m),e[14]=-(u*b+v*f+d*m),e[15]=1,e)}function m(e,t){var n=t[0],c=t[1],r=t[2],i=t[3],o=t[4],a=t[5],l=t[6],s=t[7],u=t[8],v=t[9],d=t[10],j=t[11],b=t[12],f=t[13],m=t[14],h=t[15],p=n*a-c*o,w=n*l-r*o,x=n*s-i*o,O=c*l-r*a,g=c*s-i*a,y=r*s-i*l,_=u*f-v*b,k=u*m-d*b,M=u*h-j*b,E=v*m-d*f,S=v*h-j*f,C=d*h-j*m,L=p*C-w*S+x*E+O*M-g*k+y*_;return L?(L=1/L,e[0]=(a*C-l*S+s*E)*L,e[1]=(r*S-c*C-i*E)*L,e[2]=(f*y-m*g+h*O)*L,e[3]=(d*g-v*y-j*O)*L,e[4]=(l*M-o*C-s*k)*L,e[5]=(n*C-r*M+i*k)*L,e[6]=(m*x-b*y-h*w)*L,e[7]=(u*y-d*x+j*w)*L,e[8]=(o*S-a*M+s*_)*L,e[9]=(c*M-n*S-i*_)*L,e[10]=(b*g-f*x+h*p)*L,e[11]=(v*x-u*g-j*p)*L,e[12]=(a*k-o*E-l*_)*L,e[13]=(n*E-c*k+r*_)*L,e[14]=(f*w-b*O-m*p)*L,e[15]=(u*O-v*w+d*p)*L,e):null}function h(e,t){var n=e[0],c=e[1],r=e[2],i=e[3],o=e[4],a=e[5],l=e[6],s=e[7],u=e[8],v=e[9],d=e[10],j=e[11],b=e[12],f=e[13],m=e[14],h=e[15],p=t[0],w=t[1],x=t[2],O=t[3];return[p*n+w*o+x*u+O*b,p*c+w*a+x*v+O*f,p*r+w*l+x*d+O*m,p*i+w*s+x*j+O*h]}function p(e,t,n,c){var r=Math.floor(t.width/n),i=Math.floor(t.height/c);e.viewports=[];for(var o=0;o<c;o++)for(var a=0;a<n;a++)e.viewports.push([a*r,o*i,r,i])}function w(e){var t=e.viewports[0][2],n=e.viewports[0][3];!function(e,t,n,c,r){var i=1/Math.tan(t/2),o=1/(c-r);e[0]=i/n,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=i,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=(r+c)*o,e[11]=-1,e[12]=0,e[13]=0,e[14]=2*r*c*o,e[15]=0}(e.projection,Math.PI/3,t/n,.01,100),m(e.inverse_projection,e.projection)}function x(e){return[e[0],e[1],0]}function O(e){for(var t=0;t<e.cameras.length;t++){var n=e.cameras[t];f(e.views[t],n,x(n),[0,1,0]),b(e.view_projections[t],e.projection,e.views[t]),m(e.inverse_view_projections[t],e.view_projections[t])}}function g(e,t,n){var c=function(e,t){var n=h(e.projection,[0,0,t,1]);return n[2]/n[3]}(e,-n),r=[2*t/e.viewports[0][2],0,c,1],i=h(e.inverse_projection,r);return i[0]/i[3]}function y(e,t){var n,c=e.$render,r=Object(j.a)(t);try{for(r.s();!(n=r.n()).done;){var i=n.value,o=Object(l.a)(e.viewports[i],4),a=o[0],s=o[1],u=o[2],v=o[3],d=e.cameras[i],b=s+v/2,f=a+u/2-c.width/2,m=b-c.height/2,h=g(e,f,d[2]),p=g(e,m,d[2]);e.cameras[i][0]=h,e.cameras[i][1]=p}}catch(w){r.e(w)}finally{r.f()}}function _(e,t,n){var c,r=e.all_active,i=Object(j.a)(r);try{for(i.s();!(c=i.n()).done;){var o=c.value,a=(e.viewports[o],e.cameras[o]),l=g(e,8*t,a[2]),s=g(e,8*n,a[2]);e.cameras[o][0]+=l,e.cameras[o][1]+=s}}catch(u){i.e(u)}finally{i.f()}}function k(e,t,n,c){var r=e.viewports[t],i=function(e,t,n){var c=h(e.view_projections[t],[0,0,n,1]);return c[2]/c[3]}(e,t,c),o=function(e,t){return[(t[0]-e[0])/e[2]*2-1,(t[1]-e[1])/e[3]*2-1]}(r,n),a=[o[0],o[1],i,1],l=h(e.inverse_view_projections[t],a);return[l[0]/l[3],l[1]/l[3]]}function M(e){return Math.min(100,Math.max(.01,e))}function E(e,t){var n,c=e.all_active,r=Object(j.a)(c);try{for(r.s();!(n=r.n()).done;){var i=n.value,o=e.cameras[i][2],a=M(1===t?1.125*e.cameras[i][2]:e.cameras[i][2]/1.125);if(a>o||a<o)if("canvas"===e.zoom_mode){var l=k(e,i,[e.width/2,e.height/2],a);e.cameras[i]=[].concat(Object(d.a)(l),[a])}else if("active"===e.zoom_mode){var s=e.viewports[e.active],u=k(e,i,[s[0]+s[2]/2,s[1]+s[3]/2],a);e.cameras[i]=[].concat(Object(d.a)(u),[a])}else"every"===e.zoom_mode&&(e.cameras[i][2]=a)}}catch(v){r.e(v)}finally{r.f()}}function S(e){var t,n=e.all_active,c=Object(j.a)(n);try{for(c.s();!(t=c.n()).done;){var r=t.value;e.cameras[r][0]+=1-2*Math.random(),e.cameras[r][1]+=1-2*Math.random()}}catch(i){c.e(i)}finally{c.f()}}function C(e){var t,n=e.all_active,c=Object(j.a)(n);try{for(c.s();!(t=c.n()).done;){var r=t.value;e.cameras[r][0]=0,e.cameras[r][1]=0}}catch(i){c.e(i)}finally{c.f()}}function L(e,t,n,c){return[[e,t],[n,t],[e,c],[e,c],[n,t],[n,c]]}function R(e,t,n,c,r,i){var o=e.regl;return o({frag:"\n    precision mediump float;\n    uniform vec4 color;\n    uniform sampler2D texture;\n    varying vec2 vuv;\n    void main () {\n      gl_FragColor = texture2D(texture, vuv);\n    }",vert:"\n    precision mediump float;\n    attribute vec2 position;\n    attribute vec2 uv;\n    varying vec2 vuv;\n    uniform mat4 view_projection;\n    void main () {\n      vuv = uv;\n      gl_Position = view_projection * vec4(position, 0, 1);\n    }",attributes:{position:L(n,c,r,i),uv:[[0,0],[1,0],[0,1],[0,1],[1,0],[1,1]]},uniforms:{texture:o.texture(t),color:[1,1,0,1],view_projection:o.prop("view_projection")},count:6})}function A(e,t,n){var c=new Image;c.onload=function(){var t=c.width*e.pixel,r=c.height*e.pixel,i=[-t/2,r/2,t/2,-r/2],o=e.images.length;e.images.push(c);var a=R.apply(void 0,[e,c].concat(i));e.imageDraws.push(a);for(var l=0;l<n.length;l++){var s=n[l];e.viewport_image_map[s]=o}},c.src=t}function z(e,t){t.addEventListener("change",(function n(c){var r,i=Object(j.a)(this.files);try{for(i.s();!(r=i.n()).done;){var o=r.value;if(o.name+"."+o.type,!(o.type.indexOf("image")<0)){var a=URL.createObjectURL(o);A(e,a,e.all_active),t.value=null}}}catch(l){i.e(l)}finally{i.f()}t.removeEventListener("change",n)})),t.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window}))}function I(e){return Object(c.jsx)("div",{style:{marginBottom:8},children:e.children.toUpperCase()})}function N(e){return Object(c.jsx)("div",{style:{marginBottom:8},children:e.children})}function P(){return Object(c.jsx)("div",{style:{width:"100%",height:8}})}function Z(){return Object(c.jsx)("div",{style:{width:"100%",height:4}})}var B=function(e){var t=e.scene,n=e.width,r=e.rows,i=e.cols,o=e.addCol,a=e.addRow,l=e.remCol,d=e.remRow,j=e.select_row,b=e.select_col,f=e.select_all,m=e.toggleSelectAll,h=e.toggleSelectCol,p=e.toggleSelectRow,w=e.clearSelections,x=e.zoom_mode,O=e.setZoomMode,g=e.setKeyboardActive,k=e.file_input;return Object(c.jsxs)("div",{id:"sidebar",style:{width:n},children:[Object(c.jsx)(I,{children:"Selections"}),Object(c.jsxs)("div",{children:[Object(c.jsx)(v,{text:"Column",keyname:"q",compare:b,click:h}),Object(c.jsx)(v,{text:"Row",keyname:"w",compare:j,click:p}),Object(c.jsx)(v,{text:"All",keyname:"e",compare:f,click:m}),Object(c.jsx)(s,{text:"Clear",keyname:"escape",click:w})]}),Object(c.jsx)(P,{}),Object(c.jsx)(Z,{}),Object(c.jsx)(I,{children:"Pan"}),Object(c.jsx)(N,{children:"Click and drag or use"}),Object(c.jsxs)("div",{children:[Object(c.jsx)(s,{text:"",keyname:"\u2190",click:_.bind(null,t,1,0)}),Object(c.jsx)(s,{text:"",keyname:"\u2193",click:_.bind(null,t,0,1)}),Object(c.jsx)(s,{text:"",keyname:"\u2191",click:_.bind(null,t,0,-1)}),Object(c.jsx)(s,{text:"",keyname:"\u2192",click:_.bind(null,t,-1,0)})]}),Object(c.jsx)(P,{}),Object(c.jsx)(Z,{}),Object(c.jsx)(I,{children:"Zoom"}),Object(c.jsx)(N,{children:"Use mousewheel or"}),Object(c.jsxs)("div",{children:[Object(c.jsx)(s,{text:"Zoom in",keyname:"+",click:E.bind(null,t,1)}),Object(c.jsx)(s,{text:"Zoom out",keyname:"-",click:E.bind(null,t,-1)})]}),Object(c.jsx)(P,{}),Object(c.jsx)(Z,{}),Object(c.jsx)(I,{children:"Zoom center"}),Object(c.jsxs)("div",{children:[Object(c.jsx)(v,{text:"Canvas",keyname:"z",compare:"canvas"===x,click:O.bind(null,"canvas")}),Object(c.jsx)(v,{text:"Active",keyname:"x",compare:"active"===x,click:O.bind(null,"active")}),Object(c.jsx)(v,{text:"Every",keyname:"c",compare:"every"===x,click:O.bind(null,"every")})]}),Object(c.jsx)(P,{}),Object(c.jsx)(Z,{}),Object(c.jsx)(I,{children:"Set Active"}),Object(c.jsx)(N,{children:"Move mouse, tap, or use"}),Object(c.jsx)(s,{text:"\u2190",keyname:"h",click:g.bind(null,-1,0)}),Object(c.jsx)(s,{text:"\u2193",keyname:"j",click:g.bind(null,0,1)}),Object(c.jsx)(s,{text:"\u2191",keyname:"k",click:g.bind(null,0,-1)}),Object(c.jsx)(s,{text:"\u2192",keyname:"l",click:g.bind(null,1,0)}),Object(c.jsx)(P,{}),Object(c.jsx)(Z,{}),Object(c.jsx)(I,{children:"Load image to selection"}),Object(c.jsx)(u,{text:"Load image",keyname:"o",click:z.bind(null,t,k)}),Object(c.jsx)(P,{}),Object(c.jsx)(Z,{}),Object(c.jsx)(I,{children:"More actions"}),Object(c.jsx)(s,{text:"Shake",keyname:"t",click:S.bind(null,t)}),Object(c.jsx)(s,{text:"Center",keyname:"y",click:C.bind(null,t)}),Object(c.jsx)(s,{text:"Relative Center",keyname:"u",click:y.bind(null,t,t.all_active)}),Object(c.jsx)(P,{}),Object(c.jsx)(Z,{}),Object(c.jsx)(I,{children:"Size"}),Object(c.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:[Object(c.jsx)("div",{style:{marginBottom:8,marginRight:8},children:"Cols:"}),Object(c.jsxs)("div",{children:[Object(c.jsx)(s,{text:"-",keyname:"f",click:l}),Object(c.jsx)(s,{text:"+",keyname:"g",click:o})]}),Object(c.jsx)("div",{style:{marginBottom:8},children:i})]}),Object(c.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:[Object(c.jsx)("div",{style:{marginBottom:8,marginRight:8},children:"Rows:"}),Object(c.jsxs)("div",{children:[Object(c.jsx)(s,{text:"-",keyname:"v",click:d}),Object(c.jsx)(s,{text:"+",keyname:"b",click:a})]}),Object(c.jsx)("div",{style:{marginBottom:8},children:r})]})]})};var F=function(e){var t=e.cols,n=e.rows,r=e.width,i=e.height,o=Math.floor(r/t),a=Math.floor(i/n);return Object(c.jsxs)("div",{children:[t>0?Object(d.a)(Array(t-1)).map((function(e,t){return Object(c.jsx)("div",{style:{pointerEvents:"none",position:"absolute",left:(t+1)*o-1,top:0,width:2,height:"100%",background:"rgba(100,100,100,0.5)"}},"col_".concat(t))})):null,n>0?Object(d.a)(Array(n-1)).map((function(e,t){return Object(c.jsx)("div",{style:{pointerEvents:"none",position:"absolute",left:0,top:(t+1)*a-1,height:2,width:"100%",background:"rgba(100,100,100,0.5)"}},"row_".concat(t))})):null]})};var D=function(e){var t=e.$render,n=e.scene,c=e.active,i=e.setActive,o=Object(r.useRef)({raw:[0,0],down:!1});return Object(r.useEffect)((function(){var e=o.current;function r(e){for(var t=Object(l.a)(e,2),c=t[0],r=t[1],i=0;i<n.viewports.length;i++){var o=n.viewports[i],a=Object(l.a)(o,4),s=a[0],u=a[1],v=a[2],d=a[3];if(c>=s&&c<=s+v&&r>=u&&r<=u+d)return i}}function a(t){var o=[t.clientX,t.clientY];if(e.down){var a=o[0]-e.raw[0],l=o[1]-e.raw[1];!function(e,t,n){var c,r=e.all_active,i=Object(j.a)(r);try{for(i.s();!(c=i.n()).done;){var o=c.value,a=(e.viewports[o],e.cameras[o]),l=g(e,t,a[2]),s=g(e,n,a[2]);e.cameras[o][0]-=l,e.cameras[o][1]+=s}}catch(u){i.e(u)}finally{i.f()}}(n,a,l)}else{var s=r(e.raw);void 0!==s&&s!==c&&i(s)}e.raw=o}function s(n){e.down=[n.clientX,n.clientY],t.setPointerCapture(n.pointerId)}function u(e){e.preventDefault();var t=e.deltaY<0?-1:1;E(n,t)}return t.addEventListener("mousemove",a),t.addEventListener("pointerdown",s),t.addEventListener("pointerup",(function(n){e.down=null;var o=r(e.raw);void 0!==o&&o!==c&&i(o),t.releasePointerCapture(n.pointerId)})),t.addEventListener("wheel",u,{passive:!1}),function(){t.removeEventListener("mousemove",a),t.removeEventListener("pointerdown",s),t.removeEventListener("pointerup",s),t.removeEventListener("wheel",u)}}),[]),null};var T=function(e){var t=e.active,n=e.width,i=e.height,o=e.rows,a=e.cols,l=e.select_col,s=e.select_row,u=e.select_all,v=e.zoom_mode,j=Math.floor(n/a),b=Math.floor(i/o),f=t%a,m=Math.floor(t/o),h=f*j,p=m*b,w=l&&!u,x=s&&!u,O=u,g="every"===v,y=[];return g||("canvas"===v?y=[Math.floor(n/2),Math.floor(i/2)]:"active"===v&&(y=[h+j/2,p+b/2])),Object(c.jsxs)(r.Fragment,{children:[w?Object(c.jsx)("div",{style:{pointerEvents:"none",position:"fixed",left:h-1,top:-1,width:j+2,height:i+2,border:"solid 2px rgba(160, 160, 160, 0.5)"}}):null,x?Object(c.jsx)("div",{style:{pointerEvents:"none",position:"fixed",left:-1,top:p-1,width:n+2,height:b+2,border:"solid 2px rgba(160, 160, 160, 0.5)"}}):null,O?Object(c.jsx)("div",{style:{pointerEvents:"none",position:"fixed",left:-1,top:-1,width:n+2,height:i+2,border:"solid 2px rgba(160, 160, 160, 0.5)"}}):null,Object(c.jsx)("div",{style:{pointerEvents:"none",position:"fixed",left:h-1,top:p-1,width:j+2,height:b+2,border:"solid 2px rgba(240, 240, 240, 0.5)"}}),g?Object(c.jsxs)("div",{children:[O?Object(d.a)(Array(a*o)).map((function(e,t){var n=t%a,r=Math.floor(t/a);return Object(c.jsx)("div",{className:"zoom_pointer",style:{left:n*j+j/2-4,top:r*b+b/2-4}},"every_".concat(t))})):Object(c.jsx)("div",{className:"zoom_pointer",style:{left:h+j/2-4,top:p+b/2-4}}),w?Object(d.a)(Array(o)).map((function(e,t){return t===m?null:Object(c.jsx)("div",{className:"zoom_pointer",style:{left:h+j/2-4,top:t*b+b/2-4}},"col_".concat(t))})):null,x?Object(d.a)(Array(a)).map((function(e,t){return t===f?null:Object(c.jsx)("div",{className:"zoom_pointer",style:{left:t*j+j/2-4,top:p+b/2-4}},"row_".concat(t))})):null]}):Object(c.jsx)("div",{className:"zoom_pointer",style:{left:y[0]-4,top:y[1]-4}})]})};var q=function(e){var t=Object(r.useRef)(null),n=Object(r.useState)(!1),i=Object(l.a)(n,2),o=i[0],a=i[1],s=e.width,u=e.height,v=e.scene_ref,j=e.rows,b=e.cols,f=e.select_row,m=e.select_col,h=e.select_all,x=e.zoom_mode,_=e.active,k=e.setActive,M=v.current;t.current,Object(r.useEffect)((function(){a(!0);var e=t.current,n=window.createREGL(e);M.regl=n,M.$render=e,M.images=[],M.imageDraws=[],p(M,e,b,j),function(e,t,n){e.viewport_image_map=[];for(var c=0;c<n;c++)for(var r=0;r<t;r++)e.viewport_image_map.push(null)}(M,b,j),function(e){e.cameras=[],e.projection=[],e.inverse_projection=[],e.views=[],e.view_projections=[],e.inverse_view_projections=[];for(var t=0;t<e.viewports.length;t++)e.cameras.push([0,0,10]),e.views.push([]),e.view_projections.push([]),e.inverse_view_projections.push([])}(M),w(M),O(M),M.pixel=g(M,1,5);var c=Object(d.a)(Array(b*j)).map((function(e,t){return t}));A(M,"/images/keyboard.png",c),y(M,c);var r=e.getContext("webgl");return r.enable(r.SCISSOR_TEST),n.frame((function(e){e.tick;n.clear({color:[0,0,0,1]}),O(M);for(var t=u-M.viewports[0][3]*j,c=0;c<M.viewports.length;c++){var i=M.viewports[c],o=Object(l.a)(i,4),a=o[0],s=o[1],v=o[2],d=o[3];if(s+=t,r.viewport(a,s,v,d),r.scissor(a,s,v,d),n.clear({color:[.1,.1,.1,1],depth:1}),null!==M.viewport_image_map[c])(0,M.imageDraws[M.viewport_image_map[c]])({view_projection:M.view_projections[c]})}})),n.destroy}),[]),Object(r.useEffect)((function(){var e=t.current;p(M,e,b,j),w(M)}),[b,j,s,u]);var E=Object(d.a)(Array(b*j)).map((function(e,t){return t})),S=_%b,C=Math.floor(_/b),L=j-1-C;if(M.active=L*b+S,h)M.all_active=E;else{if(M.all_active=[M.active],m)for(var R=M.active%b,z=0;z<j;z++){var I=z*b+R;I!==M.active&&M.all_active.push(I)}if(f)for(var N=Math.floor(M.active/b),P=0;P<b;P++){var Z=N*b+P;Z!==M.active&&M.all_active.push(Z)}}return M.width=s,M.height=u,M.zoom_mode=x,Object(c.jsxs)("div",{style:{position:"relative",width:s,height:u},children:[Object(c.jsx)("canvas",{ref:t,width:s,height:u}),o?Object(c.jsxs)(r.Fragment,{children:[Object(c.jsx)(F,{rows:j,cols:b,width:s,height:u}),Object(c.jsx)(D,{$render:t.current,scene:M,setActive:k}),Object(c.jsx)(T,{active:_,rows:j,cols:b,width:s,scene:M,height:u,select_col:m,select_row:f,select_all:h,zoom_mode:x})]}):null]})};var K=function(e){var t=Object(r.useRef)({}),n=e.scene_ref.current,c=e.addCol,i=e.addRow,o=e.remCol,a=e.remRow,l=e.toggleSelectCol,s=e.toggleSelectRow,u=e.toggleSelectAll,v=e.clearSelections,d=e.setZoomMode,j=e.setKeyboardActive,b=e.file_input;function f(e,n){t.current[e]&&n()}return Object(r.useEffect)((function(){function e(e){var r=t.current,m=e.key.toLowerCase();r[m]=!0,function(e,t){f("q",l),f("w",s),f("e",u),f("escape",v),f("arrowleft",_.bind(null,n,1,0)),f("arrowright",_.bind(null,n,-1,0)),f("arrowup",_.bind(null,n,0,-1)),f("arrowdown",_.bind(null,n,0,1)),f("+",E.bind(null,n,-1)),f("=",E.bind(null,n,-1)),f("-",E.bind(null,n,1)),f("z",d.bind(null,"canvas")),f("x",d.bind(null,"active")),f("c",d.bind(null,"every")),f("h",j.bind(null,-1,0)),f("j",j.bind(null,0,1)),f("k",j.bind(null,0,-1)),f("l",j.bind(null,1,0)),function(e,t,n){e===t&&n()}(e,"o",z.bind(null,n,b)),f("t",S.bind(null,n)),f("y",C.bind(null,n)),f("u",y.bind(null,n,n.all_active)),f("g",c),f("f",o),f("b",i),f("v",a)}(m)}function r(e){t.current[e.key.toLowerCase()]=!1}return window.addEventListener("keydown",e),window.addEventListener("keyup",r),function(){window.removeEventListener("keydown",e),window.removeEventListener("keyup",r)}}),[]),null};var U=function(){var e=Object(r.useState)({width:void 0,height:void 0}),t=Object(l.a)(e,2),n=t[0],c=t[1];return Object(r.useEffect)((function(){function e(){c({width:window.innerWidth,height:window.innerHeight})}return window.addEventListener("resize",e),e(),function(){return window.removeEventListener("resize",e)}}),[]),n};var $=function(){var e=U(),t=i.a.useRef(null),n=Object(r.useState)(!0),o=Object(l.a)(n,2),a=o[0],s=(o[1],Object(r.useState)(8)),u=Object(l.a)(s,2),v=u[0],d=u[1],j=Object(r.useState)(8),b=Object(l.a)(j,2),f=b[0],m=b[1],h=Object(r.useState)(0),p=Object(l.a)(h,2),w=p[0],x=p[1],O=Object(r.useState)(!1),g=Object(l.a)(O,2),y=g[0],_=g[1],k=Object(r.useState)(!1),M=Object(l.a)(k,2),E=M[0],S=M[1],C=Object(r.useState)(!1),L=Object(l.a)(C,2),R=L[0],A=L[1],z=Object(r.useState)("canvas"),I=Object(l.a)(z,2),N=I[0],P=I[1],Z=function(){d((function(e){return Math.min(16,e+1)}))},F=function(){d((function(e){return Math.max(1,e-1)}))},D=function(){m((function(e){return Math.min(16,e+1)}))},T=function(){m((function(e){return Math.max(1,e-1)}))},$=function(){_((function(e){return!1===e&&A(!1),!e}))},Y=function(){S((function(e){return!1===e&&A(!1),!e}))},J=function(){A((function(e){return!1===e&&(S(!1),_(!1)),!e}))},X=function(){S(!1),_(!1),A(!1)},G=i.a.useRef({active:0,all_active:[0]}),H=function(e,t){x((function(n){var c=n%v,r=Math.floor(n/v),i=Math.max(0,Math.min(v-1,c+e));return Math.max(0,Math.min(f-1,r+t))*v+i}))};return Object(c.jsxs)(i.a.Fragment,{children:[Object(c.jsx)("input",{style:{display:"none"},type:"file",accept:"image/*",ref:t}),e.width&&a?Object(c.jsx)(B,{scene:G.current,width:320,cols:v,rows:f,select_row:y,select_col:E,select_all:R,zoom_mode:N,addCol:Z,addRow:D,remCol:F,remRow:T,toggleSelectAll:J,toggleSelectRow:$,toggleSelectCol:Y,clearSelections:X,setKeyboardActive:H,setZoomMode:P,file_input:t.current}):null,e.width?Object(c.jsx)(K,{scene_ref:G,addCol:Z,addRow:D,remCol:F,remRow:T,toggleSelectAll:J,toggleSelectRow:$,toggleSelectCol:Y,clearSelections:X,setZoomMode:P,setKeyboardActive:H,file_input:t.current}):null,e.width?Object(c.jsx)(q,{width:e.width-320,height:e.height,size:e,scene_ref:G,cols:v,rows:f,active:w,select_row:y,select_col:E,select_all:R,zoom_mode:N,setZoomMode:P,setActive:x}):Object(c.jsx)("div",{children:"Loading..."})]})},Y=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,17)).then((function(t){var n=t.getCLS,c=t.getFID,r=t.getFCP,i=t.getLCP,o=t.getTTFB;n(e),c(e),r(e),i(e),o(e)}))};a.a.render(Object(c.jsx)(i.a.StrictMode,{children:Object(c.jsx)($,{})}),document.getElementById("root")),Y()}},[[16,1,2]]]);
//# sourceMappingURL=main.caf61766.chunk.js.map