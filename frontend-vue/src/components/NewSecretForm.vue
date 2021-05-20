<template>
  <div class="new-secret-form">
    <h1>Add new secret</h1>
    <form @submit.prevent="addNewSecret">
      <div class="input-with-label">
        <label for="new-secret">New Secret:</label>
        <input
          v-model="newSecret"
          id="new-secret"
          name="newSecret"
          type="text"
          required
        />
      </div>

      <div class="input-with-label">
        <label for="expire-after-views">Expire after views:</label>
        <input
          v-model="expireAfterViews"
          id="expire-after-views"
          name="expireAfterViews"
          type="number"
          min="1"
          required
        />
      </div>

      <div class="input-with-label">
        <label for="expire-after">Number of minutes to expire:</label>
        <input
          v-model="expireAfter"
          id="expire-after"
          name="expireAfter"
          type="number"
          min="0"
          required
        />
      </div>
      <button>Add secret</button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "NewSecretForm",
  emits: ["addHash"],
  setup(props, { emit }) {
    const newSecret = ref("");
    const expireAfterViews = ref(1);
    const expireAfter = ref(0);

    const addNewSecret = async () => {
      if (newSecret.value === "") {
        console.error("Empty secret!");
        return;
      }

      const response = await fetch("http://localhost:8000/api/secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: newSecret.value,
          expireAfterViews: expireAfterViews.value,
          expireAfter: expireAfter.value,
        }),
      });

      if (response.status === 200) {
        const secret = await response.json();
        emit("addHash", { hash: secret.hash });
      } else {
        const error = await response.json();
        if (error.message.includes("duplicate")) {
          const hashForSecret = error.message.split('"')[1];

          emit("addHash", { hash: hashForSecret });
          alert(`\
          Secret already saved!
          hash: ${hashForSecret} added for recent hashes
          `);
        }
      }

      newSecret.value = "";
      expireAfterViews.value = 1;
      expireAfter.value = 0;
    };

    return {
      addNewSecret,
      newSecret,
      expireAfterViews,
      expireAfter,
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
  margin-bottom: 16px;
  align-self: center;
  padding: 8px;
  font-size: 16px;
}
</style>
