const Discord = require("discord.js");
const Sysinfo = require("systeminformation");
const client = new Discord.Client();
const config = require("./config.json");
const prefix = config.prefix; 
const fs = require("fs");
const jfile = require("jsonfile");
const moment = require("moment");
const got = require('got');
const kmhToMph = require('kmh-to-mph');
const util = require('util');
const d2d = require('degrees-to-direction');
require("moment-duration-format");

client.on("ready", () => {
    console.log("Running " + config.version);
    client.user.setActivity("Over " + client.users.size + " Users", { type: "WATCHING" });
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let messageArray = message.content.split(" "); 
    let command = messageArray[0]; 
    let args = messageArray.slice(1); 
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

        if(!command.startsWith(prefix)) return;
    
    //Owner Only
    if (command === `${prefix}game`) {
        if (message.author.id === config.botowner) {
            const gameMessage = message.content.slice(config.prefix.length + command.length + 3).trim()
            const gameType = message.content.slice(config.prefix.length + command.length + 1).split("")[0];
            client.user.setActivity(gameMessage, { type: parseInt(gameType) });
            message.channel.send('Game Status set to "' + gameMessage + '" with type "' + gameType + '"');
            console.log('Game Status set to "' + gameMessage + '" with type "' + gameType + '"');
        }
        else {
            return;
        }
    }

    //Owner Only
    if (command === `${prefix}status`) {
        if (message.author.id === config.botowner) {
            const color = args.join(" ");
            if (color.toLowerCase() == "online") {
                client.user.setStatus("online");
                message.channel.send('Bots Status set to Online');
                console.log('Bots Status set to "Online"');
                return;
            }
            else if (color.toLowerCase() == "idle") {
                client.user.setStatus("idle");
                message.channel.send('Bots Status set to Idle');
                console.log('Bots Status set to "Idle"');
                return;
            }
            else if (color.toLowerCase() == "dnd") {
                client.user.setStatus("dnd");
                message.channel.send('Bots Status set to DnD');
                console.log('Bots Status set to "DnD"');
                return;
            }
            else {
                message.channel.send('Only options are "online", "idle" or "dnd"');
                return;
            }
        }
        else {
            return;
        }
    }


    //Owner Only
    if (command === `${prefix}say`) {
        if (message.author.id === config.botowner) {
            const sayMessage = args.join(" ");
            const attachment = (message.attachments).array();
            message.delete().catch(O_o => { });
            if (typeof attachment != "undefined" && attachment != null && attachment.length > 0) {
                message.channel.send(sayMessage, { files: [attachment[0].url] });
                return;
            }
            message.channel.send(sayMessage);
            return;
        }
        else {
            return;
        }
    }

    //Lol spam to crash bot
    if (command === `${prefix}ping`) {
        if (message.author.id === config.botowner) {
    
        const m = await message.channel.send("Ping?");
        connectionLatency = m.createdTimestamp - message.createdTimestamp;
        apiLatency = Math.round(client.ping);
       
        const embed = new Discord.RichEmbed()
            .addField("Connection Latency", connectionLatency + "ms")
            .addField("API Latency", apiLatency + "ms")
            .setColor("00ff00")
            .setTimestamp();
        m.edit(embed);

    }
    else {
        return;
    }
        
}
    
if (command == `${prefix}purge`) {
    var number = parseInt(args)
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
        message.channel.send("I do not have the permission to manage messages");
        return;
    }
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        return;
    }
    if (!number) {
        message.channel.send("A number was not provided");
        return;
    }
    if (number < 2) {
        message.channel.send("Provide a number higher than 1");
        return;
    }
    if (number > 100) {
        number = 100;
    }
    const fetched = await message.channel.fetchMessages({ limit: number });
    message.channel.bulkDelete(fetched)
        .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    const m = await message.channel.send(":white_check_mark: Deleted **" + fetched.size + "** messages from **" + message.channel.name + "**");
    setTimeout(() => m.delete(), 3000);
    return;
}

    //niggas iffy uuh 
    if (command == `${prefix}userinfo`|| command == `${prefix}uinfo`) {
        if (message.mentions.members.first()) {
            user = message.mentions.users.first();
            displayname = user.tag;
        }
        else {
            user = message.author;
            displayname = message.author.tag;
        }
        userguild = message.guild.member(user);
        roles = userguild.roles.array().slice(1);
        if (roles.length < 1) {
            roles = ['User Currently Has No Roles'];
        }
        const embed = new Discord.RichEmbed()
            .setTitle("User Info for " + displayname)
            .setThumbnail(user.avatarURL)
            .setColor("#800080")
            .addField("Status", user.presence.status[0].toUpperCase() + user.presence.status.slice(1), true)
            .addField("User ID", user.id, true)
            .addField("Current Game", (user.presence.game && user.presence.game && user.presence.game.name) || 'Not playing anything at the moment')
            .addField("Current Roles", roles.join(', '))
            .addField("Account Created", user.createdAt)
            .addField("Account Joined", userguild.joinedAt)
            .addField("Is user a bot?", user.bot)
            .setFooter("If you're born blind and deaf what language would you think in")
            .setTimestamp();
        message.channel.send({ embed });

    }

    if (command == `${prefix}botinfo` || command ==`${prefix}binfo`) {
        Sysinfo.osInfo(function (data) {
            hostinfo = data.codename + ", " + data.distro + ", " + data.kernel + ", " + data.arch;
            let embed = new Discord.RichEmbed()
                .setTitle("Information")
                .setThumbnail(client.user.avatarURL)
                .setColor("#800080")
                .addField("Owner", "Lucoa#1000")
                .addField("Bot ID", client.user.id)
                .addField("Total Servers", client.guilds.size)
                .addField("Bot Version", config.version)
                .addField("Region", "Little Tokyo")
                .addField("Systems Time", Date())
                .addField("System Info", hostinfo)
                .addField("Uptime", moment.duration(client.uptime, "milliseconds").format("D [Days,] hh [Hours,] mm [Minutes and] ss [Seconds]"))
                .setTimestamp();
            message.channel.send({ embed });
        });
        return;
    }

    if (command === `${prefix}serverinfo` || command == `${prefix}sinfo`) {
        const embed = new Discord.RichEmbed()
            .setTitle("Server Info for " + message.guild.name)
            .setThumbnail(message.guild.iconURL)
            .setColor("#800080")
            .addField("Owner", message.guild.owner)
            .addField("Region", message.guild.region)
            .addField("Server ID", message.guild.id, true)
            .addField("Level of Verification", message.guild.verificationLevel, true)
            .addField("Creation Date", message.guild.createdAt)
            .addField("Number of Users (Includes Bots)", message.guild.memberCount, true)
            .addField("Users Online (Includes Bots)", message.guild.members.filter(m => m.presence.status !== 'offline').size, true)
            .addField("Text Channel Count             ", message.guild.channels.filter(m => m.type === 'text').size, true)
            .addField("Voice Channel Count", message.guild.channels.filter(m => m.type === 'voice').size, true)
            .setImage(message.guild.splashURL)
            .setTimestamp();
        message.channel.send({ embed });

    }
    if (command === `${prefix}avatar`) {
        if (message.mentions.members.first()) {
            user = message.mentions.users.first();
            displayname = user.tag;
        }
        else {
            user = message.author;
            displayname = message.author.tag;
        }
        avatarLink = user.avatarURL;
        if (!avatarLink) {
            const embed = new Discord.RichEmbed()
                .setTitle("Avatar for " + displayname)
                .setColor("#ff9900")
                .setDescription("This User has default discord avatar")
            message.channel.send({ embed });

            return;
        }
        const embed = new Discord.RichEmbed()
            .setTitle("Avatar for " + displayname)
            .setColor("#ff9900")
            .setImage(avatarLink)
        message.channel.send({ embed });

    }

        if (command === `${prefix}roll`) {
            var number = parseInt(args)
            if (!number || number < 1) {
                number = 1;
            }
            if (number > 100) {
                number = 100;
            }
    
            var result = "";
    
            for (var i = 0; i < number; i++) {
                var roll = (Math.floor(Math.random() * 6) + 1) + ", ";
                result += roll;
            }
            message.channel.send(":game_die: The dice rolled: ```py\n" + result.slice(0, -2) + "```");
            return;
        }

        if (command === `${prefix}coinflip`) {
            var result = Math.floor(Math.random() * 2) + 1;
            if (result === 1) {
                message.channel.send(":money_with_wings: Coin landed on heads");
            }
            else if (result === 2) {
                message.channel.send(":money_with_wings: Coin landed on tails");
            }
            return;
        }

        if (command === `${prefix}question`|| command === `${prefix}q`) {
            var result = Math.floor(Math.random() * 2) + 1;
            if (result === 1) {
                message.channel.send("Yes");
            }
            else if (result === 2) {
                message.channel.send("No");
            }
            return;
        }

        if (command === `${prefix}8ball`) {
            var responses = ["Hell yea, 100% sure", "It could work", "Perhaps it will happen", "There is a chance", "May not happen", "Chances are it will be a no", "I dont think that will happen anytime soon", "No, Just no...", "What the fuck no. Never ask me again"];
            var number = Math.floor(Math.random() * responses.length);
            message.channel.send(':8ball: 8 ball says "' + responses[number] + '"')
        }

        if (command === `${prefix}stroke`) {
            user = message.mentions.users.first();
            if (!user) {
                message.channel.send("*With graceful movment " + message.author + " sticks their hand in the air and strokes nothing at all, either they are retarded or as uncoordinated as bambi*")
                return;
            }
            if (user.id === message.author.id) {
                message.channel.send("*With graceful movment " + message.author + " sticks their hand in...* their own pants and... loves themself..? I mean I'm ok with masturbation and all, but do you mind not jacking off right in front of me");
                return;
            }
            if (user.id === client.user.id) {
                message.channel.send("*With graceful movme...* YO WOAH HEY MISS ME WITH DAT GAY SHIT, faggot :angry:");
                return;
            }
            if (user.bot === true) {
                message.channel.send("Look I'm pretty sure bots dont have... ya know... ***that one thing***. I'm sure we can fashion and emergency strapon");
                return;
            }
            message.channel.send("*With graceful movment " + message.author + " sticks their hand in " + user + "'s pants and lovingly grips onto their pole...* Long poles into deep holes, amirite lads. ");
            return;
        }

    if (command === `${prefix}traceroute` || command ===`${prefix}trace`) {
        var search = args.join(" ");

        const m = await message.channel.send("Tracing...");

        if (search.length < 1) {
            m.edit("Please Provide the hostname or IP address you want to use the traceroute command on");
            return;
        }

        const result = await got(`https://api.hackertarget.com/mtr/?q=${encodeURIComponent(search)}`);

        if (result.body === "error input invalid - enter IP or Hostname") {
            m.edit("Error: input invalid")
            return;
        }
        const embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setDescription("```" + result.body + "```");
        m.edit(embed);
        return;
    }

    if (command === `${prefix}pingip`) {
        var search = args.join(" ");

        const m = await message.channel.send("Pinging...");

        if (search.length < 1) {
            m.edit("Please provide the hostname or IP address you want to ping");
            return;
        }

        const result = await got(`https://api.hackertarget.com/nping/?q=${encodeURIComponent(search)}`);

        if (result.body === "error input invalid - enter IP or Hostname") {
            m.edit("Error: input invalid")
            return;
        }
        const embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setDescription("```" + result.body + "```");
        m.edit(embed);
        return;
    }

    if (command === `${prefix}dns`) {
        var search = args.join(" ");

        const m = await message.channel.send("Looking up DNS...");

        if (search.length < 1) {
            m.edit("Please provide the hostname or website you want to look up the DNS of");
            return;
        }

        const result = await got(`https://api.hackertarget.com/dnslookup/?q=${encodeURIComponent(search)}`);

        if (result.body === "error input invalid - enter IP or Hostname") {
            m.edit("Error: input invalid")
            return;
        }
        const embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setDescription("```" + result.body + "```");
        m.edit(embed);
        return;
    }

    if (command === `${prefix}reversedns`) {
        var search = args.join(" ");

        const m = await message.channel.send("Performing reverse DNS search...");

        if (search.length < 1) {
            m.edit("Please provide the IP you want to perform a reverse DNS search on");
            return;
        }

        const result = await got(`https://api.hackertarget.com/reversedns/?q=${encodeURIComponent(search)}`);

        if (result.body === "error input invalid - enter IP or Hostname") { 
            m.edit("Error: input invalid")
            return;
        }
        const embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setDescription("```" + result.body + "```");
        m.edit(embed);
        return;
    }

    if (command === `${prefix}cat`) {
        const catAPI = "http://random.cat/meow.php";
        const catJSON = await got(catAPI, { json: true });
        message.channel.send(catJSON.body.file);
        return;
    }

    if (command === `${prefix}dog`) {
        const dogAPI = "https://random.dog/woof.json";
        const dogJSON = await got(dogAPI, { json: true });
        message.channel.send(dogJSON.body.url);
        return;
    }

    if (command === `${prefix}randomfact`) {
        const result = await got(`https://murkapi.com/fact.php?key=5aa3d576d2a03`)

        const embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setDescription(result.body)
        message.channel.send({ embed });
        return;
    }

    if (command === `${prefix}doxhelper`) {
        const result = await got(`https://murkapi.com/dox.php?key=5aa3d576d2a03&value=${encodeURIComponent(search)}`)
        
        if (search.length < 1) {
            m.edit("Please provide a username or name"); 
            return;
        }

        const embed = new Discord.RichEmbed()
            .setTitle("Information I could find")
            .setColor("#ff0000")
            .setDescription(result.body)
        message.channel.send({ embed });
        return;
    }

    if (command === `${prefix}proxygen`) {
        const result = await got(`https://murkapi.com/proxygen.php?key=5aa3d576d2a03`)

        const embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .addField("Proxy and Port" , result.body)
        message.channel.send({ embed }); 
        return;
    }

    if (command === `${prefix}portscan`) {
        const result = await got(`https://api.hackertarget.com/nmap/?q=${encodeURIComponent(search)}`)

        const embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .addField("Open Ports" , result.body)
        message.channel.send({ embed });
        return;
    }

    if (command === `${prefix}infogen` || command === `${prefix}geninfo`) {
        const result = await got(`https://randomuser.me/api/`, { json: true });
        const person = result.body.results[0];

        const embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setTitle("Random Information Generator") 
            .addField("Name", capitalizeFirstLetter(person.name.first) + " " + capitalizeFirstLetter(person.name.last))
            .addField("Gender", capitalizeFirstLetter(person.gender))
            .addField("Address", person.location.street + ", " + capitalizeFirstLetter(person.location.city))
            .addField("Date Of Birth", person.dob)
            .addField("Email", person.email)
            .addField("Login", "**Username:** " + person.login.username + ", **Pass:** " + person.login.password)
            .addField("Phone Number", "**Home:** " + person.phone + ", **Mobile:** " + person.cell)
            .setImage(person.picture.large)
            .setTimestamp()
            .setFooter("Powered by randomuser.me"); 

        message.channel.send(embed);
        return;

        }
        if (command === `${prefix}whois`) {
            var search = args.join(" ");
    
            const m = await message.channel.send("Performing task...");
    
            if (search.length < 1) {
                m.edit("Please provide a hostname or an IP address");
                return;
            }
    
            const result = await got(`http://ip-api.com/json/${encodeURIComponent(search)}`, { json: true });
            const address = result.body;
    
            if (address.message === "invalid query") {
                m.edit("Error : invalid input");
                return;

            }
            const embed = new Discord.RichEmbed()
                .setColor("#ff0000")
                .setTitle("Whois information") 
                .addField("AS", address.as || "Not Found")
                .addField("City", address.city || "Not Found")
                .addField("Zip Code", address.zip || "Not Found") 
                .addField("Region", address.regionName || "Not Found")
                .addField("Country", address.country || "Not Found")
                .addField("ISP", address.isp || "Not Found")
                .addField("Latitude and Longitude", address.lat + ", " + address.lon || "Not Found")
                .addField("Timezone", address.timezone || "Not Found");

            m.edit(embed);
        }

        if (command === `${prefix}weather`) {
            const cityURL = (city) => `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(city)}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
            var city = args.join(" ");
    
            if (city.length < 1) {
                message.channel.send("City name not provided, I cant give the weather of the entire planet!");
                return;
            }
            const res = await got(cityURL(city), { json: true });
            if (!res || !res.body || !res.body.query || !res.body.query.results || !res.body.query.results.channel) {
                message.channel.send(":sos: Error getting weather infomation");
                return;
            }
            const weatherInfo = res.body.query.results.channel;
            const forecast = weatherInfo.item.forecast[0];
            const celsius = Math.round(((weatherInfo.item.condition.temp - 32) * 5) / 9);
            const windmph = Math.round(kmhToMph(parseInt(weatherInfo.wind.speed)));
            const visibilitymiles = Math.round(kmhToMph(parseFloat(weatherInfo.atmosphere.visibility)) * 10) / 10;
    
            const embed = new Discord.RichEmbed()
                .setTitle("Weather Info for " + weatherInfo.location.city + ", " + weatherInfo.location.region + ", " + weatherInfo.location.country)
                .setDescription(weatherInfo.item.lat + ", " + weatherInfo.item.long)
                .setColor("#4169e9")
                .addField(":white_sun_cloud: Conditions", weatherInfo.item.condition.text, true)
                .addField(":thermometer: Temperature", weatherInfo.item.condition.temp + "°F / " + celsius + "°C", true)
                .addField(":dash: Wind Speed", windmph + " MPH / " + weatherInfo.wind.speed + " KMH", true)
                .addField(":leaves: Wind Direction", d2d(parseInt(weatherInfo.wind.direction)) + " / " + weatherInfo.wind.direction + "°", true)
                .addField(":control_knobs: Pressure", weatherInfo.atmosphere.pressure + " mBAR", true)
                .addField(":airplane: Visibility", visibilitymiles + " MI / " + weatherInfo.atmosphere.visibility + " KM", true)
                .addField(":sweat_drops: Humidity", weatherInfo.atmosphere.humidity + '%', true)
                .addField(":sunny: Sunrise", weatherInfo.astronomy.sunrise, true)
                .addField(":crescent_moon: Sunset", weatherInfo.astronomy.sunset, true)
                .setTimestamp();
            message.channel.send({ embed });
            return;
        }

        if (command === `${prefix}r34` || command === "rule34") {
            if (!message.channel.nsfw) {
                message.channel.send("I can't post porn in a channel that isn't marked as NSFW you moron");
                return;
            }
            var parseString = require('xml2js').parseString;
    
            const m = await message.channel.send("Searching...");
            var search = args.join(" ");
            var getamount = 100;
    
            const r34 = `http://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=${encodeURIComponent(getamount)}&tags=${encodeURIComponent(search)}`;
            const phpresponse = await got(r34);
    
            parseString(phpresponse.body, function (err, result) {
                jsonresponse = JSON.stringify(result);
            });
    
            const imageamount = JSON.parse(jsonresponse).posts.$.count;
    
            if (imageamount == 0) {
                m.edit("Failed to receive any images, try something else");
                return;
            };
    
            const number = Math.floor(Math.random() * parseInt(getamount));
            const jsonimage = JSON.parse(jsonresponse).posts.post[number].$;
    
            const embed = new Discord.RichEmbed()
                .setColor("#ff0000")
                .addField("Score", jsonimage.score, true)
                .addField("Rating", (jsonimage.rating).toUpperCase(), true)
                .addField("ID", jsonimage.id, true)
                .addField("Creator ID", jsonimage.creator_id, true)
                .setImage(jsonimage.file_url)
                .setFooter("Powered by horny twelve year olds");
            m.edit(embed);
            return;
        }
    
});

client.login(config.token);