var MareFrame = MareFrame || {};
MareFrame.DST = MareFrame.DST || {};

MareFrame.DST.Handler = function() {
	var modelArr = [];
	var activeModel;
	this.fileHandler = new MareFrame.DST.FileIO();

	console.log("javascript handler");
	this.init = function() {
		console.log("handler init running");
		var loadModel = "scotland";
		//getUrlParameter('model');
		if (loadModel !== null) {
			h.fileHandler.QuickLoad(loadModel);
		} else {
			this.addNewModel();
		}
	}

	this.reset = function() {
		var loadModel = "scotland"//getUrlParameter('model');
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

	this.addNewModel = function() {
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
	}

	this.getActiveModel = function() {
		return activeModel;
	}
}

MareFrame.DST.FileIO = function() {
	var LastPath = "";
	this.SaveModel = function(m) {

	}

	this.QuickSave = function() {
		var m = h.getActiveModel();
		var json = JSON.stringify(m);
		localStorage.setItem("temp", json);
	}

	this.QuickLoad = function(model) {
		var path = "";
		switch(model) {
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
		jQuery.getJSON(path, function(data) {

			console.log(data);
			var mdl = h.addNewModel();
			mdl.fromJSON(data);
		});
	}
}
function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) {/* Do nothing */
	}
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


MareFrame.DST.Model = function() {
	var elementArr = [];
	var connectionArr = [];
	var modelName = "untitled";
	var modelPath = "./";
	var modelChanged = true;

	this.update = function() {
		elementArr.forEach(function(elmt) {
			if (true) {//}!elmt.isUpdated()) {   Not working yet
				elmt.update();
			}
		})
	}
	this.CreateNewElement = function() {
		var e = new MareFrame.DST.Element();
		elementArr.push(e);
		return e;

	}

	this.getElement = function(id) {
		return elementArr[getElementIndex(id)];
	}
	function getElementIndex(id) {
		var key = 0;
		elementArr.every(function(elm) {
			if (elm.getID() === id)
				return false;
			else {
				key = key + 1;
				return true;
			}
		});
		return key;
	}


	this.getElementByName = function(name) {
		var element;
		elementArr.forEach(function(elm) {
			if (elm.getName() === name) {
				// console.log("found " + elm)
				element = elm;
			}
		});
		return element;
	}

	this.getConnections = function() {
		return connectionArr;
	}

	this.getConnection = function(id) {
		return connectionArr[getConnectionIndex(id)];
	}
	function getConnectionIndex(id) {
		var key = 0;
		connectionArr.every(function(conn) {
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

	this.deleteElement = function(id) {

		h.getActiveModel().getElement(id).deleteAllConnections();

		elementArr.splice(getElementIndex(id), 1);
	}

	this.setName = function(n) {
		modelName = n;
	}

	this.getName = function() {
		return modelName;
	}

	this.addConnection = function(c) {
		var validConn = true;
		connectionArr.forEach(function(conn) {

			if (conn === c) {
				validConn = false;
			} else if ((c.getOutput().getID() === conn.getOutput().getID() && c.getInput().getID() === conn.getInput().getID()) || (c.getOutput().getID() === conn.getInput().getID() && c.getInput().getID() === conn.getOutput().getID())) {
				validConn = false;
			}
		});
		if (validConn) {
			connectionArr.push(c);

			c.getInput().addConnection(c);
			c.getOutput().addConnection(c);
			return true;
		} else {
			return false;
		}
	}

	this.toJSON = function() {
		return {
			elements : elementArr,
			connections : connectionArr,
			mdlName : modelName
		};
	}

	this.fromJSON = function(jsonElmt) {
		console.log("fromJSON");
		$("#modelHeader").html(jsonElmt.mdlName);

		console.log($("#model_header").html());
		var header = $("#model_header").html();
		//Only append if model name has not been added
		if (header.indexOf(">", header.length - 1) !== -1) {
			$("#model_header").append(jsonElmt.mdlName);
		}

		modelName = jsonElmt.mdlName;

		var maxX = 0;
		var maxY = 0;

		jsonElmt.elements.forEach(function(elmt) {
			var e = h.gui.addElementToStage();
			e.fromJSON(elmt);

			h.gui.updateElement(e);
			if (elmt.posX > maxX)
				maxX = elmt.posX;

			if (elmt.posY > maxY)
				maxY = elmt.posY;

		});

		jsonElmt.connections.forEach(function(conn) {
			var inpt = h.getActiveModel().getElement(conn.connInput);
			var c = new MareFrame.DST.Connection(inpt, h.getActiveModel().getElement(conn.connOutput));
			c.fromJSON(conn);
			if (h.getActiveModel().addConnection(c)) {
				h.gui.addConnectionToStage(c);
			}
		});

		//Update data
		this.getElementArr().forEach(function(elmt) {
			elmt.update();
		})

		h.gui.setSize(maxX + 80, maxY + 20);
	}
}

MareFrame.DST.Element = function() {
	var data = [];
	var id = "elmt" + new Date().getTime();
	var name = "Element";
	var description = "write description here";
	var type = 1
	var connections = [];
	var values = [];
	var updated = false;

	this.getData = function() {
		return data;
	}
	this.setData = function(d) {
		data = d;
	}

	this.getID = function() {
		return id;
	}
	this.setId = function(i) {
		id = i;
	}
	this.getName = function() {
		return name;
	}
	this.setName = function(n) {
		name = n;
	}
	this.getDescription = function() {
		return description;
	}
	this.setDescription = function(d) {
		description = d;
	}
	this.getType = function() {
		return type;
	}
	this.setType = function(t) {
		type = t;
	}
	this.getValues = function() {
		return values;
	}
	this.setValues = function(v) {
		values = v;
	}
	this.isUpdated = function() {
		return updated;
	}
	this.setUpdated = function(b) {
		updated = b;
	}

	this.deleteConnection = function(id) {
		var key = 0;
		this.connections.every(function(elm) {
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
	this.deleteAllConnections = function() {
		connections.forEach(function(c) {
			c.deleteThis(this.id);
		});

		connections = [];
	}
	this.addConnection = function(e) {
		connections.push(e);
	}
	this.getConnections = function() {
		return connections;
	}
	this.getChildElements = function() {
		var elmt = this;
		var children = [];
		this.getConnections().forEach(function(c) {
			if (c.getOutput().getName() === elmt.getName()) {
				children.push(c.getInput());
			}
		})
		//console.log(elmt.getName() + " children: " + children);
		return children;

	}
	this.getChildElementsByType = function(type) {
		var elmt = this;
		var children = [];
		this.getConnections().forEach(function(c) {
			if (c.getOutput().getName() === elmt.getName() && c.getInput().getType() === type) {
				children.push(c.getInput());
			}
		})
		return children;

	}
	this.getChildElementByName = function(name) {
		console.log("in")
		this.getChildElements().forEach(function(elmt) {
			if (elmt.getName() === name) {
				console.log("returned " + elmt.getName())
				return elmt;
			} else {
				var nextChild = elmt.getChildElementByName(name)
				if (nextChild !== undefined) {
					console.log("returned " + nextChild.getName())
					return nextChild;
				}
			}
		})
	}

	this.update = function() {
		this.updateData();
		if (this.updateValues()) {
			this.setUpdated(true);
		}

	}
	this.updateValues = function() {
		var updated = false;
		if (this.getType() !== 1) {//This is not working for decision nodes yet
			var model = h.getActiveModel();
			//console.log("updating values for " + this.getName());
			var values = this.copyDefArray();
			this.setValues(values);
			// console.log("Starting at: "+ values);
			var numOfHeaderRows = this.numOfHeaderRows();
			// console.log("number of header rows in defData: " + numOfHeaderRows);
			var headerElement;
			var isChoiceConditioned = false;
			var childValues;
			//For each header row
			for (var n = numOfHeaderRows - 1; n >= 0; n--) {
				// console.log("n: " + n);
				// console.log("values: " + values);
				headerElement = model.getElementByName(values[n][0]);
				// console.log("header element values: " + headerElement.getValues());
				if (headerElement.getType() === 0) {//Chance node
					// console.log("header element is a chance node");
					childValues = headerElement.getValues();
					numOfDecisionsInChild = headerElement.numOfDecisions()
					// console.log("child values:\n" + childValues)
					//Add decisions to values table
					//For each decision in the childs values table
					for (var i = 0; i < numOfDecisionsInChild; i++) {
						// console.log("There are decisions in the childs value table")
						//Add the decision to the values table
						this.addToValuesArray(childValues[i]);
						numOfHeaderRows++;
						isChoiceConditioned = true;
						values = this.getValues();
						n++;
						// console.log("header element values: " + headerElement.getValues());
					}
					//Calculate the new value in each cell
					this.calculateNewValues(n, numOfHeaderRows, numOfDecisionsInChild, isChoiceConditioned);

					//Sum values that belong to the same child element but different condions
					this.sumValues(n, numOfHeaderRows);

					isChoiceConditioned = false;
					//Delete the row from the table
					values.splice(n, 1);
					numOfHeaderRows--;
				}
			}
			// console.log("result: " + this.getValues());
			updated = true;
		}
		return updated;
	}
	this.calculateNewValues = function(rowNumber, numOfHeaderRows, numOfDecisionsInChild, isChoiceConditioned) {
		var values = this.getValues();
		console.log("calculating new values from " + values);
		var n = rowNumber;
		var model = h.getActiveModel();
		headerElement = model.getElementByName(values[n][0]);
		console.log("number of rows: " + values.length);
		//For each value row
		for (var i = numOfHeaderRows; i < values.length; i++) {
			//For each value cell
			for (var j = 1; j < values[0].length; j++) {
				if (isChoiceConditioned) {
					//Create an array with the conditions
					var conditions = this.arrayFromValuesColumn(j, n - numOfDecisionsInChild, n - 1);
					values[i][j] *= headerElement.getValueWithCondition(values[n][j], conditions)
				} else {
					// console.log(values[i][j] + " * " + headerElement.getValue(values[n][j]));
					values[i][j] *= headerElement.getValue(values[n][j]);
				}
				console.log("new value in " + i + ", " + j + ": " + values[i][j]);
			}
		}
	}
	this.sumValues = function(rowNumber, numOfHeaderRows) {
		var values = this.getValues();
		var firstHeader = values[rowNumber][1];
		// console.log("values table before summing:")
		// console.log(values);
		//For each column
		var rowLength = values[0].length - 1;
		for (var j = 1; j < rowLength; j++) {
			// console.log("rowLength: " + rowLength)
			//If the value in the header is not equal to the first header value
			//i.e. all different conditions have not been summed yet
			if (values[rowNumber][j + 1] !== firstHeader) {
				for (var i = numOfHeaderRows; i < values.length; i++) {
					// console.log("value " + values[i][j + 1] + " is added to " + values[i][j]);
					values[i][j] += values[i][j + 1];
				}
				this.deleteValueColumn(j + 1);
				j--;
				rowLength--;
			}
		}
	}
	this.numOfDecisions = function() {
		var values = this.getValues();
		var counter = 0;
		for (var i = 0; i < values.length; i++) {
			//if the cell in column 2 contains text it is a header row and must be a decision
			if (isNaN(values[i][1])) {
				counter++;
			}
		}
		return counter;
	}
	this.arrayFromValuesColumn = function(column, start, end) {
		var values = this.getValues();
		// console.log("creating array from column " + column + " in \n" + values + " from row " + start+ " to " +end);
		var array = [];

		for (var i = start; i <= end; i++) {
			array.push(values[i][column]);
		}
		// console.log("returned " + array)
		return array;
	}

	this.copyDefArray = function() {
		var data = this.getData();
		// var valueArray = data.concat();
		var valueArray = [];

		for (var i = 0; i < data.length; i++) {
			valueArray[i] = [];
			for (var j = 0; j < data[0].length; j++) {
				valueArray[i].push(data[i][j]);
			}
		}
		return valueArray;
	}
	this.deleteValueColumn = function(columnNo) {
		var values = this.getValues();
		for (var i = 0; i < values.length; i++) {
			values[i].splice(columnNo, 1);
		}

	}
	this.getValueWithCondition = function(rowElmt, conditionArray) {
		// console.log("getting value " + rowElmt+  " with condition " + conditionArray)
		var values = this.getValues();
		// console.log("values table : \n " + values);
		//First find the right row
		for (var i = 0; i < values.length; i++) {
			if (values[i][0] === rowElmt) {
				//Then find the right column
				for (var j = 1; j < values[0].length; j++) {
					// console.log("new column")
					var rightColumn = true;
					for (var n = 0; n < this.numOfDecisions(); n++) {
						//If element is not found, this is not the right column
						// console.log("looking for " + values[n][j] + " in " + conditionArray);
						if (conditionArray.indexOf(values[n][j]) === -1) {
							// console.log("not found");
							rightColumn = false;
							break;
						}
					}
					//If all elements are found in the column return the value
					if (rightColumn) {
						// console.log("returned " + values[i][j]);
						return values[i][j];
					}
				}
			}

		}
	}
	this.getValue = function(rowElmt) {
		var values = this.getValues();
		for (var i = 0; i < values.length; i++) {
			if (values[i][0] === rowElmt) {
				return values[i][1];
			}
		}
	}
	this.addToValuesArray = function(anArray) {
		console.log("Adding array: " + anArray)
		var array = anArray.slice();
		//Convert the array to only contain one of each element
		var newArray = [array[0]];
		for (var i = 1; i < array.length; i++) {
			if (newArray.indexOf(array[i]) === -1) {
				newArray.push(array[i]);
			}
		}
		console.log("converted array: " + newArray)
		array = newArray;
		var values = this.getValues();
		console.log("to " + values);
		var newRow;
		var numOfHeaderRows = this.numOfHeaderRows();
		// console.log("number of header rows: " + numOfHeaderRows);
		var newValues = [];
		var numOfDiffValues = array.length - 1;
		console.log("numOfDiffValues " + numOfDiffValues)
		console.log("number of rows in original values: " + values.length)
		var rowLength = values[0].length - 1;
		//For each row
		for (var i = 0; i < values.length; i++) {
			//For each different value in array
			for (var n = 0; n < numOfDiffValues - 1; n++) {
				newRow = values[i];
				//For each column
				for (var j = 1; j <= rowLength; j++) {
					//Insert the value
					newRow.push(values[i][j]);
					console.log("adding " + values[i][j]);
				}
			}
				console.log("new row number " + i + ": " + newRow)
				newValues.push(newRow);
		}
		//Add the new row of variables
		var newRow = [array[0]];
		array.splice(0, 1);
		for (var j = 0; j < numOfDiffValues; j++) {
			for (var i = 0; i < rowLength; i++) {
				newRow.push(array[j]);
			}
		}
		console.log("new header row: " + newRow);
		//Add the new row to the values table
		newValues.splice(numOfHeaderRows - 1, 0, newRow);
		console.log("new values: " + newValues)
		this.setValues(newValues);
	}
	this.updateData = function() {
		//console.log("updateData " + e.getName());
		var data = []
		var originalData = this.getData();
		var rowLength = (originalData[0]).length - 1;
		var myCounter = 0;
		var combinationsBelow;
		if (this.getType() !== 1) {//Decision nodes do not rely on child elements
			//Fill table from the bottom and up
			for (var i = originalData.length - 1; i >= this.numOfHeaderRows(); i--) {
				// console.log("i: " + i);
				// console.log("new data: " + originalData[i]);
				data.unshift(originalData[i]);
			}
			this.getChildElements().forEach(function(elmt) {
				var newRow = [];
				var mainValues = elmt.getMainValues();
				//console.log("child main values: " + mainValues)
				newRow.push(mainValues[0]);
				//console.log("counter = " + myCounter);
				//The first row that is added
				if (myCounter === 0) {
					//console.log("new row length: " + newRow.length + ". table row length: " + rowLength);
					//Add the elements until the row is full
					while (newRow.length < rowLength) {
						for (var i = 1; i < mainValues.length; i++) {
							newRow.push(mainValues[i]);
							// console.log("pushed to new row: " + mainValues[i]);
						}
					}
					combinationsBelow = mainValues.length - 1;
				} else {
					for (var i = 1; i < mainValues.length; i++) {
						//Add each element as many times as there are different combinations below
						for (var counter = 0; counter < combinationsBelow; counter++) {
							newRow.push(mainValues[i]);
						}
					}
					combinationsBelow *= (mainValues.length - 1);
				}

				data.unshift(newRow);
				//console.log("new row: " + newRow);
				myCounter++;
			})
			// console.log("updated data: ");
			// console.log(data);
			this.setData(data);
		}
	}
	//returns the different variables (conditions or decitions) that belong to the element
	this.getMainValues = function() {
		var row = [];
		var data = this.getData();
		row.push(this.getName());
		for (var i = 0; i < data.length; i++) {
			// console.log("i: " + i);
			// console.log("check data: " + data[i][1]);
			if (!isNaN(parseFloat(data[i][1])) || data[i][1] === undefined) {
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
			//if the cell in column 2 contains text or is undefined it is a header row
			if (isNaN(data[i][1]) && data[i][1] !== undefined) {
				counter++;
			}
		}
		return counter;
	}
	this.toJSON = function() {

		return {
			posX : this.easelElmt.x,
			posY : this.easelElmt.y,
			elmtID : this.getID(),
			elmtName : name,
			elmtDesc : this.getDescription(),
			elmtType : this.getType(),
			elmtData : this.getData()
		};
	}
	this.fromJSON = function(jsonElmt) {
		this.easelElmt.x = jsonElmt.posX;
		this.easelElmt.y = jsonElmt.posY;
		this.setID(jsonElmt.elmtID);
		name = jsonElmt.elmtName;
		this.setName(jsonElmt.elmtName);
		this.setDescription(jsonElmt.elmtDesc);
		this.setType(jsonElmt.elmtType);
		this.setData(jsonElmt.defData);
	}
}

MareFrame.DST.Connection = function(eIn, eOut) {
	var inputElement = eIn;
	var outputElement = eOut;
	var id = "conn" + new Date().getTime();
	if (eIn.getType() === 1 && eOut.getType() === 1) {
		var color = "gray";
	} else {
		var color = "black";
	}
	this.getColor = function() {
		return color;
	}
	this.deleteThis = function(calledElement) {
		if (inputElement.getID() === calledElement) {
			outputElement.deleteConnection(id);
		} else {
			inputElement.deleteConnection(id);
		}
	}

	this.getID = function() {
		return id;
	}

	this.setID = function(i) {
		id = i;
	}

	this.setInput = function(e) {
		inputElement = e;
	}

	this.setOutput = function(e) {
		outputElement = e;
	}

	this.getInput = function() {
		return inputElement;
	}

	this.getOutput = function() {
		return outputElement;
	}

	this.flip = function() {
		var e = inputElement;
		inputElement = outputElement;
		outputElement = e;

		inputElement.deleteConnection(id);
		outputElement.addConnection(id);
	}

	this.toJSON = function() {
		return {
			connInput : inputElement.getID(),
			connOutput : outputElement.getID(),
			connID : id
		};
	}

	this.fromJSON = function(jsonElmt) {
		id = jsonElmt.connID;
	}
}

$(document).ready(function() {

	h = new MareFrame.DST.Handler();

	if (MareFrame.DST.GUIHandler) {
		console.log("guihandler found");
		MareFrame.DST.GUIHandler();
		h.init();
	}

	$("#button").bind("click", function(e) {
	});
});
