(function () {

var Breaker = {
	checkavoid: function(active, passive, weapon, hit) {
		var skillArr = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, 'breaker');
		
		var count = skillArr.length;
		var skill;
		
		for (i = 0; i < count; i++) {
			var skill = skillArr[i];
			if (skill.custom.weaponTypes.contains(weapon.custom.getWeaponType())){
				if (hit >= 33) {
					hit = 33;
				}
			}
		}
		
		return hit;
	}
}

})();