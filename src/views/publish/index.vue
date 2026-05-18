<script setup lang="ts">
import { useRouter } from 'vue-router';
import { mockCategories } from '@/mock/vibe-works';

defineOptions({ name: 'PublishPage' });

const router = useRouter();

const step = ref(1);
const publishing = ref(false);
const published = ref(false);

const form = reactive({
  title: '',
  description: '',
  category: 'web',
  tags: [] as string[],
  vibePrompt: '',
  codeSnippet: '',
  link: '',
});

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
  if (step.value === 2 && !form.description.trim()) return;
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
    <h2 class="text-2xl font-700 mb-2" style="color: #f1f5f9; font-family: Orbitron, sans-serif">
      发布成功!
    </h2>
    <p class="text-sm" style="color: #94a3b8">正在跳转回首页...</p>
  </div>

  <!-- Form -->
  <div v-else class="pt-20 pb-12 px-4 max-w-2xl mx-auto">
    <h1
      class="text-2xl md:text-3xl font-700 mb-2 tracking-wider"
      style="font-family: Orbitron, sans-serif; color: #f1f5f9"
    >
      发布作品
    </h1>
    <p class="text-sm mb-8" style="color: #64748b; font-family: 'JetBrains Mono', monospace">
      Step {{ step }} / 3
    </p>

    <!-- Progress -->
    <div class="flex gap-2 mb-10">
      <div
        v-for="i in 3"
        :key="i"
        class="flex-1 h-1 rounded-full transition-all duration-300"
        :style="{
          background:
            i <= step ? 'linear-gradient(90deg, #F97316, #FB923C)' : 'rgba(249, 115, 22, 0.1)',
        }"
      />
    </div>

    <!-- Step 1: Basic Info -->
    <div v-if="step === 1" class="space-y-6">
      <div>
        <label class="block text-sm font-500 mb-2" style="color: #94a3b8">作品名称 *</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="给你的作品取个名字..."
          class="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all duration-200"
          style="
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(249, 115, 22, 0.1);
            color: #f1f5f9;
            font-family: 'JetBrains Mono', monospace;
          "
        />
      </div>
      <div>
        <label class="block text-sm font-500 mb-2" style="color: #94a3b8">分类</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in mockCategories.filter((c) => c.id !== 'all')"
            :key="cat.id"
            class="h-9 px-4 rounded-lg text-sm cursor-pointer transition-all duration-200"
            :style="{
              color: form.category === cat.id ? '#F97316' : '#94A3B8',
              background:
                form.category === cat.id ? 'rgba(249, 115, 22, 0.12)' : 'rgba(30, 41, 59, 0.5)',
              border: `1px solid ${form.category === cat.id ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.06)'}`,
              fontFamily: '\'JetBrains Mono\', monospace',
            }"
            @click="form.category = cat.id"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>
      <button
        class="w-full h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200"
        style="background: linear-gradient(135deg, #f97316, #fb923c); color: #fff"
        :style="{
          opacity: form.title.trim() ? 1 : 0.5,
          cursor: form.title.trim() ? 'pointer' : 'not-allowed',
        }"
        @click="nextStep"
      >
        下一步
      </button>
    </div>

    <!-- Step 2: Description + Vibe Prompt -->
    <div v-if="step === 2" class="space-y-6">
      <div>
        <label class="block text-sm font-500 mb-2" style="color: #94a3b8">作品描述 *</label>
        <textarea
          v-model="form.description"
          rows="5"
          placeholder="描述你的作品、用了什么技术、有什么亮点..."
          class="w-full p-4 rounded-xl text-sm outline-none resize-none transition-all duration-200"
          style="
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(249, 115, 22, 0.1);
            color: #f1f5f9;
            font-family: 'JetBrains Mono', monospace;
          "
        />
      </div>
      <div>
        <label class="block text-sm font-500 mb-2" style="color: #94a3b8">Vibe Prompt (可选)</label>
        <textarea
          v-model="form.vibePrompt"
          rows="3"
          placeholder="写出创作时使用的 prompt，让大家感受你的灵感..."
          class="w-full p-4 rounded-xl text-sm outline-none resize-none transition-all duration-200"
          style="
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(249, 115, 22, 0.1);
            color: #f1f5f9;
            font-family: 'JetBrains Mono', monospace;
          "
        />
      </div>
      <div class="flex gap-3">
        <button
          class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200"
          style="
            background: transparent;
            color: #94a3b8;
            border: 1px solid rgba(249, 115, 22, 0.15);
          "
          @click="prevStep"
        >
          上一步
        </button>
        <button
          class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200"
          style="background: linear-gradient(135deg, #f97316, #fb923c); color: #fff"
          @click="nextStep"
        >
          下一步
        </button>
      </div>
    </div>

    <!-- Step 3: Tags + Code + Link -->
    <div v-if="step === 3" class="space-y-6">
      <div>
        <label class="block text-sm font-500 mb-2" style="color: #94a3b8">标签</label>
        <div class="flex items-center gap-2 mb-3">
          <input
            v-model="tagInput"
            type="text"
            placeholder="输入标签后按回车..."
            class="flex-1 h-10 px-4 rounded-lg text-sm outline-none transition-all duration-200"
            style="
              background: rgba(30, 41, 59, 0.5);
              border: 1px solid rgba(249, 115, 22, 0.1);
              color: #f1f5f9;
              font-family: 'JetBrains Mono', monospace;
            "
            @keyup.enter="addTag"
          />
          <button
            class="h-10 px-4 rounded-lg text-sm cursor-pointer"
            style="background: rgba(249, 115, 22, 0.12); color: #f97316"
            @click="addTag"
          >
            添加
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in form.tags"
            :key="tag"
            class="h-7 px-3 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all duration-200"
            style="
              background: rgba(249, 115, 22, 0.1);
              color: #fb923c;
              font-family: 'JetBrains Mono', monospace;
            "
            @click="removeTag(tag)"
          >
            {{ tag }}
            <span class="text-xs" style="color: #f97316">x</span>
          </span>
        </div>
      </div>
      <div>
        <label class="block text-sm font-500 mb-2" style="color: #94a3b8">代码片段 (可选)</label>
        <textarea
          v-model="form.codeSnippet"
          rows="6"
          placeholder="粘贴一段核心代码，展示你的作品灵魂..."
          class="w-full p-4 rounded-xl text-sm outline-none resize-none transition-all duration-200"
          style="
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(249, 115, 22, 0.08);
            color: #94a3b8;
            font-family: 'JetBrains Mono', monospace;
          "
        />
      </div>
      <div>
        <label class="block text-sm font-500 mb-2" style="color: #94a3b8">项目链接 (可选)</label>
        <input
          v-model="form.link"
          type="url"
          placeholder="https://github.com/..."
          class="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all duration-200"
          style="
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(249, 115, 22, 0.1);
            color: #f1f5f9;
            font-family: 'JetBrains Mono', monospace;
          "
        />
      </div>
      <div class="flex gap-3">
        <button
          class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200"
          style="
            background: transparent;
            color: #94a3b8;
            border: 1px solid rgba(249, 115, 22, 0.15);
          "
          @click="prevStep"
        >
          上一步
        </button>
        <button
          class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
          :style="{
            background: publishing ? '#334155' : 'linear-gradient(135deg, #F97316, #FB923C)',
            color: publishing ? '#94A3B8' : '#fff',
          }"
          :disabled="publishing"
          @click="submit"
        >
          <div
            v-if="publishing"
            class="w-4 h-4 rounded-full border-2 border-transparent animate-spin"
            style="border-top-color: #94a3b8"
          />
          {{ publishing ? '发布中...' : '发布作品' }}
        </button>
      </div>
    </div>
  </div>
</template>
