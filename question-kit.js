/* global requirejs */

if (requirejs.s.contexts._.config.paths.material === undefined || requirejs.s.contexts._.config.paths.jquery === undefined) {
  requirejs.config({
    shim: {
      jquery: {
        exports: '$'
      },
      recaptcha: {
        exports: 'grecaptcha'
      }
    },
    paths: {
      material: './vendor/mdc-web/material-components-web-11.0.0',
      libphonenumber: './vendor/libphonenumber-max',
      jquery: './vendor/jquery-reuse',
      marked: './vendor/marked.min',
      recaptcha: '//www.google.com/recaptcha/api'
    }
  })
}

const dependencies = ['material', 'libphonenumber', 'recaptcha', 'marked', 'jquery']

const translations = {
  label_required: {
    en: 'Required',
    es: 'Necesario'
  },
  label_month: {
    en: 'Month',
    es: 'Mes'
  },
  label_day: {
    en: 'Day',
    es: 'Dia'
  },
  label_year: {
    en: 'Year',
    es: 'Año'
  },
  month_jan: {
    en: 'January',
    es: 'Enero'
  },
  month_feb: {
    en: 'February',
    es: 'Febrero'
  },
  month_mar: {
    en: 'March',
    es: 'Marzo'
  },
  month_apr: {
    en: 'April',
    es: 'Abril'
  },
  month_may: {
    en: 'May',
    es: 'Mayo'
  },
  month_jun: {
    en: 'June',
    es: 'Junio'
  },
  month_jul: {
    en: 'July',
    es: 'Julio'
  },
  month_aug: {
    en: 'August',
    es: 'Agosto'
  },
  month_sep: {
    en: 'September',
    es: 'Septiembre'
  },
  month_oct: {
    en: 'October',
    es: 'Octubre'
  },
  month_nov: {
    en: 'November',
    es: 'Noviembre'
  },
  month_dec: {
    en: 'December',
    es: 'Diciembre'
  },
  label_hour: {
    en: 'Hour',
    es: 'Hora'
  },
  label_minute: {
    en: 'Minute',
    es: 'Minuto'
  },
  label_am_pm: {
    en: 'AM / PM',
    es: 'a.m. / p.m.'
  },
  label_am: {
    en: 'AM',
    es: 'a.m.'
  },
  label_pm: {
    en: 'PM',
    es: 'p.m.'
  },
  label_time_unit: {
    en: 'Time Unit',
    es: 'Unidad de tiempo'
  },
  time_unit_years: {
    en: 'Years',
    es: 'Años'
  },
  time_unit_months: {
    en: 'Months',
    es: 'Meses'
  },
  time_unit_weeks: {
    en: 'Weeks',
    es: 'Semanas'
  },
  time_unit_days: {
    en: 'Days',
    es: 'Días'
  },
  time_unit_years_ago: {
    en: 'years ago'
  },
  time_unit_months_ago: {
    en: 'months ago'
  },
  time_unit_weeks_ago: {
    en: 'weeks ago'
  },
  time_unit_days_ago: {
    en: 'days ago'
  }
}

