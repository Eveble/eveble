(window.webpackJsonp=window.webpackJsonp||[]).push([[103],{238:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return b})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return p}));var r=n(2),a=n(9),i=(n(0),n(465)),s={id:"abilityassertion",title:"AbilityAssertion",sidebar_label:"AbilityAssertion"},b={id:"api/classes/abilityassertion",title:"AbilityAssertion",description:"Hierarchy",source:"@site/docs/api/classes/abilityassertion.md",permalink:"/eveble/docs/api/classes/abilityassertion",sidebar_label:"AbilityAssertion",sidebar:"api",next:{title:"AcceptTask",permalink:"/eveble/docs/api/classes/accepttask"}},c=[{value:"Hierarchy",id:"hierarchy",children:[]},{value:"Index",id:"index",children:[{value:"Constructors",id:"constructors",children:[]},{value:"Properties",id:"properties",children:[]},{value:"Methods",id:"methods",children:[]}]},{value:"Constructors",id:"constructors-1",children:[{value:"constructor",id:"constructor",children:[]}]},{value:"Properties",id:"properties-1",children:[{value:"api",id:"api",children:[]},{value:"asserter",id:"asserter",children:[]}]},{value:"Methods",id:"methods-1",children:[{value:"getApi",id:"getapi",children:[]}]}],o={rightToc:c};function p(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},o,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("h2",{id:"hierarchy"},"Hierarchy"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("p",{parentName:"li"},Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"/eveble/docs/api/classes/assertion"}),"Assertion"))),Object(i.b)("li",{parentName:"ul"},Object(i.b)("p",{parentName:"li"},"Assertion"),Object(i.b)("p",{parentName:"li"},"\u21b3 ",Object(i.b)("strong",{parentName:"p"},"AbilityAssertion")))),Object(i.b)("h2",{id:"index"},"Index"),Object(i.b)("h3",{id:"constructors"},"Constructors"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"/eveble/docs/api/classes/abilityassertion#constructor"}),"constructor"))),Object(i.b)("h3",{id:"properties"},"Properties"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"/eveble/docs/api/classes/abilityassertion#api"}),"api")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"/eveble/docs/api/classes/abilityassertion#asserter"}),"asserter"))),Object(i.b)("h3",{id:"methods"},"Methods"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",Object(r.a)({parentName:"li"},{href:"/eveble/docs/api/classes/abilityassertion#getapi"}),"getApi"))),Object(i.b)("h2",{id:"constructors-1"},"Constructors"),Object(i.b)("h3",{id:"constructor"},"constructor"),Object(i.b)("p",null,"+"," ",Object(i.b)("strong",{parentName:"p"},"new AbilityAssertion"),"(",Object(i.b)("inlineCode",{parentName:"p"},"asserter"),": ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"/eveble/docs/api/interfaces/types.asserter"}),"Asserter"),"): ",Object(i.b)("em",{parentName:"p"},Object(i.b)("a",Object(r.a)({parentName:"em"},{href:"/eveble/docs/api/classes/abilityassertion"}),"AbilityAssertion"))),Object(i.b)("p",null,Object(i.b)("em",{parentName:"p"},"Inherited from ",Object(i.b)("a",Object(r.a)({parentName:"em"},{href:"/eveble/docs/api/classes/assertion"}),"Assertion"),".",Object(i.b)("a",Object(r.a)({parentName:"em"},{href:"/eveble/docs/api/classes/assertion#constructor"}),"constructor"))),Object(i.b)("p",null,Object(i.b)("em",{parentName:"p"},"Overrides void")),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"Parameters:")),Object(i.b)("table",null,Object(i.b)("thead",{parentName:"table"},Object(i.b)("tr",{parentName:"thead"},Object(i.b)("th",Object(r.a)({parentName:"tr"},{align:null}),"Name"),Object(i.b)("th",Object(r.a)({parentName:"tr"},{align:null}),"Type"))),Object(i.b)("tbody",{parentName:"table"},Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",Object(r.a)({parentName:"tr"},{align:null}),Object(i.b)("inlineCode",{parentName:"td"},"asserter")),Object(i.b)("td",Object(r.a)({parentName:"tr"},{align:null}),Object(i.b)("a",Object(r.a)({parentName:"td"},{href:"/eveble/docs/api/interfaces/types.asserter"}),"Asserter"))))),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"Returns:")," ",Object(i.b)("em",{parentName:"p"},Object(i.b)("a",Object(r.a)({parentName:"em"},{href:"/eveble/docs/api/classes/abilityassertion"}),"AbilityAssertion"))),Object(i.b)("h2",{id:"properties-1"},"Properties"),Object(i.b)("h3",{id:"api"},"api"),Object(i.b)("p",null,"\u2022 ",Object(i.b)("strong",{parentName:"p"},"api"),": ",Object(i.b)("em",{parentName:"p"},"Map\u2039string, any\u203a")," = new Map([\n// Validation - ensures that ",Object(i.b)("inlineCode",{parentName:"p"},"Entity")," is able to handle an action(throws error)\n[\n'ensure.is.ableTo',\nnew Proxy(this, {\nget(target: any, propKey: string): any {\nconst entity = target.asserter.getEntity();\nif (typeof entity","[propKey]"," === 'function') {\nconst proxifiedMethod = new Proxy(entity","[propKey]",", {\napply(_targetMethod, _thisArg, args): any {\nentity",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:""}),"SAVE_STATE_METHOD_KEY"),";\nconst result = entity",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"...args"}),"propKey"),";\nentity",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:""}),"ROLLBACK_STATE_METHOD_KEY"),";\ntarget.asserter.clearAction();\nreturn result;\n},\n});\nreturn proxifiedMethod;\n}\nreturn entity","[propKey]",";\n},\n}),\n],\n// Evaluation - evaluates that ",Object(i.b)("inlineCode",{parentName:"p"},"Entity")," is able to handle an action(returns boolean)\n[\n'is.ableTo',\nnew Proxy(this, {\nget(target: any, propKey: string): any {\nconst entity = target.asserter.getEntity();\nif (typeof entity","[propKey]"," === 'function') {\nconst proxifiedMethod = new Proxy(entity","[propKey]",", {\napply(_targetMethod, _thisArg, args): any {\nentity",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:""}),"SAVE_STATE_METHOD_KEY"),";\nlet isAble = true;\ntry {\nentity",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"...args"}),"propKey"),";\n} catch (e) {\nisAble = false;\n}\nentity",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:""}),"ROLLBACK_STATE_METHOD_KEY"),";\nreturn isAble;\n},\n});\nreturn proxifiedMethod;\n}\nreturn entity","[propKey]",";\n},\n}),\n],\n])"),Object(i.b)("p",null,Object(i.b)("em",{parentName:"p"},"Overrides ",Object(i.b)("a",Object(r.a)({parentName:"em"},{href:"/eveble/docs/api/classes/assertion"}),"Assertion"),".",Object(i.b)("a",Object(r.a)({parentName:"em"},{href:"/eveble/docs/api/classes/assertion#api"}),"api"))),Object(i.b)("p",null,"Since our goal is to enable expressive API in form of:"),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},Object(i.b)("inlineCode",{parentName:"strong"},"example"))," "),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"entity.ensure.is.ableTo.doAction(...)\n")),Object(i.b)("p",null,"We need to use Proxy to pass-through all calls to the entity itself\n(entity state will be not changed upon invoking method)."),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},Object(i.b)("inlineCode",{parentName:"strong"},"remarks")),"\nThe ",Object(i.b)("inlineCode",{parentName:"p"},"entity.ensure")," getter-method will return a Proxified instance of the\n",Object(i.b)("inlineCode",{parentName:"p"},"Entity"),". This proxified instance listens to all get methods and\ncatches the requested method name."),Object(i.b)("p",null,"If the requested get method is named ",Object(i.b)("inlineCode",{parentName:"p"},"is")," - ",Object(i.b)("inlineCode",{parentName:"p"},"is")," an existing api registered\non ",Object(i.b)("inlineCode",{parentName:"p"},"Asserter")," with ",Object(i.b)("inlineCode",{parentName:"p"},"AbilityAssertion")," as assertion API.\nThis will return an object that will include property:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts"}),"{ableTo: ...}\n")),Object(i.b)("p",null,"That will be fired with code below."),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},Object(i.b)("inlineCode",{parentName:"strong"},"remarks")),"\nSame approach is used for evaluator api ",Object(i.b)("inlineCode",{parentName:"p"},"is.ableTo"),"(returning boolean\nby catching any thrown error) - however it was replaced by\n",Object(i.b)("inlineCode",{parentName:"p"},"Entity.prototype.can")," method directly build on Entity.\nThe ",Object(i.b)("inlineCode",{parentName:"p"},"is.ableTo")," legacy code is still available to show possibilities of\nbuilding custom assertion apis without direct modification of\n",Object(i.b)("inlineCode",{parentName:"p"},"Entity")," or its subclasses - to have a assertion api code shared\n'globally'."),Object(i.b)("hr",null),Object(i.b)("h3",{id:"asserter"},"asserter"),Object(i.b)("p",null,"\u2022 ",Object(i.b)("strong",{parentName:"p"},"asserter"),": ",Object(i.b)("em",{parentName:"p"},Object(i.b)("a",Object(r.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.asserter"}),"Asserter"))),Object(i.b)("p",null,Object(i.b)("em",{parentName:"p"},"Inherited from ",Object(i.b)("a",Object(r.a)({parentName:"em"},{href:"/eveble/docs/api/classes/assertion"}),"Assertion"),".",Object(i.b)("a",Object(r.a)({parentName:"em"},{href:"/eveble/docs/api/classes/assertion#asserter"}),"asserter"))),Object(i.b)("p",null,Object(i.b)("em",{parentName:"p"},"Overrides void")),Object(i.b)("h2",{id:"methods-1"},"Methods"),Object(i.b)("h3",{id:"getapi"},"getApi"),Object(i.b)("p",null,"\u25b8 ",Object(i.b)("strong",{parentName:"p"},"getApi"),"(): ",Object(i.b)("em",{parentName:"p"},"Map\u2039string, Function\u203a")),Object(i.b)("p",null,Object(i.b)("em",{parentName:"p"},"Inherited from ",Object(i.b)("a",Object(r.a)({parentName:"em"},{href:"/eveble/docs/api/classes/assertion"}),"Assertion"),".",Object(i.b)("a",Object(r.a)({parentName:"em"},{href:"/eveble/docs/api/classes/assertion#getapi"}),"getApi"))),Object(i.b)("p",null,Object(i.b)("em",{parentName:"p"},"Overrides void")),Object(i.b)("p",null,Object(i.b)("strong",{parentName:"p"},"Returns:")," ",Object(i.b)("em",{parentName:"p"},"Map\u2039string, Function\u203a")))}p.isMDXComponent=!0},465:function(e,t,n){"use strict";n.d(t,"a",(function(){return l})),n.d(t,"b",(function(){return j}));var r=n(0),a=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function b(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var o=a.a.createContext({}),p=function(e){var t=a.a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):b(b({},t),e)),n},l=function(e){var t=p(e.components);return a.a.createElement(o.Provider,{value:t},e.children)},O={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},d=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,o=c(e,["components","mdxType","originalType","parentName"]),l=p(n),d=r,j=l["".concat(s,".").concat(d)]||l[d]||O[d]||i;return n?a.a.createElement(j,b(b({ref:t},o),{},{components:n})):a.a.createElement(j,b({ref:t},o))}));function j(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,s=new Array(i);s[0]=d;var b={};for(var c in t)hasOwnProperty.call(t,c)&&(b[c]=t[c]);b.originalType=e,b.mdxType="string"==typeof e?e:r,s[1]=b;for(var o=2;o<i;o++)s[o]=n[o];return a.a.createElement.apply(null,s)}return a.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);