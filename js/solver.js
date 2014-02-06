Array.prototype.clone = function(){return this.slice(0);}

var solver = {
	currBlock : -1,
	sortedPos : [],
	size:0,
	gameArray : [],
	stepsArray : [],

	numSeq : function(len,depth){
		var seq = [];
		for(var i=0;i<len;i++){
			seq.push(i);
		}
		for(var i=1;i<len;i++){
			seq.push(i*len);
		}
		var l = seq.length;
		for(var i=0;i<l;i++){
			seq[i] = (Math.floor(seq[i]/len)+depth)*(len+depth) + (seq[i]%len)+depth +1;
		}
		
		return seq;
	},
	
	blockMove : function(initPos,finalPos){
		this.currBlock = initPos;
		//get the moves array
		//for each move, call the empty tile move on the next pos
		// switch the block with empty block
		if(initPos!=finalPos){
			var getArray = this.getMovesArray(initPos,finalPos,-1);
			var len1 = getArray.length;
			if(len1==0){
				return false;
			}
			for(var i=0;i<len1;i++){
				if(!this.emptyTileMove(getArray[i])){
					return false;
				}
				this.makeMove(initPos);
				initPos = getArray[i];
				this.currBlock = initPos;
			}
		}
		return true;
	},
	
	emptyTileMove : function(finalPos){
		// get the moves array
		//for each move, switch the tiles
		var initPos = this.gameArray.indexOf("");
		if(initPos!=finalPos){
			var getArray = this.getMovesArray(initPos,finalPos,this.currBlock);
			var len1 = getArray.length;
			if(len1==0){
				return false;
			}
			for(var i=0;i<len1;i++){
				this.makeMove(getArray[i]);
			}
		}
		return true;
	},
	
	initGame : function(gameArray, size){
		this.size = size;
		this.gameArray = gameArray;
		this.currBlock = -1;
		this.sortedPos = [];
		this.stepsArray = [];
		this.solveGame(this.size,0);
	},
	
	solveGame : function(size, depth){
		var n = size+depth;
		var array = this.numSeq(size,depth);
		var len = array.length;
		if(size>2){
			for(var i =0;i<len;i++){
				var start = this.gameArray.indexOf(array[i]);
				this.currBlock = start;
				if(i!=(len-1) && i!=((len-1)/2)){
					if(!this.blockMove(start,array[i]-1))
						break;
				}
				else if(i==((len-1)/2)){
					var tempPos = (depth+2)*n-1;
					if(this.gameArray.indexOf(array[i])==array[i]-1){
						this.sortedPos.push(array[i]-1);
						continue;
					}
					if(this.gameArray.indexOf(array[i])==tempPos && this.gameArray.indexOf("")==(array[i]-1)){
						this.makeMove(tempPos);
					}
					else{
						tempPos--;
						this.blockMove(start,tempPos);
						this.emptyTileMove((depth+1)*n + depth);
						for(var k = 0;k<=i;k++){
							this.makeMove(this.gameArray.indexOf(array[k]));
						}
						this.makeMove((depth+2)*n-1);
						this.makeMove((depth+1)*n-1);
						for(var k = i;k>=0;k--){
							this.makeMove(this.gameArray.indexOf(array[k]));
						}
					}
				}
				else if(i==(len-1)){
					if(this.gameArray.indexOf(array[i])==array[i]-1){
						this.sortedPos.push(array[i]-1);
						continue;
					}
					if(this.gameArray.indexOf(array[i])==array[i] && this.gameArray.indexOf("")==(array[i]-1)){
						this.makeMove(array[i]);
					}
					else{
						var tempPos = n*(n-2)+1+depth;
						this.blockMove(start,tempPos);
						this.emptyTileMove((depth+2)*n-1);
						for(var k = (len-1)/2;k>=0;k--){
							this.makeMove(this.gameArray.indexOf(array[k]));
						}
						for(var k = (len+1)/2;k<len;k++){
							this.makeMove(this.gameArray.indexOf(array[k]));
						}
						this.makeMove(n*(n-1)+depth+1);
						this.makeMove(n*(n-1)+depth);
						for(var k = len-1; k >=(len+1)/2;k--){
							this.makeMove(this.gameArray.indexOf(array[k]));
						}
						for(var k = 0;k<=(len-1)/2;k++){
							this.makeMove(this.gameArray.indexOf(array[k]));
						}
					}
				}
				this.sortedPos.push(array[i]-1);
			}
			var $this = this; 
			setTimeout(function(){$this.solveGame(size-1,depth+1)},0);
		}
		else if(size==2){
			for(var i =0;i<len;i++){
				var start = this.gameArray.indexOf(array[i]);
				this.currBlock = start;
				this.blockMove(start,array[i]-1);
				this.sortedPos.push(array[i]-1);
			}
			makeDummyMoves(this.stepsArray);
		}
	},
	
	getMovesArray : function(start,finish,current){
		var blockerArray = this.sortedPos.clone();
		if(current!=-1){
			blockerArray.push(this.currBlock);
		}
		var returnVal = getMoves(this.size,this.size,blockerArray,start,finish);
		if(typeof returnVal == "boolean"){
			return [];
		}
		else{
			return returnVal;
		}
	},
	
	makeMove : function(pos){
		this.stepsArray.push(pos);
		var index = this.gameArray.indexOf("");
		this.gameArray[index] = this.gameArray[pos];
		this.gameArray[pos] = "";
	}
}

