var MareFrame = MareFrame || {};
MareFrame.DST = MareFrame.DST || {};





MareFrame.DST.Handler = function () {
	var modelArr = [];
	var activeModel;
    this.fileHandler = new MareFrame.DST.FileIO();
    

    console.log("javascript handler");
    this.init = function() {
    	console.log("handler init running");
    	var loadModel = "scotland"; //getUrlParameter('model');
    	if (loadModel!==null) {
    	    h.fileHandler.QuickLoad(loadModel);
    	} else {
    	    this.addNewModel();
    	}
    }

    this.reset = function() {
	var loadModel = "scotland" //getUrlParameter('model');
	h.fileHandler.QuickLoad(loadModel);
    };

    this.getGUI = function() {
        return gui;
    };
    this.setGUI = function(g) {
	    this.gui = g;
    }

    this.getFileIO = function() {
        return fileHandler;
    }

    this.addNewModel = function () {
    	var mdl = new MareFrame.DST.Model()
    	//modelArr.push(mdl);
    	this.setActiveModel(mdl);
    	h.gui.clear();
		//console.log(mdl)
    	return mdl;
    }

    this.addModel = function(m) {
        modelArr.push(m);
    }

    this.closeModel = function(e) {

    }

    this.setActiveModel = function(m) {
    	activeModel = m;
    	//h.gui.importStage();
    }

    this.getActiveModel = function() {
        return activeModel;
    }

    
}

MareFrame.DST.FileIO = function ()
{
	var LastPath = "";
    this.SaveModel= function (m)
    {
        
    }
    
    this.QuickSave = function ()
    {
    	var m = h.getActiveModel();
    	var json = JSON.stringify(m);
    	localStorage.setItem("temp",json);
    }

    this.QuickLoad = function (model)
    {
    	var path = "";
    	switch(model)
    	{
    		case "baltic":
    			path = "JSON/baltic.json";
    			break;
    		case "blackSea":
    			path = "JSON/blackSea.json";
    			break;
    		case "cadiz":
    			path = "JSON/cadiz.json";
    			break;
    		case "iceland":
    			path = "JSON/iceland.json";
    			break;
    		case "northSea":
    			path = "JSON/northSea.json";
    			break;
    		case "scotland":
    			path = "JSON/scotland.json";
    			break;
    		case "sicily":
    			path = "JSON/sicily.json";
    			break;
    		default:
    			break;
    	}
    	console.log("localstorage empty");
    	console.log(path);
    		jQuery.getJSON(path, function (data) {

    			console.log(data);
    			var mdl = h.addNewModel();
    			mdl.fromJSON(data);
    			h.gui.updateFinalScores();
    		});
    		
    	//}

    }
}

function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}//borrowed code

function getUrlParameter(sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}//borrowed code



