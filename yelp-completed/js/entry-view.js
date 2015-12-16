(function(window, document, undefined) {
  var EntryView = {};

  /* Renders an entry into the given $entry element. Requires the object
   * representing the active entry (activeEntryData). If this object is null,
   * picks the first existing entry. If no entry exists, this view will display
   * the CreatingEntryView. */
  EntryView.render = function($entry, activeEntryData) {
    Util.loadEntries(function(entries) {
      // if no active entry was specified, pick the first one
      if (!activeEntryData && entries.length > 0) {
        activeEntryData = entries[0];
      } else if (!activeEntryData) {
        // no entires at all; switch to creating entry view
        CreatingEntryView.render($entry);
        return;
      }

      $entry.html(Util.renderEntry({
        viewing: true,
        entries: entries,
        activeEntryData: activeEntryData
      }));

      $entry.find('.new').click(function() {
        CreatingEntryView.render($entry);
      });

      $entry.find('.edit').click(function() {
        EditingEntryView.render($entry, activeEntryData);
      });

      $entry.find('.delete').click(function() {
        deleteEntry($entry, function() {
          EntryView.render($entry, null);
        });
      });

      handleEntrySelections($entry, entries);
      addGoogleMapToEntry($entry, activeEntryData);
    });
  };

  /* Deletes the given entry.
   *
   * Calls: callback() once finished.
   */
  function deleteEntry($entry, callback) {
    var id = $entry.find('.id').val();

    EntryModel.remove(id, function(error) {
      if (error) {
        Util.displayError(error); 
      } else {
        callback();
      }
    });
  }

  /* Changes the entry being displayed if the user selects a different one. */
  function handleEntrySelections($entry, entries) {
    var $select = $entry.find('select');
    $select.change(function() {
      var id = parseInt($select.val(), 10);
      var entryData = findEntryDataWithID(entries, id);
      
      if (entryData) {
        EntryView.render($entry, entryData);
      }
    });
  }

  /* Returns the entry with the given ID in the provided array of entries. */
  function findEntryDataWithID(entries, id) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].id === id) {
        return entries[i];
      }
    }

    return null;
  }

  /* Adds a Google Map to the $entry element with the provided entry data. */
  function addGoogleMapToEntry($entry, entryData) {
    GoogleMapView.render($entry.find('.map'), entryData);
  }

  window.EntryView = EntryView;
})(this, this.document);
