(function() {
	
ParamType.FIRD = 9018;
	
UnitParameter.FIRD = defineObject(BaseUnitParameter {
	getParameterType: function() {
		return ParamType.FIRD;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var fird;
		
		if (typeof unit.custom.fird === 'number') {
			fird = unit.custom.fird;
		}
		else {
			fird = 0;
		}
		
		return fird;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.fird = value;
	},
	
	getParameterBonus: function(obj) {
		var fird;
		
		if (typeof obj.custom.fird === 'number') {
			fird = obj.custom.fird;
		}
		else {
			fird = 0;
		}
		
		return fird;
	},
	
	getDopingParameter: function(obj) {
		var fird;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.firdDoping === 'number') {
			fird = obj.custom.firdDoping;
		}
		else {
			fird = 0;
		}
		return fird;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		return 100;
	},
	
	getMinValue: function(unit) {
		return -50;
	},
	
	getParameterName: function() {
		return 'Fire Resist';
	}
}
);

ParamType.FIRD = 9018;
	
UnitParameter.FIRD = defineObject(BaseUnitParameter {
	getParameterType: function() {
		return ParamType.FIRD;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var fird;
		
		if (typeof unit.custom.fird === 'number') {
			fird = unit.custom.fird;
		}
		else {
			fird = 0;
		}
		
		return fird;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.fird = value;
	},
	
	getParameterBonus: function(obj) {
		var fird;
		
		if (typeof obj.custom.fird === 'number') {
			fird = obj.custom.fird;
		}
		else {
			fird = 0;
		}
		
		return fird;
	},
	
	getDopingParameter: function(obj) {
		var fird;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.firdDoping === 'number') {
			fird = obj.custom.firdDoping;
		}
		else {
			fird = 0;
		}
		return fird;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		return 100;
	},
	
	getMinValue: function(unit) {
		return -50;
	},
	
	getParameterName: function() {
		return 'Fire Resist';
	}
}
);

ParamType.WTRD = 9019;
	
UnitParameter.WTRD = defineObject(BaseUnitParameter {
	getParameterType: function() {
		return ParamType.WTRD;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var wtrd;
		
		if (typeof unit.custom.wtrd === 'number') {
			fird = unit.custom.wtrd;
		}
		else {
			wtrd = 0;
		}
		
		return wtrd;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.wtrd = value;
	},
	
	getParameterBonus: function(obj) {
		var wtrd;
		
		if (typeof obj.custom.wtrd === 'number') {
			fird = obj.custom.wtrd;
		}
		else {
			wtrd = 0;
		}
		
		return wtrd;
	},
	
	getDopingParameter: function(obj) {
		var wtrd;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.wtrdDoping === 'number') {
			wtrd = obj.custom.wtrdDoping;
		}
		else {
			wtrd = 0;
		}
		return wtrd;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		return 100;
	},
	
	getMinValue: function(unit) {
		return -50;
	},
	
	getParameterName: function() {
		return 'Water Resist';
	}
}
);

ParamType.FIRD = 9020;
	
UnitParameter.WNDD = defineObject(BaseUnitParameter {
	getParameterType: function() {
		return ParamType.WNDD;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var wndd;
		
		if (typeof unit.custom.wndd === 'number') {
			wndd = unit.custom.wndd;
		}
		else {
			wndd = 0;
		}
		
		return wndd;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.wndd = value;
	},
	
	getParameterBonus: function(obj) {
		var wndd;
		
		if (typeof obj.custom.wndd === 'number') {
			wndd = obj.custom.wndd;
		}
		else {
			wndd = 0;
		}
		
		return wndd;
	},
	
	getDopingParameter: function(obj) {
		var wndd;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.wnddDoping === 'number') {
			wndd = obj.custom.wnddDoping;
		}
		else {
			wndd = 0;
		}
		return wndd;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		return 100;
	},
	
	getMinValue: function(unit) {
		return -50;
	},
	
	getParameterName: function() {
		return 'Wind Resist';
	}
}
);

ParamType.ERTD = 9021;
	
