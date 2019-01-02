function getMercenaryCost(unitId, isMain) {
	var unit, level, baseCost, levelCoeff, totalFee;
	unit = PlayerList.getMainList().getData(unitId);
	level = unit.getLevel();
	baseCost = unit.custom.baseCost;
	levelCoeff = unit.custom.levelCoeff;
	
	totalFee = baseCost + (levelCoeff * level);
	
	if (!isMain) {
		totalFee = Math.ceil(totalFee/2);
	}
	
	return totalFee;
};

function isMercenaryCrippled(unitId) { //for now, assume that the cripple status is a unit custom field rather than a status condition
	var unit = PlayerList.getMainList().getData(unitId);
	
	return unit.custom.isCrippled;
};

function hireMercenary(unitId) {
	var unit, hiringFee, gold, endGold;
	
	unit = PlayerList.getMainList().getData(unitId);
	hiringFee = getMercenaryCost(unitId, isMain);
	
	gold = root.getMetaSession().getGold();
	endGold = gold - hiringFee;
	
	root.getMetaSession().setGold(endGold);
	
	unit.setAliveState(UnitStatus.ALIVE);
}