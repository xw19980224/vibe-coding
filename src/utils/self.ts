import { useAuthStore } from "@/stores/modules/auth";
import type { Directive } from "vue";

export const isSelf: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {

    const currLoginNickname = useAuthStore().userInfo?.nickname;
    const { value } = binding;
    if (value) {
      const requiredLoginNickname = value;
      if (currLoginNickname !== requiredLoginNickname) {
        el.parentNode?.removeChild(el);
      }
    } else {
      throw new Error('need user id! Like: v-is-self="123"');
    }
  }
}
