# tinyfsm

tiny finite state machine depends on q.js


```
var q4web=require('q4web')();
var {QOK,Q,os}=q4web;
var GetMemoryUsage = ()=>{
	var rt = process.memoryUsage()||{};
	rt.freemem=os.freemem();
	rt.totalmem=os.totalmem();
	return rt;
};
var gMemoryUsage = GetMemoryUsage();
var Max=(n1,n2)=>(n1>n2)?n1:n2;
var GetMemInfo = ()=>{
	var _MemoryUsage = GetMemoryUsage();
	for(var k in _MemoryUsage){
		//gMemoryUsage[k+'_delta'] = (_MemoryUsage[k]-gMemoryUsage[k]);
		gMemoryUsage[k+'_max'] = Max(_MemoryUsage[k],gMemoryUsage[k]);
		gMemoryUsage[k] = _MemoryUsage[k];
	}
	return gMemoryUsage;
}
///////////////////////////////////////////
require('./tinyfsm')(lgc,`
RoundStart        .OK => ShowInfo        //
ShowInfo          .OK => RoundEnd        // oper when round end
RoundEnd          .OK => RoundStart      // let do next round
`).fail(err=>err).done(rst=>console.log('tinyfsm.rst=',rst));
```
