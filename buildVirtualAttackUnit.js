StructureBuilder.buildVirtualAttackUnit = function() {
	return {
		unitSelf: null,
		hp: null,
		weapon: null,
		secondary: null,
		damageTotal: 0,
		weaponUseCount: 0,
		isWeaponLimitless: false,
		isSrc: false,
		isCounterattack: false,
		isInitiative: false,
		attackNumber: 0,
		attackCount: 0,
		roundCount: 0,
		skillFastAttack: null,
		skillContinuousAttack: null,
		motionAttackCount: 0,
		motiondDmageCount: 0,
		motionAvoidCount: 0,
		stateArray: null,
		totalStatus: null,
		isApproach: false
	}
}