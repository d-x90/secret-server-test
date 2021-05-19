<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <NewSecretForm @addHash="addHash" />
  <hr />
  <GetSecretForm :selectedHash="selectedHash" />
  <h2>Hashes recently added</h2>
  <ul>
    <li v-for="hash in recentHashes" :key="hash" @click="onHashClick(hash)">
      {{ hash }}
    </li>
  </ul>
</template>

<script>
import { ref } from "vue";
import NewSecretForm from "./components/NewSecretForm.vue";
import GetSecretForm from "./components/GetSecretForm.vue";

export default {
  name: "App",
  components: {
    NewSecretForm,
    GetSecretForm,
  },
  setup() {
    const recentHashes = ref([]);
    const selectedHash = ref("");
    const addHash = ({ hash }) => {
      recentHashes.value.push(hash);
    };

    const onHashClick = (hash) => {
      selectedHash.value = "";
      // Workaround for watch only running callback when prop changed in GetSecretForm
      setTimeout(() => (selectedHash.value = hash), 0);
    };

    return {
      recentHashes,
      addHash,
      onHashClick,
      selectedHash,
    };
  },
};
</script>

<style>
html {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  font-size: 20px;
}

hr {
  width: 40vw;
}

ul {
  list-style: none;
}

li {
  cursor: pointer;
  margin-bottom: 8px;
}
</style>
