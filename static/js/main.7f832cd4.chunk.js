(this["webpackJsonpdnd-horde-battler"]=this["webpackJsonpdnd-horde-battler"]||[]).push([[0],{23:function(e,t,a){},24:function(e,t,a){},31:function(e,t,a){"use strict";a.r(t);var c=a(1),s=a(2),n=a.n(s),r=a(13),o=a.n(r),i=(a(23),a(7)),l=a(9),d=a(14),h=a(15),j=a(17),m=a(16),u=(a(24),a(25),a(33)),b=a(34),O=a(35),p=a(36),x=a(37),f=a(8),g=a(10),v=function(e){Object(j.a)(a,e);var t=Object(m.a)(a);function a(e){var s;return Object(d.a)(this,a),(s=t.call(this,e)).changeStats=function(e){s.setState({creatureStats:Object(l.a)(Object(l.a)({},s.state.creatureStats),{},Object(i.a)({},e.target.name,e.target.value))})},s.changeParams=function(e){s.setState(Object(i.a)({},e.target.name,e.target.value))},s.parseDamDice=function(e,t){var a,c,n,r=0,o=e.toUpperCase();if(o.includes("D")){var i=o.split("D"),l=i[0],d=i[1];if(d.includes("+")){var h=d.split("+");c=parseInt(h[0]),n=parseInt(h[1])}else if(d.includes("-")){var j=d.split("-");c=parseInt(j[0]),n=parseInt(j[1])}else c=parseInt(i[1]),n=0;a=parseInt(l),t&&(a*=2);for(var m=c+n,u=1+n,b=0;b<a;b++)r+=s.rollDie(u,m);return r}s.setState({validity:!1})},s.rollDie=function(e,t){return e+Math.floor(Math.random()*(t-e+1))},s.handleAddToHorde=function(){for(var e=s.state,t=e.creatureStats,a=e.numOfCreatures,c=e.chosenHorde,n=s.state[c],r=0;r<a;r++){var o={num:n.length+1,hp:parseInt(t.hp)||1,maxHp:parseInt(t.hp)||1,ac:parseInt(t.ac)||10,att:parseInt(t.att)||0,damDice:t.damDice||"1d1"};n.push(o)}s.setState(Object(i.a)({},s.state.chosenHorde,n))},s.deleteCreature=function(e,t){var a=s.state[e];a.splice(t,1);s.setState(Object(i.a)({},e,a))},s.attack=function(e,t){for(var a=s.state[e],c=s.state.combatLog,n=s.state[t],r=0;r<a.length;r++){var o=a[r];if(o.hp>0){var d=Math.floor(Math.random()*n.length);n[d].hp<=0&&(d=Math.floor(Math.random()*n.length));var h=n[d],j=s.rollDie(1+o.att,20+o.att);if(j-o.att==20){var m=s.parseDamDice(a[r].damDice,"critical");c.push("#".concat(o.num," from ").concat(e," attacks #").concat(h.num," scoring a critical hit (").concat(j,"), dealing ").concat(m," damage!!"))}else if(j>=h.ac){var u,b=s.parseDamDice(a[r].damDice);n[d].hp-=b,c.push("#".concat(o.num," from ").concat(e," attacks #").concat(h.num," and hits (").concat(j,"), dealing ").concat(b," damage!")),s.setState((u={},Object(i.a)(u,h,Object(l.a)(Object(l.a)({},s.state[h]),{},{arr:n})),Object(i.a)(u,"combatLog",c),u))}else c.push("#".concat(o.num," from ").concat(e," attacks #").concat(h.num," and misses (").concat(j,").")),s.setState({combatLog:c})}}},s.resetHorde=function(e){s.setState(Object(i.a)({},e,[]))},s.renderCreature=function(e,t,a){var n,r=e.maxHp,o=e.hp,i=e.num,l=o>0?o:0;return n=0==l?"dead":l<r&&l>r/2?"damaged":l<=r/2?"bloodied":"normal",Object(c.jsxs)("div",{className:"creature-container",id:n,children:[Object(c.jsx)(g.a,{className:"delete-icon",onClick:function(){return s.deleteCreature(t,a)}}),Object(c.jsxs)("div",{className:"creature-designation",children:["#",i]}),Object(c.jsx)(f.b,{className:"skull"}),Object(c.jsxs)("div",{className:"data",children:[l," / ",r]})]},"creatureContainer; ".concat(t,": ").concat(a))},s.renderCombatLogEntry=function(e,t){return Object(c.jsxs)("div",{className:"entry",children:["Entry #".concat(t+1,"."),Object(c.jsx)("div",{className:"text",children:e})]},"combatLogEntry: ".concat(t))},s.state={creatureStats:{hp:1,ac:10,att:0,damDice:"",validity:!0},hordeA:[],hordeB:[],combatLog:[],numOfCreatures:1,chosenHorde:""},s}return Object(h.a)(a,[{key:"render",value:function(){for(var e=this,t=this.state.creatureStats,a=t.hp,s=t.ac,n=t.att,r=t.damDice,o=!1,i=0,l=0,d=0;d<this.state.hordeA.length;d++)0==this.state.hordeA[d].hp&&i++;for(var h=0;h<this.state.hordeB.length;h++)0==this.state.hordeB[h].hp&&l++;return i!=this.state.hordeA.length&&l!=this.state.hordeB.length&&0!=this.state.hordeA.length&&0!=this.state.hordeB.length||(o=!0),Object(c.jsxs)(u.a,{className:"App",fluid:!0,children:[Object(c.jsxs)(b.a,{noGutters:!0,className:"top-row",children:[Object(c.jsxs)(O.a,{className:"top-col divider",children:[Object(c.jsxs)("div",{className:"title-content",children:[Object(c.jsx)("div",{className:"title",children:"D&D Horde Battler"}),Object(c.jsx)("div",{className:"subtext",children:"This program utilizes basic d20 rules to determine the outcome of a pitched battle between two groups of combatants."})]}),Object(c.jsxs)("div",{className:"horde-data-div",children:[Object(c.jsxs)("div",{className:"creature-input-container",children:[Object(c.jsx)(p.a,{onChange:this.changeParams,name:"numOfCreatures",value:this.state.numOfCreatures,placeholder:"# of creatures...",type:"number",className:"number-of-creatures-form-control"}),Object(c.jsxs)(p.a,{onChange:this.changeParams,name:"chosenHorde",value:this.state.chosenHorde,as:"select",className:"select-horde-form-control",children:[Object(c.jsx)("option",{value:"",children:"Select a horde..."}),Object(c.jsx)("option",{value:"hordeA",children:"Horde A"}),Object(c.jsx)("option",{value:"hordeB",children:"Horde B"})]}),Object(c.jsxs)(x.a,{onClick:function(){return e.handleAddToHorde("hordeA")},className:"common-button add-button",children:[Object(c.jsx)(g.b,{}),"Add to Horde"]})]}),Object(c.jsx)("div",{className:"header",children:"Creature Stats"}),Object(c.jsxs)(b.a,{noGutters:!0,children:[Object(c.jsxs)(O.a,{lg:4,className:"form-control-container",children:[Object(c.jsxs)("label",{children:[Object(c.jsx)(f.d,{className:"label-icon"}),"HP"]}),Object(c.jsx)(p.a,{onChange:this.changeStats,name:"hp",value:a,type:"number"})]}),Object(c.jsxs)(O.a,{lg:4,className:"form-control-container",children:[Object(c.jsxs)("label",{children:[Object(c.jsx)(f.a,{className:"label-icon"}),"AC"]}),Object(c.jsx)(p.a,{onChange:this.changeStats,name:"ac",value:s,type:"number"})]}),Object(c.jsxs)(O.a,{lg:4,className:"form-control-container",children:[Object(c.jsxs)("label",{children:[Object(c.jsx)(f.e,{className:"label-icon"}),"Attack Bonus"]}),Object(c.jsx)(p.a,{onChange:this.changeStats,name:"att",value:n,type:"number"})]}),Object(c.jsxs)(O.a,{lg:4,className:"form-control-container",children:[Object(c.jsxs)("label",{children:[Object(c.jsx)(f.c,{className:"label-icon"}),"Damage"]}),Object(c.jsx)(p.a,{onChange:this.changeStats,name:"damDice",placeholder:"Ex. 1d8+2; 3d6+4",value:r})]})]})]})]}),Object(c.jsxs)(O.a,{className:"top-col",children:[Object(c.jsxs)("div",{className:"horde-data-div horde-container",children:[Object(c.jsxs)(x.a,{disabled:o,onClick:function(){return e.attack("hordeA","hordeB")},className:"common-button attack-button",children:[Object(c.jsx)(f.e,{}),"Attack!"]}),Object(c.jsx)(g.c,{onClick:function(){return e.resetHorde("hordeA")},className:"reset-icon"}),Object(c.jsxs)("div",{className:"header",children:["Horde A (",this.state.hordeA.length,")"]}),Object(c.jsx)(b.a,{noGutters:!0,children:this.state.hordeA.map((function(t,a){return e.renderCreature(t,"hordeA",a)}))})]}),Object(c.jsxs)("div",{className:"horde-data-div horde-container",children:[Object(c.jsxs)(x.a,{disabled:o,onClick:function(){return e.attack("hordeB","hordeA")},className:"common-button attack-button",children:[Object(c.jsx)(f.e,{}),"Attack!"]}),Object(c.jsx)(g.c,{onClick:function(){return e.resetHorde("hordeB")},className:"reset-icon"}),Object(c.jsxs)("div",{className:"header",children:["Horde B (",this.state.hordeB.length,")"]}),Object(c.jsx)(b.a,{noGutters:!0,children:this.state.hordeB.map((function(t,a){return e.renderCreature(t,"hordeB",a)}))})]}),Object(c.jsxs)("div",{className:"horde-data-div combat-log-container",children:[Object(c.jsx)("div",{className:"header",children:"Combat Log"}),Object(c.jsx)("div",{className:"combat-log",children:this.state.combatLog.map((function(t,a){return e.renderCombatLogEntry(t,a)}))})]})]})]}),Object(c.jsx)(b.a,{noGutters:!0,className:"footer-row",children:"Written by John Martinez"})]})}}]),a}(s.Component),N=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,38)).then((function(t){var a=t.getCLS,c=t.getFID,s=t.getFCP,n=t.getLCP,r=t.getTTFB;a(e),c(e),s(e),n(e),r(e)}))};o.a.render(Object(c.jsx)(n.a.StrictMode,{children:Object(c.jsx)(v,{})}),document.getElementById("root")),N()}},[[31,1,2]]]);
//# sourceMappingURL=main.7f832cd4.chunk.js.map