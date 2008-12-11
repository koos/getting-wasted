GoogleMap = {
	map: null,
	zoom: 3,
	playing:false,
	initialize: function(options) {
		this.options = options || {};
		this.map = new GMap2(document.getElementById(this.options.element || "map"));
		this.map.addControl(new GLargeMapControl());
    this.map.addControl(new GOverviewMapControl());
    this.map.addControl(new GScaleControl());
    this.map.addControl(new GMapTypeControl());
		this.map.enableDoubleClickZoom();
		this.map.enableScrollWheelZoom();
		this.map.enableGoogleBar();
		this.center(new GLatLng((this.options.latitude || 50.9455811), (this.options.longitude || 6.9207192)), (this.options.zoom || 3));
	}, 
	center: function(latlong,zoom) {
		this.map.checkResize();
		this.map.setCenter(latlong, (zoom || this.zoom));
	},
	zoom: function(level) {
		this.zoom = level;
		this.map.setZoom(level);
	},
	createMarkerForTweet: function(tweet) {
		var icon = new GIcon();
		icon.image = "/drinks.png";
		icon.shadow = "/shadow.png";
		icon.iconSize = new GSize(21, 31);
		icon.shadowSize = new GSize(52, 29);
		icon.iconAnchor = new GPoint(9, 33);
		icon.infoWindowAnchor = new GPoint(20, 1);
		        
		var posn = new GLatLng(tweet.latitude,tweet.longitude);
		var marker =  new GMarker(posn,{"title":tweet.overlay_body, "icon":icon});
		this.map.addOverlay(marker); 
		GEvent.addListener(marker, 'click', function() { marker.openInfoWindowHtml(tweet.overlay_body)  } );
		return marker;
	},
	addTweetMarkers: function(tweets) {
		tweets.each(function(tweet){
			this.createMarkerForTweet(tweet);
		},this);
	},
	loadTweet: function() {
		if(!GoogleMap.playing) { return false;}
		
		new Ajax.Request('/random', { method:'get', 
			onSuccess : function(transport) {
				if(!GoogleMap.playing) { return }
				GoogleMap.removeAllMarkers();
				var tweet = transport.responseText.evalJSON();
				var marker = GoogleMap.createMarkerForTweet(tweet);
				marker.openInfoWindowHtml(tweet.overlay_body);
				window.setTimeout(GoogleMap.loadTweet,2000);
			}, 
			parameters: {current_tweet: null}});	
	},
	play: function() {
		this.playing = true
		this.zoom(10);
		this.loadTweet();
	},
	stop: function() {
		this.playing = false;
		window.clearTimeout(GoogleMap.loadTweet);
	},
	removeAllMarkers: function() {
		this.map.closeInfoWindow();
		this.map.clearOverlays();
	}
};