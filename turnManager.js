var TurnManager = {
	totalActions = 0;
	actionQueue : null,
	_actionTracker = null,
	orderings = null,
	
	getActionQueue: function() {
		return this.actionQueue.getQueue();
	},
	
	peek: function() {
		return this.actionQueue.peek();
	},
	
	isEmpty: function() {
		return this.actionQueue !== null ? this.actionQueue.isEmpty(): true;
	}
	
	pop: function() {
		this.actionQueue.pop();
	},
	
	playerStandby: function() {
		this.actionQueue.factionStandby(TurnType.PLAYER);
	},
	
	getTopFive: function() {
		return this.actionQueue.getTopFive();
	},
	
	/*getNextAction: function() { 
		return this.actionQueue.actionQueue[1] !== undefined ? actionQueue.actionQueue[1] : null;
	},*/
	
	resetAll : function() {
		//get the counts of deployed/alive units on the map as array and then feed into actionQueue
		this.restartQueue();
		this.resetAllOrderings();
		//this.resetCurrentActionCounts();
		//this.initializeOrderings();
		//this.resetOrderIndices();
	},
	
	resetCurrentActionCounts: function() {
		this.totalActions = 0;
		this._actionTracker.forEach(obj => obj.actionCounter = 0);
	},
	
	initializeTrackers: function() {
		var reorderCounters = root.getCurrentSession().getCurrentMapInfo().custom.reorderCounters !== undefined ? root.getCurrentSession().getCurrentSession.custom.reorderCounters : null;
		this._actionTracker = [
			{ actionCounter: 0, reorderCounter: reorderCounters !== undefined && reorderCounters.length >= 1 ? reorderCounters[0] : null }, //player berserk
			{ actionCounter: 0, reorderCounter: reorderCounters !== undefined && reorderCounters.length >= 2 ? reorderCounters[1] : null }, //enemy
			{ actionCounter: 0, reorderCounter: reorderCounters !== undefined && reorderCounters.length >= 3 ? reorderCounters[2] : null } //npc
			//maybe add something in for berserk players?
		];
	},
	
	initializeOrderings: function() {
		//for now, just an array of current orderIndices. However, might want to make it array of objects if we're doing something involving reordering the lists.
		this.orderings = [0,0,0]; //player (berserk only), enemy, ally.
	},
	
	initializeDefaultOrdering: function() { //call when in EnemyTurn when _actionTracker[turnType].actionCounter == 0
		var ttp = root.getCurrentSession().getTurnType();
		this.orderings[ttp].prevOrderedList = TurnControl.getActorList();
		this.orderings[ttp].currentOrderedList = TurnControl.getActorList().filter(actor => !actor.isActionStop() && !actor.isInvisible());
	},
	
	restartQueue: function() {
		if (this.actionQueue === null) {
			this.actionQueue = createObject(ActionQueue);
		}
		this.actionQueue.prepareQueue();
	},
	
	resetQueue: function() {
		if (this.actionQueue !== null){
			this.actionQueue.resetQueue();
		}
	},
	
	totalActions: function() {
		return this.totalActions;
	},
	
	actionTracker: function() {
		return this._actionTracker;
	},
	
	incrementActionCount: function() {
		//this._actionTracker[tt].actionCounter++;
		this.totalActions++;
		//this.orderings[tt].orderIndex++;
	},
	
	setOrdering: function(turntype, index) {
		this.orderings[turntype] = index;
	},
	
	getOrderCount: function(turntype) {
		return this.orderings[turntype];
	},
	
	resetOrdering: function(turntype) {
		this.orderings[turntype] = 0;
	},
	
	resetAllOrderings: function(turntype) {
		this.orderings = [0,0,0];
	}
	
	_prepareTurnManager: function() {
		this.actionQueue = createObject(ActionQueue);
		this.actionQueue.prepareQueue();
		this.totalActions = 0;
		this.initializeOrderings();
		this.initializeTrackers();
	},
	
	_clearTurnManager: function() {
		this.actionQueue = null;
		this.totalActions = 0;
		this._actionTracker = null;
		this.orderings = null;
	}
	
};

