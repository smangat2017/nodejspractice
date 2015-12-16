(function(window, document, undefined) {
  var EditingEntryView = {};

  /* Renders a view to allow the user to edit an entry. Requires the $entry
   * element and an object representing the active entry. */
  EditingEntryView.render = function($entry, activeEntryData) {
    $entry.html(Util.renderEntry({
      editing: true,
      entries: null,
      activeEntryData: activeEntryData
    }));

    $entry.find('.update').click(function() {
      updateEntry($entry, function(entryData) {
        EntryView.render($entry, entryData);
      });
    });
  };

  /* Updates the given entry with the user inputted data.
   *
   * Calls: callback(entryData)
   *  entryData -- an object representing the updated entry
   */
  function updateEntry($entry, callback) {
    var updatedEntryData = Util.getEntryDataFromElement($entry);

    EntryModel.update(updatedEntryData, function(error) {
      if (error) {
        Util.displayError(error);
      } else {
        callback(updatedEntryData);
      }
    });
  }

  window.EditingEntryView = EditingEntryView;
})(this, this.document);
