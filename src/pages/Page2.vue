<template>
  <q-page class="flex flex-center">
    Page 2
  </q-page>
</template>

<style>
</style>

<script>
import db from '../services/fbase'

export default {
  name: 'Page2',
  created () {
    console.log(db)
  }
}
</script>
