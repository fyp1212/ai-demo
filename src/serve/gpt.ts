// const CHATGPT_API_URL = 'https://api.chatanywhere.tech/v1/chat/completions'
const CHATGPT_API_URL = 'http://8.138.133.120:8080/api/v1/aic'

// const OPENAI_API_KEY = 'sk-Gf5tjuMlFciGMXr1JoHP4f5bIrUtl2DDcXEJpkZkHzpW0T2a'
// TODO 适用直接调chatgpt接口
  export async function* getChatgpt_Multurn_qa(messages:string) {
    const response = await fetch(CHATGPT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${ OPENAI_API_KEY }`
      },
      body: JSON.stringify({
        question:messages,
        stream: true,
      })
    });
 
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
 
  const reader = response.body!.getReader();
  
  let decoder = new TextDecoder();
  const stepTime =  Date.now()
  let resultData = '';
 
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    resultData += decoder.decode(value);
    console.log(resultData);
    
    while (resultData.includes('\n')) {
        const messageIndex = resultData.indexOf('\n');
        const message = resultData.slice(0, messageIndex);
        resultData = resultData.slice(messageIndex + 1);
        if (message.startsWith('data:')) {
            const content = message.substring(5);
            
            yield {
                content: content,
                role: "assistant",
                id:stepTime 
            };
            localStorage.setItem('lastId', stepTime.toString());  
        }
    }
}
}