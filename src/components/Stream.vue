<template>
    <div>
      <h1>OpenAI API Example</h1>
      <textarea v-model="prompt" placeholder="Enter your prompt"></textarea>
      <button @click="generateText">Generate</button>
      <div v-if="generatedText">
        <h2>Generated Text:</h2>
        <p>{{ generatedText }}</p>
      </div>
    </div>
  </template>
   
  <script setup lang="ts">
  import axios from 'axios';
  import { ref } from 'vue';
  const prompt = ref('');
  const generatedText = ref('');
  const my_key = 'sk-Gf5tjuMlFciGMXr1JoHP4f5bIrUtl2DDcXEJpkZkHzpW0T2a'//这里填写自己的key
   
  const generateText = async () => {
    const url = 'https://api.chatanywhere.tech/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${my_key}`,
    };
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'assistant', content: prompt.value } // 确保 prompt.value 是有效的字符串
      ],
      temperature: 0.7
    };
   
   
    try {
      const response = await axios.post(url, data, { headers });
      const result = response.data;
      if (result.choices && result.choices.length > 0) {
        generatedText.value = result.choices[0].message.content; // 更新生成的文本
      } else {
        generatedText.value = 'Error generating text';
      }
    } catch (error) {
      console.error('Error:', error);
      generatedText.value = 'Error generating text';
    }
  };
  </script>
  <style scoped lang="scss"></style>