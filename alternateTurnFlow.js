function getLivingUnits() {
	var aliveUnitsListArray = FilterControl.getAliveListArray(UnitFilterFlag.PLAYER | UnitFilterFlag.ENEMY | UnitFilterFlag.ALLY).flatMap(x => x); //Returns a list of arrays of alive units for each faction
}
function getSideCounts(aliveUnitsListArray) {
	const sideCounts = aliveUnitsListArray.reduce(function(livingCounts, unit) { //an associative array containing the counts of each unit for each side.
		var currentUnitType = unit.getUnitType();
		//console.log(Object.keys(livingCounts));
		if (livingCounts[currentUnitType]) {
			livingCounts[currentUnitType]++;
		}
		else {
			livingCounts[currentUnitType] = 1;
		}
		return livingCounts;
	}, {});
}

function getRatio(sCounts, side1, side2) {
	return sCounts[side1]/sideCounts[side2];
}

//Setting up the initial Order queue and recalculating the order queue should either be separate functions or should be determined in one function w/a optional parameter for relative turn order.

//need to filter out all 0 side counts of course.
function setUpOrderQueue(sideCounts) {
	var sortedRatios = [getRatios(sideCounts, 0, 1), getRatios(sideCounts, 1, 2)].sort(function(a,b) {
		return b-a;
	});
	var rat1 = getRatio(sideCounts, 0, 1);
	var rat2 = getRatio(sideCounts, 1, 2);
	
	var playerCount = sideCounts[UnitType.PLAYER];
	var enemyCount = sideCounts[UnitType.ENEMY];
	var allyCount = sideCounts[UnitType.ALLY];
	
	var orderQueue = [];
	
	
}
