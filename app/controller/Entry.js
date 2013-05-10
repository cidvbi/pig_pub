/**
 * The main controller class for the application.
 * 
 * @this {EnterThePIG.controller.Entry}
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @see Ext.app.Controller
 *
 * @extends Ext.app.Controller
 */
Ext.define('EnterThePIG.controller.Entry', {
	extend: 'Ext.app.Controller',

	views:  ['BacteriaTree','VirusesTree','EupathsTree','HostsTree','Filters'],
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
	},/*{
		selector: 'tbtext[itemId="counter"]',
		ref: 'totalCounter'
	},{
		selector: 'tbtext[itemId="ppicounter"]',
		ref: 'ppiCounter'
	},*/{
		selector: 'radiogroup[itemId="btwnOnlyRadios"]',
		ref: 'btwnOnlyRadios'
	},{
		selector: 'radio[itemId="btwnOnlyTrue"]',
		ref: 'btwnOnlyTrue'
	},{
		selector: 'radio[itemId="btwnOnlyFalse"]',
		ref: 'btwnOnlyFalse'
	},{
		selector: 'radiogroup[itemId="hpisOnlyRadios"]',
		ref: 'hpisOnlyRadios'
	},{
		selector: 'radio[itemId="hpisOnlyTrue"]',
		ref: 'hpisOnlyTrue'
	},{
		selector: 'radio[itemId="hpisOnlyFalse"]',
		ref: 'hpisOnlyFalse'
	},{
		selector: 'button[itemId="viewInteractionsButton"]',
		ref: 'viewInteractionsButton'
	},{
		selector: 'textfield[itemId="keywordText"]',
		ref: 'keywordText'
	}],

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
			
			'radiogroup[itemId="hpisOnlyRadios"]' : {
				change: function(){
					this.getCount();
				}
			},
			'radiogroup[itemId="btwnOnlyRadios"]' : {
				change: function(){
					this.getCount();
				}
			},
			'textfield[itemId="keywordText"]' : {
				change: function(e, newVal){
					if (newVal.length < 1 || newVal.length > 4) this.activateCountTimer(newVal);
				}
			},
			'button[itemId="viewInteractionsButton"]' : {
				click: function(){
					this.launchViewer();
				}
			}
		});
	},
	
	activateCountTimer: function(newVal) {
		//if (countTimer != null) clearTimeout(countTimer);
		clearTimeout(countTimer);
		countTimer=setTimeout(function(){
			var controller=_myAppGlobal.getController('Entry');
			//console.log(controller);
			controller.getCount(controller);
		}, 1000);
	},
	
	
	onLaunch: function() {
		this.generalLoad();
		this.getHpisOnlyTrue().setValue(true);
		this.getBtwnOnlyTrue().setValue(true);
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
		
		this.getCount();
		
		return total;
	},
	
	/*
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
		
		//var label='organisms';
		//if (total==1) label='organism';
		
		//this.getTotalCounter().setText(total+' '+label+' |');
		
		if (total==0) {
			this.getViewInteractionsButton().disable();
			this.getViewInteractionsButton().setText('View 0 Interactions');
			//this.getPpiCounter().setText('0 PPIs selected');
		} else {
			this.getViewInteractionsButton().enable();
			this.getCount();
		}
				
	},
	*/
	
	
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
	

	/*
	getMinChecked: function(node) {
		var arr=[];
		if (node.get("rollup") && this.areAllChildrenChecked(node)) {
			arr.push(node.get('taxid'));
		} else {
			if (node.hasChildNodes()) {
				for (var i=0; i<node.childNodes.length; i++) {
					arr=arr.concat(this.getMinChecked(node.childNodes[i]));
				}
			} else if (node.get('checked')) {
				arr.push(node.get('taxid'));
			}
		}
		return arr;
	},
	*/
	
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

		var tidsB=this.getMinChecked(this.getBacteriaTree().getRootNode());
		var tidsV=this.getMinChecked(this.getVirusesTree().getRootNode());
		var tidsE=this.getMinChecked(this.getEupathsTree().getRootNode());
		var tidsH=this.getMinChecked(this.getHostsTree().getRootNode());

		var hpis=false;
		if (this.getHpisOnlyTrue().getValue()) hpis=true;
		var btwn=false;
		if (this.getBtwnOnlyTrue().getValue()) btwn=true;

		//var dims=Util.getElemSize('body');
		
		var params={
			keywds  : this.getKeywordText().getRawValue(),
			taxids  : tidsB.concat(tidsV,tidsE,tidsH),
			hpisOnly: hpis,
			btwnOnly: btwn,
			page    : 1/*,
			w       : dims.w,
			h       : dims.h*/
		};

		var href=(URL.parse(Util.getLoc())).href;
		var a   =href.split("/");
		a.pop();
		var newloc = a.join("/") +'/viewer/index.html?';
		newloc += Connect.makeViewerQueryString(params);
		
		//console.log(newloc);
		Util.setLoc(newloc);
		
	},
	
	getCount: function(x) {
		var src=this;
		if (x) src=x;
		
		var keywds=escape(src.getKeywordText().getRawValue());

		var hpis=false;
		if (src.getHpisOnlyTrue().getValue()) hpis=true;
		var btwn=false;
		if (src.getBtwnOnlyTrue().getValue()) btwn=true;
				
		/*
		var tids=[];
		if (src.getBacteriaTree().getView().getChecked()==0 &&
				src.getVirusesTree().getView().getChecked()==0 &&
				src.getEupathsTree().getView().getChecked()==0 &&
				src.getHostsTree().getView().getChecked()==0) {
			tids=['*'];
		} else {
		*/
		var tidsB=src.getMinChecked(src.getBacteriaTree().getRootNode());
		var tidsV=src.getMinChecked(src.getVirusesTree().getRootNode());
		var tidsE=src.getMinChecked(src.getEupathsTree().getRootNode());
		var tidsH=src.getMinChecked(src.getHostsTree().getRootNode());
		var tids =tidsB.concat(tidsV,tidsE,tidsH);
		
		if (keywds=='' && tids.length==0) {
			this.getViewInteractionsButton().disable();
			this.getViewInteractionsButton().setText('View 0 Interactions');
			return;
		}
		
		src.getViewInteractionsButton().setText('View <img src="resources/images/loading-animated-spokes.gif" width=12 height=12 />  Interactions');
		Ext.Ajax.request({
			url: Connect.makeCountRequestURL({
				taxids: tids,
				keywds: keywds,
				hpisOnly: hpis,
				btwnOnly: btwn
			}),
			params: {},
			disableCaching: false,
			headers: {
			'Accept': 'application/json'
			},
			success: function(response){
				// responseText should be in json format
				var jsonStr = response.responseText;
				var json=Ext.JSON.decode(jsonStr);
				//console.log(json);
				src.getViewInteractionsButton().setText('View ' +json.totalRows+' Interactions');
				if (json.totalRows>0) {
					src.getViewInteractionsButton().enable();
				} else {
					src.getViewInteractionsButton().disable();
				}
			},
			scope: src
		});
	},
	
	
	deselectAllTaxa: function(tree) {
		//console.log(button);
		var records = tree.getView().getChecked();
		Ext.Array.each(records, function(rec){
			//console.log(rec);
			rec.set('checked', false);
		});
	}

});
