<!DOCTYPE html>
<html>
	<head>
		<title>snailrace</title>
		<meta charset="utf-8">
		<link href="css/style.css" media="screen" rel="stylesheet" type="text/css">
	</head>
	<body>
		<button id="changecamera" class="btn btn-small-orange">devCam: false</button>
		<div id="gameOverInput">
			<div class="inputElement">
				<span class="displayTime">time:</span>
				<span class="displayTime" id="timeElapsed"></span>
			</div>
			<div class="inputElement">
				<input id="playerName" placeholder="Your name"></input>
			</div>
			<div class="inputElement">
				<button id="highscoreBtn" class="btn btn-small-orange">submit</button>
			</div>
		</div>
		<div id="loadingBar">Loading..</div>
		<div id="lobbyContainer">
			<div id="lobbyContent">
				<?php
					// Open the file for reading 
					$fp = fopen("counterlog.txt", "r"); 
					// Get the existing count 
					$count = fread($fp, 1024); 
					// Close the file 
					fclose($fp); 
					// Add 1 to the existing count 
					$count = $count + 1; 
					// Display the number of hits 
					echo "<div id='counter'>Page views: " . $count . "</div>"; 
					// Reopen the file and erase the contents 
					$fp = fopen("counterlog.txt", "w"); 
					// Write the new count to the file 
					fwrite($fp, $count); 
					// Close the file 
					fclose($fp); 
				?>
				<div id="contentWrapper">
					<div id="highContainer" class="contentElement">
						<div id="contentHeader">Highscore:</div>
						<div id="high"></div>
					</div>
					<div id="controls" class="contentElement">
						<div id="contentHeader">Controls:</div>
						<div class="fLeft">Player 1: <div class="key">Q</div></div>
						<div class="fRight special">Player 4: <div class="key">P</div></div>
						<div class="clearfix"></div>
						<div class="fLeft sub special">Player 2: <div class="key">C</div></div>
						<div class="fRight sub">Player 3: <div class="key">N</div></div>
						
					</div>
					<div class="contentElement">
						<button id="startgame" class="btn btn-green btn-disabled" disabled>Start Game</button>
					</div>
				</div>
				<div id="playerContainer">
					<div id="playerCounterContainer">
						<button id="playerAdd" class="countChange">add</button>
						<div id="playerCount">2</div>
						<button id="playerRemove" class="countChange">remove</button>
					</div>
					<h3>Player</h3>
				</div>
			</div>
			<div id="impressum">by
				<a href="https://twitter.com/rocketshape" title="webpumpkin blog">David Neubauer</a> and
				Joscha Probst
			</div>
		</div>

		
		
		<!-- vendor -->
		<script src="js/vendor/three.min.js"></script>
		<script src="js/vendor/jquery-1.10.1.js"></script>
		<script src="js/vendor/jquery-ui-1.10.3.custom.min.js"></script>
		<script src="js/vendor/tween.min.js"></script>
		<script src="js/vendor/TrackballControlls.js"></script>
		<script src="js/vendor/MTLLoader.js"></script>
		<script src="js/vendor/OBJLoader.js"></script>
		<script src="js/vendor/OBJMTLLoader.js"></script>
		<script src="js/vendor/Detector.js"></script>
		<script src="js/vendor/THREEx.KeyboardState.js"></script>
		<script src="js/vendor/THREEx.FullScreen.js"></script>
		<script src="js/vendor/THREEx.WindowResize.js"></script>
		<script src="js/vendor/helvetiker_regular.typeface.js"></script>
		<!-- game scripts -->
		<script type="text/javascript" src="js/gameController.js"></script>
		<script type="text/javascript" src="js/modelController.js"></script>
		<script type="text/javascript" src="js/floorController.js"></script>
		<script type="text/javascript" src="js/main.js"></script>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-44526177-1', 'mediacube.at');
  ga('send', 'pageview');

</script>
	</body>
</html>
