(function() {
	var alias1 = AttackChecker.isCounterattack;
	
	AttackChecker.isCounterattack = function(unit, targetUnit) {
		var weapon, indexArray, secondary;
		
		if (!Calculator.isCounterattackAllowed(unit, targetUni)) {
			return false;
		}
		
		weapon = ItemControl.getEquippedWeapon(unit);
		secondary = ItemControl.getEquippedSecondary(unit);
		if (weapon !== null && weapon.isOneSide()) { //equipped with "One Way" weapon, e.g a lance.
			return false;
		}
		
		//equipped with a bow/gun/ballista, but not ammo; no counterattack.
		if weapon.custom.
		
		
		alias1.call(this);
	}
// Check if the targetUnit can counterattack the unit.
	isCounterattack: function(unit, targetUnit) {
		var weapon, indexArray;
		
		if (!Calculator.isCounterattackAllowed(unit, targetUnit)) {
			return false;
		}
		
		weapon = ItemControl.getEquippedWeapon(unit);
		if (weapon !== null && weapon.isOneSide()) {
			// If the attacker is equipped with "One Way" weapon, no counterattack occurs.
			return false;
		}
		
		// Get the equipped weapon of those who is attacked.
		weapon = ItemControl.getEquippedWeapon(targetUnit);
		
		// If no weapon is equipped, cannot counterattack.
		if (weapon === null) {
			return false;
		}
		
		// If "One Way" weapon is equipped, cannot counterattack.
		if (weapon.isOneSide()) {
			return false;
		}
		
		indexArray = IndexArray.createIndexArray(targetUnit.getMapX(), targetUnit.getMapY(), weapon);
		
		return IndexArray.findUnit(indexArray, unit);
	},
	
	isCounterattackPos: function(unit, targetUnit, x, y) {
		var indexArray;
		var weapon = ItemControl.getEquippedWeapon(targetUnit);
		
		if (weapon === null) {
			return false;
		}
		
		indexArray = IndexArray.createIndexArray(targetUnit.getMapX(), targetUnit.getMapY(), weapon);
		
		return IndexArray.findPos(indexArray, x, y);
	}
}) ();