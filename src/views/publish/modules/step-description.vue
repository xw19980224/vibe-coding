<script setup lang="ts">
defineOptions({ name: 'StepDescription' });

const form = defineModel<Api.VibeCoding.publishVibeProjectForm>('form', { required: true });
async function validate() { }

defineExpose({ validate })
</script>

<template>
  <ElForm ref="formRef" label-position="top">
    <ElFormItem label="项目说明书" prop="instructions">
      <ElInput v-model="form.instructions" type="textarea" :rows="5" placeholder="描述你的作品、用了什么技术、有什么亮点..." />
    </ElFormItem>
  </ElForm>
  <Markdown v-if="form.instructions" :source="form.instructions" />
</template>
