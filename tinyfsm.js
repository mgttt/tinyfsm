module.exports = (lgc,fsm_data,step_start)=>{
	//parse fsm from str to obj:
	var pt;
	var fsm_o = (typeof(fsm_data)=='object') ? fsm_data : fsm_data.split(/[\n\r]+/).reduce(
		(r,e)=>(m=e.replace(/\s/g,'').match(/^(\w+)?(\.(\w*)=>(\w*))?/))&&(pt=m[1]||pt,pt&&(r[pt]=(r[pt]||{}),r[pt][m[3]]=m[4]),r),{}
	);
	var Q = require('q');
	//find start:
	if(!step_start){ for(var nm in fsm_o){ if(nm){step_start=nm; break}} }
	//tiny fsm exec engine:
	var dfr=Q.defer();
	var fsm_exec = (step_name,prev_nm,prev_sts,prev_rst) =>
		lgc[step_name] ? lgc[step_name](prev_rst,prev_nm,prev_sts).then((rst,STS,step_next)=>(
			STS = (rst||{}).STS,
			step_next = (fsm_o[step_name]||{})[STS],
			step_next ? fsm_exec(step_next,step_name,STS,rst) : dfr.resolve(rst)
		)) : dfr.resolve({STS:'KO',errmsg:(prev_nm)?(prev_nm+'.'+prev_sts+'?=>'+step_name):(step_name)});
	fsm_exec(step_start);
	return dfr.promise;
};
