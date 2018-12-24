
/*--------------------------------------------------------------------------
  
  attackorder_weaponexp, custom-item-weapnlevel, singleton-calculator_custom から呼び出されるメソッドが入っています。
  
  使用方法：
  武器熟練度を作成した場合は、getClassBonus,getItemBonus,getUnitBonus,_addWeaponExp,getJyukurendoの内容を追加する。
  
  例：「斧」について
  UnitParameter.AXE
  武器タイプを、カスタムパラメータ{wtype: 2}
  武器熟練度を、カスタムパラメータaxe
  クラスボーナスを、カスタムパラメータaxe
  アイテムボーナスを、カスタムパラメータaxe
  として作成した場合、
  	getClassBonuscase → case 2 : bonus = unit.getClass().custom.axe; break;
  	getItemBonus → case 2 : bonus = item.custom.axe; break;
  	getUnitBonus → case 2 : bonus = unit.custom.axe; break;
  	_addWeaponExp → case 2  : UnitParameter.AXE.setUnitValue(unit, wexp + UnitParameter.AXE.getUnitValue(unit)); break;
  	getJyukurendoMax → case 2  : UnitParameter.AXE.getMaxValue(unit); break;
  上記のように、それぞれswitch文の中に追加する。
  
  ※replaceWeaponLevelについて
  ItemSentence.WeaponLevel.replaceWeaponLevel は、
  武器レベル、武器熟練度毎に表示するランクを定義しています。
  デフォルトの場合、1～30がランクE, 31～70がランクD, … ,251がランクS,という感じです。
  なので、例えば武器ランクがDの武器を作りたい場合は、武器のカスタムパラメータに{wlv:31}と記載すればいいです。
  
  作成者: CB
  
  更新履歴:
  2015/07/06 新規作成
  2015/07/08 使用方法に追記
  2015/08/09 熟練度のクラス上限値に対応
             ※getJyukurendoMaxメソッドを追加。こちらも武器タイプに応じて編集が必要です（上記参照）。
  2016/06/09 バーゲージ表示対応（作者じゃないけど）
  
--------------------------------------------------------------------------*/

