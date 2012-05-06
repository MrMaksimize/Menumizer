;(function ( $, window, document, undefined ) {
  var menumize = 'defaultMenumize',
    defaults = {
      // ul selectors for menus
      // menus that will be affected
      // contains smush and menumize objects
      menus: {},
      stateController: function() {
        var width = $(window).width();
        return width <= 500;
      }
      // must return TRUE for minimize, false for maximize
    };

  // The actual plugin constructor
  function Menumizer( element, options ) {
    this.options = $.extend( {}, defaults, options) ;
    this.element = element;
    this._defaults = defaults;
    this._name = menumize;
    this.menus = this.options.menus;
    this.state = '';
    this.prevState = '';
    this.stateController = this.options.stateController;

    this.menuToDropDown = function(singleMenu, smush) {
      smush = smush || false;
      if (smush == false) {
        var singleMenuParent = singleMenu.parentElement || $(singleMenu).parent();
        $(singleMenuParent).append('<select class="menumizer-select"/>');
        var menuItems = $(singleMenu).children('li');//$(singleMenuParent).find('li');
        //@todo - submenus <ul><li><ul><li></li></ul></li></ul>
        $('select', singleMenuParent).append(this.menuItemsToSelects(menuItems));
        $(singleMenu).addClass('menumizer-hidden').hide();
      }
      else {
        //Smushing
        var singleMenuParent = singleMenu[0].parentElement || $(singleMenu[0]).parent();
        $(singleMenuParent).append('<select class="menumizer-select"/>');
        var combinedSelects = '';
        for (var i in singleMenu) {
          var menuItems = $(singleMenu[i]).children('li');
          combinedSelects = combinedSelects + this.menuItemsToSelects(menuItems);
          $(singleMenu[i]).addClass('menumizer-hidden').hide();
        }
        $('select', singleMenuParent).append(combinedSelects);
      }
    };

    this.menuItemsToSelects = function(menuItems) {
      var allSelects = '';
      $(menuItems).each(function() {
        var optionString = '<option value = "' + $('a', this).attr('href') + '" ';
        if($(this).hasClass('active')){
          optionString = optionString + 'selected="selected" '
        }
        optionString = optionString + '>' + $('a', this).text() + '</a>';
        // @todo - deal with multiple selects
        allSelects = allSelects + optionString;
      });
      return allSelects;
    };

    this.dropDownToMenu = function () {
      $('.menumizer-select').remove();
      $('.menumizer-hidden').removeClass('menumizer-hidden').show();
    };

    this.getMenus = function () {
       // get top container from ul class.
      // if empty object, then get all uls.
      var menus = this.options.menus;
      if ($.isEmptyObject(menus)) {
        // Default to normal menumize as behavior
        var allMenus = $(this.element).find('ul');
        menus.menumize = {};
        console.log(allMenus);
        $(allMenus).each(function(index, singleMenu) {
          menus.menumize[index] = $(singleMenu, this.element);
        });
      }
      return menus;
    };

    this.init();
  }

  Menumizer.prototype.init = function () {
    this.menus = this.getMenus();
    this.state = this.stateController();
    this.prevState = this.state;
    // Determine initial state and react accordingly
    console.log(this);
    // Alias this to base
    var base = this;
    if (base.state == true) {
      console.log('menumize');
      for (var i in base.menus.menumize) {
        base.menuToDropDown(base.menus.menumize[i]);
      }
      for (var i in base.menus.smush) {
        base.menuToDropDown(base.menus.smush[i], true);
      }
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
          for (var i in base.menus.menumize) {
            base.menuToDropDown(base.menus.menumize[i]);
          }
          for (var i in base.menus.smush) {
            base.menuToDropDown(base.menus.smush[i], true);
          }
         }
        //end by making state prevState
        base.prevState = base.state;
      }
    });
  };

  $.fn.menumize = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + menumize)) {
        $.data(this, 'plugin_' + menumize,
          new Menumizer( this, options ));
      }
    });
  }

})( jQuery, window, document );
