/* 
 * Mount management object
*/
var MountControl = {
	
	getUnitMount: function(unit) {
		return unit.custom.mountInfo.mount;
	},
	
	getUnitMountInfo: function(unit) {
		return unit.custom.mountInfo.isMounted;
	},
	
	canUnitMount: function(unit) { 
		var x = unit.getMapX();
		var y = unit.getMapY();
		return PosChecker.getMovePointFromUnit(x, y, unit); //if it's 0, return false;
	},
	
	isMountRideable: function(unit, mount) {
		var job = unit.getClass();
		return job.custom.mountType === mount.mountType;
	},
	
	setMountHP: function(unit, hp) {
		unit.custom.mountInfo.mount.hp = hp;
	},
	
	damageMount: function(unit, damage) {
		unit.custom.mountInfo.mount.hp -= damage;
		if (unit.custom.mountInfo.mount.hp <= 0) {
			this.killMount(unit);
		}
	},
	
	killMount: function(unit) {
		this.dismount(unit);
		unit.custom.mountInfo.mount = {};
	},
	
	dismount: function(unit) {
		var job = unit.getClass();
		var dismountId = job.custom.dismountId;
		var dismountClass = root.getBaseData().getClassList()[dismountId] || undefined;
		if (dismountClass) {
			Miscellaneous.changeClass(unit, dismountClass);
		};
		unit.custom.mountInfo.isMounted = false;
	},
	
	getOn: function(unit) {
		var job = unit.getClass();
		var mountId = job.custom.mountId;
		var mountClass = root.getBaseData().getClassList()[mountId] || undefined;
		if (dismountClass !== null || typeof dismountClass !== 'undefined') {
			Miscellaneous.changeClass(unit, dismountClass);
		};
		unit.custom.mountInfo.isMounted = true;
	},
	
	setUnitMount: function(unit, mount) {
		unit.custom.mountInfo.mount = mount;
	},
	
	convertItemToMount: function(mountItem) {
		var mount = defineObject(MountObj, {
			id: mountItem.custom.mountId,
			itemId: mountItem.id,
			mountTye: mountItem.custom.mountType,
			hp: mountItem.custom.maxHP,
			maxHP: mountItem.custom.maxHP,
			price: mountItem.price,
			statParams: mountItem.custom.statParams,
			bonusSkills: mountItem.custom.bonusSkills,
			combatBonuses: mountItem.custom.combatBonuses
	},
	
	//getReservedMounts: function() { },
	
	// Initialize mount custom parameters, mainly for store stuff
	initMount: function(index) {
		var mounts = root.getMetaSesssion().global.mount_data;
		if (mounts === null || typeof mounts === 'undefined') {
			root.getMetaSesssion().global.mount_data = {};
			mounts = root.getMetaSession().global.mount_data;
		}
	},
	
	getMountData: function(index) {
		this.initMount(index);
		var mounts = root.getMetaSession().global.mount_data;
		return mounts[index];
	}
}