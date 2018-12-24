
/*--------------------------------------------------------------------------
  
  ユニットのステータスに武器毎の熟練度を追加します。GBA版FEの武器レベルのようなものです。
  公式で配布されている、熟練度を追加するスクリプトとは併用しないで下さい。
  
  使用方法:
  custom-item-weapnlevelと併用してください。
  
  ユニットのカスタムパラメータに{swd: 71, swdGrowthBonus: 80}のように設定します。
  (剣熟練度の初期値が71、成長値が80%の意味)
  
  剣熟練度ボーナスを持たせたいクラスのカスタムパラメータに{swd: 1, swdMax: 121}のように設定します。
  剣熟練度ボーナスを持たせたいクラスのカスタムパラメータに{swd: 31, swdMax:121}のように設定します。
  [swd: 1]  ユニットがこのクラスに属している場合に、剣熟練度が+31されます。
  [swdMax: 121]  ユニットがこのクラスに属している場合、剣熟練度の上限値が121になります(設定なしの場合251)。
  
  武器や道具のカスタムパラメータに{swd: 71}のように設定すると、以下の効果があります。
    武器　[swd: 71] この武器を"装備"している場合、剣熟練度+71。武器タイプによって変わります。初期値は0
    道具　[swd: 71] この道具を"所持"している場合、剣熟練度+71（同一種類の道具を複数所持しても効果は重複しません）

  ドーピングアイテムのカスタムパラメータに{swdDoping: 71}のように設定すると、以下の効果があります。
    ・このドーピングアイテムを使用すると、ユニットの剣熟練度に+71されます。
      以下のカスタムパラメータが使用可能です（XXには数値が入ります）
        剣熟練度のドーピング  　{swdDoping:XX}
        槍熟練度のドーピング  　{lncDoping:XX}
        斧熟練度のドーピング  　{axeDoping:XX}
        弓熟練度のドーピング  　{bowDoping:XX}
        魔法熟練度のドーピング　{firDoping:XX}

  熟練度を設定していない武器タイプについては、熟練度1として扱われます。
  (デフォルトでは武器レベルが1に設定されるので、カスタムパラメータwlvを渡していない武器は装備可能な状態)
  
  パラメータ名(getParameteNameのreturn値)は、対応する武器タイプの名前と同じにして下さい。
  unitmenu-weaponlevelwindowで、正しく熟練度を表示できなくなります。
  
  新たに武器熟練度を作成したい場合は、この内容をコピーして作って下さい。
  また、新たに武器熟練度を作成した場合は、edit_weapontype-caseの編集が必要です。
  
  作成者: CB
  
  更新履歴:
  2015/07/04 新規作成
  2015/10/05 ステータス画面で熟練度が表示されないよう修正（作者じゃないけど）
  2016/01/11 1.048対応（作者じゃないけど）
  2016/07/26 1.085対応（作者じゃないけど）
  2016/09/24 1.094対応（作者じゃないけど）
  
  
--------------------------------------------------------------------------*/

(function() {

//剣熟練度の作成
// 既存の数値と一致しない値に設定
ParamType.SWD = 9000;

UnitParameter.SWD = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.SWD;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var swd;
		
		if (typeof unit.custom.swd === 'number') {
			swd = unit.custom.swd;
		}
		else {
			swd = 1;
		}
		
		return swd;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.swd = value;
	},
	
	getParameterBonus: function(obj) {
		var swd;
		
		if (typeof obj.custom.swd === 'number') {
			swd = obj.custom.swd;
		}
		else {
			swd = 0;
		}
		
		return swd;
	},
	
	getGrowthBonus: function(obj) {
		var swd;
		
		if (typeof obj.custom.swdGrowthBonus === 'number') {
			swd = obj.custom.swdGrowthBonus;
		}
		else {
			swd = 0;
		}
		
		return swd;
	},
	
	getDopingParameter: function(obj) {
		var swd;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.swdDoping === 'number') {
			swd = obj.custom.swdDoping;
		}
		else {
			swd = 0;
		}
		
		return swd;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var swdMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.swdMax === 'number') {
				swdMax = unit.getClass().custom.swdMax;
			}
			else {
				swdMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.swdMax === 'number') {
				swdMax = root.getMetaSession().global.swdMax;
			}
			else {
				swdMax = 251;
			}
		}
		
		return swdMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Sword';
	}
}
);

