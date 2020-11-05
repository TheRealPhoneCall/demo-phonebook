<template>
  <q-scroll-area
    ref="scrollArea"
    :visible="false"
    class="q-pa-sm"
  >
    <q-infinite-scroll
      v-if="restructuredMsgs.length"
      ref="infiniScroll"
      :offset="10"
      reverse
    >
      <!-- <template slot="loading">
        <div class="row justify-center q-my-md">
          <q-spinner
            color="primary"
            name="dots"
            size="40px"
          />
        </div>
      </template> -->
      <div>
        <transition-group
          class="column full-height q-gutter-y-xs q-pa-none"
          enter-active-class="animated zoomIn"
          leave-active-class="animated zoomOut"
          tag="div"
        >
          <div
            v-for="msg in restructuredMsgs"
            :key="`msg-${msg.id}`"
            class="q-message"
            :class="msg.user === authedUser.id ? 'q-message-sent' : 'q-message-received'"
          >
            <div class="q-message-container row items-end no-wrap">
              <img
                src="https://png.pngtree.com/svg/20160506/5401434f9c.png"
                class="q-message-avatar col-auto"
              />
              <div>
                <div class="q-message-name">{{ msg.user === authedUser.id ? 'You' : msg.user }}</div>
                <transition-group
                  class="column full-height q-gutter-y-xs q-pa-none"
                  enter-active-class="animated zoomIn"
                  leave-active-class="animated zoomOut"
                  tag="div"
                >
                  <div
                    v-for="(txt, id) in msg.msg"
                    :key="`txt-${id}`"
                    class="col-1 q-message-text"
                    :class="msg.user === authedUser.id ? 'text-primary bg-primary' : 'text-grey-9 bg-grey-9'"
                  >
                    <span class="q-message-text-content text-white">
                      <div>{{ txt }}</div>
                      <div class="q-message-stamp">{{ msg.date_created | timeLapsed }}</div>
                    </span>
                  </div>
                </transition-group>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </q-infinite-scroll>
    <!-- <q-infinite-scroll
      @load="onLoad"
      :offset="10"
      reverse
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="caption"
      >
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.</p>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
      </template>
    </q-infinite-scroll> -->
  </q-scroll-area>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'DwMessages',
  props: ['soaId'],
  data: () => ({
    items: [{}, {}, {}, {}, {}],
    limit: 10,
    mounted: false
  }),
  computed: {
    ...mapGetters('userAuth', ['authedUser']),
    ...mapGetters('conversations', ['comments', 'restructuredMsgs'])
  },
  methods: {
    ...mapActions('conversations', ['retrieveAllComments', 'restructureComments'])
    // async onLoad (index, done) {
    //   console.log('loading more: ', index)
    //   this.limit += index
    //   await this.retrieveMostRecent({
    //     id: this.project,
    //     limit: this.limit
    //   }).then(() => { done() })
    //     .catch(() => done(true))
    // }
    // onLoad (index, done) {
    //   console.log('onload')
    //   setTimeout(() => {
    //     if (this.items) {
    //       this.items.push({}, {}, {}, {}, {}, {}, {})
    //       done()
    //     }
    //   }, 2000)
    // }
  },
  async created () {
    console.log('new convo')
    await this.retrieveAllComments(this.soaId)
    await this.restructureComments()
    // await this.retrieveMostRecent({
    //   id: this.project,
    //   limit: this.limit,
    //   isNew: true
    // }).then(() => {
    //   this.$refs.scrollArea.setScrollPosition(this.$refs.infiniScroll.$el.clientHeight + 200, 300)
    //   console.log('conversation loaded')
    // })
    //   .catch(() => {
    //     console.log('no conversation')
    //   })
  },
  mounted () {
    this.mounted = true
  },
  watch: {
    'comments': async function () {
      if (!this.mounted) return
      this.$refs.scrollArea.setScrollPosition(this.$refs.infiniScroll.$el.clientHeight, 300)
    }
  }
}
</script>
