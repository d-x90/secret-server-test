<template>
  <div class="get-secret-form">
    <h1>Get secret</h1>
    <form @submit.prevent="getSecret(hash)">
      <div class="input-with-label">
        <label for="hash">Hash:</label>
        <input v-model="hash" id="hash" name="hash" type="text" required />
      </div>
      <button>Get secret</button>
    </form>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "GetSecretForm",
  emits: ["addHash"],
  props: {
    selectedHash: String,
  },
  setup(props) {
    const hash = ref("");

    watch(
      () => props.selectedHash,
      (newSelectedHash) => {
        hash.value = newSelectedHash;
      }
    );

    const getSecret = async (hash) => {
      const response = await fetch(`http://localhost:8000/api/secret/${hash}`);

      if (response.status === 200) {
        const secret = await response.json();
        alert(`\
        secret: ${secret.secretText}
        remaining views: ${secret.remainingViews}
        expires at: ${
          secret.expiresAt !== null
            ? new Date(secret.expiresAt).toLocaleString()
            : "never"
        }\
        `);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    };

    return {
      getSecret,
      hash,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
form {
  width: 40vw;
  display: flex;
  flex-direction: column;
}

form > * {
  margin-bottom: 6px;
}

.input-with-label {
  display: flex;
  justify-content: space-between;
}

input {
  font-size: 15px;
  flex-basis: 50%;
}

button {
  margin-top: 8px;
  align-self: center;
  padding: 8px;
  font-size: 16px;
}
</style>
