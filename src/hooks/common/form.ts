import { ref } from 'vue';
import { REG_CODE_SIX, REG_EMAIL } from '@/constants/reg';
import type { FormInstance } from 'element-plus';

export function useFormRules() {
  const patternRules = {
    code: {
      pattern: REG_CODE_SIX,
      message: '验证码格式不正确',
      trigger: 'change',
    },
    email: {
      pattern: REG_EMAIL,
      message: '邮件格式不正确',
      trigger: 'change',
    },
  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    code: [createRequiredRule('请输入验证码'), patternRules.code],
    email: [createRequiredRule('请输入邮箱'), patternRules.email],
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule('不能为空');

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message,
    };
  }

  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
  };
}

export function useNaiveForm() {
  const formRef = ref<FormInstance | null>(null);

  async function validate() {
    await formRef.value?.validate();
  }

  async function restoreValidation() {
    formRef.value?.resetFields();
  }

  return {
    formRef,
    validate,
    restoreValidation,
  };
}
