const factionType = {
	'PLAYER': 0,
	'ENEMY': 1,
	'NPC': 2,
	'OTHER': 3
}

function Pair(a, b) {
	this.a = a;
	this.b = b;
}

function Faction(funcEnum, unitList) {
	this.faction = funcEnum;
	this.unitCount = unitList.length;
	this.lastOccurence = 0;
	this.ratios = {};
	this.priority = 1;
}

function ActionList(allUnits) {
	var pointer = 0;
	var actionList = [];
	var factions = [];
	var baseOrdering = [factionType.PLAYER, factionType.ENEMY, factionType.NPC, factionType.OTHER];
	var orderingByRat = factions.sort(function(a,b) {
		return a.unitCount - b.unitCount;
	}).map(function (a) {
		a.priority = factions.findIndex(a)+1;
		return a.faction;
	});
	

}

function getFactionOccurences(section, facEnum) {
	return section.filter(fact => fact === facEnum);
}

function buildFactionArray(unitList) {
	var factionList = [];
	for (a in factionType) {
		const filteredUnits = unitList.filter(unit => unit.factionType === factionType[a]);
		factionList.push(new Faction(a, filteredUnits));
	}
	return factionList;
}