(function() {

//武器タイプ毎に参照するクラスボーナスを設定。
ItemControl.getClassBonus = function(weaponType, unit){
	var bonus;
	switch(weaponType) {
		case 0 : bonus = unit.getClass().custom.swd; break;
		case 1 : bonus = unit.getClass().custom.spr; break;
		case 2 : bonus = unit.getClass().custom.axe; break;
		case 3 : bonus = unit.getClass().custom.bow; break;
		case 4 : bonus = unit.getClass().custom.fir; break;
		case 5 : bonus = unit.getClass().custom.wtr; break;
		case 6 : bonus = unit.getClass().custom.wnd; break;
		case 7 : bonus = unit.getClass().custom.ert; break;
		case 8 : bonus = unit.getClass().custom.thn; break;
		case 9 : bonus = unit.getClass().custom.div; break;
		case 10: bonus = unit.getClass().custom.drk; break;
		case 11: bonus = unit.getClass().custom.dag; break;
		case 12: bonus = unit.getClass().custom.cbw; break;
		case 13: bonus = unit.getClass().custom.gun; break;
		case 14: bonus = unit.getClass().custom.stk; break;
		case 15: bonus = unit.getClass().custom.ssh; break;
		case 16: bonus = unit.getClass().custom.msh; break;
		case 17: bonus = unit.getClass().custom.lsh; break;
		default : bonus = 0 ; break;
	}
	
	if(typeof bonus !== 'number') {
		bonus = 0;
	}
	
	return bonus;
};

//武器タイプ毎に参照するアイテムボーナスを設定。
ItemControl.getItemBonus = function(weaponType, item){
	var bonus;
	switch(weaponType) {
		case 0  : bonus = item.custom.swd; break;
		case 1  : bonus = item.custom.spr; break;
		case 2  : bonus = item.custom.axe; break;
		case 3  : bonus = item.custom.bow; break;
		case 4  : bonus = item.custom.fir; break;
		case 5  : bonus = item.custom.wtr; break;
		case 6  : bonus = item.custom.wnd; break;
		case 7  : bonus = item.custom.ert; break;
		case 8  : bonus = item.custom.thn; break;
		case 9  : bonus = item.custom.div; break;
		case 10 : bonus = item.custom.drk; break;
		case 11 : bonus = item.custom.dag; break;
		case 12 : bonus = item.custom.cbw; break;
		case 13 : bonus = item.custom.gun; break;
		case 14 : bonus = item.custom.stk; break;
		case 15 : bonus = item.custom.ssh; break;
		case 16 : bonus = item.custom.msh; break;
		case 17 : bonus = item.custom.lsh; break;
		default : bonus = 0 ; break;
	}
	
	if(typeof bonus !== 'number') {
		bonus = 0;
	}
	
	return bonus;
};

//武器タイプ毎に参照するユニットボーナスを設定。
ItemControl.getUnitBonus = function(weaponType, unit){
	var bonus;
	switch(weaponType) {
		case 0  : bonus = item.custom.swd; break;
		case 1  : bonus = item.custom.spr; break;
		case 2  : bonus = item.custom.axe; break;
		case 3  : bonus = item.custom.bow; break;
		case 4  : bonus = item.custom.fir; break;
		case 5  : bonus = item.custom.wtr; break;
		case 6  : bonus = item.custom.wnd; break;
		case 7  : bonus = item.custom.ert; break;
		case 8  : bonus = item.custom.thn; break;
		case 9  : bonus = item.custom.div; break;
		case 10 : bonus = item.custom.drk; break;
		case 11 : bonus = item.custom.dag; break;
		case 12 : bonus = item.custom.cbw; break;
		case 13 : bonus = item.custom.gun; break;
		case 14 : bonus = item.custom.stk; break;
		case 15 : bonus = item.custom.ssh; break;
		case 16 : bonus = item.custom.msh; break;
		case 17 : bonus = item.custom.lsh; break;
		default : bonus = 1 ; break;
	}
	
	if(typeof bonus !== 'number') {
		bonus = 1;
	}
	
	return bonus;
};

// 武器タイプ毎に対応する熟練度に、武器経験値を加算する。
NormalAttackOrderBuilder._addWeaponExp = function(unit, wexp, wtype){
	switch(wtype) {
		case 0  : UnitParameter.SWD.setUnitValue(unit, wexp + UnitParameter.SWD.getUnitValue(unit)); break;
		case 1  : UnitParameter.SPR.setUnitValue(unit, wexp + UnitParameter.SPR.getUnitValue(unit)); break;
		case 2  : UnitParameter.AXE.setUnitValue(unit, wexp + UnitParameter.AXE.getUnitValue(unit)); break;
		case 3  : UnitParameter.BOW.setUnitValue(unit, wexp + UnitParameter.BOW.getUnitValue(unit)); break;
		case 4  : UnitParameter.FIR.setUnitValue(unit, wexp + UnitParameter.FIR.getUnitValue(unit)); break;
		case 5  : UnitParameter.WTR.setUnitValue(unit, wexp + UnitParameter.WTR.getUnitValue(unit)); break;
		case 6  : UnitParameter.WND.setUnitValue(unit, wexp + UnitParameter.WND.getUnitValue(unit)); break;
		case 7  : UnitParameter.ERT.setUnitValue(unit, wexp + UnitParameter.ERT.getUnitValue(unit)); break;
		case 8  : UnitParameter.THN.setUnitValue(unit, wexp + UnitParameter.THN.getUnitValue(unit)); break;
		case 9  : UnitParameter.DIV.setUnitValue(unit, wexp + UnitParameter.DIV.getUnitValue(unit)); break;
		case 10 : UnitParameter.DRK.setUnitValue(unit, wexp + UnitParameter.DRK.getUnitValue(unit)); break;
		case 11 : UnitParameter.DGR.setUnitValue(unit, wexp + UnitParameter.DGR.getUnitValue(unit)); break;
		case 12 : UnitParameter.CBW.setUnitValue(unit, wexp + UnitParameter.CBW.getUnitValue(unit)); break;
		case 13 : UnitParameter.GUN.setUnitValue(unit, wexp + UnitParameter.GUN.getUnitValue(unit)); break;
		case 14 : UnitParameter.STK.setUnitValue(unit, wexp + UnitParameter.STK.getUnitValue(unit)); break;
		case 15 : UnitParameter.SSH.setUnitValue(unit, wexp + UnitParameter.SSH.getUnitValue(unit)); break;
		case 16 : UnitParameter.MSH.setUnitValue(unit, wexp + UnitParameter.MSH.getUnitValue(unit)); break;
		case 17 : UnitParameter.LSH.setUnitValue(unit, wexp + UnitParameter.LSH.getUnitValue(unit)); break;
		default : break;
	}
	return true;
};

// ↓★2015/8/9追加
// 武器タイプに対応した熟練度の上限値を取得する。
AbilityCalculator.getJyukurendoMax = function(weaponType, unit) {
	var maxValue = 251;
	
	switch(weaponType) {
		case 0  : maxValue =UnitParameter.SWD.getMaxValue(unit); break;
		case 1  : maxValue =UnitParameter.SPR.getMaxValue(unit); break;
		case 2  : maxValue =UnitParameter.AXE.getMaxValue(unit); break;
		case 3  : maxValue =UnitParameter.BOW.getMaxValue(unit); break;
		case 4  : maxValue =UnitParameter.FIR.getMaxValue(unit); break;
		case 5  : maxValue =UnitParameter.WTR.getMaxValue(unit); break;
		case 6  : maxValue =UnitParameter.WND.getMaxValue(unit); break;
		case 7  : maxValue =UnitParameter.ERT.getMaxValue(unit); break;
		case 8  : maxValue =UnitParameter.THN.getMaxValue(unit); break;
		case 9  : maxValue =UnitParameter.DIV.getMaxValue(unit); break;
		case 10 : maxValue =UnitParameter.DRK.getMaxValue(unit); break;
		case 11 : maxValue =UnitParameter.DGR.getMaxValue(unit); break;
		case 12 : maxValue =UnitParameter.CBW.getMaxValue(unit); break;
		case 13 : maxValue =UnitParameter.GUN.getMaxValue(unit); break;
		case 14 : maxValue =UnitParameter.STK.getMaxValue(unit); break;
		case 15 : maxValue =UnitParameter.SSH.getMaxValue(unit); break;
		case 16 : maxValue =UnitParameter.MSH.getMaxValue(unit); break;
		case 17 : maxValue =UnitParameter.LSH.getMaxValue(unit); break;
		default : break;
	}
	return maxValue;
};

// 武器タイプに対応した熟練度を取得する。
AbilityCalculator.getJyukurendo = function(unit, weapon) {
	var weaponType = weapon.custom.wtype;
	var classBns = ItemControl.getClassBonus(weaponType, unit);
	var itemBns  = ItemControl.getItemBonus(weaponType, weapon);
	var unitBns  = ItemControl.getUnitBonus(weaponType, unit);
	var totalValue = classBns + itemBns + unitBns;
	var MaxValue = AbilityCalculator.getJyukurendoMax(weaponType, unit);
	
	// ↓2015/8/9追加
	//熟練度の合計がクラスの上限値を上回っている場合、熟練度にクラスの上限値を代入
	if (totalValue > MaxValue) {
		totalValue = MaxValue;
	}
	
	return totalValue;
};

// 武器レベル、熟練度の値毎に表示する文字を設定
ItemSentence.WeaponLevel.replaceWeaponLevel = function(wlv) {
	var string = wlv;

	// 武器レベル(熟練度)の値に応じて、表示する文字を設定
	if (wlv >= 1 && wlv <= 30) { string = 'E'; }
	else if (wlv >= 31 && wlv <= 70) { string = 'D'; }
	else if (wlv >= 71 && wlv <= 120) { string = 'C'; }
	else if (wlv >= 121 && wlv <= 180) { string = 'B'; }
	else if (wlv >= 181 && wlv <= 250) { string = 'A'; }
	else if (wlv >= 251) { string = 'S'; }
	else { string = 'ERR'; }
	
	return string;
}

// 武器レベル、熟練度の値毎に表示する文字を設定
ItemSentence.WeaponLevel.getNowWeaponLevelMin = function(wlv) {
	// 武器レベル(熟練度)の値に応じて、表示する文字を設定
	if (wlv < 1) {
		return 0;
	}
	if (wlv >= 1 && wlv <= 30) {
		return 0;
	}
	if (wlv >= 31 && wlv <= 70) {
		return 31;
	}
	if (wlv >= 71 && wlv <= 120) {
		return 71;
	}
	if (wlv >= 121 && wlv <= 180) {
		return 121;
	}
	if (wlv >= 181 && wlv <= 250) {
		return 181;
	}
//	else if (wlv >= 251) {
//	}
	return 251;
}

// 武器レベル、熟練度の値毎に表示する文字を設定
ItemSentence.WeaponLevel.getNowWeaponLevelMax = function(wlv) {
	// 武器レベル(熟練度)の値に応じて、表示する文字を設定
	if (wlv < 1) {
		return 30;
	}
	if (wlv >= 1 && wlv <= 30) {
		return 30;
	}
	if (wlv >= 31 && wlv <= 70) {
		return 70;
	}
	if (wlv >= 71 && wlv <= 120) {
		return 120;
	}
	if (wlv >= 121 && wlv <= 180) {
		return 180;
	}
	if (wlv >= 181 && wlv <= 250) {
		return 250;
	}
//	else if (wlv >= 251) {
//	}
	return 251;
}

})();
