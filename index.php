<html>
  <head>
    <title>BreakIn 1.0</title>
    <style>
    
      body
          {
          background: #a6a6a6;
          font-family: Verdana, Tahoma, sans-serif;
          font-size: 11px;
          text-align: center;
          }
          
      h1
          {
          font-size: 11px;
          font-weight: bold;
          }
    
      #container
          {
          margin: 40px auto 0 auto;
          padding: 0;
          width: 793px;
          }
    
      #top
          {
          width: 793px;
          height: 8px;
          background: url(images/top.gif);
          font-size: 0;
          }
          
      #header
          {
          width: 793px;
          text-align: center;
          }
      
      #main
          {
          width: 793px;
          background: #fff;
          }
          
      .third
          {
          float: left;
          text-align: center;
          width: 33%;
          padding: 20px 0 20px 0;
          margin: 0;
          }
          
      .third ul
          {
          list-style: none;
          padding: 0;
          margin: 0;
          color: grey;
          }

      #bottom
          {
          width: 793px;
          height: 8px;
          background: url(images/bottom.gif);
          font-size: 0;
          }
          
      #copyright
          {
          text-align: center;
          padding: 20px;
          }
    
    </style>
    <script language="Javascript">
    
      function game() {
        var windowGame = window.open('game.html', 'BreakIn', 'height=238, width=550');
        if (window.focus) {
          windowGame.focus()
        }
      }
    
    </script>
    
  </head>
  <body>
  
    <div id="container">
      <div id="top"></div>
      <div id="main">
        <div id="header"><img src="images/BreakInBunny.png" alt="BreakIn Bunny" /></div>
        <div class="third">
          <h1>Supported Browsers</h1>
          <ul>
            <li>Safari 2.0.3 - OS X</li>
            <li>Camino 1.0 - OS X</li>
            <li>Firefox 1.5 - Windows</li>
            <li>Internet Explorer 7 - Windows</li>
          </ul>
        </div>
        <div class="third">
          <h1>High Scores</h1>
          <?php include('include/score.php'); ?>
        </div>
        <div class="third">
          <a
            onMouseOver="document.getElementById('play').src='images/play.png';"
            onMouseOut="document.getElementById('play').src='images/play-grey.png';" 
            href="javascript:game()">
            <img id="play" src="images/play-grey.png" style="border: 0" />
          </a>
        </div>
        <div style="clear: both;"></div>
      </div>
      <div id="bottom"></div>
    </div>
    <div id="copyright">
      &copy; 2006, Jason Barrie Morley, Shawn Erin Leedy
    </div>
  
  </body>
</html>
