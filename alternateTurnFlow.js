/*var UnitFilterFlag = {
	PLAYER: 0x01,
	ENEMY: 0x02,
	ALLY: 0x04,
	OTHER: 0x08
};*/

/*function getLivingUnits() {
	var aliveUnitsListArray = FilterControl.getAliveListArray(UnitFilterFlag.PLAYER | UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY | UnitFilterFlag.OTHER).flatMap(x => x); //Returns a list of arrays of alive units for each faction
}*/


function FactionRatioObject(faction, unitCount) {
	this.faction = faction;
	this.unitCount = unitCount;
	this.work = 0;
}

FactionRatioObject.prototype.clear() {
	this.faction = '';
	this.unitCount = 0;
	this.work = 0;
}

FactionRatioObject.prototype = Object.create(FactionRatioObject.prototype);
FactionRatioObject.prototype.constructor = FactionRatioObject;

const defaultOrder = [TurnType.PLAYER, TurnType.ENEMY, TurnType.ALLY];

var ActionQueue = defineObject(BaseObject,
{
	_queue: null,
	
	prepareQueue: function() {
		var counts = [PlayerList.getSortieList().getCount(), EnemyList.getAliveList().getCount(), AllyList.getAliveList().getCount()];
		var armies = [];
		this._queue = [];
		for (var i = 0; i < counts.length; i++) {
			if (counts[i] !== null && counts[i] > 0) {
				var army = new FactionRatioObject(defaultOrder[i], counts[i]);
				armies.push(army);
				this._queue.push(army.faction);
				armies[i].work++;
			}
		}
		var ordered = armies.sort(function(c,d) {
			return d.unitCount - c.unitCount;
		});
		console.log(ordered);
		var startIdx = this._queue.length;
		var totalActions = ordered.reduce(function(accumulator, factionObj) {
			return accumulator + factionObj.unitCount;
		}, 0);
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
		}
	},
	
	peek: function() {
		return this._queue[0];
	},
	
	pop: function() {
		return this._queue[0] ? this._queue.shift() : null;
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
		this._queue = this._queue.filter(a => a !== tType);
	},
	
	getTopFive: function() {
		var len = this._queue.length;
		if (len >= 5)
			return this._queue.slice(0,5);
		else if (len > 0)
			return this._queue.slice(0,len);
		return null;
	}
});

//function to get xth occurence of factiontype