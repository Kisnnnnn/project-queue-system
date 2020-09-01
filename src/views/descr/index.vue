<template>
  <div>
    <MarkdownPreview :bordered="false"
      isPreview
      style="height: auto;"
      v-model="mdValue" />
  </div>
</template>
<script>
import MarkdownPreview from 'vue-meditor';
import axios from 'axios';

export default {
  components: {
    MarkdownPreview,
  },
  data() {
    return {
      mdValue: '',
    };
  },
  created() {
    let bootUrl =
      window.location.origin +
      window.location.pathname.replace('/index.html', '');

    axios.get(bootUrl + '/update.md').then(({ data }) => {
      this.mdValue = data;
    });
  },
  methods: {},
};
</script>
<style lang='scss' scoped>
</style>