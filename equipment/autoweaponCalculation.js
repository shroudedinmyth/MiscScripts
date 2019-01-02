(function () {
	var alias1 = AttackEvaluator.HitCritical.calculateDamage;
	
	AttackEvaluator.HitCritical.calculateDamage = function(virtualActive, virtualPassive, entry) {
		
	};
	
var AutoWeaponCalculate = {
	/**
	*
	*@param virtualActive
	*@param virtualPassive
	*@param attackEntry
	*@param targetItem
	*@param targetAmmunition
	*@returns {*}
	*/
	calculateDamage: function(virtualActive, virtualPassive, attackEntry, targetItem, targetAmmunition) {
		if (typeof targetItem.custom.Auto === 'number') {
			var pow = targetItem.getPow() + targetAmmunition.custom.might;
			
			if (Miscellaneous.isPhysicsBattle(targetItem)) {
				pow
			}
		}
	}
}
}) ();