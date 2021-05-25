const Discord = require('discord.js');
const animaction = require('../../util/animaction/index.js');

module.exports = {
    name: 'dance',
    description: "Muestra tus pasos owo",
    aliases: [],
    usage: '',
    cooldown: 2,
    args: 0,
    catergory: 'Reacción',
    async execute(client, message, args) {
        message.react('✨');
            if (message.mentions.members.size === 0) {
                const dance = animaction.dance();
                const botaction = [
                    `**${message.author.username}** esta bailando :3`,
                    `**${message.author.username}** muestra sus grandes pasos!! .w.`
                ]
                randombot = botaction[Math.floor(Math.random() * Math.floor(botaction.length))];
                const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(randombot)
                .setImage(dance)
                return message.channel.send(embed);
            }
            const member = message.mentions.members.first();
            const dance = animaction.dance();
            if (member.user.id === message.author.id) {
                const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`**${message.author.username}** esta bailando frente a un espejo .w.`)
                .setImage(dance)
                return message.channel.send(embed);
            } else if (member.user.id === client.user.id) {
                const botaction = [
                    `**${message.author.username}** esta bailando conmigo, grandes pasos amig@ .w.`,
                    `**${message.author.username}** se puso a bailar conmigo -Se alegra- nwn`
                ]
                randombot = botaction[Math.floor(Math.random() * Math.floor(botaction.length))];
                const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(randombot)
                .setImage(dance)
                return message.channel.send(embed);
            } else {
            const randomaction = [
                `**${message.author.username}** se puso a bailar con **${member.user.username}** >w<`,
                `**${message.author.username}** demuestra sus pasos a **${member.user.username}**!!! :D`
            ] //Respuestas posibles
            randomsg = randomaction[Math.floor(Math.random() * Math.floor(randomaction.length))];
            const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(randombot)
            .setImage(dance)
            return message.channel.send(embed);
            }
      }
  };