<template>
  <q-scroll-area
    class="fit q-pr-md"
    ref="scrollArea"
    :visible="false"
  >
    <q-infinite-scroll
      v-if="restructuredMsgs.length"
      ref="infiniScroll"
      @load="onLoad"
      :offset="10"
      reverse
    >
      <template slot="loading">
        <div class="row justify-center q-my-md">
          <q-spinner
            color="primary"
            name="dots"
            size="40px"
          />
        </div>
      </template>
      <!-- <div> -->
        <div class="column full-height q-gutter-y-xs q-pa-none">
          <q-chat-message
            v-for="msg in restructuredMsgs"
            :key="msg.id"
            :name="msg.userId === authedUser.id ? 'You' : msg.name"
            :sent="msg.userId === authedUser.id"
            :avatar="msg.avatar"
            :text="msg.msg"
            size="7"
            :stamp="timeLapsed(msg.timeStamp)"
            text-color="white"
            :bg-color="msg.userId === authedUser.id ? 'primary' : 'secondary'"
            :class="screenSm ? 'q-pa-none' : ''"
          />
        </div>
      <!-- </div> -->
    </q-infinite-scroll>
  </q-scroll-area>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { mapFilters } from '../../store/helpers/helpers'

export default {
  name: 'DwMessages',
  data: () => ({
    items: [{}, {}, {}, {}, {}],
    limit: 10
  }),
  computed: {
    ...mapGetters('ui', ['screenSm']),
    ...mapGetters('userAuth', ['authedUser']),
    ...mapGetters('messages', ['messages', 'restructuredMsgs'])
  },
  props: ['convo'],
  methods: {
    ...mapActions('messages', ['retrieveMostRecent']),
    ...mapFilters(['timeLapsed']),
    async onLoad (index, done) {
      console.log('loading more: ', index)
      this.limit += index
      await this.retrieveMostRecent({
        convoId: this.convo.id,
        limit: this.limit
      }).then(() => { done() })
        .catch(() => done(true))
    }
  },
  async created () {
    console.log('new convo')
    await this.retrieveMostRecent({
      convoId: this.convo.id,
      limit: this.limit,
      isNew: true
    }).then(() => {
      this.$refs.scrollArea.setScrollPosition(this.$refs.infiniScroll.$el.clientHeight + 200, 300)
      console.log('conversation loaded')
    })
      .catch(() => {
        console.log('no conversation')
      })
  },
  watch: {
    'messages': async function () {
      console.log('msgs: ', this.messages.length)
      this.limit += 1 // assume there is new 1 message
      await this.retrieveMostRecent({
        convoId: this.convo.id,
        limit: this.limit
      }).then(() => {
        this.$refs.scrollArea.setScrollPosition(this.$refs.infiniScroll.$el.clientHeight, 300)
      })
    }
  }
}
</script>
