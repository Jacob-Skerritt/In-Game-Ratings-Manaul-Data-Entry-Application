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


