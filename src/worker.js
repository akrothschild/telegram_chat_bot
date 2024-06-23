
import MistralClient from '@mistralai/mistralai';


export default {

    async fetch(request, env, ctx) {
        if (request.method === "POST") {
            const payload = await request.json();
            if ('message' in payload) {
                const chatId = payload.message.chat.id;
                const input = String(payload.message.text);
                const client = new MistralClient(env.MISTRAL_API_KEY);
                const systemSettings = "You are a pleasant AI assistant";
                const chatResponse = await client.chat({
                    model: 'open-mixtral-8x7b',
                    messages: [
                        {role: 'system', content: systemSettings},
                        {role: 'user', content: input}
                    ],
                });
                await this.sendMessage(env.API_KEY, chatId, chatResponse.choices[0].message.content);
            }
        }
        return new Response('OK');
    },

    async sendMessage(apiKey, chatId, text) {
        const url = `https://api.telegram.org/bot${apiKey}/sendMessage?chat_id=${chatId}&text=${text}`;
        const data = await fetch(url).then(resp => resp.json());
    }
};