// 槍熟練度の作成
// 既存の数値と一致しない値に設定
ParamType.SPR = 9001;

UnitParameter.SPR = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.SPR;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var spr;
		
		if (typeof unit.custom.spr === 'number') {
			spr = unit.custom.spr;
		}
		else {
			spr = 1;
		}
		
		return spr;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.spr = value;
	},
	
	getParameterBonus: function(obj) {
		var spr;
		
		if (typeof obj.custom.spr === 'number') {
			spr = obj.custom.spr;
		}
		else {
			spr = 0;
		}
		
		return spr;
	},
	
	getGrowthBonus: function(obj) {
		var spr;
		
		if (typeof obj.custom.sprGrowthBonus === 'number') {
			spr = obj.custom.sprGrowthBonus;
		}
		else {
			spr = 0;
		}
		
		return spr;
	},
	
	getDopingParameter: function(obj) {
		var spr;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.sprDoping === 'number') {
			lnc = obj.custom.sprDoping;
		}
		else {
			lnc = 0;
		}
		
		return spr;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var sprMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.sprMax === 'number') {
				sprMax = unit.getClass().custom.sprMax;
			}
			else {
				sprMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.sprMax === 'number') {
				sprMax = root.getMetaSession().global.sprMax;
			}
			else {
				sprMax = 251;
			}
		}
		
		return sprMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Spear';
	}
}
);

// 斧熟練度の作成
// 既存の数値と一致しない値に設定
ParamType.AXE = 9002;

UnitParameter.AXE = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.AXE;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var axe;
		
		if (typeof unit.custom.axe === 'number') {
			axe = unit.custom.axe;
		}
		else {
			axe = 1;
		}
		
		return axe;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.axe = value;
	},
	
	getParameterBonus: function(obj) {
		var axe;
		
		if (typeof obj.custom.axe === 'number') {
			axe = obj.custom.axe;
		}
		else {
			axe = 0;
		}
		
		return axe;
	},
	
	getGrowthBonus: function(obj) {
		var axe;
		
		if (typeof obj.custom.axeGrowthBonus === 'number') {
			axe = obj.custom.axeGrowthBonus;
		}
		else {
			axe = 0;
		}
		
		return axe;
	},
	
	getDopingParameter: function(obj) {
		var axe;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.axeDoping === 'number') {
			axe = obj.custom.axeDoping;
		}
		else {
			axe = 0;
		}
		
		return axe;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var axeMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.axeMax === 'number') {
				axeMax = unit.getClass().custom.axeMax;
			}
			else {
				axeMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.axeMax === 'number') {
				axeMax = root.getMetaSession().global.axeMax;
			}
			else {
				axeMax = 251;
			}
		}
		
		return axeMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Axe';
	}
}
);

// 弓熟練度の作成
// 既存の数値と一致しない値に設定
ParamType.BOW = 9003;

UnitParameter.BOW = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.BOW;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var bow;
		
		if (typeof unit.custom.bow === 'number') {
			bow = unit.custom.bow;
		}
		else {
			bow = 1;
		}
		
		return bow;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.bow = value;
	},
	
	getParameterBonus: function(obj) {
		var bow;
		
		if (typeof obj.custom.bow === 'number') {
			bow = obj.custom.bow;
		}
		else {
			bow = 0;
		}
		
		return bow;
	},
	
	getGrowthBonus: function(obj) {
		var bow;
		
		if (typeof obj.custom.bowGrowthBonus === 'number') {
			bow = obj.custom.bowGrowthBonus;
		}
		else {
			bow = 0;
		}
		
		return bow;
	},
	
	getDopingParameter: function(obj) {
		var bow;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.bowDoping === 'number') {
			bow = obj.custom.bowDoping;
		}
		else {
			bow = 0;
		}
		
		return bow;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var bowMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.bowMax === 'number') {
				bowMax = unit.getClass().custom.bowMax;
			}
			else {
				bowMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.bowMax === 'number') {
				bowMax = root.getMetaSession().global.bowMax;
			}
			else {
				bowMax = 251;
			}
		}
		
		return bowMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Bow';
	}
}
);

