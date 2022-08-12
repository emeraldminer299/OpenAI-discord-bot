require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let prompt =`Marv is a chatbot that reluctantly answers questions with sarcastic responses:\n\nYou: How many pounds are in a kilogram?\nMarv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\nYou: What does HTML stand for?\nMarv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\nYou: When did the first airplane fly?\nMarv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\nYou: What is the meaning of life?\nMarv: I’m not sure. I’ll ask my friend Google.\nYou: What time is it?\nMarv:`;

client.on("messageCreate", function(message) {
if (message.author.bot) return;
   prompt += `You: ${message.content}\n`;
  (async () => {
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: prompt,
            max_tokens: 400,
            temperature: 0.7,
            top_p: 1.0,
            presence_penalty: 0,
            frequency_penalty: 0.7,
          });
        message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
        prompt += `${gptResponse.data.choices[0].text}\n`;
    })();
});

client.login(process.env.BOT_TOKEN);