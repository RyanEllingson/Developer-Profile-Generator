const axios = require('axios');
const inquirer = require('inquirer');

inquirer
.prompt({
    message: "Enter GitHub username",
    name: "username"
})
.then(function({username}) {
    const queryUrl = `https://api.github.com/users/${username}`;

    axios.get(queryUrl)
    .then(function(response) {

        console.log(response.data);
    })
    .catch(function(err) {
        console.log(err);
    });
});