//魔法熟練度の作成
// 既存の数値と一致しない値に設定
ParamType.FIR = 9004;

UnitParameter.FIR = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.FIR;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var fir;
		
		if (typeof unit.custom.fir === 'number') {
			fir = unit.custom.fir;
		}
		else {
			fir = 1;
		}
		
		return fir;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.fir = value;
	},
	
	getParameterBonus: function(obj) {
		var fir;
		
		if (typeof obj.custom.fir === 'number') {
			fir = obj.custom.fir;
		}
		else {
			fir = 0;
		}
		
		return fir;
	},
	
	getGrowthBonus: function(obj) {
		var fir;
		
		if (typeof obj.custom.firGrowthBonus === 'number') {
			fir = obj.custom.firGrowthBonus;
		}
		else {
			fir = 0;
		}
		
		return fir;
	},
	
	getDopingParameter: function(obj) {
		var fir;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.firDoping === 'number') {
			fir = obj.custom.firDoping;
		}
		else {
			fir = 0;
		}
		
		return fir;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var firMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.firMax === 'number') {
				firMax = unit.getClass().custom.firMax;
			}
			else {
				firMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.firMax === 'number') {
				firMax = root.getMetaSession().global.firMax;
			}
			else {
				firMax = 251;
			}
		}
		
		return firMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Fire';
	}
}
);

ParamType.WTR = 9005;

UnitParameter.WTR = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.WTR;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var wtr;
		
		if (typeof unit.custom.wtr === 'number') {
			wtr = unit.custom.wtr;
		}
		else {
			wtr = 1;
		}
		
		return wtr;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.wtr = value;
	},
	
	getParameterBonus: function(obj) {
		var wtr;
		
		if (typeof obj.custom.wtr === 'number') {
			wtr = obj.custom.wtr;
		}
		else {
			wtr = 0;
		}
		
		return wtr;
	},
	
	getGrowthBonus: function(obj) {
		var wtr;
		
		if (typeof obj.custom.wtrGrowthBonus === 'number') {
			wtr = obj.custom.wtrGrowthBonus;
		}
		else {
			wtr = 0;
		}
		
		return wtr;
	},
	
	getDopingParameter: function(obj) {
		var wtr;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.wtrDoping === 'number') {
			wtr = obj.custom.wtrDoping;
		}
		else {
			wtr = 0;
		}
		
		return wtr;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var wtrMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.wtrMax === 'number') {
				wtrMax = unit.getClass().custom.wtrMax;
			}
			else {
				wtrMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.wtrMax === 'number') {
				wtrMax = root.getMetaSession().global.wtrMax;
			}
			else {
				wtrMax = 251;
			}
		}
		
		return wtrMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Water';
	}
}
);

ParamType.WND = 9006;

UnitParameter.WND = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.WND;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var wnd;
		
		if (typeof unit.custom.wnd === 'number') {
			wnd = unit.custom.wnd;
		}
		else {
			wnd = 1;
		}
		
		return wnd;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.wnd = value;
	},
	
	getParameterBonus: function(obj) {
		var wnd;
		
		if (typeof obj.custom.wnd === 'number') {
			wnd = obj.custom.wnd;
		}
		else {
			wnd = 0;
		}
		
		return wnd;
	},
	
	getGrowthBonus: function(obj) {
		var wnd;
		
		if (typeof obj.custom.wndGrowthBonus === 'number') {
			wnd = obj.custom.wndGrowthBonus;
		}
		else {
			wnd = 0;
		}
		
		return wnd;
	},
	
	getDopingParameter: function(obj) {
		var wnd;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.wndDoping === 'number') {
			wnd = obj.custom.wndDoping;
		}
		else {
			wnd = 0;
		}
		
		return wnd;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var wndMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.wndMax === 'number') {
				wndMax = unit.getClass().custom.wndMax;
			}
			else {
				wndMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.wndMax === 'number') {
				wndMax = root.getMetaSession().global.wndMax;
			}
			else {
				wndMax = 251;
			}
		}
		
		return wndMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Wind';
	}
}
);

