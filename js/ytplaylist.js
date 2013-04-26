(function( $, undefined ) {
  $.fn.ytPlaylist = function(options) {
  
  	var settings = $.extend( {
  		'playlist' : 'PLDFmQ1Ea1sUXBNTLloUE6T0iSs5Xt97Ig',
  	}, options);

  	var request = 'https://gdata.youtube.com/feeds/api/playlists/' + settings.playlist + '?alt=json'
    
    var getJSON = function(request) {
    	$.ajax({
  			url: request,
  			dataType: 'json',
  			success: function(response){
    			successCallback(response);
  			},
  			error: function(jqXHR, textStatus, errorThrown){
  				console.log(textStatus);
  			},
    	});
    }	

    var successCallback = function(json){
    	console.log(json);
    }

	getJSON(request);


  };
})( jQuery );