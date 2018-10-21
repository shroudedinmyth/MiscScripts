var UnitFilterFlag = {
	PLAYER: 0x01,
	ENEMY: 0x02,
	ALLY: 0x04,
	OTHER: 0x08
};

function getLivingUnits() {
	var aliveUnitsListArray = FilterControl.getAliveListArray(UnitFilterFlag.PLAYER | UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY | UnitFilterFlag.OTHER).flatMap(x => x); //Returns a list of arrays of alive units for each faction
}


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

const defaultOrder = [UnitFilterFlag.PLAYER, UnitFilterFlag.ENEMY, UnitFilterFlag.ALLY, UnitFilterFlag.OTHER];

function ActionQueue(unitCounts) { //when array is fed in, unit counts are always in order PLAYER, ENEMY, ALLY, OTHER for index locations
	this.actionQueue = [];
	this.armies = unitCounts.filter(a => a > 0).map(b => new FactionRatioObject(defaultOrder[unitCounts.indexOf(b)], b));
	for (var i = 0; i < this.armies.length; i++) {
		this.actionQueue.push(this.armies[i].faction);
		this.armies[i].work++;
	}
	this.ordered = this.armies.sort(function(c,d) {
		return d.unitCount - c.unitCount;
	});
	let startIdx = this.actionQueue.length;
	let totalActions = this.ordered.reduce(function(accumulator, factionObj) {
		return accumulator + factionObj.unitCount;
	}, 0);
	//console.log(this.totalActions);
	for (var j = startIdx; j < totalActions; j++) {
		for (k = 0; k < this.ordered.length-1; k++) {
			if ((this.ordered[k].work + 1)/(this.ordered[k+1].work + 1) < this.ordered[k].unitCount/this.ordered[k+1].unitCount) {
				this.actionQueue.push(this.ordered[k].faction);
				this.ordered[k].work++;
				//console.log(this.ordered[k].unitCount/this.ordered[k+1].unitCount);
				break;
			}
			else if (k + 1 === this.ordered.length-1) {
				this.actionQueue.push(this.ordered[k+1].faction);
				this.ordered[k+1].work++;
			}
		}
	}
	this.armies = this.ordered.slice().sort((a,b) => a.faction - b.faction);
}

ActionQueue.prototype = Object.create(ActionQueue.prototype);
ActionQueue.prototype.constructor = ActionQueue;