##Menumizer

Menumizer is a simple jQuery library for making menus responsive.  The idea is to convert all menus within a given element into `<select>` list to make them easier to use on the device.  

Menumizer works by taking three main parameters:

`stateController` - callback function that takes the `minPoint` paramter and determines whether the menus should be converted to selects, or should they be converted back to regular menus.  Defaults to being triggered on window wize <= `minPoint`

`minPoint` - an integer determining when the menumizer would trigger

`menumize` - an object containing jQuery objects of the menus to be converted UL.  

`smush` - an object containing objects that contain menus that need to be merged together when converted.

