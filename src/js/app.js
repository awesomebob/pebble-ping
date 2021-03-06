/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var Vibe = require('ui/vibe');
var Vector2 = require('vector2');
var Settings = require('settings');
var config = require('./config.json');

// Initial settings

Settings.data('player1', 'Player 1');
Settings.data('player1Score', 0);
Settings.data('player2', 'Player 2');
Settings.data('player2Score', 0);

var getBody = function(){
  var data = Settings.data();
  return data.player1 + ': ' + data.player1Score + "\n" + data.player2 + ': ' + data.player2Score;
}

var gameOver = function(winner){
  var card = new UI.Card();
  var data = Settings.data();
  card.title('Game Over');
  card.subtitle(Settings.data(winner) + ' wins!');
  card.body(getBody() + "\nLong Click to Post");
  Vibe.vibrate('short');

  card.on('longClick', 'down', function(e){
    var loser = '';
    var winnerScore = loserScore = 0;
    if (winner === 'player1'){
      loser = 'player2'
      winnerScore = 'player1Score';
      loserScore = 'player2Score';
    } else {
      loser = 'player1';
      winnerScore = 'player2Score';
      loserScore = 'player1Score';
    }
    ajax({ url: config.WEBHOOK_URL +
      Settings.data(winner) + '/' +
      Settings.data(winnerScore) + '/' +
      Settings.data(loser) + '/' +
      Settings.data(loserScore), method: 'post'
    });
    Vibe.vibrate('double');
    card.hide();
  });
  card.show();
}

var checkScore = function(){
  var player1Score = Settings.data('player1Score');
  var player2Score = Settings.data('player2Score');
  var highScore = 0, lowScore = 0;
  var winning = '';
  if (player1Score === player2Score) return;
  if (player1Score > player2Score){
    winning = 'player1';
    highScore = player1Score;
    lowScore = player2Score;
  } else {
    winning = 'player2';
    highScore = player2Score;
    lowScore = player1Score;
  }

  // Skunk
  if (highScore === 7 && lowScore === 0){
    gameOver(winning);
  }

  // Normal win
  if (highScore >= 11 && (highScore - lowScore) >= 2){
    gameOver(winning);
  }

}

var main = new UI.Card({
  title: 'Pebble Ping',
  icon: 'images/menu_icon.png',
  body: getBody(),
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

main.on('longClick', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Player 1'
      }, {
        title: 'Bob'
      }, {
        title: 'Jacob'
      }, {
        title: 'Timothy'
      }, {
        title: 'Guilherme'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex);
    console.log('The selection is titled "' + e.item.title + '"');
    Settings.data('player1', e.item.title);
    main.body(getBody());
    menu.hide();
  });
  menu.show();
});

main.on('longClick', 'down', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Player 2'
      }, {
        title: 'Bob'
      }, {
        title: 'Jacob'
      }, {
        title: 'Timothy'
      }, {
        title: 'Guilherme'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex);
    console.log('The selection is titled "' + e.item.title + '"');
    Settings.data('player2', e.item.title);
    main.body(getBody());
    menu.hide();
  });
  menu.show();
});

main.on('click', 'up', function(e) {
  Settings.data('player1Score', Settings.data('player1Score') + 1);
  main.body(getBody());
  checkScore();
});

main.on('click', 'down', function(e) {
  Settings.data('player2Score', Settings.data('player2Score') + 1);
  main.body(getBody());
  checkScore();
});

main.on('longClick', 'select', function(e) {
  Settings.data({
    player1Score: 0,
    player2Score: 0
  });
  main.body(getBody());
});

