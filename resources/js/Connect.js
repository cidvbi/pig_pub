/**
 * Constructs valid api queries for PIG data. Desipte its name, this class does 
 * not actually connect to the backend.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {Connect}
 */
var Connect={

	apiUrl: 'http://example.api.com/',
	
	makeInteractionsRequestURL: function(params) {
		//console.log('Connect.makeInteractionsRequestURL');
		
		var	start = params.maxPPI * (params.page-1);
		var uri='?';
		if (params.taxids.length>0) {
			uri += 'descendants((' + params.taxids.join(',') + '))';
			if (params.btwnOnly) uri += '&between()';
		}
		uri += '&keyword(' +encodeURIComponent(params.keywds)+ ')';

		if (params.hpisOnly) uri += '&eq(is_hpi,Y)';
		
		if (params.hasOwnProperty('mids') && params.mids.length > 1) {
			var mids=[];
			var op = params.mids[0];
			var jcn='or';
			if (op=='ne') jcn='and';
			for (var i=1; i<params.mids.length; i++) {
				mids.push(op+ '(method_id,' +encodeURIComponent('"' +params.mids[i]+ '"')+ ')');
			}
			uri += '&' + jcn + '(' + mids.join(',') + ')';
		}
		
		if (params.hasOwnProperty('tids') && params.tids.length > 1) {
			var tids=[];
			var op = params.tids[0];
			var jcn='or';
			if (op=='ne') jcn='and';
			for (var i=1; i<params.tids.length; i++) {
				tids.push(op+ '(type_id,' +encodeURIComponent('"' +params.tids[i]+ '"')+ ')');
			}
			uri += '&' + jcn + '(' + tids.join(',') + ')';
		}

		uri += '&facet((pivot,(method_id,method_name)),(mincount,1),(limit,900))' + 
					 '&facet((pivot,(type_id,type_name)),(mincount,1),(limit,900))' + 
					 //'&facet((pivot,(repository_id,repository_name)),(mincount,1),(limit,900))' + 
					 '&facet((pivot,(taxon_a,taxon_b)),(mincount,1),(limit,900))' + 
					 '&facet((pivot,(taxon_a,taxid_a)),(mincount,1),(limit,900))' + 
					 '&facet((pivot,(taxon_a,group_a)),(mincount,1),(limit,900))' + 
					 '&facet((pivot,(taxon_b,group_b)),(mincount,1),(limit,900))' + 
					 '&facet((pivot,(taxon_b,taxid_b)),(mincount,1),(limit,900))' + 
					 '&limit(' +params.maxPPI+ ',' +start+ ')';

		//console.log(Connect.apiUrl+uri);
		return Connect.apiUrl+uri;
	},

	makeNewPageRequestURL: function(params) {
		//console.log('Connect.makeNewPageRequestURL');
		//console.log(params);
		
		if (!params.hasOwnProperty('mids')) params.mids=[];
		if (!params.hasOwnProperty('tids')) params.tids=[];

		var	start = params.maxPPI * (params.page-1);
		
		var uri='?';
		if (params.taxids.length>0) {
			uri += 'descendants((' + params.taxids.join(',') + '))';
			if (params.btwnOnly) uri += '&between()';
		}
		uri += '&keyword(' +encodeURIComponent(params.keywds)+ ')';

		if (params.hpisOnly) uri += '&eq(is_hpi,Y)';

		if (params.hasOwnProperty('mids') && params.mids.length > 1) {
			var mids=[];
			var op = params.mids[0];
			var jcn='or';
			if (op=='ne') jcn='and';
			for (var i=1; i<params.mids.length; i++) {
				mids.push(op+ '(method_id,' +encodeURIComponent('"' +params.mids[i]+ '"')+ ')');
			}
			uri += '&' + jcn + '(' + mids.join(',') + ')';
		}
		
		if (params.hasOwnProperty('tids') && params.tids.length > 1) {
			var tids=[];
			var op = params.tids[0];
			var jcn='or';
			if (op=='ne') jcn='and';
			for (var i=1; i<params.tids.length; i++) {
				tids.push(op+ '(type_id,' +encodeURIComponent('"' +params.tids[i]+ '"')+ ')');
			}
			uri += '&' + jcn + '(' + tids.join(',') + ')';
		}

		uri += '&limit(' +params.maxPPI+ ',' +start+ ')'+
					 '&facet((sort,+rownum))';

		//uri = encodeURIComponent(uri);
		//console.log(Connect.apiUrl+uri);
		return Connect.apiUrl+uri;
	},

	makeCountRequestURL: function(params) {
		//console.log('Connect.makeCountRequestURL');
	
		if (!params.hasOwnProperty('mids')) params.mids=[];
			if (!params.hasOwnProperty('tids')) params.tids=[];
		
		var uri='?';
		if (params.taxids.length>0) {
			uri += 'descendants((' + params.taxids.join(',') + '))';
			if (params.btwnOnly) uri += '&between()';
		}
		uri += '&keyword(' +encodeURIComponent(params.keywds)+ ')';

		if (params.hpisOnly) uri += '&eq(is_hpi,Y)';

		if (params.hasOwnProperty('mids') && params.mids.length > 1) {
			var mids=[];
			var op = params.mids[0];
			var jcn='or';
			if (op=='ne') jcn='and';
			for (var i=1; i<params.mids.length; i++) {
				mids.push(op+ '(method_id,' +encodeURIComponent('"' +params.mids[i]+ '"')+ ')');
			}
			uri += '&' + jcn + '(' + mids.join(',') + ')';
		}
		
		if (params.hasOwnProperty('tids') && params.tids.length > 1) {
			var tids=[];
			var op = params.tids[0];
			var jcn='or';
			if (op=='ne') jcn='and';
			for (var i=1; i<params.tids.length; i++) {
				tids.push(op+ '(type_id,' +encodeURIComponent('"' +params.tids[i]+ '"')+ ')');
			}
			uri += '&' + jcn + '(' + tids.join(',') + ')';
		}

		uri += '&facet((sort,+rownum))&limit(0,0)';
		
		//console.log(Connect.apiUrl+uri);
		return Connect.apiUrl+uri;
	},

	makeTreeRequest: function(group) {
		//console.log('Connect.makeTaxonPairsRequestURL');
		//console.log(params);
		if (group!='vectors') {
			return 'data/' +group+ '.tree.json';
		} else {
			return 'data/' +group+ 'tree.json';
		}
	},
	
	makeViewerQueryString: function(params) {

		var q = 'keywds='   + escape(params.keywds)   +
						'&taxids='  + params.taxids.join(',') +
						'&hpisOnly='+ params.hpisOnly         +
						'&btwnOnly='+ params.btwnOnly         +
						'&page='    + params.page;
						
		if (params.hasOwnProperty('mids') && params.mids.length > 1)
			q  += '&mids='    + params.mids.join(',');
		if (params.hasOwnProperty('tids') && params.tids.length > 1)
			q  += '&tids='    + params.tids.join(',');
		if (params.hasOwnProperty('maxPPI'))
			q  += '&maxPPI='  + params.maxPPI;
		if (params.hasOwnProperty('w'))
			q  += '&w='    + params.w;
		if (params.hasOwnProperty('h'))
			q  += '&h='    + params.h;
		
		return q;
	}

};
var countTimer=null;
	
	