MareFrame.DST.Model = function()
{
    var elementArr = [];
    var connectionArr = [];
    var modelName = "untitled";
    var modelPath = "./";
    //var plotArr = [];
    var modelChanged = true;
    var dataMatrix = [];
    // var mainObjective;
// 
    // this.setMainObj=function(obj)
    // {
    	// mainObjective = obj;
    // }
    // this.getMainObj=function()
    // {
    	// return mainObjective;
    // }

    this.getDataMatrix = function () {
    	return dataMatrix;
    }

    this.setDataMatrix = function (mat) {
    	dataMatrix = mat;
    }

    this.getWeights = function (elmt)
    {
    	var weightsArr = [];
    	
    	//traverse down the tree and store the weights for each attrib, normalized to fraction of 1 each level
    	// if (elmt.getType() != 0) {
    		// var total = 0.0;
    		// elmt.getData()[1].forEach(function (val) { total += val; });
    		// for (var i = 0; i < elmt.getData()[0].length; i++) {
    			// var childWeights = this.getWeights(this.getConnection(elmt.getData()[0][i]).getInput());
    			// for (var j = 0; j < childWeights.length; j++)
    			// {
    				// childWeights[j][1] *= (elmt.getData()[1][i]/total);
    			// }
    			// weightsArr = weightsArr.concat(childWeights);
    		// }
    	// } else {
    		// weightsArr.push([elmt.getData()[0], 1]);
    	// }
    	return weightsArr;
    }

    this.getFinalScore = function () {
    	// var tempMatrix = JSON.parse(JSON.stringify(dataMatrix));
    	// var weightsArr = this.getWeights(mainObjective);
// 
    	// //console.log(tempMatrix);
    	// for (var i = 0; i < weightsArr.length; i++)
    	// {
    		// var currentMax = 0;
    		// for (var j = 1; j < tempMatrix.length; j++) {
    			// if (tempMatrix[j][i + 1] > currentMax) {
    				// currentMax = tempMatrix[j][i + 1];
    			// }
    		// }
    		// var elmtData = h.getActiveModel().getElement(dataMatrix[0][i+1]).getData()
    		// for(var j=1;j<tempMatrix.length-1;j++)
    		// {
// 				
// 				
    			// tempMatrix[j][i + 1] = getValueFn(tempMatrix[j][i + 1] / currentMax,(elmtData[1]/99)+ 0.5,(elmtData[2]/99)+0.5);
    			// //console.log(getValueFn(tempMatrix[j][i + 1] / currentMax, elmtData[1]/100, elmtData[2]/100));
    			// //console.log(tempMatrix[j][i + 1] / currentMax);
    			// tempMatrix[j][i + 1] *= weightsArr[i][1];
    			// tempMatrix[j][i + 1] = (Math.round(1000*tempMatrix[j][i + 1]))/1000;
    		// }
// 
    	// }
    	// for (var i = 1; i < tempMatrix.length-1; i++)
    	// {
    		// tempMatrix[i][0] = this.getElement(tempMatrix[i][0]).getName();
    	// }
//     	
// 
    	// return tempMatrix;
    }


    function getValueFn(xVal, posX, posY) {

    	var A = 1 - 3 * posX + 3 * posX;
    	var B = 3 * posX - 6 * posX;
    	var C = 3 * posX;

    	var E = 1 - 3 * posY + 3 * posY;
    	var F = 3 * posY - 6 * posY;
    	var G = 3 * posY;

    	// Solve for t given x (using Newton-Raphelson), then solve for y given t.
    	// Assume for the first guess that t = x.
    	var currentT = xVal;
    	var nRefinementIterations = 5;
    	for (var i = 0; i < nRefinementIterations; i++) {
    		var currentX = xFromT(currentT, A, B, C);
    		var currentSlope = slopeFromT(currentT, A, B, C);
    		currentT -= (currentX - xVal) * (currentSlope);
    		currentT = Math.max(0, Math.min(currentT, 1));
    	}

    	var y = yFromT(currentT, E, F, G);
    	return y;


    	// Helper functions:
    	function slopeFromT(t, A, B, C) {
    		var dtdx = 1.0 / (3.0 * A * t * t + 2.0 * B * t + C);
    		return dtdx;
    	}

    	function xFromT(t, A, B, C) {
    		var x = A * (t * t * t) + B * (t * t) + C * t;
    		return x;
    	}

    	function yFromT(t, E, F, G) {
    		var y = E * (t * t * t) + F * (t * t) + G * t;
    		return y;
    	}
    }

    this.getWeightedData = function (elmt,addHeader) {
    	var tempMatrix = [];
    	if (addHeader) {
    		tempMatrix.push(['string', 'number']);
    	}
    	switch (elmt.getType()) {
    		case 2: //scenario
    			for (var i = 1; i < dataMatrix[0].length; i++) {
    				tempMatrix.push([dataMatrix[0][i], dataMatrix[elmt.getData()[0]][i]]);
    			}
    			break;
    		case 0: //attribute
    			var maxVal = 0;
    			for (var i = 1; i < dataMatrix.length - 1; i++) {
    				if (dataMatrix[i][elmt.getData()[0]] > maxVal) {
    					maxVal = dataMatrix[i][elmt.getData()[0]];
    				}
    			}
    			for (var i = 1; i < dataMatrix.length - 1; i++) {
    				
    				var toAdd = [this.getElement(dataMatrix[i][0]).getName(), dataMatrix[i][elmt.getData()[0]]];
    				if (!addHeader)
    					toAdd.push(getValueFn(dataMatrix[i][elmt.getData()[0]] / maxVal, (elmt.getData()[1] / 99)+0.5, (elmt.getData()[2] / 99)+0.5));
    				console.log(elmt.getData()[1]);
    				tempMatrix.push(toAdd);
    			}
    			break;
    		case 1: //sub-objective
    			var total = 0.0;
    			elmt.getData()[1].forEach(function (val) { total += val; });
    			//console.log(total + " : " + elmt.getName());
    			for (var i = 0; i < elmt.getData()[0].length; i++) {
    				//console.log(elmt.getData());
    				var tempEl = this.getConnection(elmt.getData()[0][i]).getInput();
    				
    				var tempArr = this.getWeightedData(tempEl);
    				//console.log(tempArr);


    				var result=0;
    				for (var j = 0; j < tempArr.length; j++) {
    					
    					result += tempArr[j][1];
    					
    				}
    				//console.log(result + " " + elmt.getName()+"; "+tempArr+" "+tempEl.getName());
    				tempMatrix.push([tempEl.getName(), result * (elmt.getData()[1][i] / total)]);
    			}
    			break;
    	}
    	return tempMatrix;
    }

	this.update = function() {
		elementArr.forEach(function(elmt) {
			elmt.update();
		})
	}
    this.CreateNewElement = function () {
    	var e = new MareFrame.DST.Element();
        elementArr.push(e);
        return e;

    }

    this.getElement = function (id) {
        return elementArr[getElementIndex(id)];
    }

    function getElementIndex(id) {
        var key = 0;
        elementArr.every(function (elm) {
            if (elm.getID() === id)
                return false;
            else {
                key = key + 1;
                return true;
            }
        });
        return key;
    }

    this.getConnections= function()
    {
    	return connectionArr;
    }

    this.getConnection = function(id) {
	    return connectionArr[getConnectionIndex(id)];
    }

    function getConnectionIndex(id) {
    	var key = 0;
    	connectionArr.every(function (conn) {
    		if (conn.getID() === id)
    			return false;
    		else {
    			key = key + 1;
    			return true;
    		}
    	});
    	return key;
    }

    this.getElementArr = function() {
        return elementArr;
    }
    
    this.deleteElement = function (id) {

        h.getActiveModel().getElement(id).deleteAllConnections();

		

	    elementArr.splice(getElementIndex(id), 1);
    }
    
    this.setName = function (n)
    {
        modelName = n;
    }
    
    this.getName = function ()
    {
        return modelName;
    }
    
    this.addConnection = function(c)
    {
    	var validConn = true;
    	connectionArr.forEach(function (conn) {

    		if (conn === c)
    		{ validConn = false; }
    		else if((c.getOutput().getID()===conn.getOutput().getID()&&c.getInput().getID()===conn.getInput().getID())||(c.getOutput().getID()===conn.getInput().getID()&&c.getInput().getID()===conn.getOutput().getID()))
    		{
    			validConn = false;
    		}
    	});
    	if (validConn) {
    		connectionArr.push(c);

    		c.getInput().addConnection(c);
    		c.getOutput().addConnection(c);
    		return true;
    	} else
    	{
    		return false;
    	}
    }

    this.toJSON = function()
    {
    	return {elements:elementArr , connections:connectionArr , mdlName : modelName, dataMat:dataMatrix};
    }

    this.fromJSON = function(jsonElmt)
    {
    	console.log("fromJSON");
    	$("#modelHeader").html(jsonElmt.mdlName);
    	
    	console.log($("#model_header").html());
    	var header = $("#model_header").html();
    	//Only append if model name has not been added
    	if (header.indexOf(">", header.length - 1) !== -1) {
    		$("#model_header").append(jsonElmt.mdlName);
    	}
    	
    	modelName = jsonElmt.mdlName;

    	dataMatrix = jsonElmt.dataMat;
    	h.gui.updateTable(dataMatrix);
		
    	var maxX = 0;
    	var maxY = 0;

    	jsonElmt.elements.forEach(function (elmt) {
    		var e = h.gui.addElementToStage();
    		e.fromJSON(elmt);
    		
    		h.gui.updateElement(e);
    		if (elmt.posX > maxX)
    			maxX = elmt.posX;

    		if (elmt.posY > maxY)
    			maxY = elmt.posY;

    	});

    	jsonElmt.connections.forEach(function (conn) {
    		var inpt = h.getActiveModel().getElement(conn.connInput);
    		var c = new MareFrame.DST.Connection(inpt, h.getActiveModel().getElement(conn.connOutput));
    		c.fromJSON(conn);
    		if (h.getActiveModel().addConnection(c)) {
    			h.gui.addConnectionToStage(c);
    		}
    	});
    	
    	console.log("elements: " + this.getElementArr());

    	
    	//Update data
    	this.getElementArr().forEach(function (elmt) {
    		elmt.updateData(elmt);
    	})
    	//mainObjective = this.getElement(jsonElmt.mainObj);

    	h.gui.setSize(maxX+80,maxY+20);
    }
}

