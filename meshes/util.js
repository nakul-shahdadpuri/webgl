let loadTextResource = function(url,callback){

	let request = new XMLHttpRequest();
	request.open('GET',url,true);
	request.onload = function(){
		if (request.status < 200 || request.status > 299)
		{
			callback('Error: HTTP Status ' + request.status + ' on resource '+ url)
		}
		else {
				callback(null,request.responseText);
		}
	};
	request.send();
};

