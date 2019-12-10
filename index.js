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

        const picUrl = response.data.avatar_url;
        const loginName = response.data.login;
        const location = response.data.location;
        const gitHubUrl = response.data.url;
        const blog = response.data.blog;
        const bio = response.data.bio;
        const numRepos = response.data.public_repos;
        const numFollowers = response.data.followers;
        const numFollowing = response.data.following;

    })
    .catch(function(err) {
        console.log(err);
    });
});