var q4web=require('q4web')();
var {QOK,Q,os}=q4web;

//
const easyMonitor = require('easy-monitor');
easyMonitor('test_tinyfsm_mem');
//browser http://127.0.0.1:12333

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

//var delay=(t)=>{
//	var ddd=Q.defer();
//	var tm=setTimeout(()=>{
//		clearTimeout(tm);
//		tm=null;
//		ddd.resolve(QOK());
//		delete ddd;
//		ddd=null;
//	},t);
//	return ddd.promise;
//};

var lgc={
	RoundStart:()=>Q({STS:'OK'})
	,RoundEnd:()=>Q.delay(111).then(()=>QOK())
	,ShowInfo(){
		console.log('GetMemInfo()',GetMemInfo());
		return Q({STS:'OK'})
	}
};


require('./tinyfsm')(lgc,`
RoundStart        .OK => ShowInfo        //
ShowInfo          .OK => RoundEnd        // oper when round end
RoundEnd          .OK => RoundStart      // let do next round
`).fail(err=>err).done(rst=>{
	console.log('tinyfsm.rst=',rst);
});
wanjochan: ~/Downloads/mega/MegaTrade_work