ParamType.ERT = 9007;

UnitParameter.ERT = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.ETR;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var etr;
		
		if (typeof unit.custom.etr === 'number') {
			etr = unit.custom.etr;
		}
		else {
			etr = 1;
		}
		
		return etr;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.etr = value;
	},
	
	getParameterBonus: function(obj) {
		var etr;
		
		if (typeof obj.custom.etr === 'number') {
			etr = obj.custom.etr;
		}
		else {
			etr = 0;
		}
		
		return etr;
	},
	
	getGrowthBonus: function(obj) {
		var etr;
		
		if (typeof obj.custom.etrGrowthBonus === 'number') {
			etr = obj.custom.etrGrowthBonus;
		}
		else {
			etr = 0;
		}
		
		return etr;
	},
	
	getDopingParameter: function(obj) {
		var etr;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.etrDoping === 'number') {
			etr = obj.custom.etrDoping;
		}
		else {
			etr = 0;
		}
		
		return etr;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var etrMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.etrMax === 'number') {
				etrMax = unit.getClass().custom.etrMax;
			}
			else {
				etrMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.etrMax === 'number') {
				etrMax = root.getMetaSession().global.etrMax;
			}
			else {
				etrMax = 251;
			}
		}
		
		return etrMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Earth';
	}
}
);

ParamType.THN = 9008;

UnitParameter.THN = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.THN;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var thn;
		
		if (typeof unit.custom.thn === 'number') {
			thn = unit.custom.thn;
		}
		else {
			thn = 1;
		}
		
		return thn;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.thn = value;
	},
	
	getParameterBonus: function(obj) {
		var thn;
		
		if (typeof obj.custom.thn === 'number') {
			thn = obj.custom.thn;
		}
		else {
			thn = 0;
		}
		
		return thn;
	},
	
	getGrowthBonus: function(obj) {
		var thn;
		
		if (typeof obj.custom.thnGrowthBonus === 'number') {
			thn = obj.custom.thnGrowthBonus;
		}
		else {
			thn = 0;
		}
		
		return thn;
	},
	
	getDopingParameter: function(obj) {
		var thn;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.thnDoping === 'number') {
			thn = obj.custom.thnDoping;
		}
		else {
			thn = 0;
		}
		
		return thn;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var thnMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.thnMax === 'number') {
				thnMax = unit.getClass().custom.thnMax;
			}
			else {
				thnMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.thnMax === 'number') {
				thnMax = root.getMetaSession().global.thnMax;
			}
			else {
				thnMax = 251;
			}
		}
		
		return thnMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Thunder';
	}
}
);

ParamType.DIV = 9009;

UnitParameter.DIV = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.DIV;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var div;
		
		if (typeof unit.custom.div === 'number') {
			div = unit.custom.div;
		}
		else {
			div = 1;
		}
		
		return div;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.div = value;
	},
	
	getParameterBonus: function(obj) {
		var div;
		
		if (typeof obj.custom.div === 'number') {
			div = obj.custom.div;
		}
		else {
			div = 0;
		}
		
		return div;
	},
	
	getGrowthBonus: function(obj) {
		var div;
		
		if (typeof obj.custom.divGrowthBonus === 'number') {
			div = obj.custom.divGrowthBonus;
		}
		else {
			div = 0;
		}
		
		return div;
	},
	
	getDopingParameter: function(obj) {
		var div;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.divDoping === 'number') {
			div = obj.custom.divDoping;
		}
		else {
			div = 0;
		}
		
		return div;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var divMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.divMax === 'number') {
				divMax = unit.getClass().custom.divMax;
			}
			else {
				divMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.divMax === 'number') {
				divMax = root.getMetaSession().global.divMax;
			}
			else {
				divMax = 251;
			}
		}
		
		return divMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Divine';
	}
}
);

ParamType.DRK = 9010;

