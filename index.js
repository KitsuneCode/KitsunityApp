const keepAlive = require("./server");
const Util = require('./util/MitUtil.js');
const db = require('./util/Database.js');

const Discord = require('discord.js');
const { prefix, token, ownerid, logchannelid, database, giphy, serverbypass, LIFE } = require('./config.json');
const AntiSpam = require('discord-anti-spam');
const Canvas = require('canvas');

const antiSpam = new AntiSpam({
    warnThreshold: 5, // Amount of messages sent in a row that will cause a warning.
    kickThreshold: 7, // Amount of messages sent in a row that will cause a ban.
    banThreshold: 10, // Amount of messages sent in a row that will cause a ban.
    maxInterval: 3000, // Amount of time (in milliseconds) in which messages are considered spam.
    warnMessage: '{@user}, Por favotr deja el spam.', // Message that will be sent in chat upon warning a user.
    kickMessage: '**{user_tag}** fue expulsado por spam.', // Message that will be sent in chat upon kicking a user.
    banMessage: '**{user_tag}** fue baneado por spam.', // Message that will be sent in chat upon banning a user.
    maxDuplicatesWarning: 7, // Amount of duplicate messages that trigger a warning.
    maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
    maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a warning.
    exemptPermissions: serverbypass, // Bypass users with any of these permissions.
    ignoreBots: true, // Ignore bot messages.
    verbose: true, // Extended Logs from module.
    ignoredUsers: [], // Array of User IDs that get ignored.
});

const client = new Discord.Client();
const cooldowns = new Discord.Collection();
const snipes = new Discord.Collection();
const fs = require('fs');
/*
require('discord-buttons')(client);
const { MessageButton, MessageActionRow } = require('discord-buttons');
*/

client.UsersBalance = new Discord.Collection();
client.commands = new Discord.Collection();
client.queue = new Map();


/*
const DBL = require("dblapi.js");
const dbl = new DBL('Your top.gg token', client);
*/

let rawdata = fs.readFileSync('./include/assets/json/game.json');
let Game = JSON.parse(rawdata);

let ListOfFiles = Game.data["filecommands"];

