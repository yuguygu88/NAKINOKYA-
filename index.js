const { Collection, Client, Discord, MessageEmbed, MessageAttachment } = require('discord.js')
const canvas = require("discord-canvas");
const Canvacord = require('canvacord')
const fs = require("fs")
const client = new Client({
  disableEveryone: true,
  partials: ["MESSAGE", "CHANNEL", "REACTION"]
});
const mongoose = require('mongoose');
mongoose.connect('your-mongodblink', { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = client;
client.commands = new Collection();
const config = require('./config.json')
const prefix = config.prefix
const token = config.token

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    console.log(`Loading event ${eventName}`);
  });
});

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Loading command ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});
client.on('ready', () => {
  client.user.setActivity(`Prefix test .`)
  console.log(`${client.user.username} ✅`)
});
client.on('message', async message =>{
  if(message.author.bot) return;
  if(!message.content.startsWith(prefix)) return;
  if(!message.guild) return;
  if(!message.member) message.member = await message.guild.fetchMember(message);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if(cmd.length == 0 ) return;
  let command = client.commands.get(cmd)
  if(!command) command = client.commands.get(client.aliases.get(cmd));
  if(command) command.run(client, message, args) 
})

client.login(token)