UnitParameter.DRK = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.DRK;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var drk;
		
		if (typeof unit.custom.drk === 'number') {
			drk = unit.custom.drk;
		}
		else {
			drk = 1;
		}
		
		return drk;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.drk = value;
	},
	
	getParameterBonus: function(obj) {
		var drk;
		
		if (typeof obj.custom.drk === 'number') {
			drk = obj.custom.drk;
		}
		else {
			drk = 0;
		}
		
		return drk;
	},
	
	getGrowthBonus: function(obj) {
		var drk;
		
		if (typeof obj.custom.drkGrowthBonus === 'number') {
			drk = obj.custom.drkGrowthBonus;
		}
		else {
			drk = 0;
		}
		
		return drk;
	},
	
	getDopingParameter: function(obj) {
		var drk;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.drkDoping === 'number') {
			drk = obj.custom.drkDoping;
		}
		else {
			drk = 0;
		}
		
		return drk;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var drkMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.drkMax === 'number') {
				drkMax = unit.getClass().custom.drkMax;
			}
			else {
				drkMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.drkMax === 'number') {
				drkMax = root.getMetaSession().global.drkMax;
			}
			else {
				drkMax = 251;
			}
		}
		
		return drkMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Dark';
	}
}
);

ParamType.DGR = 9011;

UnitParameter.DGR = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.DGR;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var dag;
		
		if (typeof unit.custom.dag === 'number') {
			dag = unit.custom.dag;
		}
		else {
			dag = 1;
		}
		
		return dag;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.dag = value;
	},
	
	getParameterBonus: function(obj) {
		var dag;
		
		if (typeof obj.custom.dag === 'number') {
			dag = obj.custom.dag;
		}
		else {
			dag = 0;
		}
		
		return dag;
	},
	
	getGrowthBonus: function(obj) {
		var dag;
		
		if (typeof obj.custom.dagGrowthBonus === 'number') {
			dag = obj.custom.dagGrowthBonus;
		}
		else {
			dag = 0;
		}
		
		return dag;
	},
	
	getDopingParameter: function(obj) {
		var dag;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.dagDoping === 'number') {
			dag = obj.custom.dagDoping;
		}
		else {
			dag = 0;
		}
		
		return dag;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var dagMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.dagMax === 'number') {
				dagMax = unit.getClass().custom.dagMax;
			}
			else {
				dagMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.dagMax === 'number') {
				dagMax = root.getMetaSession().global.dagMax;
			}
			else {
				dagMax = 251;
			}
		}
		
		return dagMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Dagger';
	}
}
);

ParamType.CBW = 9012;

UnitParameter.CBW = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.CBW;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var cbw;
		
		if (typeof unit.custom.cbw === 'number') {
			cbw = unit.custom.cbw;
		}
		else {
			cbw = 1;
		}
		
		return cbw;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.cbw = value;
	},
	
	getParameterBonus: function(obj) {
		var cbw;
		
		if (typeof obj.custom.cbw === 'number') {
			cbw = obj.custom.cbw;
		}
		else {
			cbw = 0;
		}
		
		return cbw;
	},
	
	getGrowthBonus: function(obj) {
		var cbw;
		
		if (typeof obj.custom.cbwGrowthBonus === 'number') {
			cbw = obj.custom.cbwGrowthBonus;
		}
		else {
			cbw = 0;
		}
		
		return cbw;
	},
	
	getDopingParameter: function(obj) {
		var cbw;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.cbwDoping === 'number') {
			cbw = obj.custom.cbwDoping;
		}
		else {
			cbw = 0;
		}
		
		return cbw;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var cbwMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.cbwMax === 'number') {
				cbwMax = unit.getClass().custom.cbwMax;
			}
			else {
				cbwMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.cbwMax === 'number') {
				cbwMax = root.getMetaSession().global.cbwMax;
			}
			else {
				cbwMax = 251;
			}
		}
		
		return cbwMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Crossbow';
	}
}
);

ParamType.GUN = 9013;

