/**
 * Configuration variables for the Viewer.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {ViewerConfig}
 */
ViewerConfig={
	keywds  : '',
	taxids  : [],
	mids    : [],
	tids    : [],
	hpisOnly: false,
	btwnOnly: false,
	page    : 1,
	maxPPI  : 250,
	h       : 600,
	w       : 950,
	homeUrl : '../'
};


// pass url query arguments to the ViewerConfig object
var params=URL.parse(Util.getLoc()).params;
for (var key in params) {
	if (params.hasOwnProperty(key)) {
		var val=params[key];
		
		if (val=='') continue;
		
		if (key=='mids' || key=='tids' || key=='taxids') {
			ViewerConfig[key] = val.split(",");
		} else {
			if (val=='true')  val=true;
			if (val=='false') val=false;
			ViewerConfig[key]=val;
		}
	}
}
if (ViewerConfig.page < 1) ViewerConfig.page=1;
if (ViewerConfig.h < 600)  ViewerConfig.h   =600;
if (ViewerConfig.w < 950) ViewerConfig.w    =950;



/**
 * Configuration variables for the Graphs.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {GraphConfig}
 */
GraphConfig={
	global: {
		backgroundColor: "#ffffff",
		tooltipDelay: 100
	},
	nodes : {
		tooltipFont           : 'Verdana',
		tooltipFontSize       : 12,
		tooltipBackgroundColor: '#DBEEFF',
		tooltipBorderColor    : '#81A4D0',
		labelFontName         : 'Verdana',
		labelFontSize         : 12,
		labelFontStyle        : 'normal',		// normal | italic
		labelFontColor        : '#000000',
		selectionGlowColor    : '#FFFF33',
		selectionGlowBlur     : 12,					// 0-255; default is 8
		selectionGlowStrength : 50,					// 0-255; default is 6
		opacity               : 0.8,				// 0-1; default is 1.0
		hoverOpacity          : 1.0,				// 0-1; default is [opacity]
		hoverBorderColor      : '#000000',
		size : {
			continuousMapper: {
				attrName: 'scaledSize',
				minValue: 40,
				maxValue: 140
			}
		},
		shape: {
			discreteMapper: {
				attrName: "group",
				entries: [
					{attrValue: "bacteria", value: "ellipse"},
					{attrValue: "viruses",  value: "diamond"},
					{attrValue: "eupaths",  value: "rectangle"},
					{attrValue: "hosts",    value: "triangle"},
					{attrValue: "vectors",  value: "vee"}
				]
			}
		},
		color: {
			discreteMapper: {
				attrName: "group",
				entries: [
					{attrValue: "bacteria", value: "#99ccff"},
					{attrValue: "viruses",  value: "#ff6666"},
					{attrValue: "eupaths",  value: "#ff9966"},
					{attrValue: "hosts",    value: "#66ff66"},
					{attrValue: "vectors",  value: "#cccc00"}
				]
			}
		},
		tooltipText: {
			passthroughMapper: {
				attrName: 'taxon'
			}
		},
		tooltipBackgroundColor: {
			discreteMapper: {
				attrName: "group",
				entries: [
					{attrValue: "bacteria", value: "#99ccff"},
					{attrValue: "viruses",  value: "#ff6666"},
					{attrValue: "eupaths",  value: "#ff9966"},
					{attrValue: "hosts",    value: "#66ff66"},
					{attrValue: "vectors",  value: "#cccc00"}
				]
			}
		}
	},
	edges : {
		tooltipFont           : 'Verdana',
		tooltipFontSize       : 12,
		tooltipBackgroundColor: '#DBEEFF',
		tooltipBorderColor    : '#81A4D0',
		labelFontSize         : 14,
		labelFontStyle        : 'normal',		// normal | italic
		labelFontColor        : '#0000CC',
		selectionGlowColor    : '#FFFF33',
		selectionGlowBlur     : 12,					// 0-255; default is 8
		selectionGlowStrength : 50,					// 0-255; default is 6
		opacity               : 0.6,				// 0-1; default is 0.8
		hoverOpacity          : 1.0,				// 0-1; default is [opacity]
		color: {
			continuousMapper: {
				attrName: 'scaledSize',
				minValue: '#555555',
				maxValue: '#555555'
			}
		},
		width: {
			continuousMapper: {
				attrName: 'scaledSize',
				minValue: 5,
				maxValue: 30
			}
		},
		tooltipText: {
			passthroughMapper: {
				attrName: 'type_name'
			}
		}
	},

	selectMode        : 'both',	// edges | nodes | both | none
	defaultEdgeWidth  : 5,			// default edge width, in pixels
	defaultNodeSize   : 40			// default node diameter, in pixels
};


/**
 * Configuration variables for the Grids.
 * 
 * @author Timothy Driscoll
 * @version 3.0
 * @constructor
 * @this {GridConfig}
 */
GridConfig={
	colorCells: false
};

