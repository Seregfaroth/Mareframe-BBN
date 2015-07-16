MareFrame.DST.GUIHandler = function() {
    var editorMode = false;
    var canvas = new createjs.Stage("MCATool");
    var valueFnCanvas = new createjs.Stage("valueFn_canvas");
    var controlP = new createjs.Shape();
    var valueFnStage = new createjs.Container();
    var valueFnLineCont = new createjs.Container();
    var stage = new createjs.Container();
    var googleColors = ["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"];
    var hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#ffffff").drawRect(0, 0, canvas.canvas.width, canvas.canvas.height));
    var valFnBkGr = new createjs.Shape(new createjs.Graphics().beginFill("#ffffff").drawRect(0, 0, 100,100));

    hitArea.name = "hitarea";
    if(editorMode)
	hitArea.addEventListener("pressmove", pressMove);

    hitArea.addEventListener("mousedown", mouseDown);


    controlP.graphics.f("#615b4").s("#2045ff").rr(0, 0, 6, 6, 2);
    valFnBkGr.addEventListener("pressmove", moveValFnCP);
    valFnBkGr.addEventListener("mousedown", downValFnCP);
    controlP.mouseChildren = false;


    canvas.addChild(hitArea);
    canvas.addChild(stage);
    valueFnCanvas.addChild(valFnBkGr)
    valueFnCanvas.addChild(valueFnLineCont);
    valueFnCanvas.addChild(valueFnStage);
    valueFnCanvas.addChild(controlP);
    h.setGUI(this);

    
    var update = true;
    var chartsLoaded = false;
    var oldX = 0;
    var oldY = 0;
    var selectedItems = [];


    var finalScoreChart = new google.visualization.ColumnChart(document.getElementById('finalScore_div'));
    var finalScoreChartOptions = {
	width: 1024,
	height: 400,
	vAxis: { minValue: 0 },
	legend: { position: 'top', maxLines: 3 },
	bar: { groupWidth: '75%' },
	animation: { duration: 500, easing: "out", },
	isStacked: true,
	focusTarget: 'category',

    };

    
    if (!editorMode) {
	$(".header-bar").hide();
    }
    if (editorMode) {
	$(".header-bar").show();
	$("#ediDataTable").on('focusout', function () {
	    // lame that we're hooking the blur event
	    console.log(this.innerHTML);
	    //document.designMode = 'off';
	});
    }
    var elementColors = [["#efefff", "#15729b", "#dfdfff"], ["#ffefef", "#c42f33", "#ffdfdf"], ["#fff6e0", "#f6a604", "#fef4c6"], ["#efffef", "#2fc433", "#dfffdf"]];

    
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(60);

    //modify element and connection classes to contain createjs.Container object
    MareFrame.DST.Element.easelElmt = 0;
    MareFrame.DST.Element.prototype.setID = function (i) {
	this.setId(i);
	this.easelElmt.name = i;
	update = true;
    }

    this.setSize = function (x, y) {
	canvas.canvas.width = x;
	canvas.canvas.height = y;
	//$("#MCATool").width(x);
	//$("#MCATool").height(y);
    }

    this.updateElement = function(elmt)
    {
	elmt.easelElmt.removeAllChildren();

	var shape = new createjs.Shape();
	var mshape = shape.graphics.f(elementColors[elmt.getType()][0]).s(elementColors[elmt.getType()][1]);
	switch (elmt.getType()) {
		case 0: //Chance
			mshape.drawEllipse(0, 0, 150, 30);
			break;
		case 1: //Decision
			mshape.drawRect(0,0,150,30)
			break;
		case 2: //Value
			mshape.drawRoundRect(0,0,150,30,4);
			break;
		default:
		break;
	}

	

	var label = new createjs.Text(elmt.getName().substr(0,24), "1em trebuchet", elementColors[elmt.getType()][1]);
	label.textAlign = "center";
	label.textBaseline = "middle";
	label.maxWidth = 145;
	label.x = 75;
	label.y = 15;

	elmt.easelElmt.addChild(shape);
	elmt.easelElmt.addChild(label);
    }


    this.updateEditorMode = function() {
	if (editorMode) {
	    $(".header-bar").show();
	    hitArea.addEventListener("pressmove", pressMove);
	}
	else {
	    $(".header-bar").hide();
	    hitArea.removeEventListener("pressmove", pressMove);
	}
	var elementArr = h.getActiveModel().getElementArr();
	for (var i = 0; i < elementArr.length; i++) {
	    if (editorMode) {
		elementArr[i].easelElmt.addEventListener("pressmove", pressMove);
	    }
	    else {
		elementArr[i].easelElmt.removeEventListener("pressmove", pressMove);
	    }
	}
	
    }
    
    this.setEditorMode = function(cb) {
	editorMode = cb.checked;
	this.updateEditorMode();
	console.log("editormode: " + editorMode);
    }
    
    
    this.addElementToStage = function() {

	console.log("adding element to stage");
	var elmt = h.getActiveModel().CreateNewElement();

	elmt.easelElmt = new createjs.Container();

	this.updateElement(elmt);

	
	elmt.easelElmt.regX = 75;
	elmt.easelElmt.regY = 15;
	elmt.easelElmt.x = 225;
	elmt.easelElmt.y = 125;
	if(editorMode) {
	    elmt.easelElmt.addEventListener("pressmove", pressMove);
	}
	elmt.easelElmt.addEventListener("mousedown", mouseDown);
	elmt.easelElmt.on("dblclick", dblClick);
	elmt.easelElmt.mouseChildren = false;
	elmt.easelElmt.name = elmt.getID();

	stage.addChild(elmt.easelElmt);

	pause(1);
	update = true;
	return elmt;
    }

    function dblClick(e)
    {
	if(e.target.name.substr(0,4)==="elmt")
	{
	    h.gui.populateElmtDetails(e.target.name);
	    if (editorMode) {
	    	$("#defTable_div").attr("contenteditable", "true");
	    }
	    else {
	    	$("#defTable_div").attr("contenteditable", "false");
	    }
	    $("#detailsDialog").dialog("open");

	}
    }

    this.populateElmtDetails=function(elmtID)
    {
	
	var elmt = h.getActiveModel().getElement(elmtID);
	
	//console.log(elmt)
	//set dialog title
	$("#detailsDialog").dialog({
	    title: elmt.getName()
	});
	// console.log("data: " + elmt.getData());
	// console.log("string: " + this.htmlTableFromArray(elmt.getData()));

	var s = this.htmlTableFromArray(elmt.getData());
	$("#defTable_div").html(s);
	$("#defTable_div").show();

	//set description
	document.getElementById("description_div").innerHTML = elmt.getDescription();
    }

    function updateValFnCP(cPX,cPY)
    {

	valueFnStage.removeAllChildren();
	var line = new createjs.Graphics().beginStroke("#0f0f0f").mt(0, 100).bt(cPX, cPY, cPX, cPY, 100, 0);
	var plot = new createjs.Shape(line);
	valueFnStage.addChild(plot);
	valueFnCanvas.update();
	update = true;
	$("#valueFn_div").show();
    }

    function updateDataTableDiv(elmt)
    {
	// var tableMat = h.getActiveModel().getWeightedData(elmt, false);
	// tableMat.splice(0, 0, ["Scenario", "Value", "Weight"]);
// 
	// var tableData = new google.visualization.arrayToDataTable(tableMat);
	// var table = new google.visualization.Table(document.getElementById('datatable_div'));
// 
	// table.draw(tableData, { 'allowHtml': true, 'alternatingRowStyle': true, 'width': '100%', 'height': '100%' });
	// $('.google-visualization-table-table').width("100%");
    }

    function downValFnCP(e)
    {
	oldX = e.stageX;
	oldY = e.stageY;
    }

    function moveValFnCP(e)
    {
	elmt = h.getActiveModel().getElement(e.target.name)
	controlP.x = e.stageX;
	controlP.y = e.stageY;
	elmt.getData()[1] = e.stageX;
	elmt.getData()[2] = e.stageY;
	updateValFnCP(e.stageX, e.stageY);
	updateDataTableDiv(elmt);

	update = true;
	h.gui.updateFinalScores();
    }

    function getValueFnLine(xValue,color)
    {
	return new createjs.Graphics().beginStroke(color).mt(xValue,0).lt(xValue,100);
    }






    this.updateFinalScores=function()
    {
	// var data = new google.visualization.arrayToDataTable(h.getActiveModel().getFinalScore());
	// data.removeRow(data.getNumberOfRows()-1);
	// finalScoreChart.draw(data, finalScoreChartOptions);
    }

    this.updateTable = function(matrix)
    {
	var tableHTML = "";
	//console.log(matrix);
	matrix.forEach(function (row) {
	    tableHTML = tableHTML + "<tr style=\"border:1px solid black;height:64px\">";
	    for(var i = 1;i<row.length;i++){
		tableHTML = tableHTML + "<td contenteditable=true style=\"padding-right:10px;padding-left:5px;text-align:center;vertical-align:middle\">" + row[i] + "</td>";
	    }
	    tableHTML = tableHTML + "</tr>";
	})

	
	$("#editableDataTable").html(tableHTML);




    }

    function mouseDown(e) {
	//console.log("mouse down at: ("+e.stageX+","+e.stageY+")");
	oldX = e.stageX;
	oldY = e.stageY;
	console.log("target is: " + e.target);
	//console.log("cnctool options: "+$("#cnctTool").button("option","checked"));
	if (e.target.name.substr(0, 4) === "elmt") {
	    if (document.getElementById("cnctTool").checked) //check if connect tool is enabled
	    {
		console.log("cnctTool enabled");
		h.gui.connectTo(e);
	    } else {
		h.gui.select(e);
	    }
	} else {
	    h.gui.clearSelection();
	}
    }

    this.select = function(e)
    {
	//console.log("ctrl key: " + e.nativeEvent.ctrlKey);
	if (!e.nativeEvent.ctrlKey && selectedItems.indexOf(e.target) === -1) {
	    h.gui.clearSelection();
	}
	//console.log("adding to selection");
	h.gui.addToSelection(e.target);
    }

    function pressMove(e) {
	//console.log("press move");

	if (e.target.name === "hitarea") {
	    //console.log("panning");
	    stage.x += e.stageX - oldX;
	    stage.y += e.stageY - oldY;
	} else if(e.target.name.substr(0,4) === "elmt") {
	    selectedItems.forEach(function(elmt) {
		elmt.x += e.stageX - oldX;
		elmt.y += e.stageY - oldY;
		h.getActiveModel().getElement(elmt.name).getConnections().forEach(function (c) {
		    h.gui.updateConnection(c)
		});
	    });

	}
	oldX = e.stageX;
	oldY = e.stageY;
	update = true;
    }

    function tick() {
	if (update) {
	    update = false;
	    canvas.update();
	    valueFnCanvas.update();
	}
    }

    this.clear = function()
    {
	stage.removeAllChildren();
	update = true;
    }

    this.importStage = function() {
	stage.removeAllChildren();
	this.importStageElements();
	this.importStageConnections();
    } 
    this.importStageElements = function() {
	h.getActiveModel().getElementArr().forEach(function(e) {
	    stage.addChild(e.easelElmt);
	});
	update = true;
    }
    this.importStageConnections = function()
    {
	//TODO: make this.
	update = true;
    }

    this.connectTo = function (evt)
    {
	var elmtIdent = evt.target.name;
	var connected = false;
	//console.log("attempting connection "+elmtIdent);
	h.gui.getSelected().forEach(function (e) {
	    if (e.name.substr(0, 4) === "elmt" && e.name !== elmtIdent) {
		
		var c = new MareFrame.DST.Connection(h.getActiveModel().getElement(e.name), h.getActiveModel().getElement(elmtIdent));
		//console.log("connection: " + c);
		if (h.getActiveModel().addConnection(c))
		{
		    h.gui.addConnectionToStage(c);
		    connected = true;
		}
		pause(1);

	    }
	});
	if(!connected)
	{
	    h.gui.select(evt);
	}
	//this.select(elmtIdent);
    }

    this.addConnectionToStage = function(c) {
	var line = new createjs.Graphics().beginStroke("#0f0f0f").mt(c.getInput().easelElmt.x, c.getInput().easelElmt.y).lt(c.getOutput().easelElmt.x, c.getOutput().easelElmt.y);
	var conn = new createjs.Shape(line);
	var arrow = new createjs.Graphics().beginFill("#0f0f0f").mt(-5, 0).lt(5, 5).lt(5, -5).cp();
	var arrowCont = new createjs.Shape(arrow);
	var cont = new createjs.Container();
	//console.log(arrowCont);
	arrowCont.x = ((c.getInput().easelElmt.x - c.getOutput().easelElmt.x) / 2) + c.getOutput().easelElmt.x;
	arrowCont.y = ((c.getInput().easelElmt.y - c.getOutput().easelElmt.y) / 2) + c.getOutput().easelElmt.y;
	arrowCont.rotation = (180 / Math.PI) * Math.atan((c.getInput().easelElmt.y - c.getOutput().easelElmt.y) / (c.getInput().easelElmt.x - c.getOutput().easelElmt.x));
	if (c.getInput().easelElmt.x < c.getOutput().easelElmt.x) {
	    arrowCont.rotation = 180 + arrowCont.rotation;
	}
	cont.hitArea = new createjs.Graphics().setStrokeStyle(10).beginStroke("#0f0f0f").mt(c.getInput().easelElmt.x, c.getInput().easelElmt.y).lt(c.getOutput().easelElmt.x, c.getOutput().easelElmt.y);
	cont.name = c.getID();
	//conn.addEventListener("pressmove", pressMove);
	//cont.addEventListener("mousedown", mouseDown);
	cont.addChild(arrowCont);
	cont.addChild(conn);


	stage.addChildAt(cont, 0);
	c.easelElmt = cont;
	update = true;

    }

    this.updateConnection = function (c) {
	//stage.removeChild(c.easelElmt);
	c.easelElmt.getChildAt(1).graphics.clear().beginStroke("#0f0f0f").mt(c.getInput().easelElmt.x, c.getInput().easelElmt.y).lt(c.getOutput().easelElmt.x, c.getOutput().easelElmt.y);
	c.easelElmt.getChildAt(0).x = ((c.getInput().easelElmt.x - c.getOutput().easelElmt.x) / 2) + c.getOutput().easelElmt.x;
	c.easelElmt.getChildAt(0).y = ((c.getInput().easelElmt.y - c.getOutput().easelElmt.y) / 2) + c.getOutput().easelElmt.y;
	c.easelElmt.getChildAt(0).rotation = (180 / Math.PI) * Math.atan((c.getInput().easelElmt.y - c.getOutput().easelElmt.y) / (c.getInput().easelElmt.x - c.getOutput().easelElmt.x));
	if (c.getInput().easelElmt.x < c.getOutput().easelElmt.x)
	{
	    c.easelElmt.getChildAt(0).rotation = 180 + c.easelElmt.getChildAt(0).rotation;
	}
	//stage.addChildAt(c.easelElmt, 0);
	update = true;
    }

    //this.deleteConnection = function (connIdent) {
    //    canvas.getElementById(connIdent).remove();

    //}

    //	this.deleteElement = function (elmtIdent) {
    //	    h.getActiveModel().deleteElement(elmtIdent);
    //	    canvas.getElementById("grup"+elmtIdent.substr(4)).remove();
    //	}

    //	this.deleteSelected = function() {
    //		h.getActiveModel().getSelected().forEach(function(e) {
    //			if (e.getID().substr(0, 4) === "elmt")
    //				_this.deleteElement(e.getID());
    //			else if (e.getID().substr(0, 4) === "conn") {
    //				_this.deleteConnection(e.getID);
    //			}
    //		});
    //		h.getActiveModel().clearSelection();
    //	}



    this.addToSelection = function (e) {
	if (selectedItems.indexOf(e) === -1&&e.name.substr(0,4)==="elmt") {
	    selectedItems.push(e);
	    var type = h.getActiveModel().getElement(e.name).getType();
	    //console.log(e);
	    var shape = e.getChildAt(0).graphics.clear().f(elementColors[type][2]).s(elementColors[type][1]);
	    update = true;
	    
	    
	switch (type) {
		case 0: //Chance
			shape.drawEllipse(0, 0, 150, 30);
			break;
		case 1: //Decision
			shape.drawRect(0,0,150,30)
			break;
		case 2: //Value
			shape.drawRoundRect(0,0,150,30,4);
			break;
			}
			}
	}
    this.setSelection = function (e) {
	clearSelection();
	addToSelection(e);
    }

    this.getSelected = function () {
	return selectedItems;
    }

    this.clearSelection = function () {
	console.log(selectedItems);
	selectedItems.forEach(function (e) {
	    
	    var type = h.getActiveModel().getElement(e.name).getType();
	    var shape = e.getChildAt(0).graphics.clear().f(elementColors[type][0]).s(elementColors[type][1]);
	    switch (type) {
		case 0: //Chance
			shape.drawEllipse(0, 0, 150, 30);
			break;
		case 1: //Decision
			shape.drawRect(0,0,150,30)
			break;
		case 2: //Value
			shape.drawRoundRect(0,0,150,30,4);
			break;
			}
			
	});
	selectedItems = [];
	update = true;
    }
    this.htmlTableFromArray = function(data) {
    	console.log(data);
    	var numOfHeaderRows = this.numOfHeaderRows(data);
    	var htmlString = this.createHeaderTable(data);
    	for (var i = numOfHeaderRows; i < data.length; i++) {
    		htmlString += "<tr>";
    		for (var j = 0; j < data[i].length; j++) {
    			
    			//if cell is in header column
    			if (j === 0 ) {
    				htmlString += ("<th>"+ data[i][j] + "</th>");    		

    			}
    			//otherwise it is a normal cell
    			else {
    				htmlString += "<td>"+ data[i][j] + "</td>";
				}
    		}
    		htmlString += "</tr>";
    		
    		
    	}
    	console.log("html table: " + htmlString);
    	return htmlString;
    }
    
    this.createHeaderTable = function(data) {
    	var numOfHeaderRows = this.numOfHeaderRows(data);
    	var numOfCellsInRow;
    	var expNumOfCellsInRow;
    	var htmlString = "";
    	for (var i = 0; i < numOfHeaderRows; i++) {
    		numOfCellsInRow = 0;
    		htmlString += "<tr>";
    		htmlString += ("<th>"+ data[i][0] + "</th>");
    		
    		if (i > 0) {
    			expNumOfCellsInRow = (data[i].length -1) * (data[i-1].length -1); 
    		}
    		else {
    			expNumOfCellsInRow = (data[0].length - 1) 	
    		}
    		
    		//fill row until it is full
    		while (numOfCellsInRow < expNumOfCellsInRow) {
   				for (var j = 1; j < data[i].length; j++) {
   					htmlString += ("<th colspan=\"" + (numOfHeaderRows - i) + "\">"+ data[i][j] + "</th>");
   					numOfCellsInRow++;
   					
    			}
    			// console.log("Row: " + i + " Cells: " + numOfCellsInRow)
    			// console.log("Expected number of cells: "+ expNumOfCellsInRow)
    		} 
    	}   		
    	return htmlString;
    }
    
    this.numOfHeaderRows = function(data) {
    	var counter = 0;
    	for (var i = 0; i < data.length; i++) {    			
    		//if cell contains text it is a header cell
    		if (isNaN(parseFloat(data[i][1])) && data[i][1] !== undefined) {
    				counter++;    		
    		}
    	}
    	return counter;
    }
     
}