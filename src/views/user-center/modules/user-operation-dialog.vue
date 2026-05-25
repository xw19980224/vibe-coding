<script setup lang="ts">
defineOptions({ name: 'UserOperationDialog' });

interface Props {
  userInfo: Api.User.UserInfo;
}

const props = defineProps<Props>();
const visible = defineModel<boolean>('visible', { required: true });

const avatarInput = ref<HTMLInputElement>();
const skillInput = ref('');
const avatarPreview = ref('');

const form = reactive({
  nickname: '',
  introduction: '',
  skills: [] as string[],
  githubUrl: '',
  rednoteUrl: '',
  bilibiliUrl: '',
  juejinUrl: '',
  weiboUrl: '',
  portalUrl: '',
});

watch(visible, (val) => {
  if (val && props.userInfo) {
    form.nickname = props.userInfo.nickname || '';
    form.introduction = props.userInfo.introduction || '';
    form.skills = [];
    form.githubUrl = props.userInfo.githubUrl || '';
    form.rednoteUrl = props.userInfo.rednoteUrl || '';
    form.bilibiliUrl = props.userInfo.bilibiliUrl || '';
    form.juejinUrl = props.userInfo.juejinUrl || '';
    form.weiboUrl = props.userInfo.weiboUrl || '';
    form.portalUrl = props.userInfo.portalUrl || '';
    avatarPreview.value = props.userInfo.avatar || '';
    skillInput.value = '';
  }
});

function triggerAvatarUpload() {
  avatarInput.value?.click();
}

function handleAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    avatarPreview.value = URL.createObjectURL(file);
  }
}

function addSkill() {
  const trimmed = skillInput.value.trim();
  if (trimmed && !form.skills.includes(trimmed)) {
    form.skills.push(trimmed);
    skillInput.value = '';
  }
}

function removeSkill(skill: string) {
  form.skills = form.skills.filter((s) => s !== skill);
}

function handleSave() {
  visible.value = false;
}
</script>

