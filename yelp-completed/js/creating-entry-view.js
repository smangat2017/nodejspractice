(function(window, document, undefined) {
  var CreatingEntryView = {};

  /* Renders a view to allow the user to create an entry. Requires the $entry
   * element. */
  CreatingEntryView.render = function($entry) {
    $entry.html(Util.renderEntry({
      creating: true,
      entries: null,
      activeEntryData: null
    }));

    $entry.find('.add').click(function() {
      createEntry($entry, function(entryData) {
        EntryView.render($entry, entryData);
      });
    });
  };

  /* Creates an entry from the contents in the given $entry element.
   *
   * Calls: callback(entryData)
   *  entryData -- an object representing the entry just added
   */
  function createEntry($entry, callback) {
    var entryData = Util.getEntryDataFromElement($entry);

    EntryModel.add(entryData, function(error, entryWithID) {
      if (error) {
        Util.displayError(error);
      } else {
        callback(entryWithID);
      }
    });
  }

  window.CreatingEntryView = CreatingEntryView;
})(this, this.document);
