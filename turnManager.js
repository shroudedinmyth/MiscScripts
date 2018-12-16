/*var TurnType = {
	PLAYER: 0,
	ENEMY: 1,
	ALLY: 2,
	OTHER: 3
}*/

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
	
	//determineOrder : function(turnType) {
		
	//},
	
	/*resetOrderIndices : function() {
		
	},*/
	
	resetAll : function() {
		//get the counts of deployed/alive units on the map as array and then feed into actionQueue
		this.setupQueue();
		this.resetCurrentActionCounts();
		this.initializeOrderings();
		//this.resetOrderIndices();
	},
	
	resetCurrentActionCounts: function() {
		this.totalActions = 0;
		this._actionTracker.forEach(obj => obj.actionCounter = 0);
	},
	
	initializeTrackers: function() {
		var reorderCounters = root.getCurrentSession().getCurrentMapInfo().custom.reorderCounters !== undefined ? root.getCurrentSession().getCurrentSession.custom.reorderCounters : null;
		this._actionTracker = [
			{ actionCounter: 0, reorderCounter: reorderCounters !== undefined && reorderCounters.length >= 1 ? reorderCounters[0] : null },
			{ actionCounter: 0, reorderCounter: reorderCounters !== undefined && reorderCounters.length >= 2 ? reorderCounters[1] : null }
			//maybe add something in for berserk players?
		];
	},
	
	initializeOrderings: function() {
		this.orderings = [
			{ prevOrderedList: null, currentOrderedList: null }, 
			{ prevOrderedList: null, currentOrderedList: null }
			//maybe add something in for berserk players?
		];
	},
	
	initializeDefaultOrdering: function() { //call when in EnemyTurn when _actionTracker[turnType].actionCounter == 0
		var ttp = root.getCurrentSession().getTurnType();
		this.orderings[ttp].prevOrderedList = TurnControl.getActorList();
		this.orderings[ttp].currentOrderedList = TurnControl.getActorList().filter(actor => !actor.isActionStop() && !actor.isInvisible() && StateControl.isBadStateOption(actor, BadStateOption.NOACTION));
	}
	
	setupQueue: function() {
		if (this.actionQueue === null) {
			this.actionQueue = createObject(ActionQueue);
		}
	},
	
	totalActions: function() {
		return this.totalActions;
	},
	
	actionTracker: function() {
		return this._actionTracker;
	},
	
	/*setupPrevOrderings: function() {
		
	},*/
	
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
	
}

BaseTurnLogoEntry.doMainAction = function() {
	
}

TurnStartChange.pushFlowEntries = function(straightFlow) {
	
}

TurnStartChange._checkStateTurn = function() {
	var turnType = root.getCurrentSession().getTurnType();
	if (TurnManager.actionQueue === null)
		TurnManager.setupQueue();
	
	if (TurnManager.totalActions > 0 && TurnManager.isEmpty())
		TurnManager.resetAll();
	
	if (turnType === TurnType.PLAYER) {
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

/*TurnControl.turnEnd = function() {
	if (root.getBaseScene() === SceneType.FREE) {
		if (TurnManager.
	}
}*/

TurnChangeEnd._startNextTurn = function() {
	if (TurnManager.isEmpty()) {
		root.getCurrentSession().setTurnType(TurnType.PLAYER);
		this._checkActorList();
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

EnemyTurn._checkNextOrderUnit = function() {
	
}

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