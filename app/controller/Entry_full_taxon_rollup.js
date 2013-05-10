Ext.define('EnterThePIG.controller.Entry', {
	extend: 'Ext.app.Controller',

	views:  ['BacteriaTree','VirusesTree','EupathsTree','HostsTree'],
	stores: ['Bacteria','Viruses','Eupaths','Hosts'],
	models: ['Taxon'],

	refs: [{
		selector: '[xtype="bacteriatree"]',
		ref: 'bacteriaTree'
	},{
		selector: '[xtype="virusestree"]',
		ref: 'virusesTree'
	},{
		selector: '[xtype="eupathstree"]',
		ref: 'eupathsTree'
	},{
		selector: '[xtype="hoststree"]',
		ref: 'hostsTree'
	},{
		selector: 'tbtext[itemId="bcounter"]',
		ref: 'bacteriaCounter'
	},{
		selector: 'tbtext[itemId="vcounter"]',
		ref: 'virusesCounter'
	},{
		selector: 'tbtext[itemId="ecounter"]',
		ref: 'eupathsCounter'
	},{
		selector: 'tbtext[itemId="hcounter"]',
		ref: 'hostsCounter'
	},{
		selector: 'tbtext[itemId="counter"]',
		ref: 'totalCounter'
	},{
		selector: 'textfield[itemId="keywordText"]',
		ref: 'keywordText'
	},{
		selector: 'tbtext[itemId="ppicounter"]',
		ref: 'ppiCounter'
	},{
		selector: 'checkbox[itemId="hpisOnlyCheckbox"]',
		ref: 'hpisOnlyCheckbox'
	},{
		selector: 'button[itemId="viewInteractionsButton"]',
		ref: 'viewInteractionsButton'
	}/*,{
		selector: 'button[itemId="previewButton"]',
		ref: 'previewButton'
	}*/],

	init: function() {
		console.log('Initialized app!');
		Util.setController(this);
		
		this.control({
			'button[itemId="deselAllBacteria"]': {
				click: function() {
					this.deselectAllTaxa(this.getBacteriaTree());
					this.updateTreeCounter(this.getBacteriaCounter(), this.getBacteriaTree());
				}
			},
			'button[itemId="deselAllViruses"]' : {
				click: function() {
					this.deselectAllTaxa(this.getVirusesTree());
					this.updateTreeCounter(this.getVirusesCounter(), this.getVirusesTree());
				}
			},
			'button[itemId="deselAllEupaths"]' : {
				click: function() {
					this.deselectAllTaxa(this.getEupathsTree());
					this.updateTreeCounter(this.getEupathsCounter(), this.getEupathsTree());
				}
			},
			'button[itemId="deselAllHosts"]'   : {
				click: function() {
					this.deselectAllTaxa(this.getHostsTree());
					this.updateTreeCounter(this.getHostsCounter(), this.getHostsTree());
					//this.getHpisOnlyCheckbox().disable();
				}
			},

			'bacteriatree': {
				itemclick: function(view, node){
					this.changeBranchState(node);
					this.changeTrunkState(node);
					this.updateTreeCounter(this.getBacteriaCounter(), this.getBacteriaTree());
				}
			},
			'virusestree' : {
				itemclick: function(view, node){
					this.changeBranchState(node);
					this.changeTrunkState(node);
					this.updateTreeCounter(this.getVirusesCounter(), this.getVirusesTree());
				}
			},
			'eupathstree' : {
				itemclick: function(view, node){
					this.changeBranchState(node);
					this.changeTrunkState(node);
					this.updateTreeCounter(this.getEupathsCounter(), this.getEupathsTree());
				}
			},
			'hoststree'   : {
				itemclick: function(view, node){
					this.changeBranchState(node);
					this.changeTrunkState(node);
					var total=this.updateTreeCounter(this.getHostsCounter(), this.getHostsTree());
					/*
					if (total>0) {
						this.getHpisOnlyCheckbox().enable();
					} else {
						this.getHpisOnlyCheckbox().disable();
					}
					*/
				}
			},
			
			'checkbox[itemId="hpisOnlyCheckbox"]' : {
				change: function(){
					this.getCount();
				}
			},
			'button[itemId="viewInteractionsButton"]' : {
				click: function(){
					this.launchViewer();
				}
			}/*,
			'button[itemId="previewButton"]'          : {
				click: function(){
					this.preview();
				}
			}*/

		});
	},
	
	
	onLaunch: function() {
		this.generalLoad();
	},
	
	generalLoad: function() {

		var bacteriaStore = this.getBacteriaStore();
		bacteriaStore.load({
			callback: function(){
				this.updateRootLabel(bacteriaStore, 'All bacteria', '2');
			},
			scope: this
		});

		var virusesStore = this.getVirusesStore();
		virusesStore.load({
			callback: function(){
				this.updateRootLabel(virusesStore, 'All viruses', '10239');
			},
			scope: this
		});

		var eupathsStore = this.getEupathsStore();
		eupathsStore.load({
			callback: function(){
				this.updateRootLabel(eupathsStore, 'All eukaryotic pathogens', '5794');
			},
			scope: this
		});

		var hostsStore = this.getHostsStore();
		hostsStore.load({
			callback: function(){
				this.updateRootLabel(hostsStore, 'All hosts and vectors', '33208');
			},
			scope: this
		});

	},
	
	updateRootLabel: function(store, text, taxid) {
		var rn=store.getRootNode();
		rn.beginEdit();
		rn.set('text', text);
		rn.set('taxid', taxid);
		rn.endEdit();
	},

	updateTreeCounter: function(counter, tree) {
		//console.log(counter);
		var chkd=tree.getView().getChecked();
		//console.log(chkd);
		
		var total=0;
		for (var i=0; i<chkd.length; i++) {
			if (chkd[i].isLeaf()) total++;
		}
		
		var label;
		switch(tree.getRootNode().get('text')) {
			case 'All bacteria' :
				label='bacteria';
				if (total==1) label='bacterium';
				break;
			case 'All viruses'   :
				label='viruses';
				if (total==1) label='virus';
				break;
			case 'All eukaryotic pathogens':
				label='eukaryotic pathogens';
				if (total==1) label='eukaryotic pathogen';
				break;
			case 'All hosts and vectors'   :
				label='hosts/vectors';
				if (total==1) label='host/vector';
				break;
		}
		
		if (typeof label != 'undefined') {
			counter.setText(total+' '+label+' selected');
		}
		
		this.updateTotalCounter();
		
		return total;
	},
	
	updateTotalCounter: function() {
		var total=0;
		
		var chkd=this.getBacteriaTree().getView().getChecked();
		for (var i=0; i<chkd.length; i++) {
			if (chkd[i].isLeaf()) total++;
		}
		chkd=this.getVirusesTree().getView().getChecked();
		for (var i=0; i<chkd.length; i++) {
			if (chkd[i].isLeaf()) total++;
		}
		chkd=this.getEupathsTree().getView().getChecked();
		for (var i=0; i<chkd.length; i++) {
			if (chkd[i].isLeaf()) total++;
		}
		chkd=this.getHostsTree().getView().getChecked();
		for (var i=0; i<chkd.length; i++) {
			if (chkd[i].isLeaf()) total++;
		}
		
		var label='organisms';
		if (total==1) label='organism';
		
		this.getTotalCounter().setText(total+' '+label+' |');
		
		if (total==0) {
			//this.getPreviewButton().disable();
			this.getViewInteractionsButton().disable();
			this.getPpiCounter().setText('0 PPIs selected');
		} else {
			//this.getPreviewButton().enable();
			this.getViewInteractionsButton().enable();
			this.getCount();
		}
				
	},
	
	/*
	isEntireBranchChecked: function(node) {
		if (!node.get('checked')) return false;
		
		var state=true;
		for (var i=0; i<node.childNodes.length; i++) {
			state=this.isEntireBranchChecked(node.childNodes[i]);
			if (!state) break;
		}
		return state;
	},
	*/
	
	changeTrunkState: function(node) {
			if (node.hasChildNodes()) {
				var state=true;
				for (var i=0; i<node.childNodes.length; i++) {
					state=node.childNodes[i].get('checked');
					if (!state) break;
				}
				node.set('checked', state);
			}
			if (!node.isRoot()) this.changeTrunkState(node.parentNode);
	},
	
	changeBranchState: function(node, state) {
		if (state == undefined) state=!node.get('checked');
		node.set('checked', state);
		for (var i=0; i<node.childNodes.length; i++) {
			this.changeBranchState(node.childNodes[i], state);
		}
	},
	
	areAllChildrenChecked: function(node) {
		if (!node.hasChildNodes()) {
			return node.get('checked');
		} else {
			var state=true;
			for (var i=0; i<node.childNodes.length; i++) {
				state=node.childNodes[i].get('checked');
				if (!state) break;
			}
			return state;
		}
	},
	
	getMinChecked: function(node) {
		var arr=[];
		if (this.areAllChildrenChecked(node)) {
			arr.push(node.get('taxid'));
		} else {
			if (node.hasChildNodes()) {
				for (var i=0; i<node.childNodes.length; i++) {
					arr=arr.concat(this.getMinChecked(node.childNodes[i]));
				}
			}
		}
		return arr;
	},
	
	launchViewer: function() {
		var href=(URL.parse(Util.getLoc())).href;
		var a   =href.split("/");
		a.pop();
		var newloc = a.join("/") +'/viewer/index.html?';
		newloc += this.buildQuery();
		
		//console.log(newloc);
		Util.setLoc(newloc);
		
	},
	
	/*
	preview: function() {
		var q = this.buildQuery();
		//console.log(q);
		var count=120;
		
		var b="Ext.Msg.OK";
		var i="Ext.Msg.WARNING";
		
		var m = 'There are '+ count +' interaction';
		if (count!=1) m += 's';
		m += ' in your current selection.';
		
		if (count>0) {
			m += ' Would you like to view those interactions now?';
			Ext.MessageBox.confirm('Preview of Interactions', m, function(buttonId){
				if (buttonId=='yes') this.launchViewer();
			}, this);
		} else {
			m += ' Click Ok to return.';
			Ext.MessageBox.info('Preview of Interactions', m);
		}
		
	},
	*/
	
	deselectAllTaxa: function(tree) {
		//console.log(button);
		var records = tree.getView().getChecked();
		Ext.Array.each(records, function(rec){
			//console.log(rec);
			rec.set('checked', false);
		});
	},

	buildQuery: function() {
		var keywds=escape(this.getKeywordText().getRawValue());
		var hpis=this.getHpisOnlyCheckbox().getValue();

		var tidsB=this.getMinChecked(this.getBacteriaTree().getRootNode());
		var tidsV=this.getMinChecked(this.getVirusesTree().getRootNode());
		var tidsE=this.getMinChecked(this.getEupathsTree().getRootNode());
		var tidsH=this.getMinChecked(this.getHostsTree().getRootNode());
		
		var tids =tidsB.concat(tidsV,tidsE,tidsH);
				
		var q = 'keywds='+ keywds +'&taxids='+ tids.join(",") +'&hpisOnly='+ hpis;
		return q;
	},
	
	getCount: function() {
		var keywds=escape(this.getKeywordText().getRawValue());
		var hpis=this.getHpisOnlyCheckbox().getValue();
		
		var tidsB=this.getMinChecked(this.getBacteriaTree().getRootNode());
		var tidsV=this.getMinChecked(this.getVirusesTree().getRootNode());
		var tidsE=this.getMinChecked(this.getEupathsTree().getRootNode());
		var tidsH=this.getMinChecked(this.getHostsTree().getRootNode());
		
		var tids =tidsB.concat(tidsV,tidsE,tidsH);
		
		Ext.Ajax.request({
			url: Connect.makeCountRequestURL({
				taxids: tids,
				keywds: keywds,
				hpisOnly: hpis
			}),
			params: {},
			disableCaching: false,
			headers: {
			'Accept': 'application/json'
			},
			success: function(response){
				// responseText should be in json format
				var jsonStr = response.responseText;
				console.log(jsonStr);
				var json=Ext.JSON.decode(jsonStr);
				console.log(json);
				this.getPpiCounter().setText(json.totalRows+' PPIs selected');
				//json.totalRows;
			},
			scope: this
		});

	}
	
});