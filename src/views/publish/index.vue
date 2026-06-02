<script setup lang="ts">
import { useRouter } from 'vue-router';
import Steps from '@/components/custom/steps.vue';
import StepBasic from './modules/step-basic.vue';
import StepExtended from './modules/step-extended.vue';
import StepAi from './modules/step-ai.vue';
import StepDescription from './modules/step-description.vue';
import StepMedia from './modules/step-media.vue';
import StepOverview from './modules/step-overview.vue';
import { VibeCodingAPI } from '@/service/api/vibecoding.ts';

defineOptions({ name: 'PublishPage' });

const router = useRouter();

const step = ref(1);

const form = reactive<Api.VibeCoding.publishVibeCodingForm>({
  title: '',
  subtitle: '',
  languages: [],
  platform: undefined,
  coverUrl: '',
  instructions: '',
  tags: [],
  category: undefined,
  screenshots: [],
  demoUrl: '',
  repoUrl: '',
  duration: '',
  tools: [],
  model: [],
  mcps: [],
  skills: [],
  isOnline: false,
  onlineDate: '',
  license: '',
  featured: false,
});

const steps = [
  { value: 1, label: '基本信息' },
  { value: 2, label: '拓展信息' },
  { value: 3, label: 'AI 工具' },
  { value: 4, label: '项目描述' },
  { value: 5, label: '封面与截图' },
  { value: 6, label: '总览' },
];

/* 步骤组件 ref（调用各步骤的 validate） */
const stepBasicRef = ref<InstanceType<typeof StepBasic>>();
const stepExtendedRef = ref<InstanceType<typeof StepExtended>>();
const stepAiRef = ref<InstanceType<typeof StepAi>>();
const stepDescRef = ref<InstanceType<typeof StepDescription>>();
const stepMediaRef = ref<InstanceType<typeof StepMedia>>();
const stepOverviewRef = ref<InstanceType<typeof StepOverview>>();

const stepRefMap = computed(() => ({
  1: stepBasicRef.value,
  2: stepExtendedRef.value,
  3: stepAiRef.value,
  4: stepDescRef.value,
  5: stepMediaRef.value,
  6: stepOverviewRef.value,
}));

async function nextStep() {
  const current = stepRefMap.value[step.value as keyof typeof stepRefMap.value];
  if (current?.validate) {
    try {
      await current.validate();
    } catch {
      return;
    }
  }
  step.value++;
}

function prevStep() {
  if (step.value > 1) step.value--;
}

async function handleSubmit() {
  const current = stepRefMap.value[step.value as keyof typeof stepRefMap.value];
  if (current?.validate) {
    try {
      await current.validate();
    } catch {
      return;
    }
  }

  const payload: Record<string, unknown> = { ...form };
  // platform → platforms (后端期望数组)
  if (form.platform) {
    payload.platforms = [form.platform];
  }
  delete payload.platform;
  // onlineDate: Date → 13 位时间戳
  if (form.onlineDate) {
    payload.onlineDate =
      form.onlineDate instanceof Date
        ? form.onlineDate.getTime()
        : new Date(form.onlineDate).getTime();
  }

  try {
    await VibeCodingAPI.publish(payload as Api.VibeCoding.publishVibeCodingForm);
    window.$message?.success('作品发布成功');
    setTimeout(() => {
      router.push('/');
    }, 1500);
  } catch {
    window.$message?.error('发布失败，请稍后重试');
  }
}
</script>

<template>
  <!-- Form -->
  <div class="pt-20 pb-12 px-4 max-w-3xl mx-auto">
    <Steps
      :steps="steps"
      :current="step"
      confirm-label="发布作品"
      @prev="prevStep"
      @next="nextStep"
      @confirm="handleSubmit"
    >
      <template #default="{ index }">
        <StepBasic v-if="index === 1" ref="stepBasicRef" v-model:form="form" />
        <StepExtended v-if="index === 2" ref="stepExtendedRef" v-model:form="form" />
        <StepAi v-if="index === 3" ref="stepAiRef" v-model:form="form" />
        <StepDescription v-if="index === 4" ref="stepDescRef" v-model:form="form" />
        <StepMedia v-if="index === 5" ref="stepMediaRef" v-model:form="form" />
        <StepOverview
          v-if="index === 6"
          ref="stepOverviewRef"
          v-model:form="form"
          @jump="step = $event"
        />
      </template>
    </Steps>
  </div>
</template>
