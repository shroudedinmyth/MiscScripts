(function() {

var ElementTypes = {
	FIRE: 0,
	WATER: 1,
	WIND: 2,
	EARTH: 3,
	THUNDER: 4,
	DIVINE: 5,
	DARK: 6
}

ItemControl.getItemBonus = function(elmntType, item) {
	var bonus;
	switch(elmntType) {
		case 0 : bonus = item.custom.fird; break;
		case 1 : bonus = item.custom.wtrd; break;
		case 2 : bonus = item.custom.wndd; break;
		case 3 : bonus = item.custom.ertd; break;
		case 4 : bonus = item.custom.thnd; break;
		case 5 : bonus = item.custom.divd; break;
		case 6 : bonus = item.custom.drkd; break;
		default : bonus = 0; break;
	}
	
	if(typeof bonus !== 'number') {
		bonus = 0;
	}
	
	return bonus;
};
//Skill Control?

AbilityCalculator.getJyukurendoMax = function(elmntType, unit) {
	var maxValue = 100;
	switch(elmntType) {
		case 0 : maxValue =UnitParameter.FIRD.getMaxValue(unit); break;
		case 1 : maxValue =UnitParameter.WTRD.getMaxValue(unit); break;
		case 2 : maxValue =UnitParameter.WNDD.getMaxValue(unit); break;
		case 3 : maxValue =UnitParameter.ERTD.getMaxValue(unit); break;
		case 4 : maxValue =UnitParameter.THND.getMaxValue(unit); break;
		case 5 : maxValue =UnitParameter.DIVD.getMaxValue(unit); break;
		case 6 : maxValue =UnitParameter.DRKD.getMaxValue(unit); break;
		default : break;
	}
	return maxValue;
};

})();