for (let i = 0; i < ListOfFiles.length; i++) {
    const commandFiles = fs.readdirSync(`./commands/${ListOfFiles[i]}/`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${ListOfFiles[i]}/${file}`);
        client.commands.set(command.name, command);
    }
};

client.on('reconnecting', () => {
    console.log("Reconectando a Kitsunity nwn...")
    client.setStatus('dnd');
});

client.on('ready', () => {
    console.log("Limpiando consola... uwu");
    console.clear();
    console.log("Estoy conectada correctamente!!");
    console.log(`------------- x -------------`);
    let rawdata = fs.readFileSync('./include/assets/json/game.json');
    let Game = JSON.parse(rawdata);
    let ListOfFiles = Game.data["filecommands"];
    for (let i = 0; i < ListOfFiles.length; i++) {
		const commandFiles = fs.readdirSync(`./commands/${ListOfFiles[i]}/`).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(`./commands/${ListOfFiles[i]}/${file}`);
			console.log(`✅  | Comando cargado ${file}`);
    }
  };
  	console.log(`-----------------------------`);
    console.log('Seción iniciada como ' + client.user.username + ' !!!');
    console.log("Comandos totales: " + client.commands.size);
    console.log("Usuarios totales: " + client.users.cache.size);
    console.log("Servidores totales: " + client.guilds.cache.size);
    console.log("Canales totales: " + client.channels.cache.size + "\n");

    let GuildArray = client.guilds.cache.array();
    GuildArray.sort(function (a, b) {
        if (a.memberCount > b.memberCount) { return -1; }
        if (a.memberCount < b.memberCount) { return 1; }
        return 0;
    });

    for (let i = 0; i < GuildArray.length; i++) {
        console.log(`Server: ${GuildArray[i].name} (id: ${GuildArray[i].id}). Este server tiene ${GuildArray[i].memberCount} miembros!`);
    }

    console.log("\n");

    const catg = "7"
    setInterval(async function () {
    const status = [
      {
        activity: `${client.users.cache.size} usuarios en ${client.guilds.cache.size} servidores uwu!!`,
        type: "WATCHING",
      },
      {
        activity: "o!help | @Osakana",
        type: "WATCHING",
      },
      {
        activity: `kitsunity.glitch.me`,
        type: "PLAYING",
      },
      {
        activity: `${client.commands.size} comandos y ${catg} categorias >w<!!`,
        type: "LISTENING",
      },
      {
        activity: "la versión 1.0.0 💝 | o!help",
        type: "LISTENING",
      },
      {
        activity: `${client.channels.cache.size} canales :D`,
        type: "COMPETING",
      },
      {
        activity: "o!help | UwU",
        type: "LISTENING",
      }
    ];
      let random = status[Math.floor(Math.random() * Math.floor(status.length))];
      client.user.setActivity(random.activity, {
         type: random.type,
      });
    }, 15000);

    setInterval(() => {
        Util.refreshsubreddit();
    }, 600000);
});

    /*
    setInterval(() => {
        const activities_list = [
            ` ${prefix}help | kitsunity.glitch.me | Support Us!`,
            ` ${prefix}help | kitsunity.glitch.me | Aim High`,
            ` ${prefix}help | kitsunity.glitch.me | Have Patience`,
            ` ${prefix}help | kitsunity.glitch.me | No Boundaries`,
            ` ${prefix}help | kitsunity.glitch.me | Rise Above`
        ];

        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
        client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
    }, 10000);
*/

client.on('message', async message => {
    try {
        var start = new Date();

        let ServerPrefix = prefix;
        let ServerAntiSpam = "off";
        let ServerFilterInvite = "off";

        let HasPrefix = await db.has(`${message.guild.id}_prefix`);
        if (!HasPrefix) {
            await db.set(`${message.guild.id}_prefix`, prefix);
            await db.set(`${message.guild.id}_antispam`, "off");
            await db.set(`${message.guild.id}_invitefilter`, "off");
            await db.set(`${message.guild.id}_welcome`, "off");
        }
        else {
            ServerPrefix = await db.get(`${message.guild.id}_prefix`);
            ServerAntiSpam = await db.get(`${message.guild.id}_antispam`);
            ServerFilterInvite = await db.get(`${message.guild.id}_invitefilter`);
        }

        if (ServerAntiSpam == "on") {
            antiSpam.message(message);
        }

        if (ServerFilterInvite == "on") {
            const inviteRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(\.gg|(app)?\.com\/invite|\.me)\/([^ ]+)\/?/gi;
            const botInvRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(app)?\.com\/(api\/)?oauth2\/authorize\?([^ ]+)\/?/gi;

            let UserImmune = false;
            for (let i = 0; i < serverbypass.length; i++) {
                if (message.member.hasPermission(serverbypass[i])) {
                    UserImmune = true;
                }
            }

            if (!UserImmune) {
                if (message.content.match(inviteRegex) || message.content.match(botInvRegex)) {
                    message.reply("Por favor evita enviar links de invitaciona este servidor >.<");
                    return message.delete();
                }
            }
        }

        await db.add(`${message.author.id}_experience`, 1);
        if (!message.content.startsWith(ServerPrefix)) return;

        const args = message.content.slice(ServerPrefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        let HasUserInfo = await db.has(`${message.author.id}_info`);
        if (!HasUserInfo) {
            await db.set(`${message.author.id}_info`, `${message.author.tag}`);
        }

        let HasUserJob = await db.has(`${message.author.id}_job`);
        if (!HasUserJob) {
            await db.set(`${message.author.id}_job`, -1);
        }

        let HasUserPromotion = await db.has(`${message.author.id}_promotion`);
        if (!HasUserPromotion) {
            await db.set(`${message.author.id}_promotion`, 0);
        }

        let HasBase = await db.has(`${message.author.id}_base`);
        if (!HasBase) {
            await db.set(`${message.author.id}_base`, -1);

            await db.set(`${message.author.id}_basedefense`, 0);
            await db.set(`${message.author.id}_baseluck`, 0);

            await db.set(`${message.author.id}_defense`, 0);
            await db.set(`${message.author.id}_luck`, 0);
        }

        let Shops = Game.data["Shops"];
        let Upgrades = Game.data["Upgrades"];
        for (let i = 0; i < Shops.length; i++) {
            if (!db.has(`${message.author.id}_${Shops[i]}`)) {
                await db.set(`${message.author.id}_${Shops[i]}`, 0);
            }
        }

        for (let i = 0; i < Upgrades.length; i++) {
            if (!db.has(`${message.author.id}_${Upgrades[i]}`)) {
                await db.set(`${message.author.id}_${Upgrades[i]}`, 0);
            }
        }

        let MoneyPrinter3 = 0;
        let MoneyPrinter3Upgrade = 0;

        let HasMoneyPrinter1 = await db.has(`${message.author.id}_moneyprintermk1`) || await db.has(`${message.author.id}_moneyprintermk3`);
        if (HasMoneyPrinter1) {
            let MoneyPrinter = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk1`));
            MoneyPrinter3 = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk3`));

            let MoneyPrinterUpgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk1'].upgrade);
            MoneyPrinter3Upgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk3'].upgrade);

            MoneyPrinter = MoneyPrinter * MoneyPrinterUpgrade;
            MoneyPrinter3 = MoneyPrinter3 * MoneyPrinter3Upgrade;

            let NumerToAdd = Math.floor(1 + MoneyPrinter + MoneyPrinter3);

            await db.add(`${message.author.id}_balance`, NumerToAdd);
        }
        else {
            await db.add(`${message.author.id}_balance`, 1);
        }

        await db.add(`${message.author.id}_messages`, 1);

        if (message.mentions.everyone) {
            return;
        }

        const command = client.commands.get(commandName) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (command.Premium) {
            if (message.author.id != ownerid) {
                return message.reply("Esta es una caracteristca PREMIUM");
            }
        }

        if (command.args != args.length && command.args != 0 && !(command.args == -1 && args.length > 0)) {
            let reply = "**Descripcion:** " + command.description + "\n";
            reply += "**Cooldown:** " + command.cooldown + "\n";
            reply += "**Aliases:** " + command.aliases + "\n";
            reply += "\n**Usage:** \n" + ServerPrefix + command.name + " " + command.usage + "\n";

            const UsageEmbed = new Discord.MessageEmbed()
                .setColor('#8B0000')
                .setTitle('Comando: ' + ServerPrefix + command.name)
                .setDescription(reply)
                .setFooter("Requested by " + message.author.tag)
                .setTimestamp();

            return message.channel.send(UsageEmbed);
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        if (message.author.id != ownerid) {
            var now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;

            if (!timestamps.has(message.author.id)) {
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            } else {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
					const lefttime = [
					   `Vas a quemar el teclado si sigues asi!!! >.<`,
					   `Bajale lineas a tu velocidad!!! >u<`,
					   `Woah!!! Si sigues asi pasaras la velocidad de la luz >-<`,
					   `Calmate y relajate un rato, senpai!!! o.O`,
					   `Hey!!!! Detente!!! >.<`,
					   `Si seguimos con esa velocidad Discord nos va a regañar :c`
					]
					const leftmsg = lefttime[Math.floor(Math.random() * lefttime.length)]
                    const timeLeft = (expirationTime - now) + 1000;
					const coolmsg = [`**<a:OsakanaReloj:857671171243900948> |** **${message.author.username}!!!** ${leftmsg}\nPor favor espera **${Util.msToTime(timeLeft)}** antes de usar \`${command.name}\` denuevo >.<!\nTe aburres de la espera, escribe sin limites con **Osakana+**, pregunta por ello en el servidor de soporte`]
                    return message.channel.send(coolmsg);
                }

                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
            }
        }

        try {
            let HasMoneyPrinter3 = await db.has(`${message.author.id}_moneyprintermk3`);
            let HasMoneyPrinter2 = await db.has(`${message.author.id}_moneyprintermk2`);
            if (HasMoneyPrinter2 || HasMoneyPrinter3) {
                let MoneyPrinter3 = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk3`));
                let MoneyPrinter3Upgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk3'].upgrade);
                MoneyPrinter3 = MoneyPrinter3 * MoneyPrinter3Upgrade;

                let MoneyPrinter2 = Util.NotNumberCheck(await db.get(`${message.author.id}_moneyprintermk2`));
                let MoneyPrinter2Upgrade = Util.NotNumberCheck(Game.upgrades['moneyprintermk2'].upgrade);
                MoneyPrinter2 = MoneyPrinter2 * MoneyPrinter2Upgrade;

                let NumerToAdd2 = Math.floor(1 + MoneyPrinter2 + MoneyPrinter3);

                await db.add(`${message.author.id}_balance`, NumerToAdd2);
            }

            await db.add(`${message.author.id}_experience`, 5);
            await db.add(`botstats_totalcommand`, 1);

            let DBexperience = await db.get(`${message.author.id}_experience`);
            let DBLevels = 0;
            let DBValue = parseInt(DBexperience);
            for (let i = 0; i < 999; i++) {
                DBValue = DBValue - (400 * i);
                if (DBValue > 0) {
                    DBLevels += 1;
                }
                else {
                    break;
                }
            }
            await db.set(`${message.author.id}_level`, DBLevels);
        
            command.execute(client, message, args);

            var end = new Date() - start;
            let channel = client.channels.cache.get("841092321448951838");
            if (channel) {
                channel.send(`${message.guild.name} - ${message.channel.name} -> ${message.author.tag}: ${message.content}`);
            }
            console.log(`${message.guild.name} - ${message.channel.name} -> ${message.author.tag}: ${message.content} (Tiempo de respuesta %dms)`, end);
        } catch (error) {
            console.error(error);
            message.reply('Perdon! Un error ha ocurrido intentando hacer eso!');
        }
    }
    catch (err) {
        console.log(err);
    }
});

client.on('guildMemberAdd', async member => {
    try {
        await db.set(`${member.id}_info`, `${member.user.tag}`);

        let ServerWelcome = await db.get(`${member.guild.id}_welcome`);
        if (ServerWelcome == "0") return;

        let channel = member.guild.channels.cache.get(ServerWelcome.toString());
        if (!channel) {
            return await db.set(`${member.guild.id}_welcome`, "0");
        }

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('./img/wallpaper.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Slightly smaller text placed above the member's display name
        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Bienvenido al servidor,', canvas.width / 2.5, canvas.height / 3.5);

        // Add an exclamation point here and below
        ctx.font = Util.jsapplyText(canvas, `${member.displayName}!`);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

        channel.send(`Bienvenido al servidor, ${member}!`, attachment);
    }
    catch (err) {
        console.log(err);
    }
});

client.on("guildCreate", guild => {
    try {
        db.set(`${guild.id}_info`, `${guild.name}`);
        const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
        
        const welcomer = new Discord.MessageEmbed()
          .setTitle(guild.name)
          .setDescription(`Ohayo, soy Kitsunity UwU, gracias por invitarme a tu servidor, si tienes problemas puedes visitar **[mi sitio web](https://kitsunity.glitch.me)** o puedes utilizar **k=help** para ver los comandos uwu`)
          .setColor("RANDOM")
          .setImage('https://i.imgur.com/oPEvNK8.gif')
        channel.send(welcomer)

        client.users.cache.get(ownerid).send(`Se ha unido un nuevo servidor: ${guild.name} (id: ${guild.id}). Este servidor tiene ${guild.memberCount} miembros!`);
        client.users.cache.get("841092321448951838").send(`Se ha unido un nuevo servidor: ${guild.name} (id: ${guild.id}). Este servidor tiene ${guild.memberCount} miembros!`);
        console.log(`Se ha unido un nuevo servidor: ${guild.name} (id: ${guild.id}). Este servidor tiene ${guild.memberCount} miembros!`);
    }
    catch (err) {
        console.log(err);
    }
});

client.on("guildDelete", guild => {
    try {
        client.users.cache.get(ownerid).send(`He sido removida de un servidor: ${guild.name} (id: ${guild.id})`);
        client.users.cache.get("841092321448951838").send(`He sido removida de un servidor: ${guild.name} (id: ${guild.id})`);
        console.log(`He sido removida de un servidor: ${guild.name} (id: ${guild.id})`);
    }
    catch (err) {
        console.log(err);
    }
});

/*
dbl.webhook.on('vote', vote => {
  let Reward = 7500;
  if (vote.isWeekend) {
    Reward = Reward * 2;
  }

  let VoteUser = client.users.cache.get(vote.user);
  if (VoteUser) {
    VoteUser.send({
      embed: {
        title: "Vote Reward",
        description: `Thank you for voting!\nEnjoy your **${Util.moneyFormat(Reward)}** reward!`,
        color: "#8B0000",
        timestamp: new Date()
      }
    });
  }

  db.add(`${vote.user}.balance`, Reward);
  console.log(`User with ID ${vote.user} just voted!`);
});*/

keepAlive();
client.login(LIFE);
client.login(token);