var indexSolver = {
	solve : function(number){
		var index = 0;
		var sum = 0;
		for(var i=0;i<10;i++){
			if(number[i] == 'd'){
				index = i+1;
			}
			else if(number[i]=='x'){
				sum+=(10*(i+1));
			}
			else{
				sum+=(parseInt(number[i],10)*(i+1));
			}
		}
		var rem = sum%11;
		for(var i=0;i<=10;i++){
			if((rem + (i*index))%11==0){
				if( i==10 ){
					if(index==1)
						continue;
					else{
						number = number.replace("d","x");
						break;
					}	
				}
				else{
					number = number.replace("d",i);
					break;
				}
			}
		}
		if(number.indexOf('d')>=0){
			return 'no solution';
		}
		else{
			return number;
		}
	}
}

function getMoves(rows,cols,blockerArray,start,finish){
	var reqArray = [];
	var newArray = blockerArray.clone();
	newArray.push(start);
	if(start!=finish){
		var i1 = Math.floor(start/cols);
		var i2 = Math.floor(finish/cols);
		var j1 = start%cols;
		var j2 = finish%cols;
		var pos1 = {pos:(i1*cols)+j1+1,d:getDistance(i2,j2,i1,j1+1)};
		var pos2 = {pos:(i1*cols)+j1-1,d:getDistance(i2,j2,i1,j1-1)};
		var pos3 = {pos:((i1+1)*cols)+j1,d:getDistance(i2,j2,i1+1,j1)};
		var pos4 = {pos:((i1-1)*cols)+j1,d:getDistance(i2,j2,i1-1,j1)};
		var availPos = [];
		if(blockerArray.indexOf(pos1.pos)==-1 && (j1+1)<cols){
			availPos.push(pos1);
		}
		if(blockerArray.indexOf(pos2.pos)==-1 && (j1-1)>=0){
			availPos.push(pos2);
		}
		if(blockerArray.indexOf(pos3.pos)==-1 && (i1+1)<cols){
			availPos.push(pos3);
		}
		if(blockerArray.indexOf(pos4.pos)==-1 && (i1-1)>=0){
			availPos.push(pos4);
		}
		availPos.sort(function(a, b) {
			return a.d - b.d;
		});
		for(var i=0;i<availPos.length;i++){
			var sol = getMoves(rows,cols,newArray,availPos[i].pos,finish);
			if(typeof sol == "object" || sol){
				reqArray = sol.reverse();
				reqArray.push(availPos[i].pos);
				return reqArray.reverse();
			}
		}
	}
	else{
		return reqArray;
	}
	return false;
}

function makeDummyMoves(solveArray){
	if(solveArray.length>0){
		document.getElementsByClassName("container")[solveArray[0]].click();
		setTimeout(	function(){makeDummyMoves(solveArray.slice(1))},200);
	}
}

function getDistance(i1,j1,i2,j2){
	return Math.abs(i1-i2) + Math.abs(j1-j2);
}