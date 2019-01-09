(function () {
	
	var alias1 = UnitCommand.configureCommands;
	UnitCommand.configureCommands = function(groupArray) {
		alias1.call(this, groupArray);
		groupArray.insertObject(UnitCommand.Move, groupArray.length - 1);
	};

	FreeAreaScene.getPlayerTurnObject = function() {
		return this._playerTurnObject;
	};
	
	PlayerTurn._moveMap = function() {
		var result = this._mapEdit.moveMapEdit();
		
		if (result === MapEditResult.UNITSELECT) {
			this._targetUnit = this._mapEdit.getEditTarget();
			if (this._targetUnit !== null) {
				if (this._targetUnit.isWait() || this._targetUnit.getUnitType() !== TurnType.PLAYER) {
					this._mapEdit.clearRange();
					
					// Pressing the decision key on the unit who waits is treated as a map command.
					this._mapCommandManager.openListCommandManager();
					this.changeCycleMode(PlayerTurnMode.MAPCOMMAND);
				}
				else {
					// Change it to the mode which displaying the unit moving range.
					//this._mapSequenceArea.openSequence(this);
					this.setCursorSave(this._targetUnit);
					this._mapEdit.clearRange();
					this._mapSequenceCommand.openSequence(this);
					this.changeCycleMode(PlayerTurnMode.UNITCOMMAND);
				}
			}
		}
		else if (result === MapEditResult.MAPCHIPSELECT) {
			this._mapCommandManager.openListCommandManager();
			this.changeCycleMode(PlayerTurnMode.MAPCOMMAND);
		}
		
		return MoveResult.CONTINUE;
	};
	
	UnitCommand.Move = defineObject(UnitListCommand,
	{
		_parentTurnObject: null,
		_mapSequenceArea: null,
		_mapSequenceCommand: null,
		
		openCommand: function() {
			//root.log("hi");
			this._prepareCommandMemberData();
			this._completeCommandMemberData();
		},
		
		moveCommand: function() {
			var mode = this.getCycleMode();
			var result = MoveResult.CONTINUE;
			
			if (mode === PlayerTurnMode.MAP) {
				result = this._moveArea();
			}
			/*else if (mode === PlayerTurnMode.UNITCOMMAND) {
				result = this._parentTurnObject._moveUnitCommand();
			}*/
			
			if (result === MoveResult.END) {
				//root.log(this._parentTurnObject._mapSequenceCommand._targetUnit !== null);
				//root.log(this._parentTurnObject._mapEdit.getEditY());
			}
			
			return result;
		},
		
		drawCommand: function() {
			var mode = this.getCycleMode();
			
			if (mode === PlayerTurnMode.MAP) {
				this._drawArea();
			}
		},
		
		_prepareCommandMemberData: function() {
			this._parentTurnObject = SceneManager.getActiveScene().getTurnObject();
			//root.log(this._parentTurnObject !== null);
			this._mapSequenceArea = createObject(MapSequenceArea);
		},
		
		_completeCommandMemberData: function() {
			//root.log("yo");
			var unit = this.getCommandTarget();
			this._mapSequenceArea.openSequence(this._parentTurnObject);
			this.changeCycleMode(PlayerTurnMode.MAP);
			
			return EnterResult.OK;
		},
		
		isCommandDisplayable: function() {
			var unit = this.getCommandTarget();
			var x = unit.getMapX();
			var y = unit.getMapY();
			return unit.getMostResentMov() === 0;
		},
		
		isRepeatMoveAllowed: function() {
			return true;
		},
		
		isCurrentPos: function(targetUnit, prevX, prevY) {
			return targetUnit.getMapX() === prevX && targetUnit.getMapY() === prevY;
		},
		
		getCommandName: function() {
			return 'Move';
		},
		
		_moveArea: function() {
			var result = this._mapSequenceArea.moveSequence();
			
			if (result === MapSequenceAreaResult.COMPLETE) {
				this._parentTurnObject._mapEdit.clearRange();
				//need mapSequenceCommand to open up the command window again.
				this._parentTurnObject._mapSequenceCommand.openSequence(this._parentTurnObject);
				this.changeCycleMode(PlayerTurnMode.UNITCOMMAND);
			}
			else if (result === MapSequenceAreaResult.CANCEL) {
				this._parentTurnObject._mapEdit.clearRange();
				//this.endCommandAction();
				return MoveResult.END;
				//this.changeCycleMode(PlayerTurnMode.MAP);
			}
			
			return MoveResult.CONTINUE;
		},
		
		_drawArea: function() {
			MapLayer.drawUnitLayer();
			//root.log("from move command");
			this._mapSequenceArea.drawSequence();
		}
	});
}) ();