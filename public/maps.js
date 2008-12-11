GoogleMap = {
	map: null,
	zoom: 3,
	initialize: function(options) {
		this.options = options || {};
		this.map = new GMap2(document.getElementById(this.options.element || "map"));
		this.map.addControl(new GLargeMapControl());
    this.map.addControl(new GOverviewMapControl());
    this.map.addControl(new GScaleControl());
    this.map.addControl(new GMapTypeControl());
		this.map.enableDoubleClickZoom();
		this.center(new GLatLng((this.options.latitude || 50.9455811), (this.options.longitude || 6.9207192)), (this.options.zoom || 2));
	}, 
	center: function(latlong,zoom) {
		this.map.checkResize();
		this.map.setCenter(latlong, (zoom || this.zoom));
	},
	zoom: function(level) {
		this.zoom = level;
	},
	createMarkerForTweet: function(tweet) {
		var icon = this.options.icon || "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png";
		var posn = new GLatLng(tweet.latitude,tweet.longitude);
		var marker =  new GMarker(posn,{title:tweet.overlay_body});
		this.map.addOverlay(marker); 
		GEvent.addListener(marker, 'click', function() { marker.openInfoWindowHtml(tweet.overlay_body)  } );
		return marker;
	},
	addTweetMarkers: function(tweets) {
		tweets.each(function(tweet){
			this.createMarkerForTweet(tweet);
		},this);
	},
	play: function() {
		
	},
	stop: function() {
		
	},
	removeAllMarkers: function() {
		this.markerManager.clearMarkers();
	}
};