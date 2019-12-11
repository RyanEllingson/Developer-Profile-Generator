const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");

convertFactory = require('electron-html-to');

const conversion = convertFactory({
converterPath: convertFactory.converters.PDF
});


// Color conversion table obtained from https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
function colourNameToHex(colour)
{
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return false;
}

inquirer
.prompt([{
    message: "Enter GitHub username",
    name: "username"
},
{
    message: "What is your favorite color?",
    name: "colorword"
}])
.then(function({username, colorword}) {
    const color = colourNameToHex(colorword);
    const queryUrl = `https://api.github.com/users/${username}`;

    axios.get(queryUrl)
    .then(function(response) {
        // console.log(response.data);

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
            // console.log(response.data);
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
                            <div class="card text-center" style="background-color: ${color}; color: white;">
                                <img src="${picUrl}" class="card-img-top mx-auto rounded-circle border border-warning" alt="Profile picture" style="width: 18rem;">
                                <div class="card-body">
                                    <p class="card-text" style="font-size: 36px;">${username}</p>
                                    <p class="card-text" style="font-size: 24px;">${bio}</p>
                                    <a class="card-link" style="color: white;" href="https://google.com/maps/place/${modLocation}">${location}</a>
                                    <a class="card-link" style="color: white;" href="${gitHubUrl}">GitHub</a>
                                    <a class="card-link" style="color: white;" href="${blog}">Blog</a>
                                </div>
                              </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-6">
                            <div class="card text-center" style="background-color: ${color}; color: white;">
                                <div class="card-body">
                                    <p class="card-text" style="font-size: 24px;">Public Repositories</p>
                                    <p class="card-text" style="font-size: 20px;">${numRepos}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card text-center" style="background-color: ${color}; color: white;">
                                <div class="card-body">
                                    <p class="card-text" style="font-size: 24px;">Followers</p>
                                    <p class="card-text" style="font-size: 20px;">${numFollowers}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-6">
                            <div class="card text-center" style="background-color: ${color}; color: white;">
                                <div class="card-body">
                                    <p class="card-text" style="font-size: 24px;">GitHub Stars</p>
                                    <p class="card-text" style="font-size: 20px;">${numStarred}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card text-center" style="background-color: ${color}; color: white;">
                                <div class="card-body">
                                    <p class="card-text" style="font-size: 24px;">Following</p>
                                    <p class="card-text" style="font-size: 20px;">${numFollowing}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

            /**
 * https://github.com/bjrmatos/electron-html-to/issues/459
 * 
 * There is a compatability issue witht the newest versions.
 * 
 * Make sure to use:
 * "electron": "^5.0.12",
 * "electron-html-to": "^2.6.0".
 * 
 */


});
