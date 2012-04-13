;(function ( $, window, document, undefined ) {
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
      menus: {}, // menus that will be affected
      stateController: function() {
        // must return TRUE for minimize, false for maximize
        return $('body').hasClass('responsive-layout-mobile');
      }
    };

  // The actual plugin constructor
  function Menumizer( element, options ) {
    // jQuery has an extend method that merges the
    // contents of two or more objects, storing the
    // result in the first object. The first object
    // is generally empty because we don't want to alter
    // the default options for future instances of the plugin
    this.options = $.extend( {}, defaults, options) ;
    this.element = element;
    this._defaults = defaults;
    this._name = menumize;
    this.menus = this.options.menus;
    this.state = '';
    this.prevState = '';
    this.stateController = this.options.stateController;

    this.menuToDropDown = function(singleMenu){
      var singleMenuParent = singleMenu.parentElement || $(singleMenu).parent();
      $(singleMenuParent).append('<select class="menumizer-select"/>');
      var menuItems = $(singleMenuParent).find('li');
      $(menuItems).each(function() {
        var optionString = '<option value = "' + $('a', this).attr('href') + '" ';
          if($(this).hasClass('active')){
            optionString = optionString + 'selected="selected" '
          }
        optionString = optionString + '>' + $('a', this).text() + '</a>';
        // @todo - deal with multiple selects
        $('select', singleMenuParent).append(optionString); // @todo performance by compiling string and appending all at once
      });
      $(singleMenu).addClass('menumizer-hidden').hide();
    };

    this.dropDownToMenu = function () {
      $('.menumizer-select').remove();
      $('.menumizer-hidden').removeClass('menumizer-hidden').show();
    };

    this.getMenus = function () {
       // get top container from ul class.
      // if empty object, then get all uls.
      var menus = this.options.menus;
      if ($.isEmptyObject(menus)){
        menus = $(this.element).find('ul');
        return menus;
      }
      else {
        for (var menu in this.menus){
          alert('freakout'); // untested
          return menu;
        }
      }
    };
    this.init();
  }

  Menumizer.prototype.init = function () {
    // Place initialization logic here
    // You already have access to the DOM element and
    // the options via the instance, e.g. this.element
    //) and this.options
    this.menus = this.getMenus();
    this.state = this.stateController();
    this.prevState = this.state;
    // Determine initial state and react accordingly
    console.log(this);
    // Alias this to base
    var base = this;
    if (base.state == true) {
      console.log('menumize');
      $(base.menus).each(function(index, singleMenu){
        base.menuToDropDown(singleMenu);
      });
      base.prevState = true;
    }
    // convert each menu to dropdown.
    $(window).resize(function(){
      // Determine current state
      base.state = base.stateController();
      console.log($(window).width());
      if (base.prevState != base.state){
        if (base.state == false) {
          // UnMenumize
          console.log('unmenumize');
          base.dropDownToMenu();
        }
        else {
          // MenuMize
          console.log('menumize');
          $(base.menus).each(function(index, singleMenu) {
            base.menuToDropDown(singleMenu);
          });
         }
        //end by making state prevState
        base.prevState = base.state;
        console.log(base.processedMenus);
      }
    });
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
