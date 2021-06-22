<template>
  <div>
    <test-undo />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TestUndo from "@/components/TestUndo.vue";

@Component({
  components: {
    TestUndo,
  },
})
export default class Space extends Vue {}
</script>
