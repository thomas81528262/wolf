(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{168:function(e,a,n){e.exports=n.p+"static/media/logo.5d5d9eef.svg"},169:function(e,a,n){},243:function(e,a,n){e.exports=n(288)},288:function(e,a,n){"use strict";n.r(a);var t=n(0),r=n.n(t),l=n(21),i=n.n(l),c=n(11),o=n(16),m=(n(168),n(169),n(338)),u=n(347),d=n(345),s=n(14),b=n(15),p=n(30),g=n(329),f=n(333),E=n(332),v=n(328),O=n(330),j=n(331),y=n(223),h=n(290),x=n(343),$=n(344),S=n(292),C=n(160),k=n.n(C),w=n(326),P=n(327);n(325);Object(w.a)((function(e){return{footer:{backgroundColor:e.palette.background.paper,padding:e.spacing(6,0)}}}));var I=n(342),N=n(346),T=n(161),R=n(124),W=n(3),B=Object(w.a)((function(e){return{margin:{margin:e.spacing(1)},table:{minWidth:450},title:{flexGrow:1},menuButton:{marginRight:e.spacing(2)}}}));function D(e){var a=B();return r.a.createElement(v.a,{component:y.a},r.a.createElement(g.a,{className:a.table,"aria-label":"simple table",size:"small"},r.a.createElement(O.a,null,r.a.createElement(j.a,null,r.a.createElement(E.a,null,"ID"),r.a.createElement(E.a,{align:"right"},"\u73a9\u5bb6"),r.a.createElement(E.a,{align:"right"},"\u89d2\u8272"),r.a.createElement(E.a,{align:"right"},"\u4e0a\u7dda"))),r.a.createElement(f.a,null,e.data.map((function(e){return r.a.createElement(j.a,{key:e.id},r.a.createElement(E.a,{component:"th",scope:"row"},e.id),r.a.createElement(E.a,{align:"right"},e.name),r.a.createElement(E.a,{align:"right"},e.roleName),r.a.createElement(E.a,{align:"right"},r.a.createElement("span",{style:{color:e.isEmpty?"gray":"lightgreen",transition:"all .3s ease",fontSize:"24px",marginRight:"10px"}},"\u25cf")))})))))}function L(){var e=Object(o.a)(["\n  {\n    roles {\n      id\n      name\n      number\n    }\n    players {\n      id\n      name\n      roleName\n      isEmpty\n    }\n  }\n"]);return L=function(){return e},e}Object(s.b)(L());var z=Object(w.a)((function(e){return{margin:{margin:e.spacing(1)},table:{minWidth:450},title:{flexGrow:1},menuButton:{marginRight:e.spacing(2)}}}));function G(e){var a=z(),n=function(e){var a=0,n=[];return e.forEach((function(e){var t=e.number;t&&(a+=t,n.push(e))})),{total:a,data:n}}(e.data),t=n.total,l=n.data;return r.a.createElement(v.a,{component:y.a},r.a.createElement(g.a,{className:a.table,"aria-label":"simple table",size:"small"},r.a.createElement(O.a,null,r.a.createElement(j.a,null,r.a.createElement(E.a,null,"\u89d2\u8272"),r.a.createElement(E.a,{align:"right"},"\u4eba\u6578"))),r.a.createElement(f.a,null,l.map((function(e){return r.a.createElement(r.a.Fragment,{key:e.name},r.a.createElement(j.a,{key:e.name},r.a.createElement(E.a,{component:"th",scope:"row"},e.name),r.a.createElement(E.a,{align:"right"},e.number)),e.players?r.a.createElement(j.a,{align:"left"},e.players.map((function(e,a){return r.a.createElement("div",{style:{fontSize:22,marginLeft:45},key:a},"".concat(e.id," : ").concat(e.name))}))):null)})),r.a.createElement(j.a,null,r.a.createElement(E.a,{align:"right"},"\u7e3d\u4eba\u6578"),r.a.createElement(E.a,{align:"right"},t)))))}function U(e){var a=e.variables,n=e.query,t=e.pollInterval,l=Object(b.b)(n,{fetchPolicy:"network-only",variables:a}),i=l.loading,c=(l.error,l.data),o=l.startPolling,m=l.stopPolling;if(r.a.useEffect((function(){return o(t),m}),[]),i)return r.a.createElement("div",null,"Loading");var u=e.parseData(c);return console.log(u,a,n,c),r.a.createElement(G,{data:u})}var q=n(348),K=n(337),F=n(12),A=n(335),M=n(52),V=n.n(M),J=n(219),Y=n.n(J),H=n(218),Q=n.n(H),X=n(54),Z=n.n(X);function _(){var e=Object(o.a)(["\n  {\n    roles {\n      id\n      name\n      \n    }\n    \n  }\n"]);return _=function(){return e},e}var ee=Object(s.b)(_()),ae=Object(w.a)((function(e){return{margin:{margin:e.spacing(1)},table:{minWidth:250},title:{flexGrow:1},menuButton:{marginRight:e.spacing(2)}}}));function ne(e){var a,n=ae(),t=r.a.useState(-1),l=Object(c.a)(t,2),i=l[0],o=l[1],m=r.a.useState(0),s=Object(c.a)(m,2),p=s[0],g=s[1],f=Object(b.b)(ee),E=f.loading,v=(f.error,f.data);return E?r.a.createElement("div",null,"Loading"):(console.log(v),r.a.createElement("div",{style:{display:"flex",justifyContent:"center"}},r.a.createElement(u.a,{id:"combo-box-demo",options:v.roles.filter((function(e){return e.id>0})),getOptionLabel:function(e){return e.name},style:{width:300},onChange:function(e,a){o(a.id)},renderInput:function(e){return r.a.createElement(d.a,Object.assign({},e,{label:"\u89d2\u8272",variant:"outlined",margin:"dense"}))}}),r.a.createElement(d.a,{id:"standard-basic",label:"\u4eba\u6578",variant:"outlined",className:n.margin,margin:"dense",type:"number",value:p,onChange:function(e){return g(e.target.value)}}),r.a.createElement("div",{style:{marginTop:5}},r.a.createElement(A.a,(a={size:"medium",color:"secondary","aria-label":"add"},Object(F.a)(a,"size","small"),Object(F.a)(a,"onClick",(function(){e.updateRoleNumber({id:i,number:parseInt(p)})})),a),r.a.createElement(Z.a,null)))))}var te=n(26),re=n(353),le=n(351),ie="card",ce={border:"1px dashed gray",padding:"0.5rem 1rem",marginBottom:".5rem",backgroundColor:"white",cursor:"move"},oe=function(e){var a=e.id,n=e.text,l=e.index,i=e.moveCard,o=Object(t.useRef)(null),m=Object(re.a)({accept:ie,hover:function(e,a){if(o.current){var n=e.index,t=l;if(n!==t){var r=o.current.getBoundingClientRect(),c=(r.bottom-r.top)/2,m=a.getClientOffset().y-r.top;n<t&&m<c||n>t&&m>c||(i(n,t),e.index=t)}}}}),u=Object(c.a)(m,2)[1],d=Object(le.a)({item:{type:ie,id:a,index:l},collect:function(e){return{isDragging:e.isDragging()}}}),s=Object(c.a)(d,2),b=s[0].isDragging?0:1;return(0,s[1])(u(o)),r.a.createElement("div",{ref:o,style:Object(R.a)({},ce,{opacity:b})},n)},me=n(217),ue=n.n(me),de={width:400},se=function(e){var a=Object(t.useState)(Object(te.a)(e.data)),n=Object(c.a)(a,2),l=n[0],i=n[1],o=Object(t.useCallback)((function(a,n){var t=l[a],r=ue()(l,{$splice:[[a,1],[n,0,t]]});i(r),e.onUpdate(r)}),[l]);return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{style:de},l.map((function(e,a){return function(e,a){return r.a.createElement(oe,{key:e.id,index:a,id:e.id,text:e.text,moveCard:o})}(e,a)}))))},be=n(336),pe=n(222);function ge(){var e=Object(o.a)(["\n  mutation UpdateRolePriority($name: String!, $ids: [Int]!) {\n    updateTemplateRolePriority(name: $name, ids: $ids)\n  }\n"]);return ge=function(){return e},e}function fe(){var e=Object(o.a)(["\n  mutation UpdateRule($name: String!, $description: String!) {\n    updateTemplateDescription(name: $name, description: $description)\n  }\n"]);return fe=function(){return e},e}function Ee(){var e=Object(o.a)(["\n  mutation UpdateTempl($roleId: Int!, $number: Int!, $name: String!) {\n    updateTemplateRole(name: $name, number: $number, roleId: $roleId)\n  }\n"]);return Ee=function(){return e},e}function ve(){var e=Object(o.a)(["\n  query GetTemplate($name: String!) {\n    template(name: $name) {\n      roles {\n        name\n        number\n        id\n      }\n      description\n    }\n  }\n"]);return ve=function(){return e},e}var Oe=Object(s.b)(ve()),je=Object(s.b)(Ee()),ye=Object(s.b)(fe()),he=Object(s.b)(ge());function xe(e){var a=e.children,n=e.value,t=e.index,l=Object(W.a)(e,["children","value","index"]);return r.a.createElement("div",Object.assign({role:"tabpanel",hidden:n!==t,id:"full-width-tabpanel-".concat(t),"aria-labelledby":"full-width-tab-".concat(t)},l),n===t&&r.a.createElement(N.a,{p:3},a))}var $e=function(e){var a=[];return e.forEach((function(e){var n=e.name,t=e.id;a.push({id:t,text:n})})),a};function Se(e){var a=e.name,n=r.a.useState([]),t=Object(c.a)(n,2),l=t[0],i=t[1],o=r.a.useState([]),m=Object(c.a)(o,2),u=m[0],d=m[1],s=r.a.useState(!1),p=Object(c.a)(s,2),g=(p[0],p[1],Object(b.b)(Oe,{fetchPolicy:"network-only",notifyOnNetworkStatusChange:!0,variables:{name:a},onCompleted:function(e){console.log("complete",e);var a=$e(e.template.roles);i(a.map((function(e){return e.id}))),d(a.map((function(e){return e.id})))}})),f=g.loading,E=(g.error,g.data),v=g.refetch,O=Object(b.a)(he,{onCompleted:function(){v()}}),j=Object(c.a)(O,2),y=j[0],h=j[1];if(f||h.loading)return r.a.createElement("div",null,"Loading");console.log(E,u,l);var x=$e(E.template.roles);return r.a.createElement(be.a,{backend:pe.a},r.a.createElement(S.a,{"aria-label":"delete",onClick:function(){y({variables:{name:a,ids:l}})},color:u.toString()===l.toString()?"primary":"secondary"},r.a.createElement(Z.a,null)),r.a.createElement(se,{data:x,onUpdate:function(e){console.log("update view"),i(e.map((function(e){return e.id})))}}))}function Ce(e){var a=e.name,n=Object(b.a)(je),t=Object(c.a)(n,1)[0];return r.a.useEffect((function(){return console.log("mount"+a),function(){console.log("umount"+a)}}),[]),r.a.createElement("div",null,r.a.createElement(h.a,{variant:"h2",gutterBottom:!0},a),r.a.createElement(ne,{updateRoleNumber:function(e){var n=e.id,r=e.number;console.log(n,a),t({variables:{roleId:n,name:a,number:r}})}}),r.a.createElement(U,{query:Oe,variables:{name:a},parseData:function(e){return console.log(e),e.template.roles},pollInterval:500}))}function ke(e){var a=r.a.useState(e.value),n=Object(c.a)(a,2),t=n[0],l=n[1];return r.a.createElement("div",null,r.a.createElement(S.a,{"aria-label":"delete",onClick:function(){e.updateRule({variables:{description:t,name:e.name}})},color:t===e.value?"primary":"secondary"},r.a.createElement(Z.a,null)),r.a.createElement(d.a,{id:"outlined-multiline-static",multiline:!0,rows:4,fullWidth:!0,value:t,variant:"outlined",onChange:function(e){return l(e.target.value)}}))}function we(e){var a=e.name,n=Object(b.b)(Oe,{variables:{name:a}}),t=n.loading,l=(n.error,n.data),i=n.refetch,o=Object(b.a)(ye,{onCompleted:function(){i()}}),m=Object(c.a)(o,2),u=m[0];m[1];return t?r.a.createElement("div",null,"Loading"):r.a.createElement(ke,{value:l.template.description,updateRule:u,name:a})}function Pe(e){var a=e.name,n=r.a.useState(0),t=Object(c.a)(n,2),l=t[0],i=t[1];return console.log(a),r.a.createElement(y.a,{square:!0},r.a.createElement(q.a,{value:l,indicatorColor:"primary",textColor:"primary",onChange:function(e,a){i(a)},"aria-label":"disabled tabs example"},r.a.createElement(K.a,{label:"\u89d2\u8272"}),r.a.createElement(K.a,{label:"\u898f\u5247"}),r.a.createElement(K.a,{label:"\u9ed1\u591c\u9806\u5e8f"})),r.a.createElement(xe,{value:l,index:0},r.a.createElement(Ce,{name:a})),r.a.createElement(xe,{value:l,index:1},r.a.createElement(we,{name:a})),r.a.createElement(xe,{value:l,index:2},r.a.createElement(Se,{name:a})))}var Ie=n(352);function Ne(){var e=Object(o.a)(["\n  mutation EnableTemplate($name: String!) {\n    enableTemplate(name: $name)\n  }\n"]);return Ne=function(){return e},e}function Te(){var e=Object(o.a)(["\n  mutation DeleteTemplate($name: String!) {\n    deleteTemplate(name: $name)\n  }\n"]);return Te=function(){return e},e}function Re(){var e=Object(o.a)(["\n  mutation addTemplate($name: String!) {\n    addNewTemplate(name: $name)\n  }\n"]);return Re=function(){return e},e}function We(){var e=Object(o.a)(["\n  {\n    templates {\n      isEnabled\n      name\n    }\n  }\n"]);return We=function(){return e},e}var Be=Object(w.a)((function(e){return{margin:{margin:e.spacing(1)},table:{minWidth:250},title:{flexGrow:1},menuButton:{marginRight:e.spacing(2)}}})),De=Object(s.b)(We()),Le=Object(s.b)(Re()),ze=Object(s.b)(Te()),Ge=Object(s.b)(Ne());function Ue(e){var a=Be();return r.a.createElement(v.a,{component:y.a},r.a.createElement(g.a,{className:a.table,"aria-label":"simple table",size:"small"},r.a.createElement(O.a,null,r.a.createElement(j.a,null,r.a.createElement(E.a,null,"\u9078\u64c7"),r.a.createElement(E.a,{align:"left"},"\u904a\u6232\u6a21\u5f0f"),r.a.createElement(E.a,{align:"right"},r.a.createElement("div",{style:{marginRight:10}},"\u7de8\u8f2f")),r.a.createElement(E.a,{align:"right"},r.a.createElement("div",{style:{marginRight:10}},"\u522a\u9664")))),r.a.createElement(f.a,null,e.data.map((function(a){return r.a.createElement(j.a,{key:a.name},r.a.createElement(E.a,null,r.a.createElement(Ie.a,{onChange:function(n){n.target.checked&&e.onSelect(a.name)},color:"primary",inputProps:{"aria-label":"secondary checkbox"},checked:a.isEnabled})),r.a.createElement(E.a,{align:"left"},a.name),r.a.createElement(E.a,{align:"right"},r.a.createElement(S.a,{"aria-label":"delete",onClick:function(){console.log(a.name),e.onEdit(a.name)}},r.a.createElement(Q.a,null))),r.a.createElement(E.a,{align:"right"},r.a.createElement(S.a,{"aria-label":"delete",onClick:function(){e.onDelete(a.name)},disabled:a.isEnabled},r.a.createElement(Y.a,null))))})))))}function qe(e){var a,n=Be(),t=Object(b.a)(Le),l=Object(c.a)(t,1)[0],i=Object(b.a)(ze),o=Object(c.a)(i,1)[0],m=r.a.useState(""),u=Object(c.a)(m,2),s=u[0],p=u[1],g=r.a.useState(!1),f=Object(c.a)(g,2),E=f[0],v=f[1],O=Object(b.b)(De,{}),j=O.loading,y=(O.error,O.data),h=O.stopPolling,x=O.startPolling,$=(O.called,Object(b.a)(Ge,{onCompleted:function(){v(!0),x(500),setTimeout((function(){v(!1)}),2e3)}})),S=Object(c.a)($,2),C=S[0],k=S[1];return r.a.useEffect((function(){return x(500),h}),[]),j||j||k.loading||E?r.a.createElement("div",null,"Loading"):r.a.createElement("div",null,r.a.createElement("div",{style:{display:"flex",justifyContent:"center"}},r.a.createElement(d.a,{id:"standard-basic",label:"\u6a21\u5f0f\u540d\u7a31",variant:"outlined",className:n.margin,margin:"dense",value:s,onChange:function(e){return p(e.target.value)}}),r.a.createElement("div",{style:{marginTop:5}},r.a.createElement(A.a,(a={size:"medium",color:"secondary","aria-label":"add"},Object(F.a)(a,"size","small"),Object(F.a)(a,"onClick",(function(){l({variables:{name:s}})})),a),r.a.createElement(V.a,null)))),r.a.createElement(P.a,{maxWidth:"sm"},r.a.createElement(Ue,{data:y.templates,onEdit:function(a){e.setEditName(a)},onSelect:function(e){C({variables:{name:e}}),h()},onDelete:function(e){o({variables:{name:e}})}})))}function Ke(){Be();var e=r.a.useState(""),a=Object(c.a)(e,2),n=(a[0],a[1],r.a.useState("")),t=Object(c.a)(n,2),l=t[0],i=t[1],o=Object(b.a)(Le),u=(Object(c.a)(o,1)[0],Object(b.a)(ze)),d=(Object(c.a)(u,1)[0],r.a.useState(!1)),s=Object(c.a)(d,2);s[0],s[1];return l?r.a.createElement("div",null,r.a.createElement(N.a,{display:"flex"},r.a.createElement(m.a,{variant:"contained",color:"secondary",onClick:function(){i("")}},"\u9000\u51fa")),r.a.createElement(Pe,{name:l})):r.a.createElement(qe,{setEditName:function(e){i(e)}})}function Fe(){var e=Object(o.a)(["\n  {\n    enabledTemplate {\n      name\n      description\n      roles {\n        name\n        id\n        number\n      }\n    }\n  }\n"]);return Fe=function(){return e},e}var Ae=Object(s.b)(Fe());function Me(e){var a=Object(b.b)(Ae,{fetchPolicy:"network-only"}),n=a.loading,t=(a.error,a.data);if(n)return r.a.createElement("div",null,"Loading");var l=t.enabledTemplate,i=l.name,c=l.description,o=l.roles;return console.log(t.enabledTemplate),r.a.createElement("div",null,r.a.createElement(h.a,{variant:"h2",gutterBottom:!0},i),r.a.createElement(d.a,{id:"outlined-multiline-static",multiline:!0,rows:6,fullWidth:!0,value:c,variant:"outlined",label:"\u898f\u5247",disabled:!0}),r.a.createElement(G,{data:o}))}var Ve=n(93);function Je(){var e=Object(o.a)(["\n  mutation DarkStart {\n    darkStart\n  }\n"]);return Je=function(){return e},e}function Ye(){var e=Object(o.a)(["\n  mutation RemoveAllPlayer {\n    removeAllPlayer\n  }\n"]);return Ye=function(){return e},e}function He(){var e=Object(o.a)(["\n  mutation GenerateTemplatePlayer {\n    generateTemplatePlayer\n  }\n"]);return He=function(){return e},e}function Qe(){var e=Object(o.a)(["\n  mutation GenerateTemplateRole {\n    generateTemplateRole\n  }\n"]);return Qe=function(){return e},e}function Xe(){var e=Object(o.a)(["\n  mutation UpdatePlayerName($id: Int!, $name: String!) {\n    updatePlayerName(id: $id, name: $name)\n  }\n"]);return Xe=function(){return e},e}function Ze(){var e=Object(o.a)(["\n  {\n    enabledTemplate {\n      name\n      description\n      roles {\n        name\n        id\n        number\n      }\n    }\n    players {\n      id\n      name\n      roleName\n    }\n  }\n"]);return Ze=function(){return e},e}function _e(){var e=Object(o.a)(["\n  {\n    players {\n      id\n      name\n      roleName\n      isEmpty\n    }\n  }\n"]);return _e=function(){return e},e}var ea=Object(s.b)(_e()),aa=Object(s.b)(Ze()),na=Object(s.b)(Xe()),ta=Object(s.b)(Qe()),ra=Object(s.b)(He()),la=Object(s.b)(Ye()),ia=Object(s.b)(Je()),ca=Object(w.a)((function(e){return{margin:{margin:e.spacing(1)},table:{minWidth:250},title:{flexGrow:1},menuButton:{marginRight:e.spacing(2)}}}));function oa(e){var a=e.children,n=e.value,t=e.index,l=Object(W.a)(e,["children","value","index"]);return r.a.createElement("div",Object.assign({role:"tabpanel",hidden:n!==t,id:"full-width-tabpanel-".concat(t),"aria-labelledby":"full-width-tab-".concat(t)},l),n===t&&r.a.createElement(N.a,{p:3},a))}function ma(e){return r.a.createElement(U,{query:aa,variables:{},parseData:function(e){var a={};e.players.forEach((function(e){var n=e.roleName,t=e.name,r=e.id;a[n]?a[n].push({name:t||"",id:r}):a[n]=[{name:t||"",id:r}]})),console.log(a);var n=[];return e.enabledTemplate.roles.forEach((function(e){console.log("r",e);var t=e.name;n.push(Object(R.a)({},e,{players:a[t]}))})),console.log(n),n},pollInterval:500})}function ua(e){ca();var a=Object(b.a)(ta),n=Object(c.a)(a,1)[0],t=Object(b.a)(ra),l=Object(c.a)(t,1)[0],i=Object(b.a)(la),o=Object(c.a)(i,1)[0],u=Object(b.a)(ia),s=Object(c.a)(u,1)[0],p=Object(Ve.a)(e.name,500),g=Object(c.a)(p,2),f=g[0],E=g[1],v=r.a.useState(e.name||""),O=Object(c.a)(v,2),j=O[0],y=O[1],h=Object(b.a)(na),x=Object(c.a)(h,2),$=x[0],S=x[1].called;return r.a.useEffect((function(){f&&(f!==e.name||S)&&$({variables:{id:0,name:f}})}),[f]),e.isPlayerMode?r.a.createElement("div",{style:{}},r.a.createElement(N.a,{display:"flex"},r.a.createElement(m.a,{variant:"contained",color:"primary",onClick:function(){n()}},"\u7522\u751f\u89d2\u8272"),r.a.createElement(m.a,{variant:"contained",color:"secondary",onClick:function(){o()}},"\u522a\u9664\u73a9\u5bb6"),r.a.createElement(m.a,{variant:"contained",color:"secondary",onClick:function(){s()}},"\u9ed1\u591c\u958b\u59cb")),r.a.createElement(N.a,{display:"flex"},r.a.createElement(d.a,{id:"standard-basic",label:"\u59d3\u540d",variant:"outlined",margin:"dense",value:j,onChange:function(e){E(e.target.value),y(e.target.value)}})),r.a.createElement(D,{data:e.players})):r.a.createElement("div",{style:{}},r.a.createElement(N.a,{display:"flex"},r.a.createElement(m.a,{variant:"contained",color:"primary",onClick:function(){l()}},"\u52a0\u5165\u73a9\u5bb6")),r.a.createElement(Me,null))}function da(e){var a=r.a.useState(0),n=Object(c.a)(a,2),t=n[0],l=n[1],i=Object(b.b)(ea,{pollInterval:500}),o=i.loading,m=(i.error,i.data);if(o)return r.a.createElement("div",null,"Loading");var u=e.id,d=e.pass,s=e.name,p=m.players.length>1;return r.a.createElement(y.a,{elevation:3},r.a.createElement(q.a,{value:t,indicatorColor:"primary",textColor:"primary",onChange:function(e,a){l(a)},"aria-label":"disabled tabs example",variant:"fullWidth"},r.a.createElement(K.a,{label:"\u904a\u6232"}),r.a.createElement(K.a,{label:p?"\u9ed1\u591c\u8996\u91ce":"\u6a21\u5f0f\u9078\u64c7"}),p&&r.a.createElement(K.a,{label:"\u6a21\u5f0f"})),r.a.createElement(oa,{value:t,index:0},r.a.createElement(ua,{isPlayerMode:p,id:u,pass:d,name:s,players:m.players})),r.a.createElement(oa,{value:t,index:1},p?r.a.createElement(ma,null):r.a.createElement(Ke,null)),p&&r.a.createElement(oa,{value:t,index:2},r.a.createElement(Me,null)))}var sa=n(340),ba=n(341),pa=n(354),ga=n(349),fa=n(339);function Ea(){var e=Object(o.a)(["\n  mutation DarkAction($targetId: Int!, $id: Int!) {\n    exeDarkAction(targetId: $targetId, id: $id)\n  }\n"]);return Ea=function(){return e},e}function va(){var e=Object(o.a)(["\n  mutation UpdatePlayerName($id: Int!, $name: String!) {\n    updatePlayerName(id: $id, name: $name)\n  }\n"]);return va=function(){return e},e}function Oa(){var e=Object(o.a)(["\n  mutation UpdatePlayerPass($id: Int!, $pass: String!) {\n    updatePlayerPass(id: $id, pass: $pass) {\n      isValid\n      name\n    }\n  }\n"]);return Oa=function(){return e},e}function ja(){var e=Object(o.a)(["\n  mutation UpdateRoleNumber($id: Int!, $number: Int!) {\n    updateRoleNumber(id: $id, number: $number)\n  }\n"]);return ja=function(){return e},e}function ya(){var e=Object(o.a)(["\n  query GetPlayer($id: Int!, $pass: String!) {\n    player(id: $id, pass: $pass) {\n      id\n      name\n      roleName\n    }\n    players {\n      id\n      name\n      isEmpty\n    }\n    wolfKillList(id: $id) {\n      id\n      isKill\n    }\n    darkInfo {\n      isStart\n    }\n  }\n"]);return ya=function(){return e},e}function ha(){var e=Object(o.a)(["\n  {\n    players {\n      id\n      name\n      roleName\n      isEmpty\n    }\n  }\n"]);return ha=function(){return e},e}new s.a({uri:"/graphql"});var xa=Object(w.a)((function(e){return{margin:{},table:{minWidth:450},title:{flexGrow:1},menuButton:{marginRight:e.spacing(2)},submit:{margin:e.spacing(3,0,2)},container:{paddingTop:e.spacing(4),paddingBottom:e.spacing(4)}}})),$a=(Object(s.b)(ha()),Object(s.b)(ya())),Sa=(Object(s.b)(ja()),Object(s.b)(Oa()),Object(s.b)(va())),Ca=Object(s.b)(Ea());function ka(e){var a=e.children,n=e.value,t=e.index,l=Object(W.a)(e,["children","value","index"]);return r.a.createElement("div",Object.assign({role:"tabpanel",hidden:n!==t,id:"full-width-tabpanel-".concat(t),"aria-labelledby":"full-width-tab-".concat(t)},l),n===t&&r.a.createElement(N.a,{p:3},a))}function wa(e){var a=xa();return r.a.createElement(v.a,{component:y.a},r.a.createElement(g.a,{className:a.table,"aria-label":"simple table",size:"small"},r.a.createElement(O.a,null,r.a.createElement(j.a,null,r.a.createElement(E.a,null,"ID"),r.a.createElement(E.a,{align:"right"},"\u73a9\u5bb6"),r.a.createElement(E.a,{align:"right"},"\u4e0a\u7dda"))),r.a.createElement(f.a,null,e.data.map((function(e){return r.a.createElement(j.a,{key:e.id},r.a.createElement(E.a,{component:"th",scope:"row"},e.id),r.a.createElement(E.a,{align:"right"},e.name),r.a.createElement(E.a,{align:"right"},r.a.createElement("span",{style:{color:e.isEmpty?"gray":"lightgreen",transition:"all .3s ease",fontSize:"24px",marginRight:"10px"}},"\u25cf")))})))))}function Pa(e){var a=Object(b.a)(Ca),n=Object(c.a)(a,1)[0],t=e.data.wolfKillList.filter((function(e){return e.isKill}));return r.a.createElement(fa.a,null,e.data.wolfKillList.map((function(a){return r.a.createElement("div",null,r.a.createElement(ga.a,{checked:a.isKill,name:"radio-button-demo",inputProps:{"aria-label":"B"},onChange:function(){console.log(a.id),n({variables:{targetId:a.id,id:e.id}})}}),"player ".concat(a.id))})),r.a.createElement(ga.a,{checked:0===t.length,name:"radio-button-demo",inputProps:{"aria-label":"B"},onChange:function(){n({variables:{targetId:-1,id:e.id}})}}),"none")}function Ia(e){var a=xa(),n=Object(b.b)($a,{fetchPolicy:"network-only",variables:{id:e.id,pass:e.pass},pollInterval:500}),t=n.loading,l=(n.error,n.data),i=r.a.useState(!0),o=Object(c.a)(i,2),m=(o[0],o[1],Object(Ve.a)(e.name,500)),u=Object(c.a)(m,2),s=u[0],p=u[1],g=r.a.useState(e.name),f=Object(c.a)(g,2),E=f[0],v=f[1],O=Object(b.a)(Sa),j=Object(c.a)(O,2),y=j[0],x=j[1].called;if(r.a.useEffect((function(){s&&(s!==e.name||x)&&y({variables:{id:e.id,name:s}})}),[s]),t)return r.a.createElement("div",null,"Loading");var $=l.player,S=($.id,$.name,$.roleName);return r.a.createElement(r.a.Fragment,null,r.a.createElement(pa.a,{"aria-labelledby":"simple-dialog-title",open:l.darkInfo.isStart},l.wolfKillList.length>0&&r.a.createElement(Pa,{data:l,id:e.id})),r.a.createElement(N.a,{display:"flex"},r.a.createElement(d.a,{id:"standard-basic",label:"\u59d3\u540d",variant:"outlined",className:a.margin,margin:"dense",value:E,onChange:function(e){p(e.target.value),v(e.target.value)}})),r.a.createElement(sa.a,{className:a.root},r.a.createElement(ba.a,null,r.a.createElement(h.a,{variant:"h1",component:"h1"},S))),r.a.createElement(wa,{data:l.players}))}function Na(e){var a=e.id,n=e.pass,t=e.name,l=r.a.useState(0),i=Object(c.a)(l,2),o=i[0],m=i[1];return r.a.createElement(y.a,{elevation:3},r.a.createElement(q.a,{value:o,indicatorColor:"primary",textColor:"primary",onChange:function(e,a){m(a)},"aria-label":"disabled tabs example",variant:"fullWidth"},r.a.createElement(K.a,{label:"\u73a9\u5bb6"}),r.a.createElement(K.a,{label:"\u6a21\u5f0f"})),r.a.createElement(ka,{value:o,index:0},r.a.createElement(Ia,{id:a,pass:n,name:t})),r.a.createElement(ka,{value:o,index:1},r.a.createElement(Me,null)))}function Ta(){var e=Object(o.a)(["\n  mutation UpdatePlayerPass($id: Int!, $pass: String!) {\n    updatePlayerPass(id: $id, pass: $pass) {\n      isValid\n      name\n    }\n  }\n"]);return Ta=function(){return e},e}function Ra(){var e=Object(o.a)(["\n  {\n    players {\n      id\n      name\n      isEmpty\n    }\n  }\n"]);return Ra=function(){return e},e}var Wa=new s.a({uri:"/graphql",connectToDevTools:!0}),Ba=Object(w.a)((function(e){return{margin:{},table:{minWidth:450},title:{flexGrow:1},menuButton:{marginRight:e.spacing(2)},submit:{margin:e.spacing(3,0,2)},container:{paddingTop:e.spacing(4),paddingBottom:e.spacing(4)}}})),Da=Object(s.b)(Ra()),La=Object(s.b)(Ta());function za(){return r.a.createElement(h.a,{variant:"body2",color:"textSecondary",align:"center"},"Copyright \xa9 ",(new Date).getFullYear())}function Ga(){var e=Ba(),a=r.a.useState(-1),n=Object(c.a)(a,2),t=n[0],l=n[1],i=r.a.useState(""),o=Object(c.a)(i,2),s=o[0],p=o[1],g=Object(b.b)(Da),f=g.loading,E=(g.error,g.data),v=Object(b.a)(La),O=Object(c.a)(v,2),j=O[0],y=O[1],C=r.a.useState(!1),w=Object(c.a)(C,2),R=w[0],W=w[1];return f||y.loading?r.a.createElement("div",null,"Loading"):y.called&&y.data.updatePlayerPass.isValid&&R?r.a.createElement(r.a.Fragment,null,r.a.createElement(I.a,null),r.a.createElement(P.a,{maxWidth:"sm"},r.a.createElement(x.a,{position:"absolute"},r.a.createElement($.a,null,r.a.createElement(S.a,{edge:"start",className:e.menuButton,color:"inherit","aria-label":"menu"},r.a.createElement(k.a,null)),r.a.createElement(h.a,{variant:"h6",className:e.title},"\u5c0f\u72fc\u72fc"),r.a.createElement(m.a,{variant:"contained",color:"secondary",onClick:function(){W(!1)}},"\u9000\u51fa"))),r.a.createElement("div",{style:{marginTop:100}},0===t?r.a.createElement(da,{id:t,pass:s,name:y.data.updatePlayerPass.name}):r.a.createElement(Na,{id:t,pass:s,name:y.data.updatePlayerPass.name})),r.a.createElement(N.a,{pt:4},r.a.createElement(za,null)))):r.a.createElement(P.a,{component:"main",maxWidth:"xs"},r.a.createElement(I.a,null),r.a.createElement("div",{style:{marginTop:"20%"}},r.a.createElement(T.a,{round:!0,src:"wolf-login.png"}),r.a.createElement(u.a,{fullWidth:!0,id:"combo-box-demo",className:e.margin,options:E.players,getOptionLabel:function(e){return"\u73a9\u5bb6 ".concat(e.id)},renderOption:function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{style:{color:e.isEmpty?"gray":"lightgreen",transition:"all .3s ease",fontSize:"24px",marginRight:"10px"}},"\u25cf")," \u73a9\u5bb6 ".concat(e.id))},onChange:function(e,a){l(a.id)},renderInput:function(e){return r.a.createElement(d.a,Object.assign({},e,{label:"\u73a9\u5bb6",variant:"outlined",margin:"dense"}))}}),r.a.createElement(d.a,{fullWidth:!0,id:"standard-basic",label:"\u5bc6\u78bc",variant:"outlined",className:e.margin,margin:"dense",onChange:function(e){return p(e.target.value)},value:s}),r.a.createElement(m.a,{type:"submit",fullWidth:!0,variant:"contained",color:"primary",className:e.submit,onClick:function(){j({variables:{id:t,pass:s}}),W(!0)}},"\u767b\u5165")),r.a.createElement(N.a,{mt:8},r.a.createElement(za,null)))}var Ua=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(p.a,{client:Wa},r.a.createElement(Ga,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(Ua,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[243,1,2]]]);
//# sourceMappingURL=main.deb6c9e4.chunk.js.map