<template>
  <div>
    <h1>OpenAI API Example</h1>
    <textarea v-model="prompt" placeholder="Enter your prompt"></textarea>
    <button @click="generateText">Generate</button>
    <div v-if="generatedText">
      <h2>Generated Text:</h2>
      <div v-for="(item, index) in generatedText" :key="index">
        <p>{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>
 
<script setup lang="ts">
import { ref } from 'vue';
// @ts-ignore
import { getChatgpt_Multurn_qa } from "./serve/gpt.js";



const prompt = ref([]);
const generatedText = ref([{
  content: '',
  role: '',
  id: null,
  timestamp: 0
}]);


function uniqueId(): string {
  // 获取当前时间戳
  const timestamp: number = new Date().getTime();

  // 生成一个随机数作为后缀，范围在 0 到 999999 之间
  const random: number = Math.floor(Math.random() * 1000000);

  // 将时间戳和随机数拼接成字符串作为唯一标识符
  const id: string = timestamp.toString() + random.toString();

  return id;
}

const currentDialogId = ref<string | null>(null)

const dialogId: string = uniqueId();
currentDialogId.value = dialogId

const generateText = async () => {
  // 获取聊天机器人的回复
  for await (const result of getChatgpt_Multurn_qa(prompt.value)) {
    // 如果返回的结果 ID 与当前对话 ID 相同，则将聊天机器人的回复拼接到当前对话中
    if (result.id === currentDialogId.value) {
      // @ts-ignore
      const index = generatedText.value.findIndex(item => item.id === currentDialogId.value)
      const dialog = generatedText.value[index]
      dialog.content += result.content
    } else {
      currentDialogId.value = result.id
      generatedText.value.push({
        content: result.content,
        role: "assistant",
        id: result.id,
        timestamp: Date.now()
      })
      // prompt.value.push({
      //   content: result.content
      // })
    }
  }
};


</script>
