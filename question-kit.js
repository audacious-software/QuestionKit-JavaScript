requirejs.config({
    shim: {
        jquery: {
            exports: "$"
        }
    },
    paths: {
        material: "vendor/mdc-web/material-components-web.min",
        jquery: "vendor/jquery-reuse"
    }
});

var dependencies = ["material", "jquery"];

var translations = {
    "label_required": {
        "en": "Required",
        "es": "Necesario",
    }
};

requirejs(dependencies, function(mdc) {
	console.log('MDC');
	console.log(mdc);
	
    var QuestionKit = {};

    QuestionKit.valueForLabel = function(labelDefinition) {
        var language = (window.questionKitLanguage || navigator.language || navigator.systemLanguage || navigator.userLanguage || 'en').substr(0, 2).toLowerCase();

        var value = labelDefinition[language];

        if (value == undefined) {
            value = labelDefinition['en'];
        }

        if (value == undefined) {
            value = JSON.stringify(labelDefinition);
        }

        return value;
    }

    QuestionKit.valueForTerm = function(term) {
        var language = (window.questionKitLanguage || navigator.language || navigator.systemLanguage || navigator.userLanguage || 'en').substr(0, 2).toLowerCase();
        
        if (translations[term] != undefined) {
			var value = translations[term][language];

			if (value == undefined) {
				value = translations[term]['en'];
			}

			if (value == undefined) {
				value = JSON.stringify(term);
			}

	        return value;
	    }
	    
	    return term;
    }

    QuestionKit.cardRenderers = {};

    QuestionKit.cardRenderers['read-only-text'] = function(definition) {
        var output = '';

        output += '<h6 class="mdc-typography--headline6">' + QuestionKit.valueForLabel(definition['text']) + '</h6>';

        return output;
    }

    QuestionKit.cardRenderers['single-line'] = function(definition) {
        var output = '';

        output += '<h6 class="mdc-typography--headline6">' + QuestionKit.valueForLabel(definition['prompt']) + '</h6>';

        output += '<div>';
        output += '  <div class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label" style="width: 100%;">';
        output += '    <input type="text" id="' + definition['key'] + '" class="mdc-text-field__input" />';
        output += '    <div class="mdc-notched-outline">';
        output += '      <div class="mdc-notched-outline__leading"></div>';
        output += '      <div class="mdc-notched-outline__trailing"></div>';
        output += '    </div>';
        output += '  </div>';
        output += '</div>';

        if (definition["required"]) {
            output += '  <p class="mdc-typography--caption" style="text-align: right; margin-bottom: 0; color: #6100EE;">' + QuestionKit.valueForTerm('label_required') + '</p>';
        }

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

        if (definition["required"]) {
            output += '  <p class="mdc-typography--caption" style="text-align: right; margin-bottom: 0; color: #6100EE;">' + QuestionKit.valueForTerm('label_required') + '</p>';
        }

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

        if (definition["required"]) {
            output += '  <p class="mdc-typography--caption" style="text-align: right; margin-bottom: 0; color: #6100EE;">' + QuestionKit.valueForTerm('label_required') + '</p>';
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

        if (definition["required"]) {
            output += '  <p class="mdc-typography--caption" style="text-align: right; margin-bottom: 0; color: #6100EE;">' + QuestionKit.valueForTerm('label_required') + '</p>';
        }

        return output;
    }

    QuestionKit.cardRenderers['date-select'] = function(definition) {
        var output = '';

        output += '<h6 class="mdc-typography--headline6">' + QuestionKit.valueForLabel(definition['prompt']) + '</h6>';

        output += '<div class="mdc-layout-grid">';
        output += '  <div class="mdc-layout-grid__inner">';

        output += '    <div class="mdc-layout-grid__cell">';
        output += '      <div class="mdc-select mdc-select--outlined">';
        output += '        <i class="mdc-select__dropdown-icon"></i>';
        output += '        <select class="mdc-select__native-control">';
        output += '          <option value="" disabled selected></option>';
        output += '          <option value="1">' + QuestionKit.valueForTerm('month_jan') + '</option>';
        output += '          <option value="2">' + QuestionKit.valueForTerm('month_feb') + '</option>';
        output += '          <option value="3">' + QuestionKit.valueForTerm('month_mar') + '</option>';
        output += '          <option value="4">' + QuestionKit.valueForTerm('month_apr') + '</option>';
        output += '          <option value="5">' + QuestionKit.valueForTerm('month_may') + '</option>';
        output += '          <option value="6">' + QuestionKit.valueForTerm('month_jun') + '</option>';
        output += '          <option value="7">' + QuestionKit.valueForTerm('month_jul') + '</option>';
        output += '          <option value="8">' + QuestionKit.valueForTerm('month_aug') + '</option>';
        output += '          <option value="9">' + QuestionKit.valueForTerm('month_sep') + '</option>';
        output += '          <option value="10">' + QuestionKit.valueForTerm('month_oct') + '</option>';
        output += '          <option value="11">' + QuestionKit.valueForTerm('month_nov') + '</option>';
        output += '          <option value="12">' + QuestionKit.valueForTerm('month_dec') + '</option>';
        output += '        </select>';
        output += '        <div class="mdc-notched-outline">';
        output += '          <div class="mdc-notched-outline__leading"></div>';
        output += '          <div class="mdc-notched-outline__notch">';
        output += '            <label class="mdc-floating-label">' + QuestionKit.valueForTerm('label_month') + '</label>';
        output += '          </div>';
        output += '          <div class="mdc-notched-outline__trailing"></div>';
        output += '        </div>';
        output += '      </div>';
        output += '    </div>';
        
        output += '    <div class="mdc-layout-grid__cell">';
        output += '      <div class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label" style="width: 100%;">';
        output += '        <input type="number" id="' + definition['key'] + '_day" class="mdc-text-field__input" min="1" max="31" />';
        output += '        <div class="mdc-notched-outline">';
        output += '          <div class="mdc-notched-outline__leading"></div>';
        output += '           <span class="mdc-notched-outline__notch">';
        output += '             <span class="mdc-floating-label">' + QuestionKit.valueForTerm('label_day') + '</span>';
        output += '           </span>';
        output += '          <div class="mdc-notched-outline__trailing"></div>';
        output += '        </div>';
        output += '       </div>';
        output += '    </div>';
        output += '    <div class="mdc-layout-grid__cell">';
        output += '      <div class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label" style="width: 100%;">';
        output += '        <input type="number" id="' + definition['key'] + '_year" class="mdc-text-field__input" />';
        output += '        <div class="mdc-notched-outline">';
        output += '          <div class="mdc-notched-outline__leading"></div>';
        output += '           <span class="mdc-notched-outline__notch">';
        output += '             <span class="mdc-floating-label" id="my-label-id">' + QuestionKit.valueForTerm('label_year') + '</span>';
        output += '           </span>';
        output += '          <div class="mdc-notched-outline__trailing"></div>';
        output += '        </div>';
        output += '       </div>';
        output += '    </div>';
        output += '  </div>';
        output += '</div>';

        if (definition["required"]) {
            output += '  <p class="mdc-typography--caption" style="text-align: right; margin-bottom: 0; color: #6100EE;">' + QuestionKit.valueForTerm('label_required') + '</p>';
        }

        return output;
    }

    QuestionKit.cardRenderers['unknown'] = function(definition) {
        return '<pre>' + JSON.stringify(definition, null, 2) + '</pre>';
    }

    QuestionKit.renderQuestions = function(questions, options, onRendered) {
        onRendered();
    };

    QuestionKit.renderQuestion = function(definition, index) {
        var output = '';
        
        output += '<div class="mdc-card mdc-layout-grid__cell--span-12" style="margin-bottom: 1.25rem; padding: 1.25rem;" id="question_kit_container_' + definition['key'] + '">';

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

    QuestionKit.loadQuestionsFromData = function(options, data, onLoaded) {
        var disabled = options["editable"] != true;

        var container = $(options["element"]);

        container.empty();

        var itemsHtml = '<div class="mdc-layout-grid" style="padding: 0px;">';
        
        var itemIndex = 0;

        for (var i = 0; i < data.length; i++) {
            var sequence = data[i];

            var items = sequence['definition'];

            if (items == undefined) {
                items = sequence['prompts'];
            }

            if (items == undefined) {
                items = [sequence];
            }

            for (var j = 0; j < items.length; j++) {
                var item = items[j];

                QuestionKit.currentDefinition.push(item);

                itemsHtml += QuestionKit.renderQuestion(item, itemIndex);

                var constraints = item['constraints'];

                if (constraints != undefined && constraints.length > 0) {
                    QuestionKit.registerConstraint(item["key"], constraints, item['constraint-matches']);
                }
                
                itemIndex += 1;
            }
        }

        var addButton = true;

        if (options['update_button'] != undefined) {
            if ($('#' + options['update_button']).size() > 0) {
                addButton = false;
            }
        }

        if (addButton) {
            itemsHtml += '<button class="mdc-button mdc-button--raised mt-3" id="question_kit_update_form">';
            itemsHtml += '  <span class="mdc-button__label">Update</span>';
            itemsHtml += '</button>';
        }

        itemsHtml += '</div>';

        container.append(itemsHtml);

        window.setTimeout(function() {
            $('.mdc-text-field').each(function(index) {
                var field = mdc.textField.MDCTextField.attachTo($(this).get(0));

                field.disabled = disabled;

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
                var radio = mdc.radio.MDCRadio.attachTo($(this).get(0));

                radio.disabled = disabled;

                $(this).find('input[type=radio]').change(function(eventObj) {
                    var name = $(this).attr('name');
                    var value = $(this).val();

                    QuestionKit.updateValue(name, value);
                });
            });

            $('.mdc-checkbox').each(function(index) {
                var checkbox = mdc.checkbox.MDCCheckbox.attachTo($(this).get(0));

                checkbox.disabled = disabled;

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

            $('.mdc-select').each(function(index) {
                var select = mdc.select.MDCSelect.attachTo($(this).get(0));

                select.disabled = disabled;

                $(this).find('select').change(function(eventObj) {
                    var name = $(this).attr('id');
                    var value = $(this).val();

                    QuestionKit.updateValue(name, value);
                });
            });

            if (options['save_assessment_button'] != undefined) {
                if ($('#' + options['save_assessment_button']).size() > 0) {
                    addButton = false;
                }
            }

            var updateButton = "#question_kit_update_form";

            if (options['update_button'] != undefined) {
                if ($('#' + options['update_button']).size() > 0) {
                    updateButton = "#" + options['update_button'];
                }
            }

            if (options['update_button_name'] != undefined) {
                $(updateButton).text(options['update_button_name']);
            }

            if (options['editable'] == false) {
                $(updateButton).hide();
            }

            $(updateButton).click(function(eventObj) {
                eventObj.preventDefault();

                QuestionKit.submitUpdates(options['onUpdate']);

                return false;
            });
        }, 500);

        onLoaded(data);
    };

    QuestionKit.loadQuestions = function(options, definitionUrl, onLoaded) {
        var disabled = options["editable"] != true;

        $.get(definitionUrl, function(data) {
            QuestionKit.loadQuestionsFromData(options, data, onLoaded);
        });
    };

    QuestionKit.loadValues = function(values, onLoaded) {
        var loaded = function(data) {
            console.log("LOADING VALUES:");
            console.log(data);

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
        }

        if ((typeof values) == "string") {
            $.get(valuesUrl, loaded);
        } else {
            loaded(values);
        }
    };

    QuestionKit.currentAnswers = {};

    QuestionKit.updateValue = function(key, value) {
        QuestionKit.currentAnswers[key] = value;

        QuestionKit.applyConstraints();
    }

    QuestionKit.submitUpdates = function(onUpdate) {
        var complete = true;

        for (var question of QuestionKit.currentDefinition) {
            if (question['required'] == true) {
                var value = QuestionKit.currentAnswers[question['key']];

                if (value == undefined) {
                    console.log("COMPLETE CHECK: " + question['key'] + " UNDEFINED");
                    complete = false;
                } else if (value == null) {
                    console.log("COMPLETE CHECK: " + question['key'] + " NULL");
                    complete = false;
                } else if ($.type(value) === "string" && value.trim().length == 0) {
                    console.log("COMPLETE CHECK: " + question['key'] + " EMPTY STRING");
                    complete = false;
                } else if ($.type(value) === "array" && value.length == 0) {
                    console.log("COMPLETE CHECK: " + question['key'] + " EMPTY ARRAY");
                    complete = false;
                }
            }
        }

        console.log("COMPLETED: " + complete);

        onUpdate(QuestionKit.currentAnswers, complete);
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

    QuestionKit.registerConstraint = function(key, constraints, matchType) {
        if (matchType == undefined) {
            matchtype = 'all';
        }

        if (QuestionKit.currentConstraints == undefined) {
            QuestionKit.currentConstraints = {};
        }

        if (QuestionKit.currentConstraints[key] == undefined) {
            QuestionKit.currentConstraints[key] = [];
        }

        if (QuestionKit.currentConstraintMatchType == undefined) {
            QuestionKit.currentConstraintMatchType = {};
        }

        if (QuestionKit.currentConstraintMatchType[key] == undefined) {
            QuestionKit.currentConstraintMatchType[key] = matchType;
        }

        for (var constraint of constraints) {
            QuestionKit.currentConstraints[key].push(constraint);
        }
    }

    QuestionKit.applyConstraints = function() {
        var failed = [];

        for (var key in QuestionKit.currentConstraints) {
            let matchType = QuestionKit.currentConstraintMatchType[key];

            if (matchType == 'any') {
                var success = false;

                var constraints = QuestionKit.currentConstraints[key];

                for (var constraint of constraints) {
                    var value = QuestionKit.currentAnswers[constraint['key']];

                    if (value != undefined) {
                        if (constraint['operator'] == 'in') {
                            if (value.indexOf(constraint['value']) != -1) {
                                success = true;
                            }
                        } else if (constraint['operator'] == '=') {
                            if (value == constraint['value']) {
                                success = true;
                            }
                        } else if (constraint['operator'] == '!=') {
                            if (value != constraint['value']) {
                                success = true;
                            }
                        } else {
                            console.log('TODO');
                            console.log(constraint);
                        }
                    }
                }

                if (success == false) {
                    failed.push(key)
                }
            } else {
                var constraints = QuestionKit.currentConstraints[key];

                for (var constraint of constraints) {
                    var value = QuestionKit.currentAnswers[constraint['key']];

                    if (constraint['operator'] == 'in') {
                        if (value == undefined) {
                            failed.push(key);
                        } else if (value.indexOf(constraint['value']) == -1) {
                            failed.push(key);
                        }
                    } else if (constraint['operator'] == '=') {
                        if (value != constraint['value']) {
                            failed.push(key);
                        }
                    } else if (constraint['operator'] == '!=') {
                        if (value == constraint['value']) {
                            failed.push(key);
                        }
                    } else {
                        console.log('TODO');
                        console.log(constraint);
                    }
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

                        if (options['update_button_name'] != undefined) {
                            $("#question_kit_update_form").text(options['update_button_name']);
                        }

                        if (options['editable'] == false) {
                            $("#question_kit_update_form").hide();
                        }
                    });
                });
            });
        }
    };

    QuestionKit.initializeWithData = function(options) {
        if (options['definition'] != undefined) {
            QuestionKit.loadQuestionsFromData(options, options['definition'], function(questions) {
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