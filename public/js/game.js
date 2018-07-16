document.getElementsByTagName('youtoo')[0].addEventListener('click',function(){
    this.style.display = "none";
});

function openPop(){
    document.getElementsByTagName('youtoo')[0].style.display = "block";
}
function closePop(){
    document.getElementsByTagName('youtoo')[0].style.display = "none";
}
toggleConnect('block');
function toggleConnect(option){
    document.getElementsByTagName('connect')[0].style.display = option;
}


var socket = io();

let gameID = location.pathname.split('/')[2];
let gameActive = false;

socket.on('game id',function(data){
    if(!localStorage.getItem('session_gameID'))
        localStorage.setItem('session_gameID',data.session_gameID);

    if(!localStorage.getItem('session_id'))
        localStorage.setItem('session_id',data.session_id);

    if(localStorage.getItem('session_gameID'))
        socket.emit('game state',localStorage.getItem('session_gameID'));

    if(localStorage.getItem('reg_username')) {
        socket.emit('game start', {
            session: localStorage.getItem('session_id'),
            keycode:  gameID || localStorage.getItem('session_gameID'),
            name: localStorage.getItem("reg_username")
        });
    }
    socket.emit('private name', localStorage.getItem('reg_username'));
});


socket.on('game start',function(data){
   // console.log(data,"{ -- GAME START! }");
});


if(!localStorage.getItem('reg_username')){
    $(".userRegister").show();
}


function userSet() {
    localStorage.setItem('reg_username',$("input[name=username]").val());
    if($("input[name=username]").val()!== "") {
        $(".userRegister").hide();
        socket.emit('game start', {
            session: localStorage.getItem('session_id'),
            keycode: gameID ||  localStorage.getItem('session_gameID'),
            name: localStorage.getItem("reg_username")
        });

    }else{
        return;
    }
}




socket.emit('game listen', gameID);

let connectData = "";
socket.on('game listen already',function(){
   toggleConnect('none');
});
socket.on('game listen',function(data){
    if(data.gameUsers.length === 2){
        socket.emit('game listen stop','');
        connectData = data;
    }

});
socket.on('game listen stop',function(data){
    console.log(data);
    $('#us-0').html(connectData.gameUsers[0].userDisplayName);
    $('#us-1').html(connectData.gameUsers[1].userDisplayName);
    $('#rightG').addClass('active');
    $time = 3;
    let timeInterval = setInterval(function(){
        $('#vsTime').html(--$time);
        if($time <= 0) {
            clearInterval(timeInterval);
            toggleConnect('none');
            $('.user-icon').addClass('active');
            $('#uL').html(connectData.gameUsers[0].userDisplayName);
            $('#uR').html(connectData.gameUsers[1].userDisplayName);
            if(connectData.gameUsers[0].userID === localStorage.getItem('session_id')){
                $('.user-left').css({"border":"5px solid skyblue"});
                openPop();
            }
            if(connectData.gameUsers[1].userID === localStorage.getItem('session_id')){
                $('.user-right').css({"border":"5px solid skyblue"});
            }




        }
    },1000);
});




socket.on('game room full',function(data){
    $('error').show(.5);
    localStorage.removeItem('session_gameID');
    setTimeout(function(){
        window.location = `http://${window.location.hostname}:8000`;
    },7000);
});

/*
*  ==============================
*  ==============================
* */

let images = [
    "https://www.ahenklaboratuvari.com.tr/wp-content/uploads/2017/09/ahenk-wallpaper-300x300.jpg",
    "http://www.desktop-screens.com/data/out/8/2535069-atom-wallpapers.png",
    "https://www.listefit.com/wp-content/uploads/2017/10/Astronot-D%C3%BCnya-G%C3%BCne%C5%9F-Sistemi-Foto%C4%9Fraf%C4%B1-Telefon-Wallpaper-300x300.jpg",
    "http://androidpapers.co/wp-content/uploads/papers.co-af83-joystick-ps3-sony-art-crack-illust-game-1-wallpaper-300x300.jpg",
    "http://www.wallpaper4mobile.com/graphics/thumbnails/full/big/far-away-sunset-004.jpg",
    "http://www.qygjxz.com/data/out/194/4205865-rasta-wallpaper.png",
    "http://www.desktop-screens.com/data/out/32/2764386-diamond-wallpapers.png",
    "http://www.latestseotutorial.com/wp-content/uploads/2017/09/Wallpaper-300x300.jpg"
];

let checkup = {};
for(let a = 0;a<16;a++){
    checkup[a] = null;
}

let game = [
    images[7],
    images[6],
    images[5],
    images[4],
    images[3],
    images[2],
    images[1],
    images[0],

    images[0],
    images[1],
    images[2],
    images[3],
    images[4],
    images[5],
    images[6],
    images[7],
];



for(let l = 0; l < images.length; l++){

    let random = Math.floor(Math.random() * 16);
    let id = Math.floor(Math.random() * 16);
    checkup[id] = random;
}



for(let i = 0;i<game.length;i++){
    $card = ` <div class="card sutun" data="${i}"></div>`;
    $('#collection').append($card);
}

$opencard = 0;
$ops = [];
$state = true;
$pasif = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjc272XO3L-WYB2FDGbQkL2yINiYhX6OwHyJ0oXdUVglkvNduQ';
$(".card.sutun").click(function(ev){

    $sx = $ops[0] == null ? null : $ops[0].getAttribute('data');
    if($state && $sx !== ev.target.getAttribute('data') ){


        closePop(); // first click after close
        ev.target.classList.add('active');
        $opencard++;
        if(($opencard === 2)){


            $state = false;
            setTimeout(function(){
                $ops.map((item)=>{
                    item.style.backgroundImage = `url('${$pasif}')`;
                    item.classList.remove('active');
                });
                $opencard = 0;
                $ops = [];
                $state = true;
                openPop();

            },2000);

        }
         $ops.push(ev.target);
         $cardClickID = ev.target.getAttribute('data');
         socket.emit(`game card request`, {
             cardClickId: $cardClickID,
             gameClickID: gameID
         });

         //socket.emit(`game start id ${gameID}`,gameID);

        $(this).css({"background-image":"url('"+game[ev.target.getAttribute('data')]+"')"});
    }


});

socket.on('game card request',(xs)=>{
    console.log(xs);
});