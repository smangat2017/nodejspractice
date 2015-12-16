(function(window, document, undefined) {
  var GoogleMapView = {};
  
  // zoom level for Google Map
  var DEFAULT_ZOOM = 14;
  var STATUS_OK = 200;

  /* Renders a map for the given entry into the provided $map element. */
  GoogleMapView.render = function($map, entryData) {
    var request = new XMLHttpRequest();
  
    request.addEventListener('load', function() {
      if (request.status === STATUS_OK) {
        // display the map once geocoding finishes
        var location = JSON.parse(request.responseText);
        displayMap($map, location, entryData);
      } else {
        Util.displayError('Could not load the Google Maps data.');
      }
    });
  
    // geocode the address
    request.open('GET', 'http://maps.googleapis.com/maps/api/geocode/json?address=' +
      entryData.address + '&sensor=false', true);
    request.send();
  };

  /* Displays the map in the given $map element. Centers the map around the
   * provided location, returned from the geocoding API. Requires the entry
   * data to display a map tooltip. */
  function displayMap($map, location, entryData) {
    location = location.results[0].geometry.location;
    var latlng = new google.maps.LatLng(location.lat, location.lng);

    var mapOptions = {
      center: latlng,
      zoom: DEFAULT_ZOOM,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // add map and marker at the given address
    var map = new google.maps.Map($map[0], mapOptions);
    new google.maps.Marker({
        position: latlng,
        map: map,
        title: entryData.description
    }); 
  }
  
  window.GoogleMapView = GoogleMapView;

})(this, this.document);
