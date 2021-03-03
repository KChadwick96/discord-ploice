import Discord from "discord.js";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "development") {
  dotenv.config();
}

const client = new Discord.Client({ ws: { intents: ["GUILD_VOICE_STATES"] } });

client.login(process.env.BOT_TOKEN);

client.on("message", async (message) => {
  if (!message.guild) return;

  if (message.content === "/ploice") {
    if (message.member.voice.channel) {
      const alreadyInChannel = message.member.voice.channel.members.find(
        (member) => member.user.id === client.user.id
      );
      if (alreadyInChannel) {
        return message.channel.send("The PLOICE are already here!");
      }

      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play("./audio/siren.mp3", { volume: 0.5 });

      await message.channel.send(
        `${message.member.displayName} has called the PLOICE!`
      );

      dispatcher.on("finish", () => {
        connection.disconnect();
      });
    } else {
      message.channel.send("You need to join a voice channel first!");
    }
  }
});
