const CHATGPT_API_URL = 'https://api.chatanywhere.tech/v1/chat/completions'

const OPENAI_API_KEY = 'sk-Gf5tjuMlFciGMXr1JoHP4f5bIrUtl2DDcXEJpkZkHzpW0T2a'
// TODO 适用直接调chatgpt接口
export async function* getChatgpt_Multurn_qa(messages) {
  const response = await fetch(CHATGPT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ OPENAI_API_KEY }`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        { role: 'assistant', content: messages} // 确保 prompt.value 是有效的字符串
      ],
      temperature: 0.7
    })
  });
 
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
 
  const reader = response.body.getReader();
  let decoder = new TextDecoder();
  let resultData = '';
 
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    resultData += decoder.decode(value);
    while (resultData.includes('\n')) {
      const messageIndex = resultData.indexOf('\n');
      const message = resultData.slice(0, messageIndex);
      resultData = resultData.slice(messageIndex + 1);
      if (message.startsWith('data: ')) {
        const jsonMessage = JSON.parse(message.substring(5));
        if (resultData.includes('[DONE]')) {
          break
        }
        const createdID = jsonMessage.created
        yield {
          content: jsonMessage.choices[0]?.delta?.content || '',
          role: "assistant",
          id: createdID
        };
      }
    }
  }
}