<template>
  <ModalDialog v-model="visible" title="编辑资料" closeOnClickModal closeOnPressEscape>
    <div class="py-2 space-y-5">
      <!-- Avatar Section -->
      <div class="relative rounded-xl py-8 bg-slate-800/40 border border-orange-500/6">
        <div class="flex flex-col items-center gap-3">
          <img
            :src="avatarPreview"
            :alt="props.userInfo.nickname"
            class="w-20 h-20 rounded-full object-cover border-2 border-orange-500/30"
          />
          <button
            class="h-8 px-4 rounded-lg text-xs font-500 cursor-pointer transition-all duration-200 font-mono bg-orange-500/12 border border-orange-500/20"
            style="color: #fb923c"
            @click="triggerAvatarUpload"
          >
            修改头像
          </button>
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            hidden
            @change="handleAvatarChange"
          />
        </div>
      </div>

      <!-- Username -->
      <div>
        <label class="block text-sm font-500 mb-2 text-slate-400">用户名</label>
        <input
          v-model="form.nickname"
          type="text"
          maxlength="15"
          placeholder="给自己取个名字..."
          class="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-200 text-slate-100 font-mono bg-slate-800/50 border border-orange-500/10"
        />
        <div class="text-right text-xs mt-1 text-slate-500">{{ form.nickname.length }}/15</div>
      </div>

      <!-- Introduction -->
      <div>
        <label class="block text-sm font-500 mb-2 text-slate-400">简介</label>
        <textarea
          v-model="form.introduction"
          rows="3"
          maxlength="50"
          placeholder="介绍一下自己，让更多人认识你..."
          class="w-full p-4 rounded-xl text-sm outline-none resize-none transition-all duration-200 text-slate-100 font-mono bg-slate-800/50 border border-orange-500/10"
        />
        <div class="text-right text-xs mt-1 text-slate-500">{{ form.introduction.length }}/50</div>
      </div>

      <!-- Skills -->
      <div>
        <label class="block text-sm font-500 mb-2 text-slate-400">技能</label>
        <div class="flex items-center gap-2 mb-3">
          <input
            v-model="skillInput"
            type="text"
            placeholder="输入技能后按回车添加..."
            class="flex-1 h-10 px-4 rounded-lg text-xs outline-none transition-all duration-200 text-slate-100 font-mono bg-slate-800/50 border border-orange-500/10"
            @keyup.enter="addSkill"
          />
          <button
            class="h-10 px-4 rounded-lg text-xs font-500 cursor-pointer transition-all duration-200 shrink-0 font-mono bg-orange-500/12"
            style="color: #f97316"
            @click="addSkill"
          >
            添加
          </button>
        </div>
        <div v-if="form.skills.length" class="flex flex-wrap gap-2">
          <span
            v-for="skill in form.skills"
            :key="skill"
            class="h-7 px-3 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all duration-200 font-mono bg-orange-500/10"
            style="color: #fb923c"
            @click="removeSkill(skill)"
          >
            {{ skill }}
            <span class="text-xs" style="color: #f97316">×</span>
          </span>
        </div>
      </div>

      <!-- Social Links -->
      <div>
        <label class="block text-sm font-500 mb-3 text-slate-400">社交账号链接</label>
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <div
              class="h-11 w-24 px-3 rounded-xl text-xs flex items-center shrink-0 text-slate-400 font-mono bg-slate-800/50 border border-orange-500/8"
            >
              GitHub
            </div>
            <input
              v-model="form.githubUrl"
              type="url"
              placeholder="输入 GitHub 链接..."
              class="flex-1 h-11 px-4 rounded-xl text-xs outline-none transition-all duration-200 text-slate-100 font-mono bg-slate-800/50 border border-orange-500/10"
            />
          </div>
          <div class="flex items-center gap-2">
            <div
              class="h-11 w-24 px-3 rounded-xl text-xs flex items-center shrink-0 text-slate-400 font-mono bg-slate-800/50 border border-orange-500/8"
            >
              小红书
            </div>
            <input
              v-model="form.rednoteUrl"
              type="url"
              placeholder="输入小红书链接..."
              class="flex-1 h-11 px-4 rounded-xl text-xs outline-none transition-all duration-200 text-slate-100 font-mono bg-slate-800/50 border border-orange-500/10"
            />
          </div>
          <div class="flex items-center gap-2">
            <div
              class="h-11 w-24 px-3 rounded-xl text-xs flex items-center shrink-0 text-slate-400 font-mono bg-slate-800/50 border border-orange-500/8"
            >
              Bilibili
            </div>
            <input
              v-model="form.bilibiliUrl"
              type="url"
              placeholder="输入 Bilibili 链接..."
              class="flex-1 h-11 px-4 rounded-xl text-xs outline-none transition-all duration-200 text-slate-100 font-mono bg-slate-800/50 border border-orange-500/10"
            />
          </div>
          <div class="flex items-center gap-2">
            <div
              class="h-11 w-24 px-3 rounded-xl text-xs flex items-center shrink-0 text-slate-400 font-mono bg-slate-800/50 border border-orange-500/8"
            >
              掘金
            </div>
            <input
              v-model="form.juejinUrl"
              type="url"
              placeholder="输入掘金链接..."
              class="flex-1 h-11 px-4 rounded-xl text-xs outline-none transition-all duration-200 text-slate-100 font-mono bg-slate-800/50 border border-orange-500/10"
            />
          </div>
          <div class="flex items-center gap-2">
            <div
              class="h-11 w-24 px-3 rounded-xl text-xs flex items-center shrink-0 text-slate-400 font-mono bg-slate-800/50 border border-orange-500/8"
            >
              微博
            </div>
            <input
              v-model="form.weiboUrl"
              type="url"
              placeholder="输入微博链接..."
              class="flex-1 h-11 px-4 rounded-xl text-xs outline-none transition-all duration-200 text-slate-100 font-mono bg-slate-800/50 border border-orange-500/10"
            />
          </div>
          <div class="flex items-center gap-2">
            <div
              class="h-11 w-24 px-3 rounded-xl text-xs flex items-center shrink-0 text-slate-400 font-mono bg-slate-800/50 border border-orange-500/8"
            >
              个人网站
            </div>
            <input
              v-model="form.portalUrl"
              type="url"
              placeholder="输入个人网站链接..."
              class="flex-1 h-11 px-4 rounded-xl text-xs outline-none transition-all duration-200 text-slate-100 font-mono bg-slate-800/50 border border-orange-500/10"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <button
          class="h-9 px-5 rounded-lg text-sm font-600 cursor-pointer transition-all duration-200 shrink-0 border border-orange-500/30"
          style="background: transparent; color: #f97316"
          @click="visible = false"
        >
          取消
        </button>
        <button
          class="h-9 px-5 rounded-lg text-sm font-600 cursor-pointer transition-all duration-200 shrink-0"
          style="background: linear-gradient(135deg, #f97316, #fb923c); color: #fff"
          @click="handleSave"
        >
          保存
        </button>
      </div>
    </template>
  </ModalDialog>
</template>
