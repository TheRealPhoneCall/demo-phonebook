<template>
  <div class="column fit">
    <div class="q-pa-xs bg-grey-3">
      <q-input
        rounded
        outlined
        dense
        class="full-width"
        bg-color="white"
        v-model="search"
        placeholder="Search a conversation"
      >
        <template slot="prepend">
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="col full-height">
      <q-scroll-area class="fit bg-grey-2">
        <q-list>
          <q-item
            clickable
            v-ripple
            @click="$emit('startConvo')"
          >
            <q-item-section avatar>
              <q-avatar icon="add" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">
                New Message
              </q-item-label>
            </q-item-section>

          </q-item>
          <q-item
            v-for="convo in convos"
            :key="convo.id"
            clickable
            v-ripple
            :active="convoIsActive[convo.id]"
            @click="onConvoClick(convo)"
          >
            <q-item-section avatar>
              <q-avatar>
                <img :src="convo.avatar">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">
                {{ convo.name }}
              </q-item-label>
              <q-item-label caption>
                <q-icon
                  name="check"
                  v-if="convo.read[authedUser.id]"
                />
                {{ convo.caption }}
              </q-item-label>
            </q-item-section>

            <!-- <q-item-section side>
              <q-item-label caption>
                {{ convo.dateUpdated | formatDate('standard') }}
              </q-item-label>
              <q-icon name="keyboard_arrow_down" />
            </q-item-section> -->
          </q-item>
          <q-space />

        </q-list>
      </q-scroll-area>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  name: 'DwConvoList',
  data: () => ({
    search: '',
    convoIsActive: {}
  }),
  props: {
    convos: Array,
    hasCloseBtn: Boolean
  },
  computed: {
    ...mapGetters('users', ['users']),
    ...mapGetters('userAuth', ['authedUser'])
  },
  methods: {
    ...mapMutations('convos', ['setActiveConvo']),
    ...mapActions('users', ['retrieveUser']),
    onConvoClick (activeConvo) {
      this.$emit('setActiveConvo', activeConvo)

      this.convos.forEach((convo) => { this.convoIsActive[convo.id] = false })
      this.convoIsActive[activeConvo.id] = true

      console.log('convoIsActive', this.convoIsActive)
    }
  },
  async created () {
    await this.retrieveUser(this.authedUser.id)
    this.convos.forEach((convo) => { this.convoIsActive[convo.id] = false })
  },
  watch: {
    'users': async function (val) {
      await this.retrieveUser(this.authedUser.id)
    }
  }
}
</script>