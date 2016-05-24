var showTVButton;
var showVideoButton;
var showIFrameVideoTagButton;
var showYouTubeIFrameButton;

var iframeDiv;
var youtubeDiv;

function initialize(){

	showTVButton = document.getElementById('showTV');
	showVideoButton = document.getElementById('showVideo');
	showIFrameVideoTagButton = document.getElementById('showIFrameVideoTag');
	showYouTubeIFrameButton = document.getElementById('showYouTubeIFrame');

	iframeDiv = document.getElementById('iframeVideoContainer');
	youtubeDiv = document.getElementById('youTubeVideoContainer');
	tizenDiv = document.getElementById('tizenVideoContainer');
	
}

var currentWatching = 'tv';

function stopCurrentWatching(callback){

	if(currentWatching == 'tv'){
		tizenSetSource('AV', function(){
			if(callback){
				callback();
			}
		});
		return;
	}else if(currentWatching == 'video'){

		try{
			webapis.avplay.stop();
			webapis.avplay.close();
		}catch(e){
			console.log(e);
		}

		while (tizenDiv.firstChild) {
		    tizenDiv.removeChild(tizenDiv.firstChild);
		}

		if(callback){
			callback();
		}

		return;

	}else if(currentWatching == 'iframe'){

		while (iframeDiv.firstChild) {
		    iframeDiv.removeChild(iframeDiv.firstChild);
		}
		if(callback){
			callback();
		}
		return;

	}else if(currentWatching == 'youtube'){

		if(youtubePlayer){
			youtubePlayer.stopVideo();

		}

		while (youtubeDiv.firstChild) {
		    youtubeDiv.removeChild(youtubeDiv.firstChild);
		}
		if(callback){
			callback();
		}
		return;
	}


}

function switchTV(){

	if(currentWatching == 'tv'){
		return;
	}else{
		stopCurrentWatching(function(){
			tizenSetSource('TV', function(){

			});
		});
		currentWatching = 'tv';
	}


}

function exitApp(){
	switchTV();
	setTimeout(function(){
		try{
			tizen.application.getCurrentApplication().exit();
		}catch(e){
			console.log(e);
		}
		
	},1000);

}

function switchVideo(){
	if(currentWatching == 'video'){
		return;
	}else{
		stopCurrentWatching(function(){

			//<object id='av-player' type='application/avplayer' style="width:700px;height:700px;position:relative;"></object>
			var tizenPlayer = document.createElement('object');
			tizenPlayer.id = 'av-player';
			tizenPlayer.setAttribute("type", "application/avplayer");
			tizenPlayer.setAttribute("style", "width:960px;height:540px;position:relative;");
			tizenDiv.appendChild(tizenPlayer);

			setTimeout(function(){
				try{
					webapis.avplay.open("http://www.w3schools.com/html/mov_bbb.mp4");
					webapis.avplay.prepare();	
				
					//var avPlayerObj = document.getElementById("av-player");	
					webapis.avplay.setDisplayRect(400, 0, 960, 540);
					webapis.avplay.play();
				}catch(e){
					console.log(e);
				}
				
			},1000);

			
		});

		currentWatching = 'video';
	}
}

function switchIframe(){
	if(currentWatching == 'iframe'){
		return;
	}else{
		stopCurrentWatching(function(){

			var iframeObj = document.createElement('iframe');

			iframeDiv.appendChild(iframeObj);

			iframeObj.src = './html/iframe.html';
			iframeObj.className = 'videoFrame';

			currentWatching = 'iframe';
		});

	}
}

function switchYouTube(vId){
	//if(currentWatching == 'youtube'){
		//return;
	//}else{
		stopCurrentWatching(function(){

			var youtubeObj = document.createElement('div');
			youtubeObj.id = 'youtubePlayer';

			youtubeDiv.appendChild(youtubeObj);
			youtubeObj.className = 'videoFrame';
			
			setTimeout(function(){
				console.log("loadYouTubeVideo");
				loadYouTubeVideo(vId);
			},1000);
			
			

		});
		currentWatching = 'youtube';
		window.scrollTo(0, 0);

	//}
}



function tizenSetSource(sourceName, callback){

	sourceName = sourceName || 'TV';

	var connectedVideoSources;
	  function successCB(source, type) {
	      console.log("setSource() is successfully done. source name = " + source.name + ", source port number = " + source.number);
	  	if(callback){
	  		callback();
	  	}
	  }

	  function errorCB(error) {
	      console.log("setSource() is failed. Error name = "+ error.name + ", Error message = " + error.message);
	  }

	  function systemInfoSuccessCB(videoSource) {
	      connectedVideoSources = videoSource.connected;
	      for (var i = 0; i < connectedVideoSources.length; i++) {
	          console.log("--------------- Source " + i + " ---------------");
	          console.log("type = " + connectedVideoSources[i].type);
	          console.log("number = " + connectedVideoSources[i].number);
	          if (connectedVideoSources[i].type === sourceName) {
	              // set HDMI as input source of TV hole window
	              tizen.tvwindow.setSource(connectedVideoSources[i], successCB, errorCB);
	              break;
	          }
	      }
	      disconnectedSources = videoSource.disconnected;
		  for(var j = 0; j < disconnectedSources.length; j++){
		  	console.log("--------------- disconnected Source " + i + " ---------------");
		      console.log("type = " + disconnectedSources[i].type);
		      console.log("number = " + disconnectedSources[i].number);
		      console.log(disconnectedSources[i]);
		      if (disconnectedSources[i].type === sourceName){//"HDMI") {
		          // set HDMI as input source of TV hole window
		          tizen.tvwindow.setSource(disconnectedSources[i], successCB, errorCB);
		          break;
		      }
		  }
	  }

	  function systemInfoErrorCB(error) {
	      console.log("getPropertyValue(VIDEOSOURCE) is failed. Error name = "+ error.name + ", Error message = " + error.message);
	  }

	  try {
	      tizen.systeminfo.getPropertyValue("VIDEOSOURCE", systemInfoSuccessCB, systemInfoErrorCB);
	  } catch (error) {
	      console.log("Error name = "+ error.name + ", Error message = " + error.message);
	      if(callback){
	  		callback();
	  	}
	  } 
}

var youtubeScriptLoaded = false;
var youtubePlayer = false;
function loadYouTubeVideo(vId){
	  // 1. The <iframe> (and video player) will replace this <div> tag. -->

      // 2. This code loads the IFrame Player API code asynchronously.

      if(!youtubeScriptLoaded){
      	var tag = document.createElement('script');

	      tag.src = "https://www.youtube.com/iframe_api";
	      var firstScriptTag = document.getElementsByTagName('script')[0];
	      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      window.onYouTubeIframeAPIReady = function() {
      	console.log("onYouTubeIframeAPIReady");
        player = new YT.Player('youtubePlayer', {
          height: '540',
          width: '960',
          videoId: vId,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
        youtubeScriptLoaded = true;
        youtubePlayer = player;
      }

      if(youtubeScriptLoaded){
      	window.onYouTubeIframeAPIReady();
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
      	console.log("onPlayerReady");
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      function onPlayerStateChange(event) {

      }
      function stopVideo() {
        player.stopVideo();
      }
}