/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"8A6B0241-2605-4D20-A773-C73F6D3C37FA"}
 */
var ___datepicker_init = __datepicker_init();
/**
 * @author Robert J.C. Ivens
 *
 * @properties={typeid:24,uuid:"E68980EF-27FF-4CE2-9501-BDDCE71320B5"}
 */
function __datepicker_init() {

	/**
	 * JSDatePicker
	 *
	 * @author Robert J.C. Ivens
	 * @author ROCLASI Software Solutions
	 *
	 * Create a new JSDatePicker Object
	 * @constructor
	 */
	 JSDatePicker = function() {
		var _aDisableDaysOfWeek = [false, false, false, false, false, false, false],
			_aAllowedRange = [null, null];

		this.form = {
			name: "mod_datepicker_form", // required, please use a unique name for all your instances
			title: "Date Picker", // optional to set
			showOnlyFirstCharacterOfDayName: false, // optional to set, required value
			showWeek: false, // optional to set, required value
			firstDayOfWeek: 0 // optional to set, required value
		}
		this.callback = {
			// Use either callbackFormName or callbackMethod
			formName: "", // required (unless callbackMethod is used)
			columnName: "", // required, when using callbackFormName

			method: "" // required (unless callbackFormName is used)
		}

		this.disableDayOfWeek = function(weekDay) {
			if (weekDay >= 0 && weekDay < 7) {
				_aDisableDaysOfWeek[weekDay] = true;
			}
		}

		this.setAllowedDateRange = function(From, To) {
			_aAllowedRange = [From, To];
		}

		this.show = function(x, y) {
			var _oForm,
				_nWidth = 178,
				_nHeight = 265;

			// Some crude sanity check of the JSDatePicker values
			if (!this.form.name || (!this.callback.method && (!this.callback.formName || !this.callback.columnName))) {

				application.output("JSDatePicker: missing or invalid required values", LOGGINGLEVEL.ERROR);
				return; // stop right here
			}

			// If this (dynamic) form already exists in memory, remove it
			if (history.removeForm(this.form.name)) {
				solutionModel.removeForm(this.form.name);
			}

			// create a new JSDatePicker form based on the original form in this module
			_oForm = solutionModel.newForm(this.form.name, null, "datepicker_default", false, _nWidth, _nHeight);
			_oForm.extendsForm = "mod_datepicker"; // form inheritence, here we get all the settings and objects of the original form

			// Pass the JSDatePicker object to the form-variable for further processing (like when clicking on form buttons)
			forms[this.form.name]._g_oDatePicker = this;
			// Pass on the disabled week days array
			forms[this.form.name]._g_aDisableDaysOfWeek = _aDisableDaysOfWeek;
			// Pass on the allowed dates array
			forms[this.form.name]._g_aAllowedRange = _aAllowedRange;

			// Show the form in a modal dialog
			// Old code
//			application.showFormInDialog(forms[this.form.name], (x == null) ? -1 : x, (y == null) ? -1 : y, -1, -1, this.form.title, false, false, this.form.name, true);
			var dpWin = application.createWindow(this.form.name,JSWindow.DIALOG); 
			dpWin.title = this.form.title;
			dpWin.show(this.form.name);
		}
	}
}

/**
 * @param {JSEvent} _oEvent
 *
 * @author Robert J.C. Ivens
 *
 * @properties={typeid:24,uuid:"7A756A38-3D94-4E34-B663-1CA35957CB75"}
 */
function datepicker_datePicked(_oEvent) {
	var _sBtn = _oEvent.getElementName().split("_"),
		_sForm = _oEvent.getFormName(),
		_oCallback = forms[_sForm]._g_oDatePicker.callback,
		_dPickerDate = forms[_sForm]._g_dPickerDate.moveToFirstDayOfMonth(),
		_dPickedDate = _dPickerDate.addDays(_sBtn[1] - 1);

	if (_oCallback.method) {
		if (_oCallback.formName) {
			forms[_oCallback.formName][_oCallback.method](_dPickedDate);
		} else {
			globals[_oCallback.method](_dPickedDate);
		}
	} else {
		forms[_oCallback.formName][_oCallback.columnName] = _dPickedDate;
	}
	application.closeFormDialog();
}

/**
 * @author Robert J.C. Ivens
 *
 * @properties={typeid:24,uuid:"78050790-5995-493A-B374-D39E93CF4A1E"}
 */
function datepicker_getVersion() {

	/*
	 * JSDatePicker
	 *
	 * Version 1.0.1
	 *
	 * Written by Robert J.C. Ivens
	 *
	 * This software is released under the MIT license
	 * http://www.opensource.org/licenses/mit-license.php
	 *
	 * Questions, bugs, feature requests, patches:
	 * http://www.servoyforge.net/projects/mod-datepicker/
	 *
	 * REQUIREMENT: mod_datejs
	 * http://www.servoyforge.net/projects/mod-datejs/
	 *
	 */

	return "JSDatePicker v1.0.1";

}
