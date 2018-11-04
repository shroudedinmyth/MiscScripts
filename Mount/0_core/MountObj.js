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

var MountObj = {
	id: null,
	itemId: null,
	mountType: null,
	hp: null,
	maxHP: null,
	price: null,
	statParams: {},
	bonusSkills: [],
	combatBonuses: {}
}

var Mounts = [];