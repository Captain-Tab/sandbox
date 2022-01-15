<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">
        Home
      </router-link> |
      <router-link to="/space">
        space
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import cacheCenter from '@/utils/cacheCenter'

@Component({
  components: {
  },
})
export default class App extends Vue {
 private created() {
   // method 1
  // const reload = cacheCenter.read('reload') === 'true'
  //  !reload && cacheCenter.add('reloadAction', 'true')

   // method 2
   const reload = cacheCenter.read('reload') === 'true'
   reload ? cacheCenter.remove('reload') : cacheCenter.add('reload', 'true')
 }
}
</script>

<style>
@import './assets/css/reset.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
