<template>
  <v-app>
    

    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style lang="css">
    .fade-enter, .fade-leave-to{
        opacity: 0;
      }
    .fade-enter-active, .fade-leave-active{
      transition: all .05s ease;
    }
.right-text-input input {
  text-align: right
}
</style>
