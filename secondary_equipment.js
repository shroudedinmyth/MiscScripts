(function() {
	var SecondaryEquipmentType {
		NONE: 0,
		ACCESSORY: 1,
		SHIELD: 2,
		AMMO: 3
	},
	
	var ShieldType {
		SMALL: 0,
		MEDIUM: 1,
		LARGE: 2
	},
	
	//ordering of weapon type params:
	/*
		swd = 0;
		lnc = 1;
		axe = 2;
		knife = 3;
		strike = 4;
		bow = 5;
		crossbow = 6;
		gun = 7;
		ballista = 8;
		fire = 9;
		water = 10;
		wind = 11;
		earth = 12;
		thunder = 13;
		divine = 14;
		dark = 15;
		sshield = 16;
		mshield = 17;
		lshield = 18;
	*/
	
	ItemControl.getEquippedSecondary: function(unit) {
		var i, item, count;
		
		if (unit === null) {
			return null;
		}
		
		count = UnitItemControl.getPossessionItemCount(unit);
		
		// Equipped secondary item is the first secondary in the item list.
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			if (item !== null && this.isSecondaryAvailable(unit, item)) {
				return item;
			}
		}
		
		return null;
	},
	
	ItemControl.isSecondaryAvailable: function(unit, item) {
		if (item === null) {
			return false;
		}
		
		//if the item is not labeled as secondary equipment, cannot equip
		if (!item.custom.secondaryType) {
			return false;
		}
		
		if (item.custom.secondaryType === SecondaryEquipmentType.AMMO) {
			return this.checkAmmoParentUsable(item, unit);
		}
		
		if (item.custom.secondaryType === SecondaryEquipmentType.SHIELD) {
			return this.isShieldUsable(item, unit);
		}
		
		if (item.custom.secondaryType === SecondaryEquipmentType.ACCESSORY) {
			return (unit.getClass().accessories > 0);
		}
		
		return true;
	},
	
	ItemControl.isShieldUsable(item, unit) {
		var targetShieldType = item.custom.shieldType;
		var shieldExp;
		switch(targetShieldType) {
			case ShieldType.SMALL: shieldExp = unit.getClass().custom.sshield;
			case ShieldType.MEDIUM: shieldExp = unit.getClass().custom.mshield;
			case ShieldType.LARGE: shieldExp = unit.getClass().custom.lshield;
			default: shieldExp = 0;
		}
		if (shieldExp) {
			return true;
		}
		
		return false;
	},
	
	ItemControl.checkAmmoParentUsable: function(item, unit) {
		var rangeType;
		var targetParentType = item.custom.parentWeaponType;
		switch(targetParentType) {
			case 5: rangeType = unit.getClass().custom.bow;
			case 6: rangeType = unit.getClass().custom.crossbow;
			case 7: rangeType = unit.getClass().custom.gun;
			case 8: rangeType = unit.getClass().custom.ballista;
			default: rangeType = 0;
		}
		
		if (rangeType) {
			return true;
		}
		
		return false;
	}
	
}) ();