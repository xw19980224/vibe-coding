import type { App } from "vue";
import { isSelf } from "@/utils/self";

export function setupDirectives(app: App) {
  app.directive('isSelf', isSelf);
}
