<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        @click="drawer = !drawer"
        aria-label="Menu"
      >
        <q-icon name="contact_phone" />
      </q-btn>

      <q-toolbar-title>
        myPhoneBook
      </q-toolbar-title>

    </q-toolbar>
  </q-header>
</template>

<script>

export default {
  name: 'MyLayout',
  data () {
    return {
      drawer: this.$q.platform.is.desktop
    }
  }
}
</script>
