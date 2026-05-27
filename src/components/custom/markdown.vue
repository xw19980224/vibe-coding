<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import MarkdownItAbbr from 'markdown-it-abbr';
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItFootnote from 'markdown-it-footnote';
import MarkdownItSub from 'markdown-it-sub';
import MarkdownItSup from 'markdown-it-sup';
import MarkdownItTasklists from 'markdown-it-task-lists';
import MarkdownItTOC from 'markdown-it-toc-done-right';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

defineOptions({ name: 'Markdown' });

interface Props {
  source: string;
}

const props = withDefaults(defineProps<Props>(), {
  source: '',
});

const markdown = new MarkdownIt({
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch { }
    }

    return ''; // use external default escaping
  },
})
  .use(MarkdownItAbbr)
  .use(MarkdownItAnchor)
  .use(MarkdownItFootnote)
  .use(MarkdownItSub)
  .use(MarkdownItSup)
  .use(MarkdownItTasklists)
  .use(MarkdownItTOC);

const markdownText = computed(() => {
  return markdown.render(props.source);
});
</script>
<template>
  <div class=" w-full prose prose-invert" v-html="markdownText" />
</template>

<style scoped>
.prose {
  word-break: break-word;
}

.prose :deep(pre) {
  overflow-x: auto;
}

.prose :deep(img) {
  max-width: 100%;
}

.prose :deep(table) {
  display: block;
  overflow-x: auto;
}
</style>