requirejs(dependencies, function (mdc, phonenumber, recaptcha, marked) {
  const QuestionKit = {}

  marked.setOptions({
    breaks: true
  })

  QuestionKit.markupValue = function (value) {
    return marked.parse(value)
  }

  QuestionKit.valueForLabel = function (labelDefinition) {
    const language = (window.questionKitLanguage || navigator.language || navigator.systemLanguage || navigator.userLanguage || 'en').substr(0, 2).toLowerCase()

    let value = labelDefinition[language]

    if (value === undefined) {
      value = labelDefinition.en
    }

    if (value === undefined) {
      value = JSON.stringify(labelDefinition)
    }

    return value
  }

  QuestionKit.valueForTerm = function (term) {
    const language = (window.questionKitLanguage || navigator.language || navigator.systemLanguage || navigator.userLanguage || 'en').substr(0, 2).toLowerCase()

    if (translations[term] !== undefined) {
      let value = translations[term][language]

      if (value === undefined) {
        value = translations[term].en
      }

      if (value === undefined) {
        value = JSON.stringify(term)
      }

      return value
    }

    return term
  }

  QuestionKit.cardRenderers = {}

  QuestionKit.cardRenderers['read-only-text'] = function (definition) {
    let output = ''

    output += '<h6 class="mdc-typography--headline6">' + QuestionKit.markupValue(QuestionKit.valueForLabel(definition.text)) + '</h6>'

    return output
  }

  QuestionKit.cardRenderers.captcha = function (definition) {
    let output = ''

    output += '<div class="g-recaptcha" data-sitekey="' + definition.site_key + '" id="' + definition.key + '"></div>'

    return output
  }

  QuestionKit.cardRenderers['single-line'] = function (definition) {
    let output = ''

    output += '<h6 class="mdc-typography--headline6">' + QuestionKit.markupValue(QuestionKit.valueForLabel(definition.prompt)) + '</h6>'

    output += '<div>'
    output += '  <div class="qk-text-field mdc-text-field mdc-text-field--outlined mdc-text-field--no-label" style="width: 100%;">'
    output += '    <input type="text" id="' + definition.key + '" class="mdc-text-field__input" />'
    output += '    <div class="mdc-notched-outline">'
    output += '      <div class="mdc-notched-outline__leading"></div>'
    output += '      <div class="mdc-notched-outline__trailing"></div>'
    output += '    </div>'
    output += '  </div>'
    output += '</div>'

    return output
  }

  QuestionKit.cardRenderers['phone-number'] = function (definition) {
    let output = ''

    let region = definition.region

    if (region === undefined) {
      region = 'US'
    }

    output += '<h6 class="mdc-typography--headline6">' + QuestionKit.markupValue(QuestionKit.valueForLabel(definition.prompt)) + '</h6>'

    output += '<div>'
    output += '  <div class="qk-phone-number mdc-text-field mdc-text-field--outlined mdc-text-field--no-label mdc-text-field--with-trailing-icon" style="width: 100%;" data-region="' + region + '">'
    output += '    <input type="text" id="' + definition.key + '" class="mdc-text-field__input" />'
    output += '    <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button">phone_disabled</i>'
    output += '    <div class="mdc-notched-outline">'
    output += '      <div class="mdc-notched-outline__leading"></div>'
    output += '      <div class="mdc-notched-outline__trailing"></div>'
    output += '    </div>'
    output += '  </div>'
    output += '</div>'

    return output
  }

  QuestionKit.cardRenderers['multi-line'] = function (definition) {
    let output = ''

    output += '<h6 class="mdc-typography--headline6">' + QuestionKit.markupValue(QuestionKit.valueForLabel(definition.prompt)) + '</h6>'

    output += '<div>'
    output += '  <div class="qk-text-field mdc-text-field mdc-text-field--outlined mdc-text-field--textarea mdc-text-field--no-label" style="width: 100%;">'
    output += '    <textarea class="mdc-text-field__input" rows="4" id="' + definition.key + '" ></textarea>'
    output += '    <div class="mdc-notched-outline">'
    output += '      <div class="mdc-notched-outline__leading"></div>'
    output += '      <div class="mdc-notched-outline__trailing"></div>'
    output += '    </div>'
    output += '  </div>'
    output += '</div>'

    return output
  }

  QuestionKit.cardRenderers['select-multiple'] = function (definition) {
    let output = ''

    output += '<h6 class="mdc-typography--headline6">' + QuestionKit.markupValue(QuestionKit.valueForLabel(definition.prompt)) + '</h6>'

    for (let i = 0; i < definition.options.length; i++) {
      const option = definition.options[i]

      const optionKey = definition.key + '_' + option.value + '_mdc_checkbox'

      output += '<div>'
      output += '  <div class="mdc-form-field">'
      output += '    <div class="mdc-checkbox">'
      output += '      <input type="checkbox" class="mdc-checkbox__native-control" id="' + optionKey + '" value="' + option.value + '" data-question-key="' + definition.key + '"/>'
      output += '      <div class="mdc-checkbox__background">'
      output += '        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">'
      output += '          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>'
      output += '        </svg>'
      output += '        <div class="mdc-checkbox__mixedmark"></div>'
      output += '      </div>'
      output += '    </div>'
      output += '    <label for="' + optionKey + '" class="mdc-typography--body1">' + QuestionKit.markupValue(QuestionKit.valueForLabel(option.label)) + '</label>'
      output += '  </div>'
      output += '</div>'
    }

    return output
  }

  QuestionKit.cardRenderers['select-one'] = function (definition) {
    let output = ''
    output += '<h6 class="mdc-typography--headline6">' + QuestionKit.markupValue(QuestionKit.valueForLabel(definition.prompt)) + '</h6>'

    for (let i = 0; i < definition.options.length; i++) {
      const option = definition.options[i]

      const optionKey = definition.key + '_' + option.value

      output += '<div>'
      output += '  <div class="mdc-form-field">'
      output += '    <div class="mdc-radio">'
      output += '      <input type="radio" class="mdc-radio__native-control" id="' + optionKey + '" name="' + definition.key + '" value="' + option.value + '">'
      output += '      <div class="mdc-radio__background">'
      output += '        <div class="mdc-radio__outer-circle"></div>'
      output += '        <div class="mdc-radio__inner-circle"></div>'
      output += '      </div>'
      output += '    </div>'
      output += '    <label for="' + optionKey + '" class="mdc-typography--body1">' + QuestionKit.markupValue(QuestionKit.valueForLabel(option.label)) + '</label>'
      output += '  </div>'
      output += '</div>'
    }

    return output
  }

  QuestionKit.cardRenderers['date-select'] = function (definition) {
    let output = ''

    output += '<h6 class="mdc-typography--headline6">' + QuestionKit.markupValue(QuestionKit.valueForLabel(definition.prompt)) + '</h6>'

    output += '<div class="mdc-layout-grid qk-select-date" id="' + definition.key + '">'
    output += '  <div class="mdc-layout-grid__inner">'
    output += '    <div class="mdc-layout-grid__cell mdc-select mdc-select--outlined mdc-select--month">'
    output += '      <div class="mdc-select__anchor" aria-labelledby="outlined-select-label">'
    output += '        <span class="mdc-notched-outline">'
    output += '          <span class="mdc-notched-outline__leading"></span>'
    output += '          <span class="mdc-notched-outline__notch">'
    output += '            <span id="outlined-select-label" class="mdc-floating-label">' + QuestionKit.valueForTerm('label_month') + '</span>'
    output += '          </span>'
    output += '          <span class="mdc-notched-outline__trailing"></span>'
    output += '        </span>'
    output += '        <span class="mdc-select__selected-text-container">'
    output += '          <span class="mdc-select__selected-text"></span>'
    output += '        </span>'
    output += '        <span class="mdc-select__dropdown-icon">'
    output += '          <svg class="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5" focusable="false">'
    output += '            <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10">'
    output += '            </polygon>'
    output += '            <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15">'
    output += '            </polygon>'
    output += '          </svg>'
    output += '        </span>'
    output += '      </div>'
    output += '      <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">'
    output += '        <ul class="mdc-deprecated-list" role="listbox" aria-label="Month Listbox">'
    output += '          <li class="mdc-deprecated-list-item mdc-list-item--selected" aria-selected="true" data-value="" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="1" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('month_jan') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="2" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('month_feb') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="3" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('month_mar') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="4" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('month_apr') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="5" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('month_may') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="6" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('month_jun') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="7" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('month_jul') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="8" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('month_aug') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="9" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('month_sep') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="10" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('month_oct') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="11" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('month_nov') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="12" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('month_dec') + '</span>'
    output += '          </li>'
    output += '        </ul>'
    output += '      </div>'
    output += '    </div>'

    output += '    <div class="mdc-layout-grid__cell">'
    output += '      <div class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label mdc-text-field--day" style="width: 100%;">'
    output += '        <input type="number" id="' + definition.key + '_day" class="mdc-text-field__input" min="1" max="31" />'
    output += '        <div class="mdc-notched-outline">'
    output += '          <div class="mdc-notched-outline__leading"></div>'
    output += '           <span class="mdc-notched-outline__notch">'
    output += '             <span class="mdc-floating-label">' + QuestionKit.valueForTerm('label_day') + '</span>'
    output += '           </span>'
    output += '          <div class="mdc-notched-outline__trailing"></div>'
    output += '        </div>'
    output += '       </div>'
    output += '    </div>'
    output += '    <div class="mdc-layout-grid__cell">'
    output += '      <div class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label mdc-text-field--year" style="width: 100%;">'
    output += '        <input type="number" id="' + definition.key + '_year" class="mdc-text-field__input" />'
    output += '        <div class="mdc-notched-outline">'
    output += '          <div class="mdc-notched-outline__leading"></div>'
    output += '           <span class="mdc-notched-outline__notch">'
    output += '             <span class="mdc-floating-label" id="my-label-id">' + QuestionKit.valueForTerm('label_year') + '</span>'
    output += '           </span>'
    output += '          <div class="mdc-notched-outline__trailing"></div>'
    output += '        </div>'
    output += '       </div>'
    output += '    </div>'
    output += '  </div>'
    output += '</div>'

    return output
  }

  QuestionKit.cardRenderers['time-select-12-hour'] = function (definition) {
    let output = ''

    let defaultHour = ''
    let defaultMinute = ''
    let defaultAmPm = ''

    if (definition.defaults !== undefined) {
      if (definition.defaults.hour !== undefined) {
        defaultHour = definition.defaults.hour
      }

      if (definition.defaults.minute !== undefined) {
        defaultMinute = definition.defaults.minute
      }

      if (definition.defaults.am_pm !== undefined) {
        defaultAmPm = definition.defaults.am_pm
      }
    }

    output += '<h6 class="mdc-typography--headline6">' + QuestionKit.markupValue(QuestionKit.valueForLabel(definition.prompt)) + '</h6>'

    output += '<div class="mdc-layout-grid qk-select-time-12-hour" id="' + definition.key + '" data-default-ampm="' + defaultAmPm + '">'
    output += '  <div class="mdc-layout-grid__inner">'

    output += '    <div class="mdc-layout-grid__cell">'
    output += '      <div class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label mdc-text-field--hour" style="width: 100%;">'
    output += '        <input type="number" id="' + definition.key + '_day" class="mdc-text-field__input" min="1" max="12" value="' + defaultHour + '" />'
    output += '        <div class="mdc-notched-outline">'
    output += '          <div class="mdc-notched-outline__leading"></div>'
    output += '           <span class="mdc-notched-outline__notch">'
    output += '             <span class="mdc-floating-label">' + QuestionKit.valueForTerm('label_hour') + '</span>'
    output += '           </span>'
    output += '          <div class="mdc-notched-outline__trailing"></div>'
    output += '        </div>'
    output += '       </div>'
    output += '    </div>'

    if (definition.lock_minute !== undefined) {
      if (definition.hide_minute) {
        output += '    <div style="display: none;">'
      } else {
        output += '    <div class="mdc-layout-grid__cell">'
      }

      output += '      <div class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label mdc-text-field--minute mdc-text-field--disabled" style="width: 100%;">'
      output += '        <input type="number" id="' + definition.key + '_minute" class="mdc-text-field__input" min="0" max="59"  value="' + definition.lock_minute + '" disabled />'
      output += '        <div class="mdc-notched-outline">'
      output += '          <div class="mdc-notched-outline__leading"></div>'
      output += '           <span class="mdc-notched-outline__notch">'
      output += '             <span class="mdc-floating-label" id="my-label-id">' + QuestionKit.valueForTerm('label_minute') + '</span>'
      output += '           </span>'
      output += '          <div class="mdc-notched-outline__trailing"></div>'
      output += '        </div>'
      output += '       </div>'
      output += '    </div>'
    } else {
      if (definition.hide_minute) {
        output += '    <div style="display: none;">'
      } else {
        output += '    <div class="mdc-layout-grid__cell">'
      }

      output += '      <div class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label mdc-text-field--minute" style="width: 100%;">'
      output += '        <input type="number" id="' + definition.key + '_minute" class="mdc-text-field__input" min="0" max="59"  value="' + defaultMinute + '" />'
      output += '        <div class="mdc-notched-outline">'
      output += '          <div class="mdc-notched-outline__leading"></div>'
      output += '           <span class="mdc-notched-outline__notch">'
      output += '             <span class="mdc-floating-label" id="my-label-id">' + QuestionKit.valueForTerm('label_minute') + '</span>'
      output += '           </span>'
      output += '          <div class="mdc-notched-outline__trailing"></div>'
      output += '        </div>'
      output += '       </div>'
      output += '    </div>'
    }

    output += '    <div class="mdc-layout-grid__cell mdc-select mdc-select--outlined mdc-select--am-pm">'
    output += '      <div class="mdc-select__anchor" aria-labelledby="outlined-select-label">'
    output += '        <span class="mdc-notched-outline">'
    output += '          <span class="mdc-notched-outline__leading"></span>'
    output += '          <span class="mdc-notched-outline__notch">'
    output += '            <span id="outlined-select-label" class="mdc-floating-label">' + QuestionKit.valueForTerm('label_am_pm') + '</span>'
    output += '          </span>'
    output += '          <span class="mdc-notched-outline__trailing"></span>'
    output += '        </span>'
    output += '        <span class="mdc-select__selected-text-container">'

    if (defaultAmPm === 'am') {
      output += '          <span class="mdc-select__selected-text">' + QuestionKit.valueForTerm('label_am') + '</span>'
    } else if (defaultAmPm === 'pm') {
      output += '          <span class="mdc-select__selected-text">' + QuestionKit.valueForTerm('label_pm') + '</span>'
    } else {
      output += '          <span class="mdc-select__selected-text"></span>'
    }

    output += '        </span>'
    output += '        <span class="mdc-select__dropdown-icon">'
    output += '          <svg class="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5" focusable="false">'
    output += '            <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10">'
    output += '            </polygon>'
    output += '            <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15">'
    output += '            </polygon>'
    output += '          </svg>'
    output += '        </span>'
    output += '      </div>'
    output += '      <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">'
    output += '        <ul class="mdc-deprecated-list" role="listbox" aria-label="Month Listbox">'

    if (defaultAmPm === 'am') {
      output += '          <li class="mdc-deprecated-list-item mdc-list-item--selected" data-value="am" aria-selected="true">'
    } else {
      output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="am">'
    }

    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('label_am') + '</span>'
    output += '          </li>'

    if (defaultAmPm === 'pm') {
      output += '          <li class="mdc-deprecated-list-item mdc-list-item--selected" data-value="pm" aria-selected="true">'
    } else {
      output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="pm">'
    }

    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('label_pm') + '</span>'
    output += '          </li>'
    output += '        </ul>'
    output += '      </div>'
    output += '    </div>'

    output += '  </div>'
    output += '</div>'

    return output
  }

  QuestionKit.cardRenderers['time-ago'] = function (definition) {
    let output = ''

    output += '<h6 class="mdc-typography--headline6">' + QuestionKit.markupValue(QuestionKit.valueForLabel(definition.prompt)) + '</h6>'

    output += '<div class="mdc-layout-grid qk-select-time-ago" id="' + definition.key + '">'
    output += '  <div class="mdc-layout-grid__inner">'
    output += '    <div class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label mdc-text-field--count mdc-layout-grid__cell mdc-layout-grid__cell--span-6">'
    output += '      <input type="number" min="1" id="' + definition.key + '_quantity" class="mdc-text-field__input" />'
    output += '      <div class="mdc-notched-outline">'
    output += '        <div class="mdc-notched-outline__leading"></div>'
    output += '        <div class="mdc-notched-outline__trailing"></div>'
    output += '      </div>'
    output += '    </div>'
    output += '    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6 mdc-select mdc-select--outlined mdc-select--unit">'
    output += '      <div class="mdc-select__anchor" aria-labelledby="outlined-select-label">'
    output += '        <span class="mdc-notched-outline">'
    output += '          <span class="mdc-notched-outline__leading"></span>'
    output += '          <span class="mdc-notched-outline__notch">'
    output += '            <span id="outlined-select-label" class="mdc-floating-label">' + QuestionKit.valueForTerm('label_time_unit') + '</span>'
    output += '          </span>'
    output += '          <span class="mdc-notched-outline__trailing"></span>'
    output += '        </span>'
    output += '        <span class="mdc-select__selected-text-container">'
    output += '          <span class="mdc-select__selected-text"></span>'
    output += '        </span>'
    output += '        <span class="mdc-select__dropdown-icon">'
    output += '          <svg class="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5" focusable="false">'
    output += '            <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10">'
    output += '            </polygon>'
    output += '            <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15">'
    output += '            </polygon>'
    output += '          </svg>'
    output += '        </span>'
    output += '      </div>'
    output += '      <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">'
    output += '        <ul class="mdc-deprecated-list" role="listbox" aria-label="Time Unit Listbox">'
    output += '          <li class="mdc-deprecated-list-item mdc-list-item--selected" aria-selected="true" data-value="" role="option">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="years" role="years">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('time_unit_years_ago') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="months" role="months">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('time_unit_months_ago') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="weeks" role="weeks">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('time_unit_weeks_ago') + '</span>'
    output += '          </li>'
    output += '          <li class="mdc-deprecated-list-item" aria-selected="false" data-value="days" role="days">'
    output += '            <span class="mdc-deprecated-list-item__ripple"></span>'
    output += '            <span class="mdc-deprecated-list-item__text">' + QuestionKit.valueForTerm('time_unit_days_ago') + '</span>'
    output += '          </li>'
    output += '        </ul>'
    output += '      </div>'
    output += '    </div>'
    output += '  </div>'
    output += '</div>'

    return output
  }

  QuestionKit.cardRenderers.unknown = function (definition) {
    return '<pre>' + JSON.stringify(definition, null, 2) + '</pre>'
  }

  QuestionKit.renderQuestions = function (questions, options, onRendered) {
    onRendered()
  }

  QuestionKit.renderQuestion = function (definition, index) {
    let output = ''

    output += '<div class="mdc-card mdc-layout-grid__cell--span-12" style="margin-bottom: 1.25rem; padding: 1.25rem;" id="question_kit_container_' + definition.key + '">'

    const type = definition['prompt-type']

    let renderer = QuestionKit.cardRenderers[type]

    if (renderer === undefined) {
      renderer = QuestionKit.cardRenderers.unknown
    }

    output += renderer(definition)

    if (definition.caption) {
      output += '  <div class="mdc-typography--caption">' + QuestionKit.markupValue(QuestionKit.valueForLabel(definition.caption)) + '</div>'
    }

    if (definition.required) {
      output += '  <p class="mdc-typography--caption" style="text-align: right; margin-bottom: 0; color: #6100EE;">' + QuestionKit.valueForTerm('label_required') + '</p>'
    }

    output += '</div>'

    return output
  }

  QuestionKit.currentDefinition = []

  QuestionKit.loadQuestionsFromData = function (options, data, onLoaded) {
    if (Array.isArray(data) === false) {
      data = [data]
    }

    const disabled = options.editable === false

    const container = $(options.element)

    container.empty()

    let itemsHtml = '<div class="mdc-layout-grid" style="padding: 0px;">'

    let itemIndex = 0

    for (let i = 0; i < data.length; i++) {
      const sequence = data[i]

      let items = sequence.definition

      if (items === undefined) {
        items = sequence.prompts
      }

      if (items === undefined) {
        items = [sequence]
      }

      for (let j = 0; j < items.length; j++) {
        const item = items[j]

        QuestionKit.currentDefinition.push(item)

        itemsHtml += QuestionKit.renderQuestion(item, itemIndex)

        const constraints = item.constraints

        if (constraints !== undefined && constraints.length > 0) {
          QuestionKit.registerConstraint(item.key, constraints, item['constraint-matches'])
        }

        itemIndex += 1
      }
    }

    let addButton = true

    if (options.update_button !== undefined) {
      if ($('#' + options.update_button).size() > 0) {
        addButton = false
      }
    }

    if (addButton) {
      itemsHtml += '<button class="mdc-button mdc-button--raised mt-3" id="question_kit_update_form">'
      itemsHtml += '  <span class="mdc-button__label">Update</span>'
      itemsHtml += '</button>'
    }

    itemsHtml += '</div>'

    container.append(itemsHtml)

    window.setTimeout(function () {
      $('.qk-text-field').each(function (index) {
        const field = mdc.textField.MDCTextField.attachTo($(this).get(0))

        field.disabled = disabled

        $(this).find('input[type="text"]').change(function (eventObj) {
          const name = $(this).attr('id')
          const value = $(this).val()

          QuestionKit.updateValue(name, value)
        })

        $(this).find('textarea').change(function (eventObj) {
          const name = $(this).attr('id')
          const value = $(this).val()

          QuestionKit.updateValue(name, value)
        })
      })

      $('.mdc-radio').each(function (index) {
        const radio = mdc.radio.MDCRadio.attachTo($(this).get(0))

        radio.disabled = disabled

        $(this).find('input[type=radio]').change(function (eventObj) {
          const name = $(this).attr('name')
          const value = $(this).val()

          QuestionKit.updateValue(name, value)
        })
      })

      $('.mdc-checkbox').each(function (index) {
        const checkbox = mdc.checkbox.MDCCheckbox.attachTo($(this).get(0))

        checkbox.disabled = disabled

        $(this).find('input[type=checkbox]').change(function (eventObj) {
          const name = $(this).attr('data-question-key')
          const value = $(this).val()

          if ($(this).is(':checked')) {
            QuestionKit.addValue(name, value)
          } else {
            QuestionKit.clearValue(name, value)
          }
        })
      })

      $('.mdc-select').not('.mdc-select--month').not('.mdc-select--am-pm').not('.mdc-select--unit').each(function (index) {
        const select = mdc.select.MDCSelect.attachTo($(this).get(0))

        select.disabled = disabled

        select.listen('MDCSelect:change', () => {
          const name = $(this).attr('id')
          const value = select.value

          QuestionKit.updateValue(name, value)
        })
      })

      $('.qk-select-date').each(function (index) {
        const key = $(this).attr('id')

        const monthSelect = mdc.select.MDCSelect.attachTo($(this).find('.mdc-select--month').get(0))
        monthSelect.disabled = disabled

        const dayField = mdc.textField.MDCTextField.attachTo($(this).find('.mdc-text-field--day').get(0))
        dayField.disabled = disabled

        const yearField = mdc.textField.MDCTextField.attachTo($(this).find('.mdc-text-field--year').get(0))
        yearField.disabled = disabled

        const updateDate = function () {
          let month = monthSelect.value
          let day = dayField.value
          let year = yearField.value

          if (month.length > 0 && day.length > 0 && year.length > 0) {
            while (month.length < 2) {
              month = '0' + month
            }

            while (day.length < 2) {
              day = '0' + day
            }

            while (year.length < 4) {
              year = '0' + year
            }

            QuestionKit.updateValue(key, year + '-' + month + '-' + day)
          } else {
            console.log('Incomplete Selection')
          }
        }

        monthSelect.listen('MDCSelect:change', () => {
          updateDate()
        })

        $(this).find('input[type="number"]').change(function (eventObj) {
          updateDate()
        })
      })

      $('.qk-select-time-12-hour').each(function (index) {
        const key = $(this).attr('id')

        const defaultAmPm = $(this).attr('data-default-ampm')

        const amPmSelect = mdc.select.MDCSelect.attachTo($(this).find('.mdc-select--am-pm').get(0))
        amPmSelect.disabled = disabled
        amPmSelect.value = defaultAmPm

        const hourField = mdc.textField.MDCTextField.attachTo($(this).find('.mdc-text-field--hour').get(0))
        hourField.disabled = disabled

        const minuteField = mdc.textField.MDCTextField.attachTo($(this).find('.mdc-text-field--minute').get(0))
        minuteField.disabled = (minuteField.disabled || disabled)

        const updateTime = function () {
          const amPm = amPmSelect.value
          let hour = parseInt(hourField.value)
          let minute = parseInt(minuteField.value)

          if (amPm.length > 0 && isNaN(hour) === false && isNaN(minute) === false) {
            if (amPm === 'pm' && hour !== 12) {
              hour += 12
            } else if (hour === 12 && amPm === 'am') {
              hour = 0
            }

            hour = '' + hour
            minute = '' + minute

            while (hour.length < 2) {
              hour = '0' + hour
            }

            while (minute.length < 2) {
              minute = '0' + minute
            }

            QuestionKit.updateValue(key, hour + ':' + minute)
          } else {
            console.log('Incomplete Selection')
          }
        }

        amPmSelect.listen('MDCSelect:change', () => {
          updateTime()
        })

        $(this).find('input[type="number"]').change(function (eventObj) {
          updateTime()
        })

        updateTime()
      })

      $('.qk-phone-number').each(function (index) {
        const field = mdc.textField.MDCTextFieldIcon.attachTo($(this).get(0))

        field.disabled = disabled

        const region = $(this).attr('data-region')

        const icon = $(this).find('i.material-icons')

        $(this).find('input[type="text"]').on('keyup change paste', function (eventObj) {
          const name = $(this).attr('id')
          const value = $(this).val()

          try {
            const parsed = phonenumber.parsePhoneNumber(value, region)

            if (parsed.isValid()) {
              icon.text('phone_enabled')

              QuestionKit.updateValue(name, parsed.number)
            } else {
              icon.text('phone_disabled')
            }
          } catch (err) {
            icon.text('phone_disabled')
          }
        })
      })

      $('.qk-select-time-ago').each(function (index) {
        const key = $(this).attr('id')

        const countField = mdc.textField.MDCTextField.attachTo($(this).find('.mdc-text-field--count').get(0))
        const unitSelect = mdc.select.MDCSelect.attachTo($(this).find('.mdc-select--unit').get(0))

        const updateAgo = function () {
          const unit = unitSelect.value
          const count = countField.value

          if (unit !== '') {
            QuestionKit.updateValue(key, {
              unit: unit,
              quantity: count
            })
          } else {
            console.log('Incomplete Selection')
          }
        }

        unitSelect.listen('MDCSelect:change', () => {
          updateAgo()
        })

        $(this).find('input[type="number"]').change(function (eventObj) {
          updateAgo()
        })
      })

      if (options.save_assessment_button !== undefined) {
        if ($('#' + options.save_assessment_button).size() > 0) {
          addButton = false
        }
      }

      let updateButton = '#question_kit_update_form'

      if (options.update_button !== undefined) {
        if ($('#' + options.update_button).size() > 0) {
          updateButton = '#' + options.update_button
        }
      }

      if (options.update_button_name !== undefined) {
        $(updateButton).text(options.update_button_name)
      }

      $('.g-recaptcha').each(function (index) {
        const name = $(this).attr('id')

        recaptcha.render($(this).get(0), {
          sitekey: $(this).attr('data-sitekey'),
          callback: function (response) {
            QuestionKit.updateValue(name, response)
          }
        })
      })

      if (options.editable === false) {
        $(updateButton).hide()
      }

      $(updateButton).click(function (eventObj) {
        eventObj.preventDefault()

        QuestionKit.submitUpdates(options.onUpdate)

        return false
      })
    }, 500)

    onLoaded(data)
  }

  QuestionKit.loadQuestions = function (options, definitionUrl, onLoaded) {
    $.get(definitionUrl, function (data) {
      QuestionKit.loadQuestionsFromData(options, data, onLoaded)
    })
  }

  QuestionKit.loadValues = function (values, onLoaded) {
    const loaded = function (data) {
      QuestionKit.currentAnswers = {}

      for (const item of QuestionKit.currentDefinition) {
        const key = item.key
        const value = data[key]

        if (value !== undefined && value !== '') {
          QuestionKit.currentAnswers[key] = value

          if (item['prompt-type'] === 'select-multiple') {
            for (const selected of value) {
              $('input[data-question-key="' + key + '"][value="' + selected + '"]').prop('checked', true)
            }
          } else if (item['prompt-type'] === 'select-one') {
            $('input[name="' + key + '"][value="' + value + '"]').prop('checked', true)
          } else if (item['prompt-type'] === 'single-line') {
            $('input#' + key).val(value)
          } else if (item['prompt-type'] === 'multi-line') {
            $('textarea#' + key).val(value)
          } else if (item['prompt-type'] === 'date-select') {
            const tokens = value.split('-')

            const year = parseInt(tokens[0])
            const month = parseInt(tokens[1])
            const day = parseInt(tokens[2])

            $('#' + key + ' select').val('' + month)
            $('#' + key + '_day').val('' + day)
            $('#' + key + '_year').val('' + year)
          } else if (item['prompt-type'] === 'time-select-12-hour') {
            const tokens = value.split(':')

            let hour = parseInt(tokens[0])

            if (hour > '12') {
              $('#' + key + ' select').val('pm')
              hour -= 12
            } else {
              $('#' + key + ' select').val('am')
            }

            const minute = parseInt(tokens[1])

            $('#' + key + '_minute').val(minute)
            $('#' + key + '_hour').val(hour)
          } else if (item['prompt-type'] === 'time-ago') {
            console.log('trying to set ago question: ')
            console.log(value)

            const unitSelect = mdc.select.MDCSelect.attachTo($('body').find('#' + key + ' .mdc-select--unit').get(0))

            $('#' + key + '_quantity').val(value.quantity)
            unitSelect.value = value.unit
          }
        }
      }

      onLoaded()
    }

    if (values === undefined || values === '') {
      loaded({})
    } else if ((typeof values) === 'string') {
      $.get(values, loaded)
    } else {
      loaded(values)
    }
  }

  QuestionKit.currentAnswers = {}

  QuestionKit.updateValue = function (key, value) {
    QuestionKit.currentAnswers[key] = value

    QuestionKit.applyConstraints()
  }

  QuestionKit.submitUpdates = function (onUpdate) {
    const missing = []

    for (const question of QuestionKit.currentDefinition) {
      if (question.required === true) {
        const value = QuestionKit.currentAnswers[question.key]

        if (value === undefined) {
          console.log('COMPLETE CHECK: ' + question.key + ' UNDEFINED')
          missing.push(question.key)
        } else if (value === null) {
          console.log('COMPLETE CHECK: ' + question.key + ' NULL')
          missing.push(question.key)
        } else if ($.type(value) === 'string' && value.trim().length === 0) {
          console.log('COMPLETE CHECK: ' + question.key + ' EMPTY STRING')
          missing.push(question.key)
        } else if ($.type(value) === 'array' && value.length === 0) {
          console.log('COMPLETE CHECK: ' + question.key + ' EMPTY ARRAY')
          missing.push(question.key)
        }
      }
    }

    const complete = (missing.length === 0)

    console.log('COMPLETED: ' + complete)

    onUpdate(QuestionKit.currentAnswers, complete, missing)
  }

  QuestionKit.addValue = function (key, value) {
    if (QuestionKit.currentAnswers[key] === undefined) {
      QuestionKit.currentAnswers[key] = []
    }

    if (QuestionKit.currentAnswers[key].indexOf(value) >= 0) {
      return
    }

    QuestionKit.currentAnswers[key].push(value)

    QuestionKit.applyConstraints()
  }

  QuestionKit.clearValue = function (key, value) {
    if (QuestionKit.currentAnswers[key] === undefined) {
      QuestionKit.currentAnswers[key] = []
    }

    QuestionKit.currentAnswers[key] = $.grep(QuestionKit.currentAnswers[key], function (item) {
      return item !== value
    })

    QuestionKit.applyConstraints()
  }

  QuestionKit.registerConstraint = function (key, constraints, matchType) {
    if (QuestionKit.currentConstraints === undefined) {
      QuestionKit.currentConstraints = {}
    }

    if (QuestionKit.currentConstraints[key] === undefined) {
      QuestionKit.currentConstraints[key] = []
    }

    if (QuestionKit.currentConstraintMatchType === undefined) {
      QuestionKit.currentConstraintMatchType = {}
    }

    if (QuestionKit.currentConstraintMatchType[key] === undefined) {
      QuestionKit.currentConstraintMatchType[key] = matchType
    }

    for (const constraint of constraints) {
      QuestionKit.currentConstraints[key].push(constraint)
    }
  }

  QuestionKit.applyConstraints = function () {
    const failed = []

    for (const key in QuestionKit.currentConstraints) {
      const matchType = QuestionKit.currentConstraintMatchType[key]

      if (matchType === 'any') {
        let success = false

        const constraints = QuestionKit.currentConstraints[key]

        for (const constraint of constraints) {
          const value = QuestionKit.currentAnswers[constraint.key]

          if (value !== undefined) {
            if (constraint.operator === 'in') {
              if (value.indexOf(constraint.value) !== -1) {
                success = true
              }
            } else if (constraint.operator === '=') {
              if (value === constraint.value) {
                success = true
              }
            } else if (constraint.operator === '!=') {
              if (value !== constraint.value) {
                success = true
              }
            } else {
              console.log('TODO')
              console.log(constraint)
            }
          }
        }

        if (success === false) {
          failed.push(key)
        }
      } else {
        const constraints = QuestionKit.currentConstraints[key]

        for (const constraint of constraints) {
          const value = QuestionKit.currentAnswers[constraint.key]

          if (constraint.operator === 'in') {
            if (value === undefined) {
              failed.push(key)
            } else if (value.indexOf(constraint.value) === -1) {
              failed.push(key)
            }
          } else if (constraint.operator === '=') {
            if (value !== constraint.value) {
              failed.push(key)
            }
          } else if (constraint.operator === '!=') {
            if (value === constraint.value) {
              failed.push(key)
            }
          } else {
            console.log('TODO')
            console.log(constraint)
          }
        }
      }
    }

    const toDisable = []
    const toEnable = []

    for (const item of QuestionKit.currentDefinition) {
      const key = item.key

      if (failed.indexOf(key) === -1) {
        $('#question_kit_container_' + key).show()
      } else {
        $('#question_kit_container_' + key).hide()
      }

      if (item['prompt-type'] === 'select-multiple' || item['prompt-type'] === 'select-one') {
        $.each(item.options, function (index, option) {
          const itemKey = 'input[data-question-key="' + key + '"][value="' + option.value + '"]'

          if (option['disabled-constraints-any'] !== undefined) {
            let disabled = false

            $.each(option['disabled-constraints-any'], function (constraintIndex, constraint) {
              const answer = QuestionKit.currentAnswers[constraint.key]

              if (answer !== undefined && constraint.value !== undefined) {
                if (constraint.operator === 'in') {
                  if (answer.includes(constraint.value)) {
                    disabled = true
                  }
                } else if (constraint.operator === 'more-than') {
                  if ($(itemKey).prop('checked') === false) {
                    if (answer.length !== undefined && answer.length >= constraint.value) {
                      disabled = true
                    }
                  }
                }
              }
            })

            if (disabled) {
              if (toDisable.includes(itemKey) === false) {
                toDisable.push(itemKey)
              }
            } else {
              if (toEnable.includes(itemKey) === false) {
                toEnable.push(itemKey)
              }
            }
          }
        })
      }
    }

    console.log('DISABLE:')
    console.log(toDisable)

    console.log('ENABLE:')
    console.log(toEnable)

    $.each(toEnable, function (index, element) {
      $(element).parent().parent().css('text-decoration', '')
      $(element).prop('disabled', false)
    })

    $.each(toDisable, function (index, element) {
      $(element).parent().parent().css('text-decoration', 'line-through')
      $(element).prop('disabled', true)
    })
  }

  QuestionKit.initialize = function (options) {
    if (options.definition !== undefined) {
      QuestionKit.loadQuestions(options, options.definition, function (questions) {
        QuestionKit.renderQuestions(questions, options, function () {
          QuestionKit.loadValues(options.values, function () {
            QuestionKit.applyConstraints()

            if (options.update_button_name !== undefined) {
              $('#question_kit_update_form').text(options.update_button_name)
            }

            if (options.editable === false) {
              $('#question_kit_update_form').hide()
            }
          })
        })
      })
    }
  }

  QuestionKit.initializeWithData = function (options, loaded) {
    if (options.definition !== undefined) {
      QuestionKit.loadQuestionsFromData(options, options.definition, function (questions) {
        QuestionKit.renderQuestions(questions, options, function () {
          QuestionKit.loadValues(options.values, function () {
            if (loaded !== undefined) {
              loaded()
            }

            QuestionKit.applyConstraints()
          })
        })
      })
    }
  }

  window.QuestionKit = QuestionKit

  return QuestionKit
})
