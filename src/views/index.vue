<template>
    <div class="w-700px">
        <div v-if="generatedText">
            <div >

            </div>
            <div  class="border-rd-12px bg-#6d5ffd0d;" v-for="(item, index) in generatedText" :key="index">
                <p>{{ item.content }}</p>
            </div>
        </div>
        <div class="flex items-center justify-center space-x-2">
            <Textarea class="w-600px mr-10px" v-model:value="messages"
                placeholder="在此输入你的问题"
                :auto-size="{ minRows: 2, maxRows: 5 }"/>

            <Button type="primary" size="large" @click="generateText">
                <template #icon>
                    <SendOutlined />
                </template>
            </Button>
        </div>
    </div>
</template>
   
<script setup lang="ts">
import { Textarea, Button } from 'ant-design-vue'
import {
    SendOutlined
} from '@ant-design/icons-vue'
import { getChatgpt_Multurn_qa } from '../serve/gpt.ts'

const messages = ref('');
const generatedText = ref([{
    content: '',
    role: '',
    id: 0,
}]);
// const messages = ref([{
//     content: '',
//     role: '',
//     id: 0,
// }]);


const currentDialogId = ref<number | null>(null)

const dialogId: number | null = parseInt(localStorage.getItem('lastId')!);
currentDialogId.value = dialogId

const generateText = async () => {
    // 获取聊天机器人的回复
    for await (const result of getChatgpt_Multurn_qa(messages.value)) {
        // 如果返回的结果 ID 与当前对话 ID 相同，则将聊天机器人的回复拼接到当前对话中
        if (result.id == currentDialogId.value) {

            const index = generatedText.value.findIndex(item => item.id === currentDialogId.value)
            const dialog = generatedText.value[index]
            dialog.content += result.content
        } else {
            currentDialogId.value = result.id
            generatedText.value.push({
                content: result.content,
                role: result.role,
                id: result.id,
            })
            //   messages.value.push({
            //   role: "assistant",
            //   content: result.content
            // })
        }
    }
};




</script>
  