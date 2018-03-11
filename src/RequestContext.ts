
export class RequestContext {

	"null" = null ;
	
	get now():number{
		return Date.now() 
	}

	get DateNow(){
		return new Date()
	}

}