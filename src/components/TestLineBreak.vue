<template>
  <div class="test">
    <p @click="showLines">
      If a block level element contains plain text only, you can get the text of the auto-wrapped lines using DOMRect object of two ranges. Create a range (range) of the textnode inside the element to get the text of a line, and another range (hTracker) to keep book of the height of DOMRect object, when increasing the end position of the ranges. When the height of the range changes, store the text in the previous range to an array, and set the start position of range to the end of the current line. The code is as the following
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TestLineBreak extends Vue {
  name = 'TestLineBreak'

  // https://stackoverflow.com/questions/62749538/find-how-the-lines-are-split-in-a-word-wrapped-element
  private test () {
    let divs = document.querySelectorAll('p');

    for (let div of divs) {
      let wordBreak = [];
      const words = div.innerText.split(" ");
      console.log('word', words)
      div.innerText = words[0];
      let beforeBreak = words[0];
      let height = div.offsetHeight;

      for (let i = 1; i < words.length; i++) {
        div.innerText += ' ' + words[i];
        if (div.offsetHeight > height) {
          height = div.offsetHeight;
          wordBreak.push(beforeBreak);
          beforeBreak = words[i];
        } else {
          beforeBreak += ' ' + words[i];
        }
      }

      wordBreak.push(beforeBreak);
      console.log(wordBreak);
    }
  }

  mounted () {
    this.test()
  }

  private showLines(e: any) {
    const el = e.target,
        node = el.firstChild,
        range = document.createRange(),
        len = e.target.textContent.length,
        texts = [];
    let hTracker, y, oldY;
    console.log('node', node, e.target)
    range.selectNodeContents(el);
    range.collapse();
    hTracker = range.cloneRange();
    hTracker.setEnd(node, 1);
    oldY = hTracker.getBoundingClientRect().height;
    for (let n = 0; n < len; n++) {
      hTracker.setEnd(node, n);
      range.setEnd(node, n);
      y = hTracker.getBoundingClientRect().height;
      if (y > oldY || n === len - 1) {
        // Line changed, resume the previous range (not when at the end of the text)
        // @ts-ignore
        range.setEnd(node, n - (n !== len - 1));
        // Store the text of the line
        texts.push(range.toString());
        // Set the start of the range to the end of the previous line
        range.setStart(node, n - 1);
        oldY = y;
      }
    }
    console.log(texts);
  }


}
</script>

<style lang="less" scoped>
.test {
  p {
    font-size: 15px;
  }
}
</style>