UnitParameter.GUN = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.GUN;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var gun;
		
		if (typeof unit.custom.gun === 'number') {
			gun = unit.custom.gun;
		}
		else {
			gun = 1;
		}
		
		return gun;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.gun = value;
	},
	
	getParameterBonus: function(obj) {
		var gun;
		
		if (typeof obj.custom.gun === 'number') {
			gun = obj.custom.gun;
		}
		else {
			gun = 0;
		}
		
		return gun;
	},
	
	getGrowthBonus: function(obj) {
		var gun;
		
		if (typeof obj.custom.gunGrowthBonus === 'number') {
			gun = obj.custom.gunGrowthBonus;
		}
		else {
			gun = 0;
		}
		
		return gun;
	},
	
	getDopingParameter: function(obj) {
		var gun;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.gunDoping === 'number') {
			gun = obj.custom.gunDoping;
		}
		else {
			gun = 0;
		}
		
		return gun;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var gunMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.gunMax === 'number') {
				gunMax = unit.getClass().custom.gunMax;
			}
			else {
				gunMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.gunMax === 'number') {
				gunMax = root.getMetaSession().global.gunMax;
			}
			else {
				gunMax = 251;
			}
		}
		
		return gunMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Gun';
	}
}
);

ParamType.STK = 9014;

UnitParameter.STK = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.STK;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var stk;
		
		if (typeof unit.custom.stk === 'number') {
			stk = unit.custom.stk;
		}
		else {
			stk = 1;
		}
		
		return stk;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.stk = value;
	},
	
	getParameterBonus: function(obj) {
		var stk;
		
		if (typeof obj.custom.stk === 'number') {
			stk = obj.custom.stk;
		}
		else {
			stk = 0;
		}
		
		return stk;
	},
	
	getGrowthBonus: function(obj) {
		var stk;
		
		if (typeof obj.custom.stkGrowthBonus === 'number') {
			stk = obj.custom.stkGrowthBonus;
		}
		else {
			stk = 0;
		}
		
		return stk;
	},
	
	getDopingParameter: function(obj) {
		var stk;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.stkDoping === 'number') {
			stk = obj.custom.stkDoping;
		}
		else {
			stk = 0;
		}
		
		return stk;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var stkMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.stkMax === 'number') {
				stkMax = unit.getClass().custom.stkMax;
			}
			else {
				stkMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.stkMax === 'number') {
				stkMax = root.getMetaSession().global.stkMax;
			}
			else {
				stkMax = 251;
			}
		}
		
		return stkMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Strike';
	}
}
);

ParamType.SSH = 9015;

UnitParameter.SSH = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.SSH;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var ssh;
		
		if (typeof unit.custom.ssh === 'number') {
			ssh = unit.custom.ssh;
		}
		else {
			ssh = 1;
		}
		
		return ssh;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.ssh = value;
	},
	
	getParameterBonus: function(obj) {
		var ssh;
		
		if (typeof obj.custom.ssh === 'number') {
			ssh = obj.custom.ssh;
		}
		else {
			ssh = 0;
		}
		
		return ssh;
	},
	
	getGrowthBonus: function(obj) {
		var ssh;
		
		if (typeof obj.custom.sshGrowthBonus === 'number') {
			ssh = obj.custom.sshGrowthBonus;
		}
		else {
			ssh = 0;
		}
		
		return ssh;
	},
	
	getDopingParameter: function(obj) {
		var ssh;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.sshDoping === 'number') {
			ssh = obj.custom.sshDoping;
		}
		else {
			ssh = 0;
		}
		
		return ssh;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var sshMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.sshMax === 'number') {
				sshMax = unit.getClass().custom.sshMax;
			}
			else {
				sshMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.sshMax === 'number') {
				sshMax = root.getMetaSession().global.sshMax;
			}
			else {
				sshMax = 251;
			}
		}
		
		return sshMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Small Shield';
	}
}
);

ParamType.MSH = 9016;

