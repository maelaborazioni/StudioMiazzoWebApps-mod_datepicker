/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"EEE913E5-AEB9-48F1-93FF-52D3AF2FA7EC",variableType:-4}
 */
var _g_aAllowedRange = [null, null];

/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"1C9AF7F7-945C-4619-A081-4A79E4EFAC11",variableType:-4}
 */
var _g_aDisableDaysOfWeek = [false, false, false, false, false, false, false];

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"963864EC-C047-41E2-976F-A6AD54CB4184",variableType:93}
 */
var _g_dOldDateValue = null;

/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"E15A466C-9662-4DDB-90C2-082747F3EF35",variableType:93}
 */
var _g_dPickerDate = null;

/**
 * @properties={typeid:35,uuid:"58C287BC-E28A-4161-B7AB-074D5437C2F0",variableType:-4}
 */
var _g_oDatePicker = null;

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @author Robert J.C. Ivens
 *
 * @properties={typeid:24,uuid:"08F0E785-45D8-470D-8274-658FBCF7640A"}
 */
function onLoad(event) {
	if (!globals.mod_datejs_isEnvExtended()) {
		globals.mod_datejs_init();
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @author Robert J.C. Ivens
 *
 * @properties={typeid:24,uuid:"BB63DE25-B12B-403B-8CFF-D0B3FEC6F5AD"}
 */
function onShow(firstShow, event) {
	if (forms[_g_oDatePicker.callback.formName] && forms[_g_oDatePicker.callback.formName][_g_oDatePicker.callback.columnName]) {
		_g_dPickerDate = forms[_g_oDatePicker.callback.formName][_g_oDatePicker.callback.columnName];
		_g_dOldDateValue = _g_dPickerDate.clone().clearTime();
	} else {
		_g_dPickerDate = Date.today();
		_g_dOldDateValue = null;
	}
	drawHeader();
	drawPicker();
}

/**
 * @author Robert J.C. Ivens
 *
 * @properties={typeid:24,uuid:"F894D94A-335B-46DB-A7D1-B9BBE32F0F56"}
 */
function drawPicker() {
	var _oForm = solutionModel.getForm(controller.getName()),
		_oLabel,
		_oMethod = solutionModel.getGlobalMethod("globals","datepicker_datePicked"),
		_d = _g_dPickerDate.clone(),
		_nMonth = _d.getMonth(),
		_nXOffset = 10,
		_nYOffset = 100,
		_nBtnWidth = 24,
		_nBtnHeight = 24,
		_nSpacerX = 2,
		_nSpacerY = 2,
		_nX,
		_nY;

	// clear old objects
	var _aElement = elements.allnames;
	for (var i = 0; i < _aElement.length; i++) {
		if (utils.stringLeft(_aElement[i], 7) == "weeknr_" ||
		utils.stringLeft(_aElement[i], 4) == "day_" ||
		utils.stringLeft(_aElement[i], 4) == "btn_") {
			_oForm.removeLabel(_aElement[i]);
		}
	}

	_d = _d.moveToFirstDayOfMonth();
	if (_d.getDay() != _g_oDatePicker.form.firstDayOfWeek) {
		_d = _d.moveToDayOfWeek(_g_oDatePicker.form.firstDayOfWeek, -1)
	}
	for (var y = 0; y < 6; y++) {
		_nY = _nYOffset + ( (_nBtnHeight + _nSpacerY) * y)

		// create weeknumbers
		if (_g_oDatePicker.form.showWeek && (_d.getMonth() == _nMonth || _d.clone().moveToDayOfWeek(_g_oDatePicker.form.firstDayOfWeek, 1).addDays(-1).getMonth() == _nMonth)) {
			_oLabel = _oForm.newLabel(_d.getWeek(), 0, _nY, _nXOffset - 4, _nBtnHeight);
			_oLabel.name = "weeknr_" + (y + 1);
			_oLabel.transparent = true;
			_oLabel.styleClass = "weeknr"
		}

		// Create calendar buttons
		for (var x = 0; x <= 6; x++) {
			_nX = _nXOffset + ( (_nBtnWidth + _nSpacerX) * x);
			if (_d.getMonth() == _nMonth) {
				// Button
				_oLabel = _oForm.newLabel("", _nX, _nY, _nBtnWidth, _nBtnHeight);
				if (!_g_aDisableDaysOfWeek[_d.getDay()] && (!_g_aAllowedRange[0] || _d >= _g_aAllowedRange[0]) && (!_g_aAllowedRange[1] || _d <= _g_aAllowedRange[1])) {
					if (_d == Date.today()) {
						_oLabel.background = "#ff9900"
						_oLabel.foreground = "#333333";
						_oLabel.borderType = "1, #333333" 
						
					} else {
						_oLabel.background = "#666666"
						if (_g_dOldDateValue && _g_dOldDateValue == _d.clearTime()) {
							_oLabel.styleClass = "buttonborder_currentvalue";
						} else {
							_oLabel.styleClass = "buttonborder";
						}
					}
				} else {
					_oLabel.styleClass = "buttonborder_disabled";
				}
				_oLabel.transparent = false;
				_oLabel.mediaOptions = SM_MEDIAOPTION.ENLARGE;
				_oLabel.name = "btn_" + _d.getDate();

				// Button label
				_oLabel = _oForm.newLabel(_d.getDate(), _nX, _nY, _nBtnWidth, _nBtnHeight);
				if ( (_g_aAllowedRange[0] && _d < _g_aAllowedRange[0]) || (_g_aAllowedRange[1] && _d > _g_aAllowedRange[1])) {
					_oLabel.styleClass = "datebuttontext_disabled";
				} else if (_g_aDisableDaysOfWeek[_d.getDay()]) {
					_oLabel.styleClass = "datebuttontext_disabled";
				} else if (_d == Date.today()) {
					_oLabel.styleClass = "datebuttontext_today";
					_oLabel.onAction = _oMethod
				} else {
					_oLabel.styleClass = "datebuttontext";
					_oLabel.onAction = _oMethod
				}
				_oLabel.transparent = true;
				_oLabel.showClick = false;
				_oLabel.showFocus = true;
				_oLabel.rolloverCursor = SM_CURSOR.HAND_CURSOR;
				_oLabel.name = "day_" + _d.getDate();
			}
			_d = _d.addDays(1);

		}

	}

	controller.recreateUI();

	// Have to do this after the recreateUI or else it gets undone
	elements.lblMonthYear.text = utils.dateFormat(_g_dPickerDate, 'MMMM  yyyy');

}

/**
 * @author Robert J.C. Ivens
 *
 * @properties={typeid:24,uuid:"51D25329-0651-499C-A1E5-0026D124470E"}
 * @SuppressWarnings(unused)
 */
function drawHeader() {
	var _oForm = solutionModel.getForm(controller.getName()),
		_oLabel,
		_oMethod,
		_d = _g_dPickerDate.clone(),
		_nXOffset = 10,
		_nYOffset = 70,
		_nBtnWidth = 24,
		_nSpacerX = 2,
		_nX;

	// clear old objects
	var _aElement = elements.allnames;
	for (i = 0; i < _aElement.length; i++) {
		if (utils.stringLeft(_aElement[i], 10) == "lblWeekDay") {
			_oForm.removeLabel(_aElement[i]);
		}
	}

	_d = _d.moveToDayOfWeek(_g_oDatePicker.form.firstDayOfWeek, -1);
	for (var i = 1; i <= 7; i++) {
		_nX = _nXOffset + ( (_nBtnWidth + _nSpacerX) * (i - 1));

		_oLabel = _oForm.newLabel("", _nX, _nYOffset, _nBtnWidth, 30);
		_oLabel.name = "lblWeekDay" + i;
		_oLabel.transparent = true;
		_oLabel.styleClass = "dayname"
		if (_g_oDatePicker.form.showOnlyFirstCharacterOfDayName) {
			_oLabel.text = utils.stringLeft(utils.dateFormat(_d, 'EEE'), 1);
		} else {
			_oLabel.text = utils.dateFormat(_d, 'EEE');
		}
		_d = _d.addDays(1);
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @author Robert J.C. Ivens
 *
 * @properties={typeid:24,uuid:"1421A9FD-E09F-4921-803D-DDB9C20805BC"}
 */
function btnNextMonth(event) {
	_g_dPickerDate = _g_dPickerDate.addMonths(1);
	drawPicker();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"ADF71979-BD9D-4BEB-8300-DE062FFEC2B2"}
 */
function btnNextYear(event) {
	_g_dPickerDate = _g_dPickerDate.addYears(1);
	drawPicker();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @author Robert J.C. Ivens
 *
 * @properties={typeid:24,uuid:"2407CE08-4644-41CA-92A2-011484E27E1D"}
 */
function btnPrevMonth(event) {
	_g_dPickerDate = _g_dPickerDate.addMonths(-1);
	drawPicker();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @author Robert J.C. Ivens
 *
 * @properties={typeid:24,uuid:"89C86C53-C792-4D6A-8AC4-2DCED7BC05DD"}
 */
function btnPrevYear(event) {
	_g_dPickerDate = _g_dPickerDate.addYears(-1);
	drawPicker();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @author Robert J.C. Ivens
 *
 * @properties={typeid:24,uuid:"B83BCD78-02D6-4683-B4FD-C33530FE2EDF"}
 */
function btnCurrentMonth(event) {
	_g_dPickerDate = Date.today();
	drawPicker();

}
