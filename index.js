const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");

convertFactory = require('electron-html-to');

const conversion = convertFactory({
converterPath: convertFactory.converters.PDF
});


inquirer
.prompt([{
    message: "Enter GitHub username",
    name: "username"
},
{
    message: "What is your favorite color?",
    name: "color"
}])
.then(function({username, color}) {
    const queryUrl = `https://api.github.com/users/${username}`;

    axios.get(queryUrl)
    .then(function(response) {
        const picUrl = response.data.avatar_url;
        const location = response.data.location;
        const gitHubUrl = response.data.html_url;
        const blog = response.data.blog;
        const bio = response.data.bio;
        const numRepos = response.data.public_repos;
        const numFollowers = response.data.followers;
        const numFollowing = response.data.following;
        let numStarred = 0;

        const modLocation = location.split(" ").join("%20");

        axios.get(`https://api.github.com/users/${username}/starred`)
        .then(function(response) {
            numStarred = response.data.length;
            const newHtml = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>${username}'s Resume</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
            </head>
            <body>
                <div class="container">
                    <div class="row my-5">
                        <div class="col-12">
                            <div class="card text-center">
                                <img src="${picUrl}" class="card-img-top mx-auto rounded-circle border border-warning" alt="Profile picture" style="width: 18rem;">
                                <div class="card-body">
                                    <p class="card-text" style="font-size: 36px;">${username}</p>
                                    <p class="card-text" style="font-size: 24px;">${bio}</p>
                                    <a class="card-link" href="https://google.com/maps/place/${modLocation}">${location}</a>
                                    <a class="card-link" href="${gitHubUrl}">GitHub</a>
                                    <a class="card-link" href="${blog}">Blog</a>
                                </div>
                              </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-6">
                            <div class="card text-center">
                                <div class="card-body">
                                    <p class="card-text" style="font-size: 24px;">Public Repositories</p>
                                    <p class="card-text" style="font-size: 20px;">${numRepos}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card text-center">
                                <div class="card-body">
                                    <p class="card-text" style="font-size: 24px;">Followers</p>
                                    <p class="card-text" style="font-size: 20px;">${numFollowers}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-6">
                            <div class="card text-center">
                                <div class="card-body">
                                    <p class="card-text" style="font-size: 24px;">GitHub Stars</p>
                                    <p class="card-text" style="font-size: 20px;">${numStarred}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card text-center">
                                <div class="card-body">
                                    <p class="card-text" style="font-size: 24px;">Following</p>
                                    <p class="card-text" style="font-size: 20px;">${numFollowing}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style type="text/css">
                    body {
                    background-color: white;
                    -webkit-print-color-adjust: exact !important;
                    }

                    .card {
                        background-color: ${color};
                        color: white;
                    }

                    .card-link {
                        color: white;
                    }
                </style>
            </body>
            </html>`;

            conversion({ html: newHtml }, function(err, result) {
                if (err) {
                    return console.error(err);
                }
                
                // console.log(result.numberOfPages);
                // console.log(result.logs);
                result.stream.pipe(fs.createWriteStream('./index.pdf'));
                conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
            });
               

            fs.writeFile("profile.html",newHtml,function(err) {
                if (err) throw err;
            });
        });
    });
});