UnitParameter.MSH = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.MSH;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var msh;
		
		if (typeof unit.custom.msh === 'number') {
			msh = unit.custom.msh;
		}
		else {
			msh = 1;
		}
		
		return msh;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.msh = value;
	},
	
	getParameterBonus: function(obj) {
		var msh;
		
		if (typeof obj.custom.msh === 'number') {
			msh = obj.custom.msh;
		}
		else {
			msh = 0;
		}
		
		return msh;
	},
	
	getGrowthBonus: function(obj) {
		var msh;
		
		if (typeof obj.custom.mshGrowthBonus === 'number') {
			msh = obj.custom.mshGrowthBonus;
		}
		else {
			msh = 0;
		}
		
		return msh;
	},
	
	getDopingParameter: function(obj) {
		var msh;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.mshDoping === 'number') {
			msh = obj.custom.mshDoping;
		}
		else {
			msh = 0;
		}
		
		return msh;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var mshMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.mshMax === 'number') {
				mshMax = unit.getClass().custom.mshMax;
			}
			else {
				mshMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.mshMax === 'number') {
				mshMax = root.getMetaSession().global.mshMax;
			}
			else {
				mshMax = 251;
			}
		}
		
		return mshMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Medium Shield';
	}
}
);

ParamType.LSH = 9017;

UnitParameter.LSH = defineObject(BaseUnitParameter,
{
	getParameterType: function() {
		return ParamType.LSH;
	},
	
	isParameterDisplayable: function(unitStatusType) {
		return false;
	},
	
	getUnitValue: function(unit) {
		var lsh;
		
		if (typeof unit.custom.lsh === 'number') {
			lsh = unit.custom.lsh;
		}
		else {
			lsh = 1;
		}
		
		return lsh;
	},
	
	setUnitValue: function(unit, value) {
		unit.custom.lsh = value;
	},
	
	getParameterBonus: function(obj) {
		var lsh;
		
		if (typeof obj.custom.lsh === 'number') {
			lsh = obj.custom.lsh;
		}
		else {
			lsh = 0;
		}
		
		return lsh;
	},
	
	getGrowthBonus: function(obj) {
		var lsh;
		
		if (typeof obj.custom.lshGrowthBonus === 'number') {
			lsh = obj.custom.lshGrowthBonus;
		}
		else {
			lsh = 0;
		}
		
		return lsh;
	},
	
	getDopingParameter: function(obj) {
		var lsh;
		
		if (typeof obj.custom !== 'object') {
			return 0;
		}
		
		if (typeof obj.custom.lshDoping === 'number') {
			lsh = obj.custom.lshDoping;
		}
		else {
			lsh = 0;
		}
		
		return lsh;
	},
	
	getAssistValue: function(obj) {
		return 0;
	},
	
	getMaxValue: function(unit) {
		var lshMax;
		
		if (DataConfig.isClassLimitEnabled()) {
			if (typeof unit.getClass().custom.lshMax === 'number') {
				lshMax = unit.getClass().custom.lshMax;
			}
			else {
				lshMax = 251;
			}
		}
		else {
			if (typeof root.getMetaSession().global.lshMax === 'number') {
				lshMax = root.getMetaSession().global.lshMax;
			}
			else {
				lshMax = 251;
			}
		}
		
		return lshMax;
	},
	
	getMinValue: function(unit) {
		return 0;
	},
	
	getParameterName: function() {
		return 'Large Shield';
	}
}
);

//作成した熟練度をユニットパラメータに追加
var alias1 = ParamGroup._configureUnitParameters;
ParamGroup._configureUnitParameters = function(groupArray) {
	alias1.call(this, groupArray);
	groupArray.appendObject(UnitParameter.SWD);
	groupArray.appendObject(UnitParameter.SPR);
	groupArray.appendObject(UnitParameter.AXE);
	groupArray.appendObject(UnitParameter.BOW);
	groupArray.appendObject(UnitParameter.FIR);
	groupArray.appendObject(UnitParameter.WTR);
	groupArray.appendObject(UnitParameter.WND);
	groupArray.appendObject(UnitParameter.ERT);
	groupArray.appendObject(UnitParameter.THN);
	groupArray.appendObject(UnitParameter.DIV);
	groupArray.appendObject(UnitParameter.DRK);
	groupArray.appendObject(UnitParameter.DGR);
	groupArray.appendObject(UnitParameter.CBW);
	groupArray.appendObject(UnitParameter.GUN);
	groupArray.appendObject(UnitParameter.STK);
	groupArray.appendObject(UnitParameter.SSH);
	groupArray.appendObject(UnitParameter.MSH);
	groupArray.appendObject(UnitParameter.LSH);
};

})();
