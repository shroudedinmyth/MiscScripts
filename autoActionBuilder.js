var AutoActionBuilder = {
	buildApproachAction: function(unit, autoActionArray) {
		var combination;
		
		// Get the best combination in the unit who can attack from the current position.
		combination = CombinationManager.getApproachCombination(unit, true);
		if (combination === null) {
			// Search the opponent to widen the range because no unit who can be attacked from the current position exists.
			// However, before that, check if the attack within a range was set.
			if (unit.getAIPattern().getApproachPatternInfo().isRangeOnly()) {
				// Do nothing because attack is set only within a range.
				// There is no problem because it has already checked that it's impossible to attack within a range. 
				return this._buildEmptyAction(unit, autoActionArray);
			}
			else {
				// Get which enemy to be targeted because there is no opponent who can be attacked at the current position.
				combination = CombinationManager.getEstimateCombination(unit);
				if (combination === null) {
					return this._buildEmptyAction(unit, autoActionArray);
				}
				else {
					// Set the target position to move.
					this._pushMove(unit, autoActionArray, combination);
					
					// Set it so as to wait after move.
					this._pushWait(unit, autoActionArray, combination);
				}
			}
		}
		else {
			this._pushGeneral(unit, autoActionArray, combination);
		}
		
		return true;
	},
	
	buildWaitAction: function(unit, autoActionArray) {
		var combination;
		var isWaitOnly = unit.getAIPattern().getWaitPatternInfo().isWaitOnly();
		
		if (isWaitOnly) {
			return this._buildEmptyAction(unit, autoActionArray);
		}
		else {
			// Get the best combination in the unit who can attack from the current position.
			combination = CombinationManager.getWaitCombination(unit);
			if (combination === null) {
				// Do nothing because it cannot attack.
				return this._buildEmptyAction(unit, autoActionArray);
			}
			else {
				this._pushGeneral(unit, autoActionArray, combination);
			}
		}
		
		return true;
	},
	
	buildMoveAction: function(unit, autoActionArray) {
		var x, y, targetUnit;
		var combination = null;
		var patternInfo = unit.getAIPattern().getMovePatternInfo();
		
		if (patternInfo.getMoveGoalType() === MoveGoalType.POS) {
			x = patternInfo.getMoveGoalX();
			y = patternInfo.getMoveGoalY();
		}
		else {
			targetUnit = patternInfo.getMoveGoalUnit();
			if (targetUnit === null) {
				return this._buildEmptyAction(unit, autoActionArray);
			}
			
			x = targetUnit.getMapX();
			y = targetUnit.getMapY();
		}
		
		// Check if it has already reached at goal.
		if (unit.getMapX() === x && unit.getMapY() === y) {
			// Attack if it can attack.
			if (patternInfo.getMoveAIType() === MoveAIType.APPROACH) {
				combination = CombinationManager.getWaitCombination(unit);
				if (combination !== null) {
					this._pushGeneral(unit, autoActionArray, combination);
					return true;
				}
			}
		}
		else {
			combination = CombinationManager.getMoveCombination(unit, x, y, patternInfo.getMoveAIType());
			if (combination === null) {
				return this._buildEmptyAction(unit, autoActionArray);
			}
			
			if (combination.item !== null) {
				this._pushGeneral(unit, autoActionArray, combination);
				return true;
			}
			else {
				this._pushMove(unit, autoActionArray, combination);
			}
		}
		
		if (combination !== null) {
			this._pushWait(unit, autoActionArray, combination);
		}
		
		return true;
	},
	
	buildCustomAction: function(unit, autoActionArray, keyword) {
		return false;
	},
	
	_buildEmptyAction: function(unit, autoActionArray) {
		// If wait is needed, execute the following processing.
		// pushWait(unit, this._autoActionArray, null);
		this._pushWait(unit, autoActionArray, null);
		return false;
	},
	
	_pushGeneral: function(unit, autoActionArray, combination) {
		// Set the target position to move.
		this._pushMove(unit, autoActionArray, combination);
		
		if (combination.skill !== null) {
			this._pushSkill(unit, autoActionArray, combination);
		}
		else if (combination.item !== null) {
			if (combination.item.isWeapon()) {
				this._pushAttack(unit, autoActionArray, combination);
			}
			else {
				this._pushItem(unit, autoActionArray, combination);
			}
		}
		else {
			this._pushCustom(unit, autoActionArray, combination);
		}
		
		this._pushWait(unit, autoActionArray, combination);
	},
	
	_pushMove: function(unit, autoActionArray, combination) {
		var autoAction;
		
		this._pushScroll(unit, autoActionArray, combination);
		
		if (combination.cource.length === 0) {
			return;
		}
		
		autoAction = createObject(MoveAutoAction);
		autoAction.setAutoActionInfo(unit, combination);
		autoActionArray.push(autoAction);
	},
	
	_pushAttack: function(unit, autoActionArray, combination) {
		var autoAction = createObject(WeaponAutoAction);
		
		autoAction.setAutoActionInfo(unit, combination);
		autoActionArray.push(autoAction);
	},
	
	_pushItem: function(unit, autoActionArray, combination) {
		var autoAction = createObject(ItemAutoAction);
		
		autoAction.setAutoActionInfo(unit, combination);
		autoActionArray.push(autoAction);
	},
	
	_pushSkill: function(unit, autoActionArray, combination) {
		var autoAction = createObject(SkillAutoAction);
		
		autoAction.setAutoActionInfo(unit, combination);
		autoActionArray.push(autoAction);
	},
	
	_pushWait: function(unit, autoActionArray, combination) {
		var autoAction = createObject(WaitAutoAction);
		
		autoAction.setAutoActionInfo(unit, combination);
		autoActionArray.push(autoAction);
	},
	
	_pushScroll: function(unit, autoActionArray, combination) {
		var autoAction;
		
		if (CurrentMap.isCompleteSkipMode()) {
			return;
		}
		
		if (EnvironmentControl.getScrollSpeedType() === SpeedType.HIGH) {
			MapView.setScroll(unit.getMapX(), unit.getMapY());
		}
		else {
			autoAction = createObject(ScrollAutoAction);
			autoAction.setAutoActionInfo(unit, combination);
			autoActionArray.push(autoAction);
		}
	},
	
	_pushCustom: function(unit, autoActionArray, combination) {
	}
};