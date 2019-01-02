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
	
	AbilityCalculator.getShieldAccuracy = function(unit, shield) {
		var paviseBonus = 0;
		var paviseSkill = SkillControl.getPossessionCustomSkill(unit,'pavise');
		
		if (paviseSkill !== null) {
			paviseBonus = paviseSkill.custom.blockValue;
		}
		
		return shield.custom.accuracy + Math.ceil((RealBonus.getSki(unit) * 1.5)) + paviseBonus;
	};
	
	var alias1 = AbilityCalculator.getAgility;
	
	AbilityCalculator.getAgility = function(unit, weapon) {
		var agi, value, buildParam, statParam, param;
		var spd = RealBonus.getSpd(unit);
		var secondary = ItemControl.getEquippedSecondary(unit);
		var secondaryWeight = secondary !== null ? secondary.getWeight() : 0;
		
		agi = spd;
		
		if ((weapon === null && secondary === null) || !DataConfig.isItemWeightDisplayable()) {
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
	
	var alias3 = AbilityCalculator.getHit;
	
	AbilityCalculator.getHit = function(unit, weapon) {
		var secondaryBonus = 0;
		if (weapon.getWeaponCategoryType() === WeaponCategoryType.SHOOT) {
			var ammun = ItemControl.getEquippedSecondary(unit);
			if (ammun !== null && ammun.getCustomKeyword() === "Ammunition") {
				secondaryBonus = ammun.custom.hit;
			}
		}
		
		return weapon.getHit() + secondaryBonus + (RealBonus.getSki(unit) * 2);
	};
	
	ShieldAccuracyCalculator = {
		calculateShieldAccuracy: function(active, passive, weapon, shield, activeTotalStatus, passiveTotalStatus) {
			return this.calculateSingleBlock(active, passive, weapon, shield, passiveTotalStatus);
		},
		
		calculateSingleBlock: function(active, passive, weapon, shield, totalStatus) {
			var compatible = CompatibleCalculator._getShieldCompatible(active, passive, weapon, shield);
			var compatValue = compatible !== null ? compatible : 0;
			return Math.max(AbilityCalculator.getShieldAccuracy(passive, shield) + SupportCalculator.getHit(totalStatus), compatValue);
		}
	};
	
	//for things like Ajax Shield, which blocks damage from bows/crossbows/ballistas 100% of the time
	CompatibleCalculator._getShieldCompatible = function(active, passive, weapon, shield) {		
		if (shield === null || weapon === null) {
			return null;
		}
		
		if (shield.getTargetAggregation(active)) {
			return 100;
		}
		
		return null;
	};
	
	var alias4 = AttackEvaluator.HitCritical.calculateDamage;
	
	AttackEvaluator.HitCritical.calculateDamage = function(virtualActive, virtualPassive, attackEntry) {
		var damage = alias4.call(this, virtualActive, virtualPassive, attackEntry);
		
		var shield = shieldHandle.getShield(virtualPassive);
		
		if (shield !== null) { //if user has a shield
			if (shieldHandle.canShieldBlock(virtualActive, shield)) { //if the shield can block the attack
				var percent = ShieldAccuracyCalculator.calculateShieldAccuracy(virtualActive, virtualPassive, virtualActive.weapon, shield, virtualPassive.totalStatus); //get shield accuracy
				
				if (Probability.getProbability(percent)) { //if it passes the probability check, ala an attack hit
					var didBreak = false; //for now, always false, but set it to be if weapon.shieldBreaker !== null && weapon.shieldBreaker !== undefined
					
					var isPhysical = Miscellaneous.isPhysicsBattle(virtualActive.weapon);
					var elemental;
					
					if (virtualActive.weapon.getWeaponCategoryType() === WeaponCategoryType.SHOOT) {
						elemental = virtualActive.secondary.custom.element;
					}
					else {
						elemental = virtualActive.weapon.custom.element;
					}
					
					damage = shieldHandle.damage(damage, shield, isPhysical, elemental);
					ItemControl.decreaseItem(virtualPassive.unitSelf, shield);
					
					if (ItemControl.isWeaponBroken(shield)){
						didBreak = true;
					}
					
					if (didBreak) {
						ItemControl.deleteItem(virtualPassive.unitSelf, shield);
					}
					
				}
			}
		}
		return DamageCalculator.validValue(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon, damage);
	};
	
	//note: Nearly all the functions can be used for accessories that reduce damage of some kind, ala Wind Ring or Djinn Ring. The functions are meant to check whether a shield/defensive accessory and the final damage calculation if it blocks.
	var shieldHandle = {
		//this is getting specifically a shield
		getShield: function(virtualPassive) {
			var shield = virtualPassive.secondary;
			
			if (shield !== null && shield.getCustomKeyword() === "Shield") {
				return shield;
			}
			
			return null;
		},
		
		getGuardAccessory: function(virtualPassive) {
			var guardAcc = virtualPassive.secondary;
			
			if (guardAcc !== null && guardAcc.getCustomKeyword() === "Accessory") {
				if (guardAcc.custom.accessoryType === AccessoryType.DEFENSE) {
					return guardAcc;
				}
			}
			
			return null;
		},
		
		canShieldBlock: function(virtualActive, shield) {
			var canBlock = true;
			
			if (!this.checkDamageType(virtualActive, shield) && !this.checkElementType(virtualActive, shield)) {
				canBlock = false;
			}
			
			if (ItemControl.isWeaponBroken(shield)) {
				canBlock = false;
			}
			
			if (virtualActive.weapon.custom.pierce !== null && virtualActive.weapon.custom.pierce !== undefined) {
				canBlock = false;
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
		
		checkElementType: function(virtualActive, shield) {
			var request = false;
			
			if (Miscellaneous.isPhysicsBattle(virtualActive.weapon)) {
				if (virtualActive.weapon.getWeaponCategoryType() === WeaponCategoryType.SHOOT) {
					var ammoElement = virtualActive.secondary.custom.element; //should probably be a string value.
					request = ( ammoElement !== null && shield.custom.elemDefs[ammoElement] > 0 );
				}
			}
			else {
				var weaponElement = virtualActive.weapon.custom.element;
				request = ( weaponElement !== null && shield.custom.elemDefs[weaponElement] > 0 );
			}
			
			return request;
		},
		
		/**
		 * @param damage : number,
		 * @param shield : Item,
		 * @param isPhysical: bool,
		 * @param elemental: string,
		 * @returns {*}
		 */
		
		damage: function(damage, shield, isPhysical, elemental) {
			var elemReduce = 0;
			if (elemental !== null) {
				elemReduce = shield.custom.elemDefs[elemental];
			}
			if (isPhysical) {
				damage -= (shield.custom.defBoost + elemReduce);
			}
			else {
				damage -= (shield.custom.resBoost + elemReduce);
			}
			
			return damage;
		}
	}
})();