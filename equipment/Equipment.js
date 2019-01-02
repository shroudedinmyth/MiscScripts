//equipped weapon or spell = primary slot
//equipped shield, ammunition, accessory = secondary
var Equipment = {
	primary: {},
	secondary: {}
};

var AmmunitionType = {
	ARROW: 0,
	BULLET: 1,
	AMMO: 2
};

var AmmunitionWeaponMap = {
	"Bow": 0,
	"Crossbow": 0,
	"Gun": 1,
	"Ballista": 2
};

var ShieldType = {
	SMALL: 0,
	MEDIUM: 1,
	LARGE: 2
};

var AccessoryType = {
	DEFENSE: 0,
	PARAMCHANGE: 1,
	OTHER: 2
};

var MountType = {
	HORSE: 0,
	PEGASUS: 1,
	GRIFFON: 2,
	WYVERN: 3
};

var SpellType = {
	ATTACK: 1,
	HEAL: 2,
	STATUS: 3,
	SUMMON: 4,
	SUPPORT: 5
}

(function () {
	ItemControl.isWeaponRanged = function(weapon) { 
		return weapon.getCategoryType() === WeaponCategoryType.SHOOT;
	};
	
	ItemControl.isWeaponMagical = function(weapon) {
		return (weapon.isWand() || weapon.getWeaponCategoryType() === WeaponCategoryType.MAGIC);
	};
	
	ItemControl.isWeaponMelee = function(weapon) {
		return weapon.getCategoryType() === WeaponCategoryType.PHYSICS;
	}
	
	ItemControl.getEquippedWeapon = function(unit) { 
		var i, item, count;
		
		if (unit === null) {
			return null;
		}
		
		count = UnitItemControl.getPossessionItemCount(unit);
		
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, item);
			
			if (item.isWand()) {
				var magicType = item.custom.magicType;
				var refList = unit.getClass().getEquipmentWeaponTypeReferenceList();
				for (var j = 0; j < refList.getTypeCount(); j++) {
					if (refList.getTypeData(j).getId() === magicType) {
						return true;
					}
				}
			}
		}
	};
	
	ItemControl.isSpellAllowed: function(refList, magic) {
		var i;
		var count = refList.getTypeCount();
		var magType = magic.custom.magicType;
		
		for (i = 0; i < count; i++) {
			if (refList.getTypeData(i).getId() === magType) {
				break;
			}
		}
		
		if (i === count) {
			return false;
		}
		
		return true;
	};
	
	ItemControl.isWeaponAvailable = function(unit, item) {
		var isSpell = false;
		var isWeap = false;
		if (item === null)
			return false;
		
		if (item.isWand()) {
			isSpell = true;
		}
		
		if (item.isWeapon()) {
			isWeap = true;
		}
		
		if (isSpell) {
			var refList = unit.getClass().getEquipmentWeaponTypeReferenceList();
			if (!this.isSpellAllowed(refList, item)) {
				return false;
			}
			
			if (!this.isOnlyData(unit, item)) {
				return false;
			}
			
			if (StateControl.isBadStateFlag(unit, BadStateFlag.MAGIC)) {
				return false;
			}
		}
		
		if (isWeap) {
			if (!this._compareTemplateAndCategory(unit, item)) {
				return false;
			}
			
			if (!this.isWeaponTypeAllowed(unit.getClass().getEquipmentWeaponTypeReferenceList(), item)) {
				return false;
			}
			
			if (!this.isOnlyData(unit, item)) {
				return false;
			}
			
			if (item.getWeaponCategoryType() === WeaponCategoryType.MAGIC) {
				if (StateControl.isBadStateFlag(unit, BadStateFlag.MAGIC)) {
					return false;
				}
			}
			else {
				if (StateControl.isBadStateFlag(unit, BadStateFlag.PHYSICS)) {
					return false;
				}
			}
		}
		
		return true;
	};
	
	ItemControl.getEquippedSecondary = function(unit) { 
		var i, item, count;
		
		if (unit === null) {
			return null;
		}
		
		count = UnitItemControl.getPossessionItemCount(unit);
		
		//Equipped secondary is the first usable secondary on the list.
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, item);
			if (item !== null && this.canSecondaryBeEquipped(unit, item)) {
				return item;
			}
		}
		
		return null;
	};
	
	ItemControl.setEquippedSecondary = function(unit, targetItem) { 
		var i, item;
		var count = UnitItemControl.getPossessionItemCount(unit);
		var fastIndex = -1, targetIndex = -1;
		
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			if (item !== null && fastIndex === -1) {
				fastIndex = i;
			}
			
			if (item === targetItem) {
				targetIndex = i;
			}
		}
		
		if (fastIndex === -1 || targetIndex === -1) {
			return;
		}
		
		if (fastIndex === targetIndex) {
			return;
		}
		
		//Swap items
		item = UnitItemControl.getItem(unit, fastIndex);
		UnitItemControl.setItem(unit, fastIndex, targetItem);
		UnitItemControl.setItem(unit, targetIndex, item);
		
		this.updatePossessionItem(unit);
	};
	
	ItemControl.isSecondaryAvailable = function(unit, item) { 
		if (item.getWeaponType().getName() !== "Secondary") {
			return false;
		};
		
		if (!this.isOnlyData(unit, item)) {
			return false;
		}
		
		var secondaryType = item.getCustomKeyword();
		
		if (secondaryType === "Shield") {
			if (item.custom.shieldType !== undefined && item.custom.shieldType !== null) {
				var classData = unit.getClass();
				if (classData.custom.usableShieldTypes !== null) {
					for (var i = 0; i < classData.custom.usableShieldTypes.length; i++) {
						if (classData.custom.usableShieldTypes[i] === item.custom.shieldType) {
							break;
						}
					}
					if (i === classData.custom.usableShieldTypes.length) {
						return false;
					}
				}
			}
		}
		
		if (secondaryType === "Accessory") {
			return unit.getClass().custom.canUseAccessory === true;
		}
		
		if (secondaryType === "Ammunition") {
			var refList = unit.getClass().getEquipmentWeaponTypeReferenceList();
			var count = refList.getTypeCount();
			
			for (var j = 0; j < count; j++) {
				var wType = refList.getTypeData(j);
				if (AmmunitionWeaponMap[wType.getName()] === item.custom.ammunitionType) {
					break;
				}
			}
			if (j === count) {
				return false;
			}
		}
		
		return true;
	};
	
	ItemControl.canSecondaryBeEquipped = function(unit, item) {
		if (item.getWeaponType().getName() !== "Secondary") {
			return false;
		}
		
		var weapon = this.getEquippedWeapon(unit);
		if (ItemControl.isWeaponMelee(weapon) && item.getCustomKeyword() === "Shield") {
			return isSecondaryAvailable(unit, item);
		}
		else if ((ItemControl.isWeaponRanged(weapon) || ItemControl.isWeaponMagical(weapon)) && item.getCustomKeyword() === "Shield") {
			return false;
		}
		else if ((ItemControl.isWeaponMelee(weapon) || ItemControl.isWeaponMagical(weapon)) && item.getCustomKeyword() === "Accessory") {
			return ItemControl.isSecondaryAvailable(unit, item);
		}
		else if (ItemControl.isWeaponRanged(weapon) && item.getCustomKeyword() === "Accessory") {
			return false;
		}
		else if ((ItemControl.isWeaponMelee(weapon) || ItemControl.isWeaponMagical(weapon)) && item.getCustomKeyword() === "Ammunition") {
			return false;
		}
		else if (ItemControl.isWeaponRanged(weapon) && item.getCustomKeyword() === "Ammunition") {
			return AmmunitionWeaponMap[weapon.getWeaponType().getName()] === item.custom.ammunitionType;
		}
		
		return false;
	};
	
	
	AttackChecker.isCounterattack = function(unit, targetUnit) {
		var weapon, secondary, indexArray;
		
		if (!Calculator.isCounterattackAllowed(unit, targetUnit)) {
			return false;
		}
		
		weapon = ItemControl.getEquippedWeapon(unit);
		
		if ((weapon !== null && weapon.isOneSide()) || (weapon !== null && weapon.isWand())) {
			return false;
		}
		
		weapon = ItemControl.getEquippedWeapon(targetUnit);
		secondary = ItemControl.getEquippedSecondary(targetUnit);
		
		if (weapon === null) {
			return false;
		}
		if (weapon.isOneSide()) {
			return false;
		}
		if (weapon.isWand()) {
			return false;
		}
		if (weapon.getWeaponCategoryType() === WeaponCategoryType.SHOOT) {
			if (secondary === null) {
				return false;
			}
			if (secondary !== null && secondary.getCustomKeyword() === "Ammunition") {
				if (AmmunitionWeaponMap[weapon.getWeaponType().getName()] !== secondary.custom.ammunitionType) {
					return false;
				}
			}
			else if (secondary !== null && secondary.getCustomKeyword() !== "Ammunition") {
				return false;
			}
		}
		
		indexArray = IndexArray.createIndexArray(targetUnit.getMapX(), targetUnit.getMapY(), weapon);
		return indexArray.findUnit(unit, targetUnit);
	};
})();

/**
var Shield custom = {
	keyword: 'Shield'
	shieldType: item type,
	defBoosts: {
		defense: 1,
		resistance: 4
	},
	accuarcy: 50,
	weight: 4,
	elementDefenses: {
		fire: 0,
		water: 0,
		wind: 0,
		earth: 0,
		thunder: 0,
		divine: 2,
		dark: 1
	},
	wlv: 10,
	misc: {}
	
}

var Ammunition custom {
	keyword = 'Ammunition',
	ammunitionType: item type,
	might: 1,
	accuracy: 0,
	critical: 0,
	elements: {
		fire: 0,
		water: 0,
		wind: 0,
		earth: 0,
		thunder: 0,
		divine: 0,
		dark: 0
	},
	misc: {
		ignoreShields: true
	}
}

var Accessory custom {
	keyword = 'Accessory'
	
*/