(function () {
	BaseTurnLogoEntry.doMainAction = function(isMusic) {
		var startEndType;
		
		// Count a turn number if the player turn starts up.
		if (TurnManager.isEmpty() && TurnManager.totalActions > 0) {
			root.getCurrentSession().setTurnCount(root.getCurrentSession().getTurnCount() + 1);
			
			// Count a relative turn.
			root.getCurrentSession().increaseRelativeTurn();
		}
		
		if (isMusic) {
			this._changeMusic();
		}
		
		startEndType = this._turnChange.getStartEndType();
		if (startEndType === StartEndType.PLAYER_START) {
			// If the player's turn starts up, no auto skip.
			CurrentMap.setTurnSkipMode(false);
		}
		else {
			// If it's the enemy or the ally, check the auto turn skip.
			CurrentMap.setTurnSkipMode(this._isAutoTurnSkip());
		}
		
		CurrentMap.enableEnemyAcceleration(true);
	}

	TurnChangeStart.pushFlowEntries = function(straightFlow) {
		//as normal but when pushing BerserkTurnFlow, only do so if turntype is player and the only movable units left are beserked
		// Prioritize the turn display.
		if (this._isTurnAnimeEnabled()) {
			straightFlow.pushFlowEntry(TurnAnimeFlowEntry);
		}
		else {
			straightFlow.pushFlowEntry(TurnMarkFlowEntry);
		}
		if (TurnManager.totalActions > 0  && TurnManager.isEmpty()) {
			straightFlow.pushFlowEntry(RecoveryAllFlowEntry);
			straightFlow.pushFlowEntry(MetamorphozeCancelFlowEntry);
		}
		if (root.getCurrentSession().getTurnType() === TurnType.PLAYER && !StateControl.CanControlAUnit()) //note: does not actually create the berserk flow turn if there are no berserked units
			straightFlow.pushFlowEntry(BerserkFlowEntry);
	}

	TurnChangeStart._checkStateTurn = function() {
		var turnType = root.getCurrentSession().getTurnType();
		if (TurnManager.actionQueue === null)
			TurnManager.restartQueue();
		
		if (TurnManager.totalActions > 0 && TurnManager.isEmpty())
			TurnManager.resetAll();
		
		if (turnType === TurnType.PLAYER && TurnManager.totalActions === 0) {
			StateControl.decreaseTurn(this._getPlayerList());
			StateControl.decreaseTurn(EnemyList.getAliveList());
			StateControl.decreaseTurn(AllyList.getAliveList());
		}
	}

	FreeAreaScene.turnEnd = function() {
		if (!TurnManager.actionQueue || TurnManager.isEmpty()) {
			this._processMode(FreeAreaMode.TURNEND);
		}
		else {
			this._processMode(FreeAreaMode.MAIN);
		}
	}

	FreeAreaScene._processMode = function(mode) {
		if (mode === FreeAreaMode.TURNSTART) {
			if (this._turnChangeStart.enterTurnChangeCycle() === EnterResult.NOTENTER) {
				this._processMode(FreeAreaMode.MAIN);
			}
			else {
				this.changeCycleMode(mode);
			}
		}
		else if (mode === FreeAreaMode.TURNEND) {
			if (this._turnChangeEnd.enterTurnChangeCycle() === EnterResult.NOTENTER) {
				this._processMode(FreeAreaMode.TURNSTART);
			}
			else {
				this.changeCycleMode(mode);
			}
		}
		else if (mode === FreeAreaMode.MAIN) {
			root.getCurrentSession().setStartEndType(StartEndType.NONE);
			
			this.getTurnObject().openTurnCycle();
			
			this.changeCycleMode(mode);
		}
	}

	TurnChangeEnd._startNextTurn = function() {
		if (TurnManager.isEmpty()) {
			root.getCurrentSession().setTurnType(TurnType.PLAYER);
			this._checkActorList();
			TurnManager.resetCurrentActionCounts();
			//TurnManager.initializeOrderings();
		}
		else {
			root.getCurrentSession().setTurnType(TurnManager.peek());
		}
	};

	PlayerTurn._checkAutoEnd = function() {
		var i, unit;
		var isTurnEnd = true;
		var list = PlayerList.getSortieList();
		var count = list.getCount();
		
		// Don't let the turn change occur at the same time when selecting the auto turn end on the config screen.
		// There is also an intention that doesn't let the turn end at the same time when the alive is 0 at the battle.
		if (this.getCycleMode() !== PlayerTurnMode.MAP) {
			return false;
		}
		
		// Even if the auto turn is not enabled, if no alive exists, end the turn.
		if (count === 0) {
			TurnControl.turnEnd();
			return true;
		}
		
		/*if (!EnvironmentControl.isAutoTurnEnd()) {
			return false;
		}*/
		
		if (TurnManager.actionQueue.peek() !== TurnType.PLAYER) {
			TurnControl.turnEnd();
			return true;
		}
		
		for (i = 0; i < count; i++) {
			unit = list.getData(i);
			// If the all players cannot act due to the states, ending the turn is needed, so decide with the following code.
			if (!StateControl.isTargetControllable(unit)) { //might change it depending on how we handle berserked units.
				continue;
			}
			
			if (!unit.isWait()) {
				isTurnEnd = false;
				break;
			}
		}
		
		if (isTurnEnd) {
			this._isPlayerActioned = false;
			TurnControl.turnEnd();
		}
		
		return isTurnEnd;
	};

	UnitWaitFlowEntry._completeMemberData = function(playerTurn) { //note: this also can be applied to enemy turns too.
		var event;
		var unit = playerTurn.getTargetUnit();
		
		unit.setMostResentMov(0);
		
		if (!Miscellaneous.isPlayerFreeAction(unit)) {
			unit.setWait(true);
			TurnManager.pop();
			TurnManager.incrementActionCount();
		}
		
		// Get a wait place event from the unit current position.
			event = this._getWaitEvent(unit);
			if (event === null) {
				return EnterResult.NOTENTER;
			}
			
			return this._capsuleEvent.enterCapsuleEvent(event, true);
	};

	ReactionFlowEntry.moveFlowEntry = function() { //Movement Star and related skills. Since this activates after the unit has waited but before the turn shift/order shift, we push the turn type to the very top of the list.
		if (this._dynamicAnime.moveDynamicAnime() !== MoveResult.CONTINUE) {
			this._targetUnit.setReactionTurnCount(this._skill.getSkillValue());
			this._targetUnit.setWait(false);
			var ttp = this._targetUnit.getTurnType();
			TurnManager.actionQueue.placeOnTop(this._targetUnit.getTurnType());
			//TurnManager.orderings[ttp].actionCounter = TurnManager.orderings[ttp].actionCounter - 1 >= 0 ? TurnManager.orderings[tt].actionCounter - 1 : 0;
			// The following code is for the enemy AI.
			this._targetUnit.setOrderMark(OrderMarkType.FREE);
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	};

	EnemyTurn._moveTop = function() {
		var result;
		
		for (;;) {
			// Change a mode because the event occurs.
			if (this._eventChecker.enterEventChecker(root.getCurrentSession().getAutoEventList(), EventType.AUTO) === EnterResult.OK) {
				this.changeCycleMode(EnemyTurnMode.AUTOEVENTCHECK);
				return MoveResult.CONTINUE;
			}
			
			if (GameOverChecker.isGameOver()) {
				GameOverChecker.startGameOver();
			}
			
			// When the event is executed and if the scene itself has been changed,
			// don't continue. For instance, when the game is over etc.
			if (root.getCurrentScene() !== SceneType.FREE) {
				return MoveResult.CONTINUE;
			}
			
			// Get the unit who should move.
			this._orderUnit = this._checkNextOrderUnit();
			
			if (this._orderUnit === null || root.getCurrentSession().getTurnType() !== TurnManager.actionQueue.peek()) {
				// No more enemy exists, so enter to end the return.
				this.changeCycleMode(EnemyTurnMode.END);
				break;
			}
			else {
				// It's possible to refer to the control character of \act at the event.
				root.getCurrentSession().setActiveEventUnit(this._orderUnit);
				
				this._straightFlow.resetStraightFlow();
				
				// Execute a flow of PreAction.
				// PreAction is an action before the unit moves or attacks,
				// such as ActivePatternFlowEntry.
				result = this._straightFlow.enterStraightFlow();
				if (result === EnterResult.NOTENTER) {
					if (this._startAutoAction()) {
						// Change a mode because graphical action starts.
						this.changeCycleMode(EnemyTurnMode.AUTOACTION);
						break;
					}
					
					// If this method returns false, it means to loop, so the next unit is immediately checked.
					// If there are many units, looping for a long time and the busy state occurs.
					if (this._isSkipProgressDisplayable()) {
						this.changeCycleMode(EnemyTurnMode.TOP);
						break;
					}
				}
				else {
					// Change a mode because PreAction exists.
					this.changeCycleMode(EnemyTurnMode.PREACTION);
					break;
				}
			}
		}
		
		return MoveResult.CONTINUE;
	}

	EnemyTurn._checkNextOrderUnit = function() {
		var i, unit;
		var list = this._getActorList();
		var count = list.getCount();
		
		for (i = 0; i < count; i++) {
			unit = list.getData(i);
			if (!this._isOrderAllowed(unit)) {
				continue;
			}
			
			if (unit.getOrderMark() === OrderMarkType.FREE) {
				this._orderCount++;
				unit.setOrderMark(OrderMarkType.EXECUTED);
				TurnManager.setOrdering(root.getCurrentSession().getTurnType(), i); //makes it easier to refer to the current index of a side to see if its in top five.
				return unit;
			}
		}
		
		return null;
	},

	QuickItemUse.mainAction = function() {
		var targetUnit = this._itemUseParent.getItemTargetInfo().targetUnit;
		
		targetUnit.setWait(false);
		TurnManager.actionQueue.placeOnTop(targetUnit.getTurnType());
		
		targetUnit.setOrderMark(OrderMarkType.FREE);
	};

	UnitCommand.Quick._moveQuick = function() {
		var targetUnit;
		
		if (this._dynamicAnime.moveDynamicAnime() !== MoveResult.CONTINUE) {
			targetUnit = this._posSelector.getSelectorTarget(true);
			targetUnit.setWait(false);
			targetUnit.setOrderMark(OrderMarkType.FREE);
			TurnManager.actionQueue.placeOnTop(targetUnit.getTurnType());
			if (this._exp > 0) {
				this._changeExp();
			}
			else {
				this.endCommandAction();
				return MoveResult.END;
			}
		}
		
		return MoveResult.CONTINUE;
	};

	UnitCommand.Quick._moveDirect = function() {
		var i, count, x, y, targetUnit;
		
		if (this._dynamicAnime.moveDynamicAnime() !== MoveResult.CONTINUE) {
			count = this._indexArray.length;
			for (i = 0; i < count; i++) {
				x = CurrentMap.getX(this._indexArray[i]);
				y = CurrentMap.getY(this._indexArray[i]);
				targetUnit = PosChecker.getUnitFromPos(x,y);
				if (targetUnit !== null) {
					targetUnit.setWait(false);
					targetUnit.setOrderMark(OrderMarkType.FREE);
				}
			}
			if (count > 0) {
				TurnManager.resetQueue();
			}
		}
		
		if (this._exp > 0) {
			this._changeExp();
		}
		else {
			this.endCommandAction();
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	}

	MoveCommand.TurnEnd.openCommand = function() {
		if (root.getBaseScene() === SceneType.FREE){
			this._saveCursor();
		}
		TurnManager.playerStandby();
		TurnControl.turnEnd();
	}

	AllUnitList.getBerserkUnits = function(list) {
		var funcCondition = function(unit) {
			return (StateControl.isBadStateOption(unit, BadStateOption.BERSERK) || StateControl.isBadStateOption(unit, BadStateOption.AUTO));
		};
		return this.getList(list, funcCondition);
	},

	PlayerList.getBerserkUnits = function() {
		return AllUnitList.getBerserkUnits(this.getMainList());
	},

	EnemyList.getBerserkUnits = function() {
		return AllUnitList.getBerserkUnits(this.getMainList());
	},

	AllyList.getBerserkUnits = function() {
		return AllUnitList.getBerserkUnits(this.getMainList());
	},

	BerserkFlowEntry._isBerserkTurn = function() {
		var turnType = root.getCurrentSession().getTurnType();
		var list;
		
		if (turnType === TurnType.PLAYER)
			list = PlayerList.getBerserkUnits();
		else if (turnType === TurnType.ENEMY)
			list = EnemyList.getBerserkUnits();
		else
			list = AllyList.getBerserkUnits();
		
		var count = list.getCount();
		if (count !== null && count !== undefined && count > 0)
			return true;
		return false;
	},

	//start the berserk turn if all controllable units have moved/acted and the only actionable units left are the berserk units.

	StateControl.CanControlAUnit = function() {
		var i, count;
		var ttp = root.getCurrentSession().getTurnType();
		var list = TurnControl.getActorList();
		count = list.getCount();
		
		for (i = 0; i < count; i++) {
			if (StateControl.isTargetControllable(list.getData(i))
				return true;
		}
		
		return false;
	};

	PreAttack._doEndAction = function() {
		var passive = this.getPassiveUnit();
		var currentTurnType = root.getCurrentSession().getTurnType();
			
		if (this._attackParam.fusionAttackData !== null) {
			FusionControl.endFusionAttack(this._attackParam.unit);
		}
		
		if (passive.getHp() === 0) {
			// If this deactivation processing is done at the time of dead setting (DamageControl.setDeathState), the state etc.,
			// cannot be specified in the condition of the dead event, so execute with this method. 
			StateControl.arrangeState(passive, null, IncreaseType.ALLRELEASE);
			MetamorphozeControl.clearMetamorphoze(passive);
			if (currentTurnType === passive.unitSelf.getTurnType()) {
				TurnManager.popAction();
			}
			else {
				if (!passive.unitSelf.isWait()) {
					switch (currentTurnType) {
						case TurnType.PLAYER:
							TurnManager.removeLastInstance(TurnType.PLAYER);
							break;
						default:
							var fCount = TurnManager.getTopFive().reduce(function(accum, t) {
								if (t === currentTurnType) {
									return accum + 1;
								}
								else {
									return accum;
								}
							}, 0);
							if (fCount > 0) {
								var orderedList, ind, lastInd;
								if (passive.unitSelf.getTurnType() === TurnType.ENEMY) {
									orderedList = EnemyList.getAliveList();
								}
								else {
									orderedList = AllyList.getAliveList();
								}
								if (TurnManager.getOrderCount(passive.unitSelf.getTurnType()) < orderedList.getCount()) {
									for (ind = TurnManager.getOrderCount(passive.unitSelf.getTurnType()); ind < Math.min(orderedList.getCount(), ind + fCount); ind++) {
										if (orderedList[ind] === passive.unitSelf) {
											lastInd = passive.unitSelf.getTurnType(), ind - TurnManager.getOrderCount(passive.unitSelf.getTurnType()));
											break;
											//TurnManager.removeXOccurance(passive.unitSelf.getTurnType(), ind - TurnManager.getOrderCount(passive.unitSelf.getTurnType()));
										}
									}
								}
								if (lastInd !== null && lastInd !== undefined) {
									TurnManager.actionQueue.removeXOccurance(passive.unitSelf.getTurnType(), ind - TurnManager.getOrderCount(passive.unitSelf.getTurnType()));
								}
								else {
									TurnManager.actionQueue.removeLastInstance(passive.unitSelf.getTurnType());
								}
							}
							else {
								TurnManager.actionQueue.removeLastInstance(currentTurnType);
							}
							break;
					}
				}
				else {
					TurnManager.actionQueue.removeLastInstance(currentTurnType);
				}
			}
		}
		
		AttackControl.setPreAttackObject(null);
		BattlerChecker.setUnit(null, null);
	}
});