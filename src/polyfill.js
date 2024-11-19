/*
* required polyfills
*/
import "core-js";
import 'core-js/features/set/map';

/** IE9, IE10 and IE11 requires all of the following polyfills. **/

/** IE10 and IE11 requires the following for the Reflect API. */
 
/** Evergreen browsers require these. **/
// Used for reflect-metadata in JIT. If you use AOT (and only Angular decorators), you can remove.
 

// CustomEvent() constructor functionality in IE9, IE10, IE11
(function () {

  if ( typeof window.CustomEvent === "function" ) return false

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    let evt = document.createEvent( 'CustomEvent' )
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail )
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
})()
