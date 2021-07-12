const client = require('../index')
const { MessageEmbed, MessageAttachment } = require("discord.js");
const Schema = require('../models/welcomeChannel')
const canvas = require('discord-canvas')

client.on("guildMemberAdd", async (member) => {
  Schema.findOne({ Guild: member.guild.id }, async (e, data) => {
    if (!data) return;
    const user = member.user
    const image = new canvas.Welcome()
      .setUsername(user.username)
      .setDiscriminator(user.discriminator)
      .setMemberCount(member.guild.memberCount)
      .setGuildName(member.guild.name)
      .setAvatar(user.displayAvatarURL({ format: "png" }))
      .setColor("border", "#ff009d")
      .setColor("username-box", "#ff009d")
      .setColor("discriminator-box", "#ff009d")
      .setColor("message-box", "#ff009d")
      .setColor("title", "#ff009d")
      .setColor("avatar", "#ff009d")
      .setBackground(
        "פה את התמונה שלך של הרקע"
      )
      .toAttachment()

    const attachment = new MessageAttachment(
      (await image).toBuffer(),
      "goodbye-image.png"
    )

    const channel = member.guild.channels.cache.get(data.Channel)

    channel.send(attachment)
  });
});