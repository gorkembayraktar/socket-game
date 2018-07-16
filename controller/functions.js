
const gameCreate = (gameKey,gameSessionID) => {


   let json  = {
       gameWon: null,
       gameOrder: 0,
       gameKey: gameKey,
       gameSessionID : gameSessionID,
       gameUserCount: 1,
       gameStatus: {
           start: true,
           stop: false,
           stopTime: Date.now()
       },
       gameUsers : [],
       gameCards: {
           0: {
               id : 7,
               open : false,
           },
           1: {
               id : 4,
               open : false,
           },
           2: {
               id : 5,
               open : false,
           },
           3: {
               id : 1,
               open : false,
           },
           4: {
               id : 3,
               open : false,
           },
           5: {
               id : 2,
               open : false,
           },
           6: {
               id : 0,
               open : false,
           },
           7: {
               id : 6,
               open : false,
           },

           8: {
               id : 5,
               open : false,
           },
           9: {
               id : 4,
               open : false,
           },
           10: {
               id : 7,
               open : false,
           },
           11: {
               id : 0,
               open : false,
           },
           12: {
               id : 1,
               open : false,
           },
           13: {
               id : 6,
               open : false,
           },
           14: {
               id : 2,
               open : false,
           },
           15: {
               id : 3,
               open : false,
           },
       },
       gameCreated: Date.now(),
       gameViewCount: 0,
       leave : false
   };
   return json;
};
/*
*
* */
createKey = (len = 6) => {
    let letters  = "abcdefghABCDEFGHxyzwmlykXZYMLYuU";
    let key = "";
    for(let i = 0;i<len;i++){
        key += letters.charAt(Math.round(Math.random() * (letters.length - 1) ) );
    }
    return key;
}

module.exports = {
    gameCreate : gameCreate,
    createKey : createKey
};

/*
* gameUser1: {
           userID : gameUser.userID,
           userDisplayName: "test 9999",
           userLogin: Date.now(),
           userScor: 0,
           userRequest: 0
       },
* */