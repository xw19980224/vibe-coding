import { useCountDown, useLoading } from '@a02/hooks';
import { REG_EMAIL } from '@/constants/reg.ts';

export function useCaptcha() {
  const { loading, startLoading, endLoading } = useLoading();
  const { count, start, stop, isCounting } = useCountDown(60);

  const label = computed(() => {
    let text = '获取验证码';

    const countingLabel = `${count.value}秒后重新获取`;

    if (loading.value) {
      return '';
    }

    if (isCounting.value) {
      text = countingLabel;
    }

    return text;
  });

  function isEmailValid(email: string) {
    if (email.trim() === '') {
      window.$message?.error?.('请输入邮件');

      return false;
    }

    if (!REG_EMAIL.test(email)) {
      window.$message?.error?.('邮件格式不正确');

      return false;
    }
    return true;
  }

  async function getEmailCaptcha(email: string) {
    const valid = isEmailValid(email);

    if (!valid || loading.value) {
      return;
    }

    startLoading();

    // request
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    window.$message?.success?.('验证码发送成功');

    start();

    endLoading();
  }

  return {
    label,
    start,
    stop,
    isCounting,
    loading,
    getEmailCaptcha,
  };
}
