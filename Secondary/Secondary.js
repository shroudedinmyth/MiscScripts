var SpellType = {
	ATTACK: 1,
	HEAL: 2,
	STATUS: 3,
	SUMMON: 4,
	SUPPORT: 5
}

(function () {
	
ItemControl.isSecondaryTypeAllowed: function(refList, sec) {
	
};

ItemControl.getEquippedWeapon: function(unit) {
	if (unit === null)
		return null;
	
	return unit.custom.equipment.primary;
};

ItemControl.getEquippedSecondary: function(unit) {
	if (unit === null)
		return null;
	
	return unit.custom.equipment.secondary;
};

ItemControl.getEquippedShield: function(unit) {
	let secondary = ItemControl.getEquippedSecondary(unit);
	if (secondary === null || secondary.custom.secType !== SecondaryType.SHIELD) {
		return null;
	}
	else
		return secondary;
};

ItemControl.getEquippedAmmunition: function(unit) {	
	let secondary = ItemControl.getEquippedSecondary(unit);
	if (secondary === null || secondary.custom.secType !== SecondaryType.AMMUNITION) {
		return null;
	}
	else
		return secondary;
	
};

ItemControl.getEquippedAccessory: function(unit) {
	let secondary = ItemControl.getEquippedSecondary(unit);
	if (secondary === null || secondary.custom.secType !== SecondaryType.ACCESSORY) {
		return null;
	}
	else
		return secondary;
};

ItemControl.isSecondaryAvailable: function(unit, item) {
	if (item === null)
		return false;
	
	if (!item.custom.secType)
		return false;
	
	if (!this.isOnlyData(unit, item))
		return false;
	
	if (item.itemType === 'CUSTOM' &&& item.custom
};

ItemControl.setEquippedWeapon: function(unit, targetItem) {
	
};

ItemControl.setEquippedSecondary: function(unit, targetItem) {
	
};

ItemControl.isItemShield: function(targetItem) {
	return targetItem.custom.secType === SecondaryType.SHIELD;
};

ItemControl.isItemAmmunition: function(targetItem) {
	return targetItem.custom.secType === SecondaryType.AMMUNITION;
};

ItemControl.isItemAccessory: function(targetItem) {
	return targetItem.custom.secType === SecondaryType.ACCESSORY;
};

ItemControl.isWeaponRanged: function(weapon) {
	if (weapon.isWeapon()) {
		var wName = weapon.getWeaponType().getName();
		return (wName === 'Bow' || wName === 'Crossbow' || wName = 'Gun' || wName = 'Ballista');
	}
	return false;
};

ItemControl.isAmmoMatching: function(weapon, ammunition) {
	
};

UnitItemControl.getEquipment: function(unit) {
	
};

UnitItemControl.setPrimary: function(unit, item) {
	
};

UnitItemControl.setSecondary: function(unit, item) {
	
};

UnitItemControl.setEquipment: function(unit, items) {
	
};
	
})();