MareFrame.DST.Element = function ()
{
    var data = [];
    var id = "elmt"+new Date().getTime();
    var name = "Element";
    var description = "write description here";
    var type = 1
    var connections = [];
    var values = [];
    var updated = true;
    
    this.getData = function ()
    {
        return data;
    }
    this.setData = function (d)
    {
        data = d;
    }
    
    this.getID = function() {
	    return id;
    }
    this.setId = function(i) {
	    id = i;
    }
    this.getName = function ()
    {
        return name;
    }
    this.setName = function (n)
    {
        name = n;
    }
    this.getDescription = function ()
    {
        return description;
    }
    this.setDescription = function (d)
    {
        description = d;
    }
    this.getType = function ()
    {
        return type;
    }
    this.setType = function (t)
    {
        type = t;
    }
    this.getMethod = function () {
    	return weightingMethod;
    }

    this.setMethod = function (i) {
    	weightingMethod = i;
    }
    
    this.getValues = function ()
    {
        return values;
    }
    this.setValues = function (v)
    {
        values = v;
    }
    this.isUpdated = function() {
    	return updated;
    }
    this.setUpdated = function(b) {
    	updated = b;
    }
    

    this.deleteConnection = function (id) {
    	var key = 0;
    	this.connections.every(function (elm) {
    		if (elm.getID() === id)
    			return false;
    		else {
    			key = key + 1;
    			return true;
    		}
    	});
    	connections[key];

    	connections.splice(key, 1);


    }
    this.deleteAllConnections = function () {
    	connections.forEach(function (c) {
    		c.deleteThis(this.id);
    	});

    	connections = [];
    }
    this.addConnection = function (e) {
    	connections.push(e);
    }
    this.getConnections = function () {
    	return connections;
    }
    
    this.updateValueArray = function(e) {
    	var values = [];
    	this.getConnections().forEach(function(c) {
    		if (c.getOutput().getName() === e.getName()) {
    			var inputElmt = c.getInput();
    			var newRow = inputElmt.getMainValues();
    			values.unshift(newRow);
    		}
    	})
    	//TODO calculate values
    }
    this.update = function() {
    	this.updateData(this);
    	this.updateValueArray(this);
    }
    this.updateData = function (e) {
    	console.log("updateData " + e.getName());
    	var data = []
    	var originalData = e.getData();
    	for (var i = originalData.length-1; i >= this.numOfHeaderRows(); i--) {
    		console.log("i: " + i);
    		console.log("new data: " + originalData[i]);
    		data.unshift(originalData[i]);
    	}
    	// var tempData = e.getData()
    	// var data = tempData[tempData.length - 1];
    	console.log(data);
    	this.getConnections().forEach(function(c) {
    		if (c.getOutput().getName() === e.getName()) {
    			var inputElmt = c.getInput();
    			var newRow = inputElmt.getMainValues();
    			data.unshift(newRow);
    			console.log("new row: " + newRow);
    		}
    	})
    	console.log("updated data: ");
    	console.log(data);
    	this.setData(data);
    	
    }
    this.getMainValues = function() {
    	var row = [];
    	var data = this.getData();
    	row.push(this.getName());
    	// console.log("Data length: " + data.length);
    	for (var i = 0; i < data.length; i++) {
    		// console.log("i: " + i);
    		// console.log("check data: " + data[i][1]);
    		if (!isNaN(parseFloat(data[i][1])) || data[i][1] === undefined ) {
    			row.push(data[i][0]);   
    			//console.log("push data " + data[i][0]);
    		}
    	}
    	//console.log("new row: " + row);
    	return row;
    }
    
    this.numOfHeaderRows = function() {
    	var data = this.getData();
		var counter = 0;
		for (var i = 0; i < data.length; i++) {
			//if cell contains text it is a header cell
			if (isNaN(parseFloat(data[i][1])) && data[i][1] !== undefined) {
				counter++;
			}
		}
		return counter;
	}
    this.toJSON = function () {
    	
    	return { posX: this.easelElmt.x, posY: this.easelElmt.y, elmtID: this.getID(), elmtName: name, elmtDesc: this.getDescription(), elmtType: this.getType(), elmtData: this.getData(), elmtWghtMthd: this.weightingMethod };
    }
    this.fromJSON = function (jsonElmt) {
    	this.easelElmt.x = jsonElmt.posX;
    	this.easelElmt.y = jsonElmt.posY;
    	this.setID(jsonElmt.elmtID);
    	name = jsonElmt.elmtName;
    	this.setName(jsonElmt.elmtName);
    	this.setDescription(jsonElmt.elmtDesc);
    	this.setType(jsonElmt.elmtType);
    	this.setData(jsonElmt.defData);
    	this.setMethod(jsonElmt.elmtWghtMthd);
    }

}





