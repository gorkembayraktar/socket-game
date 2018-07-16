const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8000;

const path = require('path');
const bodyParser = require('body-parser');
const functions = require('./controller/functions');

app.use('/public',require('express').static(path.join(__dirname,'public')));




let primary_game_key = 0;

let data = {
    games: [
        // json formatında data
    ]
};
let arr = ["link1","link2","kamil"];
let startGames = [];
let data_find = {};



app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"/public/html/index.html"));
});

app.get('/game',(req,res)=>{res.redirect('/');});
app.get('/game/:invite',(req,res)=>{

    const result = arr.indexOf(req.params.invite);
    if(result !== -1){
        let filter = data.games.find(item => item.gameKey === arr[result]);
        //res.jsonp(filter);
        res.sendFile(path.join(__dirname,"/public/html/game.html"));
        data_find = filter;


        var loc = data.games.find(item =>item.gameKey === req.params.invite);
        if(loc !== {} ) {
            if(loc.gameUsers.length === 2){
                console.log('aktif üylere mevcut');
            }

        }
    }
    else {

        res.sendFile(path.join(__dirname, "/public/html/p404.html"));
    }

});
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());





app.get('*', function(req, res){
    res.sendFile(path.join(__dirname,"/public/html/p404.html"), 404);
});


io.on('connection', function(socket){
    let primary_id = 0;
    let primary_gameID = null;
    let privateName = "";





    socket.on("private name" , function(nx){
        privateName = nx;
    });

    app.post('/', function(req, res) {


        if(req.body.game_key)
            return res.redirect(`/game/${req.body.game_key}`);

        let gameKey = functions.createKey();

        primary_game_key = gameKey;

        data.games.push(functions.gameCreate(gameKey,socket.id));
        arr.push(gameKey);


        res.redirect(`/game/${gameKey}`);

    });


    socket.emit('game id',{
                            session_id:socket.id,
                            session_gameID:primary_game_key});


    socket.on('game state',function(result){

        var findID = data.games.find(item =>item.gameKey === result);

        if(findID !== {} ) {
            socket.emit('game state', findID);
        }
    });

    socket.on("game start",function(result){

        let error = false;
        for(let i = 0;i < data.games.length;i++){
            if(data.games[i].gameKey === result.keycode){

                   if(data.games[i].gameUsers.length === 2){

                       if(data.games[i].gameUsers[0].userID !== result.session
                        && data.games[i].gameUsers[1].userID !== result.session){

                           socket.emit('game room full',true);
                           console.log('3. oyuncu dahil oldu');
                           break;

                       }
                   }

                   data.games[i].gameViewCount += 1;
                   if(data.games[i].gameUsers.length > 0){
                       for(let b = 0;b< data.games[i].gameUsers.length;b++){
                           if(data.games[i].gameUsers[b].userID === result.session  ){
                               // controll start game
                              if(startGames.indexOf(data.games[i].gameKey) !== -1) {
                                  socket.emit('game listen already', {});
                              }
                                console.log('aynı data giriş yaptı');
                                error = true;
                                break;
                           }

                       }

                   }


               if(error) break;

                data.games[i].gameUsers.push({
                    userID : result.session,
                    userDisplayName: result.name,
                    userLogin: Date.now(),
                    userScor: 0,
                    userRequest: 999
                });
                data.games[i].gameUserCount += 1;
                // eğer 1 kişi
                if(data.games[i].gameUsers.length === 2){

                    // oyun başladıktan 10 saniye sonra ekle
                    setTimeout(function() {
                        startGames.push(data.games[i].gameKey);

                    },7000);

                }

                break;
            }
        }
        let send = data.games.find(item => item.gameKey === result.keycode);
        socket.emit('game start', send);

    });

    let listenInterval;
    socket.on('game listen',function(fs){
       listenInterval = setInterval(function() {
            let send = data.games.find(item => item.gameKey === fs);
            socket.emit('game listen', send);
        },1000);

    });
    socket.on('game listen stop',function(fs){
        clearInterval(listenInterval);
        socket.emit('game listen stop','CONNECTED');
    });


    socket.on('game card request',(id)=>{
        console.log(id);
        socket.emit('game card request',id);
    });


    /*for(let sx = 0 ; sx < startGames.length;sx++){
        socket.on(`game start id ${startGames[sx]}`,(card)=>{
            console.log(card);
            //socket.emit(`game start id ${startGames[sx]}`,card);
        });
    }*/



    socket.on('disconnect', function(){
        socket.emit('connect users',arr);
        console.log('user disconnected');
    });



});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
