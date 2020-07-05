(window.webpackJsonp=window.webpackJsonp||[]).push([[187],{322:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return i})),a.d(t,"metadata",(function(){return c})),a.d(t,"rightToc",(function(){return l})),a.d(t,"default",(function(){return o}));var n=a(2),b=a(9),r=(a(0),a(465)),i={id:"commitmongodbstorage",title:"CommitMongoDBStorage",sidebar_label:"CommitMongoDBStorage"},c={id:"api/classes/commitmongodbstorage",title:"CommitMongoDBStorage",description:"Hierarchy",source:"@site/docs/api/classes/commitmongodbstorage.md",permalink:"/eveble/docs/api/classes/commitmongodbstorage",sidebar_label:"CommitMongoDBStorage",sidebar:"api",previous:{title:"CommitMongoDBObserver",permalink:"/eveble/docs/api/classes/commitmongodbobserver"},next:{title:"CommitPublisher",permalink:"/eveble/docs/api/classes/commitpublisher"}},l=[{value:"Hierarchy",id:"hierarchy",children:[]},{value:"Implements",id:"implements",children:[]},{value:"Index",id:"index",children:[{value:"Methods",id:"methods",children:[]}]},{value:"Methods",id:"methods-1",children:[{value:"findById",id:"findbyid",children:[]},{value:"findLastVersionById",id:"findlastversionbyid",children:[]},{value:"findOneAndUpdate",id:"findoneandupdate",children:[]},{value:"flagAndResolveCommitAsTimeouted",id:"flagandresolvecommitastimeouted",children:[]},{value:"flagCommitAsFailed",id:"flagcommitasfailed",children:[]},{value:"flagCommitAsPublished",id:"flagcommitaspublished",children:[]},{value:"generateId",id:"generateid",children:[]},{value:"getAllCommits",id:"getallcommits",children:[]},{value:"getCommits",id:"getcommits",children:[]},{value:"lockCommit",id:"lockcommit",children:[]},{value:"save",id:"save",children:[]}]}],m={rightToc:l};function o(e){var t=e.components,a=Object(b.a)(e,["components"]);return Object(r.b)("wrapper",Object(n.a)({},m,a,{components:t,mdxType:"MDXLayout"}),Object(r.b)("h2",{id:"hierarchy"},"Hierarchy"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("strong",{parentName:"li"},"CommitMongoDBStorage"))),Object(r.b)("h2",{id:"implements"},"Implements"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/interfaces/types.commitstorage"}),"CommitStorage")),Object(r.b)("li",{parentName:"ul"},"CommitStorage")),Object(r.b)("h2",{id:"index"},"Index"),Object(r.b)("h3",{id:"methods"},"Methods"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/commitmongodbstorage#findbyid"}),"findById")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/commitmongodbstorage#findlastversionbyid"}),"findLastVersionById")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/commitmongodbstorage#findoneandupdate"}),"findOneAndUpdate")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/commitmongodbstorage#flagandresolvecommitastimeouted"}),"flagAndResolveCommitAsTimeouted")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/commitmongodbstorage#flagcommitasfailed"}),"flagCommitAsFailed")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/commitmongodbstorage#flagcommitaspublished"}),"flagCommitAsPublished")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/commitmongodbstorage#generateid"}),"generateId")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/commitmongodbstorage#getallcommits"}),"getAllCommits")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/commitmongodbstorage#getcommits"}),"getCommits")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/commitmongodbstorage#lockcommit"}),"lockCommit")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",Object(n.a)({parentName:"li"},{href:"/eveble/docs/api/classes/commitmongodbstorage#save"}),"save"))),Object(r.b)("h2",{id:"methods-1"},"Methods"),Object(r.b)("h3",{id:"findbyid"},"findById"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"findById"),"(",Object(r.b)("inlineCode",{parentName:"p"},"commitId"),": string): ",Object(r.b)("em",{parentName:"p"},"Promise\u2039",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit")," | undefined\u203a")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commitstorage"}),"CommitStorage"))),Object(r.b)("p",null,"Returns commit by id from MongoDB collection."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"commitId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Identifier of ",Object(r.b)("inlineCode",{parentName:"td"},"Commit"),".")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"Promise\u2039",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit")," | undefined\u203a")),Object(r.b)("p",null,"Instance implementing ",Object(r.b)("inlineCode",{parentName:"p"},"Commit")," interface, else ",Object(r.b)("inlineCode",{parentName:"p"},"undefined"),"."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"findlastversionbyid"},"findLastVersionById"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"findLastVersionById"),"(",Object(r.b)("inlineCode",{parentName:"p"},"eventSourceableId"),": string | ",Object(r.b)("a",Object(n.a)({parentName:"p"},{href:"/eveble/docs/api/classes/guid"}),"Guid"),"): ",Object(r.b)("em",{parentName:"p"},"Promise\u2039number | undefined\u203a")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commitstorage"}),"CommitStorage"))),Object(r.b)("p",null,"Returns last version of commit by event sourceable's id from MongoDB collection."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"async"))," "),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"eventSourceableId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string ","|"," ",Object(r.b)("a",Object(n.a)({parentName:"td"},{href:"/eveble/docs/api/classes/guid"}),"Guid")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Identifier as string or ",Object(r.b)("inlineCode",{parentName:"td"},"Guid")," instance.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"Promise\u2039number | undefined\u203a")),Object(r.b)("p",null,"Last commit version as number, else ",Object(r.b)("inlineCode",{parentName:"p"},"undefined"),"."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"findoneandupdate"},"findOneAndUpdate"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"findOneAndUpdate"),"(",Object(r.b)("inlineCode",{parentName:"p"},"filter?"),": FilterQuery\u2039any\u203a, ",Object(r.b)("inlineCode",{parentName:"p"},"update?"),": UpdateQuery\u2039any\u203a, ",Object(r.b)("inlineCode",{parentName:"p"},"options?"),": FindOneAndUpdateOption): ",Object(r.b)("em",{parentName:"p"},"Promise\u2039",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit")," | undefined\u203a")),Object(r.b)("p",null,"Find one document and updates it on MongoDB collection."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"async"))," "),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"filter?")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"FilterQuery\u2039any\u203a"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The Filter used to select the document to update")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"update?")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"UpdateQuery\u2039any\u203a"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The update operations to be applied to the document")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"options?")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"FindOneAndUpdateOption"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Optional settings")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"Promise\u2039",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit")," | undefined\u203a")),Object(r.b)("p",null,"Updated instance implementing ",Object(r.b)("inlineCode",{parentName:"p"},"Commit")," interface, else ",Object(r.b)("inlineCode",{parentName:"p"},"undefined"),"."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"flagandresolvecommitastimeouted"},"flagAndResolveCommitAsTimeouted"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"flagAndResolveCommitAsTimeouted"),"(",Object(r.b)("inlineCode",{parentName:"p"},"commitId"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"appId"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"workerId"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"failedAt"),": Date): ",Object(r.b)("em",{parentName:"p"},"Promise\u2039",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit")," | undefined\u203a")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commitstorage"}),"CommitStorage"))),Object(r.b)("p",null,"Flags commit as timeouted on MongoDB collection."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"async"))," "),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"commitId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Identifier for Commit that should be locked.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"appId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Application identifer on which commit timeouted.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"workerId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Worker identifer on which commit timeouted.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"failedAt")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Date"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Date of commit processing timeout.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"Promise\u2039",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit")," | undefined\u203a")),Object(r.b)("p",null,"Instance implementing ",Object(r.b)("inlineCode",{parentName:"p"},"Commit")," interface, else ",Object(r.b)("inlineCode",{parentName:"p"},"undefined"),"."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"flagcommitasfailed"},"flagCommitAsFailed"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"flagCommitAsFailed"),"(",Object(r.b)("inlineCode",{parentName:"p"},"commitId"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"appId"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"workerId"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"failedAt"),": Date): ",Object(r.b)("em",{parentName:"p"},"Promise\u2039boolean\u203a")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commitstorage"}),"CommitStorage"))),Object(r.b)("p",null,"Flags commit as failed on MongoDB collection."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"async"))," "),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"throws"))," {UpdatingCommitError}\nThrown if update operation on MongoDB is not successful."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"commitId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Identifier for Commit that should be locked.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"appId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Application identifer on which commit failed.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"workerId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Worker identifer on which commit failed.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"failedAt")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Date"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Date of commit processing fail.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"Promise\u2039boolean\u203a")),Object(r.b)("p",null,"Returns ",Object(r.b)("inlineCode",{parentName:"p"},"true")," if commit was flagged successfully, else ",Object(r.b)("inlineCode",{parentName:"p"},"false"),"."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"flagcommitaspublished"},"flagCommitAsPublished"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"flagCommitAsPublished"),"(",Object(r.b)("inlineCode",{parentName:"p"},"commitId"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"appId"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"workerId"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"publishedAt"),": Date): ",Object(r.b)("em",{parentName:"p"},"Promise\u2039boolean\u203a")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commitstorage"}),"CommitStorage"))),Object(r.b)("p",null,"Flags commit as published on MongoDB collection."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"async"))," "),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"throws"))," {UpdatingCommitError}\nThrown if update operation on MongoDB is not successful."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"commitId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Identifier for Commit that should be locked.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"appId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Application identifer on which commit is published.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"workerId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Worker identifer on which commit is published.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"publishedAt")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Date"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Date of commit publication.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"Promise\u2039boolean\u203a")),Object(r.b)("p",null,"Returns ",Object(r.b)("inlineCode",{parentName:"p"},"true")," if commit was flagged successfully, else ",Object(r.b)("inlineCode",{parentName:"p"},"false"),"."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"generateid"},"generateId"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"generateId"),"(): ",Object(r.b)("em",{parentName:"p"},"Promise\u2039string\u203a")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commitstorage"}),"CommitStorage"))),Object(r.b)("p",null,"Generates commit's id."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"Promise\u2039string\u203a")),Object(r.b)("p",null,"Identifier for ",Object(r.b)("inlineCode",{parentName:"p"},"Commit")," compatible with MongoDB."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"getallcommits"},"getAllCommits"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"getAllCommits"),"(): ",Object(r.b)("em",{parentName:"p"},"Promise\u2039",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit"),"[]\u203a")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commitstorage"}),"CommitStorage"))),Object(r.b)("p",null,"Returns all commits from MongoDB collection."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"async"))," "),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"Promise\u2039",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit"),"[]\u203a")),Object(r.b)("p",null,"List of instances implementing ",Object(r.b)("inlineCode",{parentName:"p"},"Commit")," interface."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"getcommits"},"getCommits"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"getCommits"),"(",Object(r.b)("inlineCode",{parentName:"p"},"eventSourceableId"),": string | ",Object(r.b)("a",Object(n.a)({parentName:"p"},{href:"/eveble/docs/api/interfaces/types.stringifiable"}),"Stringifiable"),", ",Object(r.b)("inlineCode",{parentName:"p"},"versionOffset"),": number): ",Object(r.b)("em",{parentName:"p"},"Promise\u2039",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit"),"[]\u203a")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commitstorage"}),"CommitStorage"))),Object(r.b)("p",null,"Returns commit from MongoDB collection if exists by event sourceable's id for specific version offset."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"async"))," "),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"eventSourceableId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string ","|"," ",Object(r.b)("a",Object(n.a)({parentName:"td"},{href:"/eveble/docs/api/interfaces/types.stringifiable"}),"Stringifiable")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Identifier as string or ",Object(r.b)("inlineCode",{parentName:"td"},"Guid")," instance.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"versionOffset")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"number"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Version number from which version events should be returned.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"Promise\u2039",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit"),"[]\u203a")),Object(r.b)("p",null,"List of instances implementing ",Object(r.b)("inlineCode",{parentName:"p"},"Commit")," interface."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"lockcommit"},"lockCommit"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"lockCommit"),"(",Object(r.b)("inlineCode",{parentName:"p"},"commitId"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"appId"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"workerId"),": string, ",Object(r.b)("inlineCode",{parentName:"p"},"registeredAndNotReceivedYetFilter"),": Record\u2039string, any\u203a): ",Object(r.b)("em",{parentName:"p"},"Promise\u2039",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit")," | undefined\u203a")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commitstorage"}),"CommitStorage"))),Object(r.b)("p",null,"Locks(changes state to received) commit on MongoDB and publishes it through CommitPublisher"),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"async"))," "),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"commitId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Identifier for Commit that should be locked.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"appId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Application identifer that is handling(locking) Commit.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"workerId")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"string"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Worker identifer that is handling(locking) Commit.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"registeredAndNotReceivedYetFilter")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Record\u2039string, any\u203a"),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Filter for MongoDB query argument which selects only commits that have not been yet received by current application.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"Promise\u2039",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit")," | undefined\u203a")),Object(r.b)("p",null,"Instance implementing ",Object(r.b)("inlineCode",{parentName:"p"},"Commit")," interface, else ",Object(r.b)("inlineCode",{parentName:"p"},"undefined"),"."),Object(r.b)("hr",null),Object(r.b)("h3",{id:"save"},"save"),Object(r.b)("p",null,"\u25b8 ",Object(r.b)("strong",{parentName:"p"},"save"),"(",Object(r.b)("inlineCode",{parentName:"p"},"commit"),": ",Object(r.b)("a",Object(n.a)({parentName:"p"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit"),"): ",Object(r.b)("em",{parentName:"p"},"Promise\u2039string\u203a")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Implementation of ",Object(r.b)("a",Object(n.a)({parentName:"em"},{href:"/eveble/docs/api/interfaces/types.commitstorage"}),"CommitStorage"))),Object(r.b)("p",null,"Adds commit to MongoDB collection."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"async"))," "),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"throws"))," {CommitConcurrencyError}\nThrown if commit with same id already exists on MongoDB collection."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"throws"))," {AddingCommitFailedError}\nThrown if commit with same id already exists on MongoDB collection."),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Parameters:")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Type"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"commit")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("a",Object(n.a)({parentName:"td"},{href:"/eveble/docs/api/interfaces/types.commit"}),"Commit")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Instance implementing ",Object(r.b)("inlineCode",{parentName:"td"},"Commit")," interface.")))),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},"Returns:")," ",Object(r.b)("em",{parentName:"p"},"Promise\u2039string\u203a")),Object(r.b)("p",null,"Identifier for document(as Commit's id) on MongoDB collection."))}o.isMDXComponent=!0},465:function(e,t,a){"use strict";a.d(t,"a",(function(){return p})),a.d(t,"b",(function(){return j}));var n=a(0),b=a.n(n);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,b=function(e,t){if(null==e)return{};var a,n,b={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(b[a]=e[a]);return b}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(b[a]=e[a])}return b}var m=b.a.createContext({}),o=function(e){var t=b.a.useContext(m),a=t;return e&&(a="function"==typeof e?e(t):c(c({},t),e)),a},p=function(e){var t=o(e.components);return b.a.createElement(m.Provider,{value:t},e.children)},O={inlineCode:"code",wrapper:function(e){var t=e.children;return b.a.createElement(b.a.Fragment,{},t)}},d=b.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,r=e.originalType,i=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),p=o(a),d=n,j=p["".concat(i,".").concat(d)]||p[d]||O[d]||r;return a?b.a.createElement(j,c(c({ref:t},m),{},{components:a})):b.a.createElement(j,c({ref:t},m))}));function j(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=a.length,i=new Array(r);i[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:n,i[1]=c;for(var m=2;m<r;m++)i[m]=a[m];return b.a.createElement.apply(null,i)}return b.a.createElement.apply(null,a)}d.displayName="MDXCreateElement"}}]);