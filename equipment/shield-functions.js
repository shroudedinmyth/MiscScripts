/*
	shields are items of the Secondary category, with the custom keyword "Shield" and the following custom fields, e.g :
	
		Buckler.custom = {
			shieldType: 0,
			defBoost: 3,
			resBoost: 0,
			elemDefs: {
				fire: 0,
				water: 0,
				wind: 0,
				earth: 0,
				light: 0,
				dark: 0
			},
			accuracy: 40,
			wlv: 1 //change to wexp when using wexp script
		}	
*/

(function () {
	
	var alias1 = AbilityCalculator.getAgility;
	
	AbilityCalculator.getAgility = function(unit, weapon) {
		var agi, value, buildParam, statParam, param, secondaryWeight;
		var spd = RealBonus.getSpd(unit);
		var secondary = ItemControl.getEquippedSecondary(unit);
		if (secondary !== undefined && secondary !== null && secondary.getCustomKeyword() !== "Shield"){
			root.log(unit.getName());
			secondaryWeight = secondary.getWeight();
		}
		else {
			return alias1.call(this, unit, weapon);
		}
		agi = spd;
		
		if ((weapon === null && !secondaryWeight) || !DataConfig.isItemWeightDisplayable()) {
			return agi;
		}
		
		buildParam = DataConfig.isBuildDisplayable() ? ParamBonus.getBld(unit) : 0;
		
		if (Miscellaneous.isPhysicsBattle(weapon)) {
			statParam = Math.floor(ParamBonus.getStr(unit)/2);
		}
		else {
			statParam = Math.floor(ParamBonus.getMag(unit)/2);
		}
		
		param = (buildParam + statParam)/2;
		value = (weapon.getWeight() + secondaryWeight) - param;
		
		if (value > 0) {
			agi -= value;
		}
		
		return agi;
	};
	
	var alias2 = AbilityCalculator.getAvoid;
	
	AbilityCalculator.getAvoid = function(unit) {
		var avoid, terrain, weapon;
		var cls = unit.getClass();
		
		weapon = ItemControl.getEquippedWeapon(unit);
		avoid = Math.max(0, this.getAgility(unit, weapon));
		
		if (cls.getClassType().isTerrainBonusEnabled()) {
			terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
			if (terrain !== null) {
				avoid += terrain.getAvoid();
			}
		}
		
		return avoid;
	};
	
	//var alias3 = AbilityCalculator.getHit;
	
	/*AbilityCalculator.getHit = function(unit, weapon) {
		var secondaryBonus = 0;
		if (weapon.getWeaponCategoryType() === WeaponCategoryType.SHOOT) {
			var ammun = ItemControl.getEquippedSecondary(unit);
			if (ammun !== null && typeof ammun !== 'undefined' && ammun.getCustomKeyword() === "Ammunition") {
				secondaryBonus = ammun.custom.hit;
			}
		}
		
		return weapon.getHit() + secondaryBonus + (RealBonus.getSki(unit) * 2);
	};*/
	
	//for things like Ajax Shield, which blocks damage from bows/crossbows/ballistas 100% of the time
	/*CompatibleCalculator._getShieldCompatible = function(active, passive, weapon, shield) {		
		if (shield === null || weapon === null) {
			return null;
		}
		
		if (shield.getTargetAggregation(active)) {
			return 100;
		}
		
		return null;
	};*/
	
	var ShieldAccuracyCalculator = {
		calculateShieldAccuracy: function(virtualPassive, shield, passiveTotalStatus) {
			return this.calculateSingleBlock(virtualPassive, shield, passiveTotalStatus);
		},
		
		calculateSingleBlock: function(virtualPassive, shield, totalStatus) {
			//var compatible = CompatibleCalculator._getShieldCompatible(active, passive, weapon, shield);
			//var compatValue = compatible !== null ? compatible : 0;
			var result = AbilityCalculator.getShieldAccuracy(virtualPassive.unitSelf, shield) + SupportCalculator.getHit(totalStatus);
			return result;
		}
	};
	
	var alias4 = AttackEvaluator.HitCritical.evaluateAttackEntry;
	
	AttackEvaluator.HitCritical.evaluateAttackEntry = function(virtualActive, virtualPassive, attackEntry) {
		this._skill = SkillControl.checkAndPushSkill(virtualActive.unitSelf, virtualPassive.unitSelf, attackEntry, true, SkillType.TRUEHIT);
		
		var shield = virtualPassive.secondary;
		
		if (ItemControl.isShield(shield)) {
			attackEntry.isHit = this.isHit(virtualActive, virtualPassive, attackEntry);
			if (!attackEntry.isHit) {
				if (this._skill === null) {
					return;
				}
				
				attackEntry.isHit = true;
			}
			
			attackEntry.isCritical = this.isCritical(virtualActive, virtualPassive, attackEntry);
			
			if (shieldHandle.canShieldBlock(virtualActive, virtualPassive)) {
				var percentage = ShieldAccuracyCalculator.calculateShieldAccuracy(virtualPassive, shield, virtualPassive.totalStatus);
				
				if (Probability.getProbability(percentage)) {
					attackEntry.damagePassive = this.calculateReduceShieldDamage(virtualActive, virtualPassive, attackEntry, this._skill, shield);
					
					this._checkStateAttack(virtualActive, virtualPassive, attackEntry);
				}
				else {
					attackEntry.damagePassive = this.calculateDamage(virtualActive, virtualPassive, attackEntry);
				}
			}
			else {
				attackEntry.damagePassive = this.calculateDamage(virtualActive, virtualPassive, attackEntry);
			}
		}
		else {
			alias4.call(this, virtualActive, virtualPassive, attackEntry);
		}
		
	};
	
	AttackEvaluator.HitCritical.calculateReduceShieldDamage = function(virtualActive, virtualPassive, attackEntry, skill, shield) {
		var trueHitValue = 0;
		
		if (this._skill !== null) {
			trueHitValue = this._skill.getSkillValue();
		}
		if (DamageCalculator.isHpMinimum(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon, attackEntry.isCritical, trueHitValue)) {
		// 現在HP-1をダメージにすることで、攻撃が当たれば相手のHPは1になる
			return virtualPassive.hp - 1;
		}

		if (DamageCalculator.isFinish(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon, attackEntry.isCritical, trueHitValue)) {
			return virtualPassive.hp;
		}
		
		return DamageCalculator.calculateReduceShieldDamage(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon, virtualPassive.secondary, attackEntry.isCritical, virtualActive.totalStatus, virtualPassive.totalStatus, trueHitValue, skill);
	};
	
	DamageCalculator.calculateReduceShieldDamage = function(active, passive, weapon, shield, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue, skill) {
		var pow, def, damage;
		
		if (this.isHpMinimum(active, passive, weapon, isCritical, trueHitValue))
			return -1;
		
		pow = this.calculateAttackPower(active, passive, weapon, isCritical, activeTotalStatus);
		def = this.calculateDefense(active, passive, weapon, isCritical, passiveTotalStatus);
		
		if (Miscellaneous.isPhysicsBattle(weapon)) {
			def += shield.custom.defBoost;
		}
		else {
			def += shield.custom.resBoost;
		}
		
		shieldHandle.handleShieldUse(passive, weapon, shield);
		damage = pow - def;
		if (this.isHalveAttack(active, passive, weapon, isCritical, trueHitValue)) {
			if (!this.isHalveAttackBreak(active, passive, weapon, isCritical, trueHitValue)) {
				damage = Math.floor(damage/2);
			}
		}
		
		if (this.isCritical(active, passive, weapon, isCritical, trueHitValue)) {
			damage = Math.floor(damage * this.getCriticalFactor());
		}
		
		return this.validValue(active, passive, weapon, damage);
	};
	
	//note: Nearly all the functions can be used for accessories that reduce damage of some kind, ala Wind Ring or Djinn Ring. The functions are meant to check whether a shield/defensive accessory and the final damage calculation if it blocks.
	var shieldHandle = {
		//this is getting specifically a shield
		getShield: function(virtualPassive) {
			var shield = virtualPassive.secondary;
			
			if (shield !== null && shield !== undefined && shield.getCustomKeyword() === "Shield") {
				return shield;
			}
			
			return null;
		},
		
		/*getGuardAccessory: function(virtualPassive) {
			var guardAcc = ItemControl.getEquippedSecondary(virtualPassive.unitSelf);
			
			if ((guardAcc !== null && typeof guardAcc !== 'undefined')) {
				if (guardAcc.getCustomKeyword() === "Accessory") {
					if (guardAcc.custom.accessoryType === AccessoryType.DEFENSE) {
						return guardAcc;
					}
				}
			}
			
			return null;
		},*/
		
		canShieldBlock: function(virtualActive, virtualPassive) {
			var canBlock = true;
			var weapon = virtualActive.weapon;
			var shield = virtualPassive.secondary;
			
			if (weapon === null || shield === null)
				canBlock = false;

			//where current bug is occurring
			if (ItemControl.isItemBroken(shield)) {
				canBlock = false;
			}
			
			if (weapon.custom.pierce === null && weapon.custom.pierce === undefined) {
				canBlock = false;
			}
			
			if (Miscellaneous.isPhysicsBattle(weapon)) {
				canBlock = shield.custom.defBoost > 0;
			}
			else {
				canBlock = shield.custom.resBoost > 0;
			}
			
			return canBlock;
		},
		
		checkDamageType: function(virtualActive, shield) {
			var request = false;
			
			if (Miscellaneous.isPhysicsBattle(virtualActive.weapon)) {
				request = ( shield.custom.defBoost >= 0 );
			}
			else {
				request = ( shield.custom.resBoost >= 0 );
			}
			
			return request;
		},
		
		handleShieldUse: function(passive, weapon, shield) {
			var result = true;
			
			var shieldBreak = false;
			
			var breaksShields = weapon.custom.shieldBreaker !== null && weapon.custom.shieldBreaker !== undefined;
			
			if (!breaksShields) {
				var limit = shield.getLimit() - 1;
				if (limit < 0)
					limit = 0;
				shield.setLimit(limit);
				if (ItemControl.isItemBroken(shield)) {
					ItemControl.deleteItem(shield);
					shieldBreak = true;
				}
				else {
					ItemControl.decreaseItem(passive, shield);
				}
			}
			
			else {
				shield.setLimit(0);
				ItemControl.deleteItem(shield);
				shieldBreak = true;
			}
			
			return shieldBreak;
		}
	}
})();