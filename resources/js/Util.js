/**
 * Creates a utility class for various top-level, general-purpose methods.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {Util}
 */
Util={
	
	controller: null,
	
	getLoc: function() {
		return window.location.href;
	},
	
	setLoc: function(url) {
		window.location.href=url;
	},
	
	getQueryParam: function(key) {
		var params = (URL.parse(Util.getLoc())).params;
		if (params.hasOwnProperty(key)) {
			var v = params[key];
			if (v=='true') v=true;
			if (v=='false') v=false;
			return v;
		} else {
			return '';
		}
	},
	
	getObj: function(id) {
		var returnVal = undefined;
		
		if (document.getElementById)
			returnVar = document.getElementById(id);
	
		else if (document.all)
			returnVar = document.all[id];
	
		else if (document.layers)
			returnVar = document.layers[id];
		
		else
			returnVar = document[id];
			
		return returnVar;
	},
	
	getElemSize: function(elem) {
		
		if (elem=='body')
			elem = document.body;
			
		else if (typeof(elem) == "string") 
			elem = this.getObj(elem);
			
		else if (typeof(elem) == "undefined") 
			return undefined;
		
		return { w:elem.offsetWidth, h:elem.offsetHeight };
	},
	
	getElemPosition: function(elem) {
		if (typeof(elem) == "string") { elem = this.getObj(elem); } 
		if (elem == null) { return undefined; }
		
		//return parseInt(elem.offsetTop);
		return {top:elem.offsetTop, left:elem.offsetLeft};
	},
	
	getElemCenter: function(elem) {
		if (typeof(elem) == "string") { elem = this.getObj(elem); } 
		if (elem == null) { return undefined; }
		
		var size = this.getElemSize(elem);
		var pos  = this.getElemPosition(elem);
		return {x:parseInt(pos.left + size.w/2), y:parseInt(pos.top + size.h/2)};
	},

	makeLinkBRC: function(linkTxt,brcid) {
		var pair = brcid.split(':');
		var href="http://www.google.com/";
		switch (pair[0]) {
			case 'patric' : 
				href="http://www.patricbrc.org/portal/portal/patric/" +
						 "Feature?cType=feature&cId=" +pair[1];
				break;
			case 'uniprotkb':
				href="http://www.uniprot.org/uniprot/" +pair[1];
				break;
			case 'refseq':
				href="http://www.ncbi.nlm.nih.gov/protein/" +pair[1];
				break;
		}
		var url="<a target=\"_blank\" href=\"" +href+ "\">" +linkTxt+ "<\/a>";
		return url;
	},
	
	makeLinkLit: function(litref) {
		var pair = litref.split(':');
		var href="http://www.google.com/";
		switch (pair[0]) {
			case 'pubmed' : 
				href="http://www.ncbi.nlm.nih.gov/pubmed/" +pair[1];
				break;
			case 'imex' : 
				href="http://www.ebi.ac.uk/intact/imex/main.xhtml?query=" +pair[1];
				break;
		}
		var url="<a target=\"_blank\" href=\"" +href+ "\">" +litref+ "<\/a>";
		return url;
	},
	
	makeLinkTax: function(name,taxid) {
		var href="http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=" +taxid;
		var url="<i><a target=\"_blank\" href=\"" +href+ "\">" +name+ "<\/a></i>";
		return url;
	},
	
	setController: function(ctl) {
		this.controller=ctl;
	},
	
	getController: function() {
		return this.controller;
	}
	
};


var URL=(function (a) {
	return {
	
		serialize: function(params) {
			var key, query = [];
			for (key in params) {
				if (params.hasOwnProperty(key))
					query.push(encodeURIComponent(key) +"="+ encodeURIComponent(params[key]));
			}
			return query.join('&');
		},
		
		unserialize: function(query) {
			var pair,params = {};
			query = query.replace(/^\?/, '').split(/&/);
			for (pair in query) {
				if (query.hasOwnProperty(pair)) {
					pair = query[pair].split('=');
					params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
				}
			}
			return params;
		},

		parse: function (url) {
			a.href = url;
			return {
				// native anchor properties
				hash: a.hash,
				host: a.host,
				hostname: a.hostname,
				href: url,
				pathname: a.pathname,
				port: a.port,
				protocol: a.protocol,
				search: a.search,
				// added properties
				file: a.pathname.split('/').pop(),
				params: URL.unserialize(a.search)
			};
		}
	};
}(document.createElement('a')));


