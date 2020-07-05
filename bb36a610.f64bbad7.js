(window.webpackJsonp=window.webpackJsonp||[]).push([[244],{379:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return o})),a.d(t,"metadata",(function(){return l})),a.d(t,"rightToc",(function(){return c})),a.d(t,"default",(function(){return p}));var n=a(2),b=a(9),r=(a(0),a(465)),o={id:"hookablemixin",title:"HookableMixin",sidebar_label:"HookableMixin"},l={id:"api/classes/hookablemixin",title:"HookableMixin",description:"Hierarchy",source:"@site/docs/api/classes/hookablemixin.md",permalink:"/eveble/docs/api/classes/hookablemixin",sidebar_label:"HookableMixin",sidebar:"api",previous:{title:"HoldTask",permalink:"/eveble/docs/api/classes/holdtask"},next:{title:"HookAlreadyExistsError",permalink:"/eveble/docs/api/classes/hookalreadyexistserror"}},c=[{value:"Hierarchy",id:"hierarchy",children:[]},{value:"Implements",id:"implements",children:[]},{value:"Index",id:"index",children:[{value:"Methods",id:"methods",children:[]}]},{value:"Methods",id:"methods-1",children:[{value:"getActions",id:"getactions",children:[]},{value:"getHook",id:"gethook",children:[]},{value:"getHookOrThrow",id:"gethookorthrow",children:[]},{value:"getHooks",id:"gethooks",children:[]},{value:"hasAction",id:"hasaction",children:[]},{value:"hasHook",id:"hashook",children:[]},{value:"overrideHook",id:"overridehook",children:[]},{value:"registerHook",id:"registerhook",children:[]},{value:"removeHook",id:"removehook",children:[]}]}],i={rightToc:c};function p(e){var t=e.components,a=Object(b.a)(e,["components"]);return Object(r.b)("wrapper",Object(n.a)({},i,a,{components:t,mdxType:"MDXLayout"}),Object(r.b)("h2",{id:"hierarchy"},"Hierarchy"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"HookableMixin"))),Object(r.b)("h2",{id:"implements"},"Implements"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/interfaces/types.hookable"}),"Hookable")),Object(r.b)("li",{parentName:"ul"},"Hookable")),Object(r.b)("h2",{id:"index"},"Index"),Object(r.b)("h3",{id:"methods"},"Methods"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/hookablemixin#getactions"}),"getActions")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/hookablemixin#gethook"}),"getHook")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/hookablemixin#gethookorthrow"}),"getHookOrThrow")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/hookablemixin#gethooks"}),"getHooks")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/hookablemixin#hasaction"}),"hasAction")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/hookablemixin#hashook"}),"hasHook")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/hookablemixin#overridehook"}),"overrideHook")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/hookablemixin#registerhook"}),"registerHook")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/hookablemixin#removehook"}),"removeHook"))),Object(r.b)("h2",{id:"methods-1"},"Methods"),Object(r.b)("h3",{id:"getactions"},"getActions"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"getActions"),"(): ",Object(r.b)("em",{parentName:"p"},Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/modules/types.hooks#actions"}),"Actions"))),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.hookable"}),"Hookable"))),Object(r.b)("p",null,"Returns a collection of all available actions with matching registered hooks as nested collection."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/modules/types.hooks#actions"}),"Actions"))),Object(r.b)("p",null,"Collection of actions(key) with matching registered hooks as nested collection(value)."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"gethook"},"getHook"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"getHook"),"(",Object(r.b)("inlineCode",{parentName:"p"},"action"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"id"),": string): ",Object(r.b)("em",{parentName:"p"},Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/modules/types#hook"}),"Hook")," | undefined")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.hookable"}),"Hookable"))),Object(r.b)("p",null,"Returns hook for action and id."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"example"))," "),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"class MyClass extends HookableMixin {}\n\nconst hook = sinon.spy();\nMyClass.prototype.registerHook('onConstruction', 'my-hook', hook);\n\nexpect(MyClass.prototype.getHook('onConstruction', 'my-hook')).to.be.equal(hook);\n")),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"action")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Action for which hook is resolved.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"id")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Identifier under which hook was was registered.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/modules/types#hook"}),"Hook")," | undefined")),Object(r.b)("p",null,"Hook as a ",Object(r.b)("inlineCode",{parentName:"p"},"function")," matching declaration, else ",Object(r.b)("inlineCode",{parentName:"p"},"undefined"),"."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"gethookorthrow"},"getHookOrThrow"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"getHookOrThrow"),"(",Object(r.b)("inlineCode",{parentName:"p"},"action"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"id"),": string): ",Object(r.b)("em",{parentName:"p"},Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/modules/types#hook"}),"Hook"))),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.hookable"}),"Hookable"))),Object(r.b)("p",null,"Returns hook for action and id or throws."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"throws"))," {HandlerNotFoundError}\nThrown if there is no hook registered for action with id."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"action")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Action for which hook is resolved.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"id")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Identifier under which hook was was registered.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/modules/types#hook"}),"Hook"))),Object(r.b)("p",null,"Hook as a ",Object(r.b)("inlineCode",{parentName:"p"},"function")," matching declaration, else throws."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"gethooks"},"getHooks"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"getHooks"),"(",Object(r.b)("inlineCode",{parentName:"p"},"action"),": string): ",Object(r.b)("em",{parentName:"p"},Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/modules/types.hooks#mappings"}),"Mappings"))),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.hookable"}),"Hookable"))),Object(r.b)("p",null,"Returns a collection of all available hooks registered for action."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"action")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Action for which hooks are resolved.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/modules/types.hooks#mappings"}),"Mappings"))),Object(r.b)("p",null,"Collection of hooks."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"hasaction"},"hasAction"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"hasAction"),"(",Object(r.b)("inlineCode",{parentName:"p"},"action"),": string): ",Object(r.b)("em",{parentName:"p"},"boolean")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.hookable"}),"Hookable"))),Object(r.b)("p",null,"Evaluates if hooks for action are registered."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"action")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Action for which hook is existence is evaluated.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"boolean")),Object(r.b)("p",null,"Returns true if hooks for action exists, else false."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"hashook"},"hasHook"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"hasHook"),"(",Object(r.b)("inlineCode",{parentName:"p"},"action"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"id"),": string): ",Object(r.b)("em",{parentName:"p"},"boolean")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.hookable"}),"Hookable"))),Object(r.b)("p",null,"Evaluates if hook for action with id is registered."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"action")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Action for which hook is existence is evaluated.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"id")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Identifier under which hook was was registered.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"boolean")),Object(r.b)("p",null,"Returns true if hook exists, else false."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"overridehook"},"overrideHook"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"overrideHook"),"(",Object(r.b)("inlineCode",{parentName:"p"},"action"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"id"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"hook"),": ",Object(r.b)("a",Object(n.a)({parentName:"p"},{href:"/eveble/docs/api/modules/types#hook"}),"Hook"),"): ",Object(r.b)("em",{parentName:"p"},"void")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.hookable"}),"Hookable"))),Object(r.b)("p",null,"Overrides registered hook by action and id or registers a new one."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"throws"))," {InvalidHookActionError}\nThrown if the the action argument is not a ",Object(r.b)("inlineCode",{parentName:"p"},"string"),"."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"throws"))," {InvalidHookIdError}\nThrown if the the id argument is not a ",Object(r.b)("inlineCode",{parentName:"p"},"string"),"."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"action")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Action for which hook will be registered(like ",Object(r.b)("inlineCode",{parentName:"td"},"onConstruction"),", ",Object(r.b)("inlineCode",{parentName:"td"},"onSend"),", ",Object(r.b)("inlineCode",{parentName:"td"},"onPublish")," etc.)")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"id")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Identifier under which hook will be registered for further reference.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"hook")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("a",Object(n.a)({parentName:"td"},{href:"/eveble/docs/api/modules/types#hook"}),"Hook")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Hook as a ",Object(r.b)("inlineCode",{parentName:"td"},"function")," matching declaration for required action that will be invoked upon action.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"void")),Object(r.b)("hr",null),Object(r.b)("h3",{id:"registerhook"},"registerHook"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"registerHook"),"(",Object(r.b)("inlineCode",{parentName:"p"},"action"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"id"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"hook"),": ",Object(r.b)("a",Object(n.a)({parentName:"p"},{href:"/eveble/docs/api/modules/types#hook"}),"Hook"),", ",Object(r.b)("inlineCode",{parentName:"p"},"shouldOverride?"),": boolean): ",Object(r.b)("em",{parentName:"p"},"void")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.hookable"}),"Hookable"))),Object(r.b)("p",null,"Registers hook by action type and id."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"throws"))," {InvalidHookActionError}\nThrown if the the action argument is not a string."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"throws"))," {InvalidHookIdError}\nThrown if the the id argument is not a string."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"throws"))," {HookAlreadyExistsError}\nThrown if the existing hook with id would be overridden."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"example"))," "),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"import {expect} from 'chai';\nimport {HookableMixin} from 'eveble'\n\nclass Document extends HookableMixin {\n  content: string;\n\n  version: number;\n\n  constructor(props: Record<keyof any, any>) {\n    super();\n    const processedProps = { ...props };\n\n    const hooks = this.getHooks('onConstruction');\n    for (const hook of Object.values(hooks)) {\n      hook.bind(this)(processedProps);\n    }\n    Object.assign(this, processedProps);\n  }\n}\n\nconst versionable = (props: Record<keyof any, any>) => {\n  if (props.version === undefined) {\n    props.version = 0;\n  }\n  return props;\n};\nDocument.prototype.registerHook('onConstruction', 'versionable', versionable);\n\nconst newDoc = new Document({ content: 'My document content' });\nexpect(newDoc.version).to.be.equal(0);\n")),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"action")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Action for which hook will be registered(like ",Object(r.b)("inlineCode",{parentName:"td"},"onConstruction"),", ",Object(r.b)("inlineCode",{parentName:"td"},"onSend"),", ",Object(r.b)("inlineCode",{parentName:"td"},"onPublish")," etc.)")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"id")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Identifier under which hook will be registered for further reference.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"hook")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("a",Object(n.a)({parentName:"td"},{href:"/eveble/docs/api/modules/types#hook"}),"Hook")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Hook as a ",Object(r.b)("inlineCode",{parentName:"td"},"function")," matching declaration for required action that will be invoked upon action.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"shouldOverride?")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"boolean"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Flag indicating that hook should be overridden if exist.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"void")),Object(r.b)("hr",null),Object(r.b)("h3",{id:"removehook"},"removeHook"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"removeHook"),"(",Object(r.b)("inlineCode",{parentName:"p"},"action"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"id"),": string): ",Object(r.b)("em",{parentName:"p"},"void")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.hookable"}),"Hookable"))),Object(r.b)("p",null,"Removes a hook by action and id."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"example"))," "),Object(r.b)("pre",null,Object(r.b)("code",Object(n.a)({parentName:"pre"},{className:"language-ts"}),"class MyClass extends HookableMixin {}\n\nconst hook = sinon.spy();\nMyClass.prototype.registerHook('onConstruction', 'my-hook', hook);\n\nMyClass.prototype.removeHook('onConstruction', 'my-hook')\nexpect(MyClass.prototype.getHook('onConstruction', 'my-hook')).to.be.undefined;\n")),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"action")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Action for which hook is removed.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"id")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Identifier under which hook was was registered.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"void")))}p.isMDXComponent=!0},465:function(e,t,a){"use strict";a.d(t,"a",(function(){return O})),a.d(t,"b",(function(){return m}));var n=a(0),b=a.n(n);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function c(e,t){if(null==e)return{};var a,n,b=function(e,t){if(null==e)return{};var a,n,b={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(b[a]=e[a]);return b}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(b[a]=e[a])}return b}var i=b.a.createContext({}),p=function(e){var t=b.a.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},O=function(e){var t=p(e.components);return b.a.createElement(i.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return b.a.createElement(b.a.Fragment,{},t)}},j=b.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,r=e.originalType,o=e.parentName,i=c(e,["components","mdxType","originalType","parentName"]),O=p(a),j=n,m=O["".concat(o,".").concat(j)]||O[j]||s[j]||r;return a?b.a.createElement(m,l(l({ref:t},i),{},{components:a})):b.a.createElement(m,l({ref:t},i))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=a.length,o=new Array(r);o[0]=j;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:n,o[1]=l;for(var i=2;i<r;i++)o[i]=a[i];return b.a.createElement.apply(null,o)}return b.a.createElement.apply(null,a)}j.displayName="MDXCreateElement"}}]);