UnitParameter.ERTD = defineObject(BaseUnitParameter {
	getParameterType: function() {
		return ParamType.ERTD;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var ertd;
		
		if (typeof unit.custom.ertd === 'number') {
			ertd = unit.custom.ertd;
		}
		else {
			ertd = 0;
		}
		
		return ertd;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.ertd = value;
	},
	
	getParameterBonus: function(obj) {
		var ertd;
		
		if (typeof obj.custom.ertd === 'number') {
			ertd = obj.custom.ertd;
		}
		else {
			ertd = 0;
		}
		
		return ertd;
	},
	
	getDopingParameter: function(obj) {
		var ertd;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.ertdDoping === 'number') {
			ertd = obj.custom.ertdDoping;
		}
		else {
			ertd = 0;
		}
		return ertd;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		return 100;
	},
	
	getMinValue: function(unit) {
		return -50;
	},
	
	getParameterName: function() {
		return 'Earth Resist';
	}
}
);

ParamType.THND = 9022;
	
UnitParameter.THND = defineObject(BaseUnitParameter {
	getParameterType: function() {
		return ParamType.THND;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var fird;
		
		if (typeof unit.custom.thnd === 'number') {
			thnd = unit.custom.thnd;
		}
		else {
			thnd = 0;
		}
		
		return thnd;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.thnd = value;
	},
	
	getParameterBonus: function(obj) {
		var thnd;
		
		if (typeof obj.custom.thnd === 'number') {
			thnd = obj.custom.thnd;
		}
		else {
			thnd = 0;
		}
		
		return thnd;
	},
	
	getDopingParameter: function(obj) {
		var thnd;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.thndDoping === 'number') {
			thnd = obj.custom.thndDoping;
		}
		else {
			thnd = 0;
		}
		return thnd;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		return 100;
	},
	
	getMinValue: function(unit) {
		return -50;
	},
	
	getParameterName: function() {
		return 'Thunder Resist';
	}
}
);

ParamType.DIVD = 9023;
	
UnitParameter.DIVD = defineObject(BaseUnitParameter {
	getParameterType: function() {
		return ParamType.DIVD;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var divd;
		
		if (typeof unit.custom.divd === 'number') {
			divd = unit.custom.divd;
		}
		else {
			divd = 0;
		}
		
		return divd;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.divd = value;
	},
	
	getParameterBonus: function(obj) {
		var divd;
		
		if (typeof obj.custom.divd === 'number') {
			divd = obj.custom.divd;
		}
		else {
			divd = 0;
		}
		
		return divd;
	},
	
	getDopingParameter: function(obj) {
		var divd;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.divdDoping === 'number') {
			fird = obj.custom.divdDoping;
		}
		else {
			divd = 0;
		}
		return divd;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		return 100;
	},
	
	getMinValue: function(unit) {
		return -50;
	},
	
	getParameterName: function() {
		return 'Divine Resist';
	}
}
);

ParamType.DIVD = 9024;
	
UnitParameter.DRKD = defineObject(BaseUnitParameter {
	getParameterType: function() {
		return ParamType.DRKD;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var drkd;
		
		if (typeof unit.custom.drkd === 'number') {
			drkd = unit.custom.drkd;
		}
		else {
			drkd = 0;
		}
		
		return drkd;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.drkd = value;
	},
	
	getParameterBonus: function(obj) {
		var drkd;
		
		if (typeof obj.custom.drkd === 'number') {
			drkd = obj.custom.drkd;
		}
		else {
			drkd = 0;
		}
		
		return drkd;
	},
	
	getDopingParameter: function(obj) {
		var drkd;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.drkdDoping === 'number') {
			fird = obj.custom.drkdDoping;
		}
		else {
			drkd = 0;
		}
		return drkd;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		return 100;
	},
	
	getMinValue: function(unit) {
		return -50;
	},
	
	getParameterName: function() {
		return 'Dark Resist';
	}
}
);

var alias1 = ParamGroup.configureUnitParameters;
ParamGroup._configureUnitParameters = function(groupArray) {
	alias1.call(this, groupArray);
	groupArray.appendObject(UnitParameter.FIRD);
	groupArray.appendObject(UnitParameter.WTRD);
	groupArray.appendObject(UnitParameter.WNDD);
	groupArray.appendObject(UnitParameter.ERTD);
	groupArray.appendObject(UnitParameter.THND);
	groupArray.appendObject(UnitParameter.DIVD);
	groupArray.appendObject(UnitParameter.DRKD);
};

})();