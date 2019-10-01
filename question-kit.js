requirejs.config({
    shim: {
        jquery: {
            exports: "$"
        }
    },
    paths: {
        material: "vendor/mdc-web/material-components-web.min",
        jquery: "vendor/jquery-3.4.1.min"
    }
});

requirejs(["material", "jquery"], function(mdc) {
	var QuestionKit = {};
	
	QuestionKit.valueForLabel = function(labelDefinition) {
		var language = (navigator.language || navigator.systemLanguage || navigator.userLanguage || 'en').substr(0, 2).toLowerCase();
		
		var value = labelDefinition[language];
		
		if (value == undefined) {
			value = labelDefinition['en'];
		}
		
		if (value == undefined) {
			value = JSON.stringify(labelDefinition);
		}
		
		return value;
	}
	
	QuestionKit.cardRenderers = {};

	QuestionKit.cardRenderers['single-line'] = function(definition) {
		var output = '';
		
		output += '<h6 class="mdc-typography--headline6">' + QuestionKit.valueForLabel(definition['prompt']) + '</h6>';
		
		output += '<div st>';
		output += '  <div class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label" style="width: 100%;">';
		output += '    <input type="text" id="' + definition['key'] + '" class="mdc-text-field__input" />';
		output += '    <div class="mdc-notched-outline">';
		output += '      <div class="mdc-notched-outline__leading"></div>';
		output += '      <div class="mdc-notched-outline__trailing"></div>';
		output += '    </div>';
		output += '  </div>';
		output += '</div>';
		
		return output;
	}

	QuestionKit.cardRenderers['multi-line'] = function(definition) {
		var output = '';
		
		output += '<h6 class="mdc-typography--headline6">' + QuestionKit.valueForLabel(definition['prompt']) + '</h6>';
		
		output += '<div>';
		output += '  <div class="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea mdc-text-field--no-label" style="width: 100%;">';
		output += '    <textarea class="mdc-text-field__input" rows="4" id="' + definition['key'] + '" ></textarea>';
		output += '    <div class="mdc-notched-outline">';
		output += '      <div class="mdc-notched-outline__leading"></div>';
		output += '      <div class="mdc-notched-outline__trailing"></div>';
		output += '    </div>';
		output += '  </div>';
		output += '</div>';
		
		return output;
	}

	QuestionKit.cardRenderers['select-multiple'] = function(definition) {
		var output = '';
		
		output += '<h6 class="mdc-typography--headline6">' + QuestionKit.valueForLabel(definition['prompt']) + '</h6>';
		
		for (var i = 0; i < definition['options'].length; i++) {
			var option = definition['options'][i];
			
			var optionKey = definition['key'] + '_' + option['value'] + '_mdc_checkbox';
			
			output += '<div>';
			output += '  <div class="mdc-form-field">';
			output += '    <div class="mdc-checkbox">';
			output += '      <input type="checkbox" class="mdc-checkbox__native-control" id="' + optionKey + '" value="' + option['value'] + '" data-question-key="' + definition['key'] + '"/>';
			output += '      <div class="mdc-checkbox__background">';
			output += '        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">';
			output += '          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>';
			output += '        </svg>';
			output += '        <div class="mdc-checkbox__mixedmark"></div>';
			output += '      </div>';
			output += '    </div>';
			output += '    <label for="' + optionKey + '" class="mdc-typography--body1" style="padding-top: 8px;">' + QuestionKit.valueForLabel(option['label']) + '</label>';
			output += '  </div>';
			output += '</div>';
		}
		
		return output;
	}

	QuestionKit.cardRenderers['select-one'] = function(definition) {
		var output = '';
		
		output += '<h6 class="mdc-typography--headline6">' + QuestionKit.valueForLabel(definition['prompt']) + '</h6>';

		
		for (var i = 0; i < definition['options'].length; i++) {
			var option = definition['options'][i];
			
			var optionKey = definition['key'] + '_' + option['value'];
			
			output += '<div>';
			
	     	output += '  <div class="mdc-form-field">';
			output += '    <div class="mdc-radio">';
			output += '      <input type="radio" class="mdc-radio__native-control" id="' + optionKey + '" name="' + definition['key'] + '" value="' + option['value'] + '">';
			output += '      <div class="mdc-radio__background">';
			output += '        <div class="mdc-radio__outer-circle"></div>';
			output += '        <div class="mdc-radio__inner-circle"></div>';
			output += '      </div>';
			output += '    </div>';
			output += '    <label for="' + optionKey + '" class="mdc-typography--body1" style="padding-top: 8px;">' + QuestionKit.valueForLabel(option['label']) + '</label>';
			output += '  </div>';
			output += '</div>';
		}
		
		return output;
	}

	QuestionKit.cardRenderers['unknown'] = function(definition) {
		return '<pre>' + JSON.stringify(definition, null, 2) + '</pre>';	
	}


	QuestionKit.renderQuestions = function(questions, options, onRendered) {
		onRendered();
	};
	
	QuestionKit.renderQuestion = function(definition) {
		var output = '';
		
		output += '<div class="mdc-card mdc-layout-grid__cell--span-12" style="margin-top: 1.25rem; padding: 1.25rem;" id="question_kit_container_' + definition['key'] + '">';
		
		var type = definition['prompt-type'];
		
		var renderer = QuestionKit.cardRenderers[type];
		
		if (renderer == undefined) {
			renderer = QuestionKit.cardRenderers['unknown'];
		}

		output += renderer(definition);

		output += '</div>';
		
		return output;
	};
	
	QuestionKit.currentDefinition = [];
	
	QuestionKit.loadQuestions = function(options, definitionUrl, onLoaded) {
		$.get(definitionUrl, function(data) {
			var container = $(options["element"]);
			
			var itemsHtml = '<div class="mdc-layout-grid" style="padding: 0px;">';

			for (var i = 0; i < data.length; i++) {
				var sequence = data[i];
				
				for (var j = 0; j < sequence['definition'].length; j++) {
					var item = sequence['definition'][j];

					QuestionKit.currentDefinition.push(item);
					
					itemsHtml += QuestionKit.renderQuestion(item);
					
					var constraints = item['constraints'];
					
					if (constraints != undefined && constraints.length > 0) {
						QuestionKit.registerConstraint(item["key"], constraints);
					}
				}
			}

			itemsHtml += '<button class="mdc-button mdc-button--raised mt-3" id="question_kit_update_report_button">';
			itemsHtml += '  <span class="mdc-button__label">Update Report</span>';
			itemsHtml += '</button>';

			itemsHtml += '</div>';

			container.append(itemsHtml);

			window.setTimeout(function() {
				$('.mdc-text-field').each(function(index) {
					mdc.textField.MDCTextField.attachTo($(this).get(0));
					
					$(this).find('input[type="text"]').change(function(eventObj) {
						var name = $(this).attr('id');
						var value = $(this).val();
						
						QuestionKit.updateValue(name, value);
					});

					$(this).find('textarea').change(function(eventObj) {
						var name = $(this).attr('id');
						var value = $(this).val();
						
						QuestionKit.updateValue(name, value);
					});
				});

				$('.mdc-radio').each(function(index) {
					mdc.radio.MDCRadio.attachTo($(this).get(0));
					
					$(this).find('input[type=radio]').change(function(eventObj) {
						var name = $(this).attr('name');
						var value = $(this).val();

						QuestionKit.updateValue(name, value);
					});
				});

				$('.mdc-checkbox').each(function(index) {
					$(this).find('input[type=checkbox]').change(function(eventObj) {
						var name = $(this).attr('data-question-key');
						var value = $(this).val();
						
						if ($(this).is(":checked")) {
							QuestionKit.addValue(name, value);
						} else {
							QuestionKit.clearValue(name, value);
						}
					});
				});
				
				$("#question_kit_update_report_button").click(function(eventObj) {
					eventObj.preventDefault();
					
					QuestionKit.submitUpdates(options['onUpdate']);
					
					return false;
				});
			}, 500);
			
			onLoaded(data);
		});
	};

	QuestionKit.loadValues = function(valuesUrl, onLoaded) {
		$.get(valuesUrl, function(data) {
			QuestionKit.currentAnswers = {};
			
			for (var item of QuestionKit.currentDefinition) {
				var key = item['key'];
				var value = data[key];
				
				if (value != undefined && value != '') {
					QuestionKit.currentAnswers[key] = value;
					
					if (item['prompt-type'] == 'select-multiple') {
						for (var selected of value) {
							$('input[data-question-key="' + key + '"][value="' + selected + '"]').prop("checked", true);
						}
					} else if (item['prompt-type'] == 'select-one') {
						$('input[name="' + key + '"][value="' + value + '"]').prop("checked", true);
					} else if (item['prompt-type'] == 'single-line') {
						$('input#' + key).val(value);
					} else if (item['prompt-type'] == 'multi-line') {
						$('textarea#' + key).val(value);
					}
				}
			}
				
			onLoaded();
		});
	};
	
	QuestionKit.currentAnswers = {};

	QuestionKit.updateValue = function(key, value) {
		QuestionKit.currentAnswers[key] = value;

		QuestionKit.applyConstraints();
	}
	
	QuestionKit.submitUpdates = function(onUpdate) {
		onUpdate(QuestionKit.currentAnswers);
	}

	QuestionKit.addValue = function(key, value) {
		if (QuestionKit.currentAnswers[key] == undefined) {
			QuestionKit.currentAnswers[key] = [];
		}
		
		QuestionKit.currentAnswers[key].push(value);

		QuestionKit.applyConstraints();
	}

	QuestionKit.clearValue = function(key, value) {
		if (QuestionKit.currentAnswers[key] == undefined) {
			QuestionKit.currentAnswers[key] = [];
		}

		QuestionKit.currentAnswers[key] = $.grep(QuestionKit.currentAnswers[key], function(item) {
			return item != value;
		});

		QuestionKit.applyConstraints();
	}

	QuestionKit.registerConstraint = function(key, constraints) {
		if (QuestionKit.currentConstraints == undefined) {
			QuestionKit.currentConstraints = {};
		}
		
		if (QuestionKit.currentConstraints[key] == undefined) {
			QuestionKit.currentConstraints[key] = [];
		}
		
		for (var constraint of constraints) {
			QuestionKit.currentConstraints[key].push(constraint);
		}
	}
	
	QuestionKit.applyConstraints = function() {
		var failed = [];
		
		for (var key in QuestionKit.currentConstraints) {
			var constraints = QuestionKit.currentConstraints[key];
			
			for (var constraint of constraints) {
				var value = QuestionKit.currentAnswers[constraint['key']];
				
				if (constraint['operator'] == 'in') {
					if (value == undefined) {
						failed.push(key)
					} else if (value.indexOf(constraint['value']) == -1) {
						failed.push(key)
					}
				} else if (constraint['operator'] == '=') {
					if (value != constraint['value']) {
						failed.push(key)
					}
				} else {
					console.log('TODO');
					console.log(constraint);
				}
			}
		}
		
		for (var item of QuestionKit.currentDefinition) {
			var key = item['key'];
			
			if (failed.indexOf(key) == -1) {
				$("#question_kit_container_" + key).show();
			} else {
				$("#question_kit_container_" + key).hide();
			}
		}
	};
	
	QuestionKit.initialize = function(options) {
		if (options['definition'] != undefined) {
			QuestionKit.loadQuestions(options, options['definition'], function(questions) {
				QuestionKit.renderQuestions(questions, options, function() {
					QuestionKit.loadValues(options['values'], function() {
						QuestionKit.applyConstraints();
					});
				});
			});
		}
	};

	window.QuestionKit = QuestionKit;
});