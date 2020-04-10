    //Global Variables used for many of the funcitons
    let team1 = null;
    let team2 = null;
    let id;

    //Function to get all data associated with a fixture based on the fixture id supplied to the input box "fixture_id"
    async function getFixtureData() {
        id  = document.getElementById("fixture_id").value;

        if(id){
            let response = await fetch('http://mysql03.comp.dkit.ie/D00196117/in_game_ratings_api/fixture/allData.php', {
              method: 'POST',
              body: JSON.stringify({id: id, account_id: 1})
            });

            // the server responds with confirmation and the image size
            let result = await response.json();
            team1 = result.localteam;
            team2 = result.visitorteam;

            console.log(result);
        }else{
            alert("please enter a fixture id");
        }
        main_table.style.visibility='visible';
        loadPlayers();


    }
    
        function loadPlayers(){

        var select = document.getElementsByClassName("players1");
        for(index in team1.players){
           select[0].options[select[0].options.length] = new Option(team1.players[index].player_name, team1.players[index].player_id);
           select[1].options[select[1].options.length] = new Option(team1.players[index].player_name, team1.players[index].player_id);
        }

        var select = document.getElementsByClassName("players2");
        for(index in team2.players){
           select[0].options[select[0].options.length] = new Option(team2.players[index].player_name, team2.players[index].player_id);
           select[1].options[select[1].options.length] = new Option(team2.players[index].player_name, team2.players[index].player_id);
        }

       
    }


