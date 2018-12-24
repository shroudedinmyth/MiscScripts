var MountType = {
	HORSE: 0,
	PEGASUS: 1,
	WYVERN: 2,
	GRIFFON: 4
};

function Mount(id, name, hp, description, mountType, statBonuses={}, skills={}, combatBonuses={}) {
	this._id = id;
	this._name = name;
	this._description = description;
	this._mountType = mountType;
	this._statBonuses = {};
	this._skills = {};
	this._combatBonuses = {};
	this._currentHP = hp;
	this._maxHP = hp;
}

Mount.prototype.getId = function() {
	return this._id;
}

Mount.prototype.getName = function() {
	return this._name;
}

Mount.prototype.getDescription = function() {
	return this._description;
}

Mount.prototype.getMountType = function() {
	return this._mountType;
}

Mount.prototype.getStatBonuses = function() {
	return this._statBonuses;
}

Mount.prototype.getSkills = function() {
	return this._skills;
}

Mount.prototype.getCombatBonuses = function() {
	return this._combatBonuses;
}

Mount.prototype.getCurrentHP = function() {
	return this._currentHP;
}

Mount.prototype.getMaxHP = function() {
	return this._maxHP;
}

Mount.prototype.setCurrentHP = function(hp) {
	return this._currentHP = hp;
}

Mount.prototype.damageMount = function(damage) {
	this._currentHP = this._currentHP - damage;
}

(function() {
	var MountControl = {
		dismount: function(unit) {
			unit.custom.mountInfo.isMounted = false;
			var classGroupId = ClassChangeChecker.getClassGroupId(unit, false);
			var dismountId = unit.getClass().custom.dismountId;
			var cGroup = ClassChangeChecker.getClassGroup(classGroupId);
			var dismountClass = cGroup.find(job => job.id === dismountId);
			Miscellaneous.changeClass(unit, dismountClass);
		},
		remount: function(unit) {
			unit.custom.mount.isMounted = true;
			var classGroupId = ClassChangeChecker.getClassGroupId(unit, false);
			var mountedId = unit.getClass().custom.mountId;
			var cGroup = ClassChangeChecker.getClassGroup(classGroupId);
			var mountClass = cGroup.find(job => job.id === mountedId);
			Miscellaneous.changeClass(unit, mountClass);
		},
		isMountUsable: function(unit, mount) {
			var uClass = unit.getClass();
			if (uClass.custom.mountType === mount.mountType) {
				return true;
			}
			return false;
		},
		setMount: function(unit, mount) {
			if (isMountAvailable(unit, mount)) {
				unit.custom.mountInfo.mount = mount;
			}
		},
		killMount: function(unit, mount) {
			dismount(unit);
			unit.custom.mountInfo.mount = {};
		}
	}
}

	