MareFrame.DST.Connection = function (eIn, eOut)
{    
    var inputElement = eIn;
    var outputElement = eOut;
    var id = "conn" + new Date().getTime();

    this.deleteThis = function (calledElement) {
        if (inputElement.getID() === calledElement) {
	        outputElement.deleteConnection(id);
        } else {
	        inputElement.deleteConnection(id);

        }
    }

    this.getID= function()
    {
        return id;
    }

    this.setID= function(i)
    {
        id = i;
    }
           
    this.setInput = function (e)
    {
        inputElement = e;
    }
    
    this.setOutput = function (e)
    {
        outputElement = e;
    }
    
    this.getInput = function ()
    {
        return inputElement;
    }
    
    this.getOutput = function ()
    {
        return outputElement;
    }
    
    this.flip = function ()
    {
        var e = inputElement;
        inputElement = outputElement;
        outputElement = e;

        inputElement.deleteConnection(id);
        outputElement.addConnection(id);
    }

    this.toJSON =function()
    {
    	return { connInput: inputElement.getID(), connOutput: outputElement.getID(), connID: id };
    }

    this.fromJSON = function(jsonElmt)
    {
    	id = jsonElmt.connID;
    }
}

$(document).ready(function () {

	h = new MareFrame.DST.Handler();
	
    if (MareFrame.DST.GUIHandler) {
		console.log("guihandler found");
		MareFrame.DST.GUIHandler();
		h.init();
	}

	$("#button").bind("click", function (e) {
		
	});
});
