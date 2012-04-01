/*!
* jQuery lightweight plugin boilerplate
* Original author: @ajpiano
* Further changes, comments: @addyosmani
* Licensed under the MIT license
*/

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

  // undefined is used here as the undefined global
  // variable in ECMAScript 3 and is mutable (i.e. it can
  // be changed by someone else). undefined isn't really
  // being passed in so we can ensure that its value is
  // truly undefined. In ES5, undefined can no longer be
  // modified.

  // window and document are passed through as local
  // variables rather than as globals, because this (slightly)
  // quickens the resolution process and can be more
  // efficiently minified (especially when both are
  // regularly referenced in your plugin).

  // Create the defaults once
  // need to know - top container, ul class
  // can get top container, but ul classes are needed.
  var menumize = 'defaultMenumize',
    defaults = {
      // ul selectors for menus
      menus: {},
    };

  // The actual plugin constructor
  function Menumizer( element, options ) {
    this.element = element;

    // jQuery has an extend method that merges the
    // contents of two or more objects, storing the
    // result in the first object. The first object
    // is generally empty because we don't want to alter
    // the default options for future instances of the plugin
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = menumize;
    // Define properties for managing menus

    this.menuToDropDown = function(menu){
      // need to know: menu top container, menu ul class,
      console.log(menu);
      // get top parent container
      var topContainer = $(menu).parent();
      $(topContainer).append('<select/>');
      var menuItems = $(topContainer).find('li');
      $(menuItems).each(function() {
        var optionString = '<option value = "' + $('a', this).attr('href') + '" ';
          if($(this).hasClass('active')){
            optionString = optionString + 'selected="selected" '
          }
        optionString = optionString + '>' + $('a', this).text() + '</a>';
        $('select', topContainer).append(optionString); // @todo performance by compiling string and appending all at once
      });
      $(menu).remove();
    };

    this.init();
  }

  Menumizer.prototype.init = function () {
    // Place initialization logic here
    // You already have access to the DOM element and
    // the options via the instance, e.g. this.element
    // and this.options
    // alias self to base
    base = this;
    // get top container from ul class.
    // if empty object, then get all uls.
    menus = this.options.menus;
    if ($.isEmptyObject(this.options.menus)) {
      menus = $(this.element).find('ul');
      console.log(menus);
    }
    // convert each menu to dropdown.
    $(menus).each(function(index, menu){
      base.menuToDropDown(menu);
    });
    console.log(this);
    console.log(this.element);
    console.log(this.options);
    this.menuToDropDown('t');
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn.menumize = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + menumize)) {
        $.data(this, 'plugin_' + menumize,
          new Menumizer( this, options ));
      }
    });
  }

})( jQuery, window, document );