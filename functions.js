// Clear all the saved data in local storage
localStorage.clear();

//In this function, we get the username and send request to the github api for information about the user
async function on_click(){
    // first we should clear table to avoid showing old data
    clear_table();
    // get username
    var username = document.getElementById('insert-box').value
    let parsed_data = ""
    // in this condition we check if the network is available or not
    if (navigator.onLine){
         // if it is not stored in local storage
        if (localStorage.getItem(username)==null){
            var api_address = "https://api.github.com/users/" + username
            let response = await fetch(api_address) 
             // if user not found
            if (response.status == 404) {
                var img = document.createElement('img')
                img.src = "notfound.png"
                document.getElementById('cell0').appendChild(img)
                document.getElementById('cell1').innerHTML = "User not found!"
                return
            }
            // could not get response from github
            if (response.status !=200 && response.status!=404){
                var img = document.createElement('img')
                img.src = "error.png"
                document.getElementById('cell0').appendChild(img)
                document.getElementById('cell1').innerHTML = "Could not fetch result!"
            }
            // get data from github api
            let data = await response.json();
            parsed_data = JSON.stringify(data)
            var name = parsed_data.name
            localStorage.setItem(username, parsed_data)
            console.log("read from origin")
        }
        else{
            // get data from local storage
            parsed_data = localStorage.getItem(username)
            console.log("read from local storage")
        }
        // parse data to show in table cells
        parsed_data = JSON.parse(parsed_data)
        var image_url = parsed_data.avatar_url
        var name = parsed_data.name
        var blog = parsed_data.blog
        var address = parsed_data.location
        var bio = parsed_data.bio
        // replace new line with <br> to show the bio correctly
        if (bio != null){
            bio = bio.replace(/(?:\r\n|\r|\n)/g, "<br>");
        }
        // if the user does not have a name, blog, address or bio, we show --- instead
        if (name == null || name == ""){
            name = "Name : ---"
        }
        if (blog == null || blog == ""){
            blog = "Blog : ---"
        }
        if (address == null || address == ""){
            address = "Location : ---"
        }
        if (bio == null || bio == ""){
            bio = "Bio : --- "
        }
        
        // update the table with the data
        table = document.getElementsByClassName('user-info');
        console.log(typeof(array))
        var img = document.createElement('img')
        img.src = image_url
        document.getElementById('cell0').appendChild(img)
        document.getElementById('cell1').innerHTML = name + '<br/>' + blog + '<br/>' + address;
        document.getElementById('cell2').innerHTML = bio;
        // find the most used language of the user
        find_language(username);
    }
    else{
        // network is not available
        var img = document.createElement('img')
        img.src = "error.png"
        document.getElementById('cell0').appendChild(img)
        document.getElementById('cell1').innerHTML = "No internet connection!"
    }
}
// in this function we clear the table
function clear_table(){
    document.getElementById('cell0').innerHTML = ""
    document.getElementById('cell1').innerHTML = ""
    document.getElementById('cell2').innerHTML = ""
    document.getElementById('cell3').innerHTML = ""
}

// in this function we find the most used language of the user
// get the most recent 5 repositories and find the language that has the most score
async function find_language(username){
    
    var languages = []; 
    var url = "https://api.github.com/users/" + username + "/repos?per_page=5&sort=pushed"
    var response = await fetch(url)
    var repositories = await response.json()

    // get languages of each repository
    for (let i = 0; i < repositories.length; i++) { 
        var langs = await fetch(repositories[i].languages_url)
        var lang = await langs.json()
        languages.push(lang);
    }
    console.log(languages)

    // find the language that has the most score
    var max = -999;
    var language = '';
    for (let j = 0; j < languages.length; j++) {
        var obj = languages[j]; 
        for (var l in obj) {
            if (obj[l] > max) {
                language = l;
                max = obj[l];
            }
        }
    }
    console.log(language)
    // update the table
    document.getElementById('cell3').innerHTML = language
}