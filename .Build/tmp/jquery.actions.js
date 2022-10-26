/**
* @module @tyler.thayn/jquery.actions
*/
define('jquery.actions', ['jquery'], ($) => {

	/** ActionHandler Callback
	* @callback ActionHandler
	* @param {Event} event
	* @param {...*} [args]
	*/

	$.fn.extend({

		/** Trigger Action for element
		* @memberof jQuery#
		* @function Action
		* @param {string} name - Name of action to trigger
		* @param {...*} [args] - Args to pass to action handler
		*/
		Action: function (name, ...args) {
			this.each((i, e) => {
				$(e).triggerHandler('action.'+name, args)
			})
		},

		/** Register ActionHandler for element
		* @memberof jQuery#
		* @function ActionHandler
		* @param {string} name - Action name to handle
		* @param {ActionHandler} fn - Handler function
		*/
		ActionHandler: function (name, fn) {
			this.each((i, e) => {
				$(e).on('action.'+name, {action: name}, (event, ...args) => {
					fn.call(e, ...args)
				})
			})
		}
	})


	$.extend({
		ActionHandlers: {
			Hide: function (effect, cb = () => {}) {
				$(this).hide(effect, () => {
					$(this).triggerHandler('hidden')
					cb()
				})
			},
			Show: function (effect, cb = () => {}) {
				$(this).show(effect, () => {
					$(this).triggerHandler('shown')
					cb()
				})
			},
			Toggle: function (effect, cb = () => {}) {
				$(this).toggle(effect, () => {
					$(this).triggerHandler(this.style.display && this.style.display == 'none' ? 'hidden' : 'shown')
					cb()
				})
			}
		}
	})

})
