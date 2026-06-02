<script setup lang="ts">
import { useNaiveForm } from '@/hooks/common/form.ts';
import { useDict } from '@/hooks/common/dict.ts';
import { DictTypes } from '@/enum/dict.ts';

defineOptions({ name: 'StepExtended' });

const { formRef, validate } = useNaiveForm();

const form = defineModel<Api.VibeCoding.publishVibeCodingForm>('form', { required: true });

const rules: Record<string, App.Global.FormRule[]> = {};

const dict = useDict(DictTypes.TAG, DictTypes.DURATION, DictTypes.LICENSE);

const tagOptions = computed(() => dict[DictTypes.TAG]?.value ?? []);
const durationOptions = computed(() => dict[DictTypes.DURATION]?.value ?? []);
const licenseOptions = computed(() => dict[DictTypes.LICENSE]?.value ?? []);

defineExpose({ validate });
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-6">
    <!-- 标签 -->
    <ElFormItem label="标签">
      <ElSelect v-model="form.tags" placeholder="选择标签" multiple>
        <ElOption
          v-for="opt in tagOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </ElSelect>
    </ElFormItem>

    <!-- 开发周期 -->
    <ElFormItem label="开发周期">
      <ElSelect v-model="form.duration" placeholder="选择开发周期" clearable>
        <ElOption
          v-for="opt in durationOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </ElSelect>
    </ElFormItem>

    <!-- 仓库地址 -->
    <ElFormItem label="仓库地址">
      <ElInput v-model="form.repoUrl" placeholder="GitHub / Gitee 仓库地址..." />
    </ElFormItem>

    <!-- 演示地址 -->
    <ElFormItem label="演示地址">
      <ElInput v-model="form.demoUrl" placeholder="在线演示地址..." />
    </ElFormItem>

    <!-- 是否上线 -->
    <ElFormItem label="是否上线">
      <ElSwitch v-model="form.isOnline" />
    </ElFormItem>

    <!-- 上线日期 -->
    <ElFormItem v-if="form.isOnline" label="上线日期">
      <ElDatePicker v-model="form.onlineDate" type="date" placeholder="选择上线日期" />
    </ElFormItem>

    <!-- 许可证 -->
    <ElFormItem label="许可证">
      <ElSelect v-model="form.license" placeholder="选择许可证" clearable>
        <ElOption
          v-for="opt in licenseOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </ElSelect>
    </ElFormItem>
  </ElForm>
</template>
