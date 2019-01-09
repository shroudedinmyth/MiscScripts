(function () {
Calculator.calculateRoundCount = function(active, passive, weapon) {
	var activeAgi;
	var passiveAgi;
	var value;
	
	if (!this.isRoundAttackAllowed(active, passive)) {
		return weapon.custom.roundCounter ? weapon.custom.roundCounter : 1;
	}
	
	activeAgi = AbilityCalculator.getAgility(active, weapon);
	passiveAgi = AbilityCalculator.getAgility(passive, ItemControl.getEquippedWeapon(passive));
	value = this.getDifference();
	
	if (!weapon.custom.roundCounter) {
		return (activeAgi - passiveAgi) >= value ? 2 : 1;
	}
	
	return (activeAgi - passiveAgi) >= value ? (weapon.custom.roundCounter + 1) : 1;
};

AbilityCalculator.getShieldAccuracy = function(unit, shield) {
	var paviseBonus = 0;
	var paviseSkill = SkillControl.getPossessionCustomSkill(unit,'pavise');
	
	if (paviseSkill !== null && paviseSkill !== undefined) {
		paviseBonus = paviseSkill.custom.blockValue;
	}
	
	var result = shield.custom.accuracy + Math.ceil((RealBonus.getSki(unit) * 1.5)) + paviseBonus;
	return shield.custom.accuracy;
};
})();