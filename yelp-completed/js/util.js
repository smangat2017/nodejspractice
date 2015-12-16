(function(window, document, undefined) {
  var Util = {};
  var $notification = $('#notification');

  var $entryTemplate = $('#entry-template');
  Util.renderEntry = Handlebars.compile($entryTemplate.html());

  /* Fetches an object with entry data from the $entry element. */
  Util.getEntryDataFromElement = function($entry) {
    return {
      id: parseInt($entry.find('.id').val(), 10),
      name: $entry.find('.feature input').val(),
      address: $entry.find('.address input').val(),
      description: $entry.find('.description textarea').val()
    };
  };

  /* Fetches all entries from the server.
   *
   * Calls: callback(entries)
   *  entries -- a list of entries
   */
  Util.loadEntries = function(callback) {
    EntryModel.loadAll(function(error, entries) {
      if (error) {
        Util.displayError('Failed loading entries.');
      } else {
        callback(entries);
      }
    });
  };

  /* Displays a notification message with the given text. */
  Util.displayError = function(text) {
    $('.error').text(text);
  };

  window.Util = Util;
})(this, this.document);
