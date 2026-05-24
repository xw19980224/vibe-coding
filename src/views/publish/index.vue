<script setup lang="ts">
import { useRouter } from 'vue-router';
import Steps from '@/components/custom/steps.vue';
import StepBasic from './modules/step-basic.vue';
import StepExtended from './modules/step-extended.vue';
import StepDescription from './modules/step-description.vue';
import StepTags from './modules/step-tags.vue';

defineOptions({ name: 'PublishPage' });

const router = useRouter();

const step = ref(1);
const publishing = ref(false);
const published = ref(false);

const form = reactive<Api.VibeCoding.VibeProject>({
  id: 0,
  coverUrl: '',
  title: '',
  description: '',
  tags: [],
  category: undefined,
  platform: undefined,
  likes: 0,
  views: 0,
  screenshots: [],
  demoUrl: '',
  repoUrl: '',
  languages: [],
  duration: '',
  tools: [],
  model: '',
  mcps: [],
  skills: [],
  instructions: '',
  isOnline: false,
  onlineDate: '',
  license: '',
  featured: false,
  status: 1,
  createdAt: '',
});

const steps = [
  { value: 1, label: '基本信息' },
  { value: 2, label: '补充信息' },
  { value: 3, label: '描述' },
  { value: 4, label: '标签' },
];

const tagInput = ref('');

function addTag() {
  const trimmed = tagInput.value.trim();
  if (trimmed && !form.tags.includes(trimmed)) {
    form.tags.push(trimmed);
    tagInput.value = '';
  }
}

function removeTag(tag: string) {
  form.tags = form.tags.filter((t) => t !== tag);
}

function nextStep() {
  if (step.value === 1 && !form.title.trim()) return;
  if (step.value === 3 && !form.description.trim()) return;
  step.value++;
}

function prevStep() {
  if (step.value > 1) step.value--;
}

async function submit() {
  publishing.value = true;
  await new Promise((r) => setTimeout(r, 1500));
  publishing.value = false;
  published.value = true;
  setTimeout(() => {
    router.push('/');
  }, 2000);
}
</script>

<template>
  <!-- Published Success -->
  <div v-if="published" class="pt-32 flex flex-col items-center">
    <div
      class="w-20 h-20 rounded-full flex items-center justify-center mb-6"
      style="background: rgba(34, 197, 94, 0.1); border: 2px solid rgba(34, 197, 94, 0.3)"
    >
      <span class="text-3xl" style="color: #4ade80">OK</span>
    </div>
    <h2 class="text-2xl font-700 mb-2 text-slate-100" style="font-family: Orbitron, sans-serif">
      发布成功!
    </h2>
    <p class="text-sm text-slate-400" >正在跳转回首页...</p>
  </div>

  <!-- Form -->
  <div v-else class="pt-20 pb-12 px-4 max-w-2xl mx-auto">
    <Steps :steps="steps" :current="step">
      <template #default="{ index }">
        <StepBasic v-if="index === 1" v-model:form="form" @next="nextStep" />
        <StepExtended v-if="index === 2" v-model:form="form" @next="nextStep" @prev="prevStep" />
        <StepDescription v-if="index === 3" v-model:form="form" @next="nextStep" @prev="prevStep" />
        <StepTags
          v-if="index === 4"
          v-model:form="form"
          v-model:tag-input="tagInput"
          v-model:publishing="publishing"
          @add-tag="addTag"
          @remove-tag="removeTag"
          @prev="prevStep"
          @submit="submit"
        />
      </template>
    </Steps>
  </div>
</template>
