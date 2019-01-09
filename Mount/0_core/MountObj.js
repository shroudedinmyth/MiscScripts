//Mount base object
// unit has mountInfo with mount field, with this:
	/** 
		mount: {
			id: 0,
			itemId: 118 //corresponds to the item that can be obtained in the map and then converted into a mount
			name: 'Liga Courser',
			mountType: 'Horse',
			currentHP: 58,
			maxHP: 80,
			price: 15000,
			statParams: {Move: 1},
			bonusSkills: [90], //in this example, 90 is the id for the skill 'Horse Master'
			combatBonuses: {}
		}
		
		mountInfo: {
			mount: {...},
			isMounted: true
	*/

var MountClass = {
	
	//initialize the list of mounts in the global data
	initMount: function(index) {
		var mount = root.getMetaSession().global.mount_data;
		if (mount === null || typeof mount === 'undefined') {
			root.getMetaSession().global.mount_data = {};
			mount = root.getMetaSession().global.mount_data;
		}
		if (mount[index] === null || typeof mount[index] === 'undefined') {
			root.getMetaSession().global.mount_data = false;
		}
	},
	
	//get specific mount data
	getMountData: function(index) {
		this.initMount(index);
		var mount = root.getMetaSession().global.mount_data;
		return mount[index];
	},
	
	//Turn on the mount data display
	turnOnMountData: function(index) {
		this.initData(index);
		root.getMetaSession().global.mount_data[index] = true;
	},
	
	isMountDisplayed: function(index) {
		return this.getMountData(index);
	},
	
	getMountList: function() {
		return MountList;
	},
	
	getMount: function(index) {
		if (Mounts[index] === null || typeof Mounts[index] === 'undefined') {
			return null;
		}
		return Mounts[index];
	},
	
	assignMount: function(unitId, mountId) {
		var list = PlayerList.getMainList();
		var unit = list.getDataFromId(unitId);
		var mount = getMount(mountId);
		if (checkMount(unit, mount)) {
			unit.custom.mount = mount;
		}
	},
	
	checkMountUsable: function(unit, mount) {
		var job = unit.getClass();
		var canMount = true;
		if (job.custom.mountId === null || typeof job.custom.mountId === 'undefined') {
			return false;
		}
		if (job.custom.mountId !== mount.mountId) {
			canMount = false;
		}
		return canMount;
	},
	
	healMount: function(mount, recoveryValue) {
		var health = mount.currentHP + recoveryValue;
		mount.currentHP = Math.min(health, mount.maxHP);
	},
	
	recoverMount: function(mount, perc) {
		var recovery = mount.maxHP * perc;
		this.healMount(mount, recovery);
	},
	
	dismount: function(unit) {
		var job = unit.getClass();
		if (job.custom.dismountId === null || typeof job.custom.dismountId === 'undefined') {
			return;
		}
		if (unit.custom.mount === null || typeof unit.custom.mount === 'undefined') {
			return;
		}
		var dismountClass = root.getBaseData().getClassList().getData(job.custom.dismountId);
		Miscellaneous.changeClass(unit, dismountClass);
		unit.custom.isMounted = false;
	},
	
	getOn: function(unit) {
		var job = unit.getClass();
		if (job.custom.mountedId === null || typeof job.custom.mountedId === 'undefined') {
			return;
		}
		if (unit.custom.mount === null || typeof unit.custom.mount === 'undefined') {
			return;
		}
		var mountedClass = root.getBaseData().getClassList().getData(job.custom.mountedId);
		Miscellaneous.changeClass(unit, mountedClass);
		unit.custom.isMounted = true;
	},
	
	getUnitMount: function(unit) {
		if (unit.custom.mount === null || typeof unit.custom.mount === 'undefined' || unit.custom.mount === {})
			return null;
		return unit.custom.mount;
	}
	
}

var Mounts = [];