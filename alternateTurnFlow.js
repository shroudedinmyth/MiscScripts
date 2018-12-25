/*var UnitFilterFlag = {
	PLAYER: 0x01,
	ENEMY: 0x02,
	ALLY: 0x04,
	OTHER: 0x08
};*/

/*function getLivingUnits() {
	var aliveUnitsListArray = FilterControl.getAliveListArray(UnitFilterFlag.PLAYER | UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY | UnitFilterFlag.OTHER).flatMap(x => x); //Returns a list of arrays of alive units for each faction
}*/


function FactionRatioObject(faction, unitCount, work) {
	this.faction = faction;
	this.unitCount = unitCount;
	this.work = work;
};

/*FactionRatioObject.prototype.clear = function() {
	this.faction = '';
	this.unitCount = 0;
	this.work = 0;
};*/

//FactionRatioObject.prototype = Object.create(FactionRatioObject.prototype);
//FactionRatioObject.prototype.constructor = FactionRatioObject;

//root.log(TurnType.PLAYER);

var defaultOrder = [TurnType.PLAYER, TurnType.ENEMY, TurnType.ALLY];

var ActionQueue = defineObject(BaseObject,
{
	_queue: null,
	
	prepareQueue: function() {
		var counts = [PlayerList.getSortieList().getCount(), EnemyList.getAliveList().getCount(), AllyList.getAliveList().getCount()];
		var armies = [];
		this._queue = [];
		for (var i = 0; i < counts.length; i++) {
			if (counts[i] !== null && counts[i] > 0) {
				var army = new FactionRatioObject(defaultOrder[i], counts[i], 0);
				armies.push(army);
				this._queue.push(army.faction);
				armies[i].work++;
			}
		}
		var ordered = armies.sort(function(c,d) {
			return d.unitCount - c.unitCount;
		});
		//root.log(ordered.length);
		//root.log(counts);
		var startIdx = this._queue.length;
		root.log(startIdx);
		/*var totalActions = ordered.reduce(function(accumulator, factionObj) {
			return accumulator + factionObj.unitCount;
		}, 0);*/
		var totalActions = 0;
		for (var m = 0; m < ordered.length; m++) {
			totalActions += ordered[m].unitCount;
		};
		for (var j = startIdx; j < totalActions; j++) {
			for (var k = 0; k < ordered.length-1; k++) {
				if ((ordered[k].work + 1)/(ordered[k+1].work + 1) < ordered[k].unitCount/ordered[k+1].unitCount) {
					this._queue.push(ordered[k].faction);
					ordered[k].work++;
					break;
				}
				else if (k+1 === ordered.length - 1) {
					this._queue.push(ordered[k+1].faction);
					ordered[k+1].work++;
				}
			}
		};
	},
	
	peek: function() {
		return this._queue[0];
	},
	
	pop: function() {
		//root.log(this._queue[0]);
		var popped = this._queue.shift();
		//root.log(typeof(popped));
		return popped;
	},
	
	isEmpty: function() {
		return this._queue === null || this._queue.length === 0;
	},
	
	getLastInstance: function(tType) {
		return this._queue[this._queue.lastIndexOf(tType)];
	},
	
	getQueue: function() {
		return this._queue;
	},
	
	removeLastInstance: function(tType) {
		var lInd = this._queue.lastIndexOf(tType);
		if (lInd > -1)
			return this._queue.splice(lInd, 1)[0];
		return null;
	},
	
	factionStandby: function(tType) {
		this._queue = this._queue.filter(function(a) { return a !== tType; });
	},
	
	getTopFive: function() {
		var len = this._queue.length;
		if (len >= 5)
			return this._queue.slice(0,5);
		else if (len > 0)
			return this._queue.slice(0,len);
		return null;
	},
	
	placeOnTop: function(ttp) {
		this._queue.splice(0,0,ttp);
	},
	
	_getActionableCounts: function() {
		return [this._getActionableUnitsList(PlayerList.getSortieList()).getCount(), this._getActionableUnitsList(EnemyList.getAliveList()).getCount(), this._getActionableUnitsList(AllyList.getAliveList()).getCount()];
	},
	
	_getActionableUnitsList: function(list) {
		var funcCondition = function(unit) {
			return (!unit.isWait() && !unit.isInvisible());
		}
		return AllUnitList.getList(list, funcCondition);
	},
	
	resetQueue: function() {
		var _cts = this._getActionableCounts();
		var armies = _cts.filter(function(o) { return (o !== undefined && o > 0); }).map(function(au, i) {
			if (au !== null && au > 0) {
				return new FactionRatioObject(i,au,1);
			};
		});
		armies.sort(function (c,d) {
			return d.unitCount - c.unitCount;
		});
		this._queue = [];
		var totalActions = armies.reduce(function(accumulator, factionObj) {
			return accumulator + factionObj.unitCount;
		}, 0);
		for (var j = 0; j < totalActions; j++) {
			for (var k = 0; k < armies.length-1; k++) {
				if ((armies[k].work+1)/(armies[k+1].work+1) < armies[k].unitCount/armies[k+1].unitCount) {
					this._queue.push(armies[k].faction);
					armies[k].work++;
				}
				else if (k+1 === armies.length - 1) {
					this._queue.push(armies[k+1].faction);
					armies[k+1].work++;
				}
			}
		}
	},
	
	getXOccuranceIndex: function(ttp, x) {
		var ct = 0;
		for (var a = 0; a < this._queue.length; a++) {
			if (this._queue[a] === ttp)
				ct++;
			
			if (ct === x)
				return a;
		}
		return -1;
	},
	
	removeXOccurance: function(tType, x) {
		var idx = this.getXOccuranceIndex(tType, x);
		if (idx > -1) {
			return this._queue.splice(idx,1)[0];
		}
		return null;
	}
});

//function to get xth occurence of factiontype