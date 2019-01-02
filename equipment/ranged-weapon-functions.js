(function () {
	
	//var alias1 = HitCalculator.calculateHit;
	var alias1 = HitCalculator.calculateSingleHit;
	
	HitCalculator.calculateSingleHit = function(active, passive, weapon, totalStatus) {
		var hitRate = alias1.call(this, active, passive, weapon, totalStatus);
		
		if (weapon.getWeaponCategoryType() === WeaponCategoryType.SHOOT) {
			hitRate += active.secondary.custom.hit;
		}
		
		return hitRate;
	};
	
	var alias2 = CriticalCalculator.calculateSingleCritical;
	
	CriticalCalculator.calculateSingleCritical = function(active, passive, weapon, totalStatus) {
		var critRate = alias2.call(active, passive, weapon, totalStatus);
		
		if (weapon.getWeaponCategoryType() === WeaponCategoryType.SHOOT) {
			critRate += active.secondary.custom.crit;
		}
		
		return critRate;
	};
	
	//var alias3 = DamageCalculator.calculateDamage;
	DamageCalculator.calculateDamage = function(active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue) {
		var pow, def, damage;
		
		if (this.isHPMinimum(active, passive, weapon, isCritical, trueHitValue)) {
			return -1;
		}
		
		if (weapon.getWeaponCategoryType() === WeaponCategoryType.SHOOT) {
			var ammunition = active.secondary;
			if (weapon.custom.auto !== null && weapon.custom.auto !== undefined) {
				pow = weapon.getPow() + ammunition.custom.might;
			}
			else {
				pow = this.calculateAttackPower(active, passive, weapon, isCritical, activeTotalStatus, trueHitValue) + ammunition.custom.might;
			}
			def = this.calculateDefense(active, passive, weapon, isCritical, passiveTotalStatus, trueHitValue);
		}
		else if (weapon.custom.dagger !== null && weapon.custom.dagger !== undefined) {
			pow = DaggerCalculate.calculatePower(active, passive, weapon);
			def = 0;
		}
		else {
			pow = this.calculateAttackPower(active, passive, weapon, isCritical, activeTotalStatus, trueHitValue);
			def = this.calculateDefense(active, passive, weapon, isCritical, passiveTotalStatus, trueHitValue);
		}
		
		damage = pow - def;
		if (this.isHalveAttack(active, passive, weapon, isCritical, trueHitValue)) {
			if (!this.isHalveAttackBreak(active, passive, weapon, isCritical, trueHitValue)) {
				damage = Math.floor(damage / 2);
			}
		}
		
		if (this.isCritical(active, passive, weapon, isCritical, trueHitValue)) {
			damage = Math.floor(damage * this.getCriticalFactor());
		}
		
		return this.validValue(active, passive, weapon, damage);
	};

var DaggerCalculate = {
	calculatePower: function(virtualActive, virtualPassive, weapon) {
		var pow;
		
		if (Miscellaneous.isPhysicsBattle(weapon)) {
			pow = RealBonus.getStr(virtualActive.unitSelf);
		}
		else {
			pow = RealBonus.getMag(virtualActive.unitSelf);
		}
		
		var rand = Math.floor(Math.random() * pow);
		return rand;
	}
};
	
})();