(function () {
	
	var alias1 = UnitCommand.configureCommands;
	UnitCommand.configureCommands = function(groupArray) {
		alias1.call(this, groupArray);
		groupArray.insertObject(UnitCommand.Move, groupArray.length - 1);
	};

	FreeAreaScene.getPlayerTurnObject = function() {
		return this._playerTurnObject;
	};
	
	UnitCommand.Move = defineObject(UnitListCommand,
	{
		_parentTurnObject: null,
		_mapSequenceArea: null,
		
		openCommand: function() {
			//root.log("hi");
			this._prepareCommandMemberData();
			this._completeCommandMemberData();
		},
		
		moveCommand: function() {
			var mode = this.getCycleMode();
			var result = MoveResult.CONTINUE;
			
			if (mode === MapSequenceAreaResult.NONE && this._mapSequenceArea !== null) {
				result = this._moveArea();
			}
			/*else if (mode === MapSequenceAreaResult.CG && this._mapSequenceArea !== null) {
				result = this._mapSequenceArea._moveMoving();
			}*/
			
			return result;
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
			this.changeCycleMode(MapSequenceAreaResult.NONE);
			
			return EnterResult.OK;
		},
		
		isCommandDisplayable: function() {
			var unit = this.getCommandTarget();
			var x = unit.getMapX();
			var y = unit.getMapY();
			return unit.getMostResentMov() === 0;
		},
		
		isRepeatMoveAllowed: function() {
			return false;
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
				this._parentTurnObject._mapSequenceCommand.openSequence(this._parentTurnObject);
			}
			else if (result === MapSequenceAreaResult.CANCEL) {
				return MoveResult.END;
			}
			
			return MoveResult.CONTINUE;
		}
	});
}) ();