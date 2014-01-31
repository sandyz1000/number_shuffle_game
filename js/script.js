/***** Slide Game ****/

var basicMethod = {
	myElementByClassName : function(classname){
		var a = [];
    	var re = new RegExp('(^| )'+classname+'( |$)');
    	var list = document.getElementsByTagName("*");
    	for( var i=0; i < list.length; i++ ){
    		if(re.test(list[i].className))
    			a.push(list[i]);	
    	}
		return a;
	},

	createEventHandler : function(element, eventName, methodName, objectName){
		methodName = (objectName)? objectName.methodName : methodName;

		if(document.addEventListener) {
			element.addEventListener(eventName, methodName, false);
			
		} else {
			element.attachEvent('on'+eventName, methodName);
		
		}
	},

	// indexOf : function(){
	// 	Array.prototype.indexOf : function(obj, start) {
	// 	    for (var i = (start || 0), j = this.length; i < j; i++) {
	// 	        if (this[i] === obj) { return i; }
	// 	    }
	//     	return -1;
	// 	}	
	// },

	randomNum : function(max ,aryLi){
		//Generate a random no
		var abc = Math.floor(Math.random()*max);
		if(aryLi.indexOf(abc) == -1) {
			return abc;
		} else {
			return this.randomNum(max, aryLi);
		}
	}
}


var shuffleGame = {

	rowIn : null,
	
	colIn : null,

	eleId : null,

	positionId : null,

	positionAry : [],

	init: function(rowsInput, colsInput){
		this.rowIn = rowsInput;
		this.colIn = colsInput;
	},

	compareObject : function(){
		var arr = [];
		arr = basicMethod.myElementByClassName('container');
		var bool = false;
		for(var dd=0; dd<arr.length-1; dd++) {
			myid = parseInt(arr[dd].getAttribute('id'));
			myval = parseInt(arr[dd].innerHTML);
			if(myid == myval){
				bool = true;
			} else {
				bool = false;
				break;
			}
		}
		return bool;
	},

	createGlbRandomObj : function(row, col){
		//run only when game is started
		var randNoLength = parseInt(row)*parseInt(col);
		var xxx = [];
		for(var ww=0; ww<randNoLength; ww++ ){
			var xyz = basicMethod.randomNum(randNoLength, xxx);
			xxx.push(xyz);
		}
		var indexxx = xxx.indexOf(0);
		if(indexxx != -1){
			xxx[indexxx] = "";
		}
		return xxx;
	},

	getPositions : function(x_cor, y_cor){
		this.positionAry.length = 0;

		if(x_cor<this.colIn)
			this.positionAry.push((y_cor*this.colIn)+(x_cor+1));
		if(x_cor>1)
			this.positionAry.push((y_cor*this.colIn)+(x_cor-1));
		if(y_cor>0)
			this.positionAry.push(((y_cor-1)*this.colIn)+x_cor);
		if(y_cor<this.rowIn-1)
			this.positionAry.push(((y_cor+1)*this.colIn)+x_cor);

		for(var yy=0; yy<this.positionAry.length; yy++) {
			if(document.getElementById(this.positionAry[yy]) && !document.getElementById(this.positionAry[yy]).innerHTML){
				this.positionId = this.positionAry[yy];
				return this.positionId;
			}
		}
	},

	reloadDOM : function(){
		window.location.reload();
	}
}

var clickOnContainer = function(e){
	var ee = e.target;
	shuffleGame.eleId = ee.getAttribute('id');
	var eleRow = ee.parentNode.getAttribute('id');
	var eleValue = ee.innerHTML;
	var xCor, yCor;
	yCor = parseInt(eleRow.substr(3, 1));
	xCor = parseInt(shuffleGame.eleId) - yCor*shuffleGame.colIn;

	var getPosition = shuffleGame.getPositions(xCor, yCor);

	if(getPosition) {
		ee.innerHTML = '';
		document.getElementById(getPosition).innerHTML = eleValue;
	} 
	if(shuffleGame.compareObject()){
		alert("Game Over");
		//shuffleGame.reloadDOM();
	}
}


var startGame = function(){

	var rowsInput = parseInt(document.getElementById('rowsInput').value);
	var colsInput = parseInt(document.getElementById('colsInput').value);
	//Create a glb Random number to the size of the puzzle
	var randomNum = shuffleGame.createGlbRandomObj(rowsInput, colsInput);
	shuffleGame.init(rowsInput, colsInput);
	
	var temp = null; var rowsEle = "";
	if(rowsInput && colsInput){
		var counter = 1;	
		for(var rr = 0; rr < rowsInput; rr++ ){
			rowsEle += '<div class="rows clearfix" id="row'+rr+'">';
			for(var c = 0; c < colsInput; c++ ){
				rowsEle += '<div class="container" id="'+counter+'"">'+randomNum[counter-1]+'</div>';
				counter ++;
			}
			rowsEle += '</div>'; 
		}

	}
	document.getElementById("shuffleContr").innerHTML = rowsEle;

	var myContainer = basicMethod.myElementByClassName('container');
	for(var ii=0; ii<myContainer.length; ii++){

		basicMethod.createEventHandler(myContainer[ii], 'click', clickOnContainer);
	}

};

var handleOnLoad = function(cols, rows) {
	
	var rowsDropdown = '<select id="rowsInput">';
	var colsDropdown = '<select id="colsInput">'; var inputBtn;
	
	for(var xx=0; xx<cols; xx++){
		rowsDropdown += '<option value="'+(xx+3)+'">'+(xx+3)+'</option>';
	}

	for(var xx=0; xx<rows; xx++){
		colsDropdown += '<option value="'+(xx+3)+'">'+(xx+3)+'</option>';
	}

	rowsDropdown += '</select>';
	colsDropdown += '</select>';
	inputBtn = '<input type="button" value="Start" onclick="startGame()" />';	
	document.getElementById('inputContr').innerHTML = colsDropdown+rowsDropdown+inputBtn;
}


//On document ready

var documentReady = (function(){
	var cols = 10;
	var rows = 10;
	handleOnLoad(cols, rows);
})();

