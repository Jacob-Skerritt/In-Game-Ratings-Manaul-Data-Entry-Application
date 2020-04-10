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
    
        function startTimer() {
        var start_time = document.getElementById("time").value;
        var timer = start_time, minutes, seconds;
        var display = document.querySelector('#time_output');
        setInterval(function () {
            
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;
            ++timer;
            
            fetch('http://mysql03.comp.dkit.ie/D00196117/in_game_ratings_api/fixture/updateTime.php', {
                method:'post',
                header: {
                  'Accept' : 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: id, time_minute:minutes, time_second:seconds})
                });
            
        }, 1000);
    }
    
        function changeStatus() {

        var e = document.getElementById("status");
        var status = e.options[e.selectedIndex].text;

        fetch('http://mysql03.comp.dkit.ie/D00196117/in_game_ratings_api/fixture/updateStatus.php', {
        method:'post',
        header: {
          'Accept' : 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: id, fixture_status: status})
        });
        getFixtureData();
    }
    
        async function addGoal(team_id) {

        await fetch('http://mysql03.comp.dkit.ie/D00196117/in_game_ratings_api/fixture_team/add_goal.php', {
        method:'post',
        header: {
          'Accept' : 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({fixture_id: id, team_id: team_id})
        }).then(response => console.log(response.json()))
          .then(data =>getFixtureData());
    }

    async function removeGoal(team_id) {

       await fetch('http://mysql03.comp.dkit.ie/D00196117/in_game_ratings_api/fixture_team/remove_goal.php', {
        method:'post',
        header: {
          'Accept' : 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({fixture_id: id, team_id: team_id})
        }).then(response => response.json())
          .then(data =>getFixtureData());
        
    }
    
    
        async function addEvent(t_id, team, new_id) {
        
        
        var e = document.getElementById("event");
        var event_id = e.options[e.selectedIndex].value;

        var e2 = document.getElementsByClassName("players1");
        var e3 = document.getElementsByClassName("players2");
        
        var player_id;
        var related_player_id;
        
        if(t_id == 0){
            player_id = e2[0].options[e2[0].selectedIndex].value;
            related_player_id = e2[1].options[e2[1].selectedIndex].value;
        }else{
            player_id = e3[0].options[e3[0].selectedIndex].value;
            related_player_id = e3[1].options[e3[1].selectedIndex].value;
        }
        
        
        
        if(event_id == 2){
            var player_position;
            var related_player_position;
            for(index in team.players){
                
                if(player_id == team.players[index].player_id){
                    player_position = team.players[index].formation_position;
                }
                    
                
               
                if(related_player_id == team.players[index].player_id){
                    related_player_position = team.players[index].formation_position;
                }
            
            }
            
            changePosition(id,related_player_position,player_id);
            changePosition(id,player_position,related_player_id);
            getFixtureData();
            
            
        }
        
        

        await fetch('http://mysql03.comp.dkit.ie/D00196117/in_game_ratings_api/fixture_event/create.php', {
        method:'post',
        header: {
          'Accept' : 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id:new_id,fixture_id: id, event_id: event_id, team_id:team.team_id, player_id:player_id, related_player_id:related_player_id, minute:1})
        });
        
        if(event_id == 1){
            addGoal(team.team_id);
        }
        
        if(event_id == 7){
            if(t_id == 0){
                addGoal(team2.team_id);
            }else{
                addGoal(team1.team_id);
            }
        }

    }
    
    function changePosition(id, position, p_id){
        fetch('http://mysql03.comp.dkit.ie/D00196117/in_game_ratings_api/fixture_player/updatePosition.php', {
        method:'post',
        header: {
          'Accept' : 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({fixture_id: id, formation_position:position, player_id:p_id})
        }).then(response => response.json())
          .then(data =>getFixtureData());
        
    
    }
    
    async function startEvent(team, team_id){

        await fetch('http://mysql03.comp.dkit.ie/D00196117/in_game_ratings_api/fixture_event/count_events.php ')
            .then(response => response.json())
            .then(data => addEvent(team_id, team, data));

    }
    
        function addRating(team){
        var user = document.getElementById("user").value;
        var rating = document.getElementById("rating").value;
        
        var player_id;
        var e2 = document.getElementsByClassName("players1");
        var e3 = document.getElementsByClassName("players2");
        if(team == 0){
            player_id = e2[0].options[e2[0].selectedIndex].value;
        }else{
            player_id = e3[0].options[e3[0].selectedIndex].value;
        }
        
        
        
        fetch('http://mysql03.comp.dkit.ie/D00196117/in_game_ratings_api/rating/add_rating.php', {
                method:'post',
                header: {
                  'Accept' : 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({fixture_id: id, player_id:player_id, account_id:user, rating:rating})
                }).then(response => response.json())
                    .then(data =>getFixtureData());
                
        
    }


