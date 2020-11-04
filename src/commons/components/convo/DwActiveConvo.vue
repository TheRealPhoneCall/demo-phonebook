<template>
  <div
    v-if="activeConvo"
    class="column fit "
  >
    <!-- header  -->
    <div class="row items-center q-pa-none q-pt-none q-gutter-x-none">
      <q-btn
        round
        flat
        v-if="hasListBtn"
        icon="list"
        @click="$emit('listBtnClick')"
      />
      <q-btn
        round
        flat
      >
        <q-avatar size="2rem">
          <img :src="activeConvo.avatar">
        </q-avatar>
      </q-btn>

      <span class="q-subtitle-1 q-pl-none">
        {{ activeConvo.name.substring(0, $q.screen.xs ? 25 : 30 ) + '...' }}
      </span>

      <q-space />

      <q-btn
        round
        flat
        icon="search"
        :dense="screenSm"
      />
      <q-btn
        round
        flat
        :dense="screenSm"
      >
        <q-icon
          name="attachment"
          class="rotate-135"
        />
      </q-btn>
      <q-btn
        round
        flat
        icon="more_vert"
        :dense="screenSm"
      >
        <q-menu
          auto-close
          :offset="[110, 0]"
        >
          <q-list style="min-width: 150px">
            <q-item clickable>
              <q-item-section>Contact data</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Block</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Select messages</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Silence</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Clear messages</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Erase messages</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Delete Convo</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <!-- body -->
    <div class="col row">
      <dw-messages
        :convo="activeConvo"
        :key="activeConvo.id"
      />
    </div>

    <q-space />
    <!-- footer -->
    <div class="row">
      <q-btn
        flat
        icon="insert_emoticon"
        class="col-1 q-mr-xs q-ml-xs"
      />
      <q-input
        rounded
        outlined
        dense
        class="col-9 q-mr-xs q-ml-xs"
        bg-color="white"
        v-model="chatMsg"
        @keyup.enter="sendMsg"
        placeholder="Type a message"
      />
      <q-btn
        flat
        icon="send"
        class="col-1 q-mr-xs q-ml-xs"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { firebase } from 'boot/firebase'
import DwMessages from './DwMessages'

export default {
  name: 'DwActiveConvo',
  components: { DwMessages },
  data: () => ({
    chatMsg: '',
    msgrName: '',
    userId: '',
    avatar: ''
  }),
  props: {
    activeConvo: Object,
    hasListBtn: Boolean
  },
  computed: {
    ...mapGetters('ui', ['screenSm', 'screenLg']),
    ...mapGetters('userAuth', ['authedUser'])
  },
  methods: {
    ...mapActions('messages', ['createDoc']),
    ...mapActions('convos', ['newConvoMsg']),
    async sendMsg () {
      const { id, msgrName, userId, avatar } = this
      console.log('userId: ', userId, 'auid: ', this.authedUser.id)
      const timeStamp = firebase.firestore.Timestamp.fromDate(this.moment().toDate())
      await this.createDoc({
        id,
        data: {
          name: msgrName,
          userId,
          avatar,
          convoId: this.activeConvo.id,
          msg: [this.chatMsg],
          timeStamp: timeStamp,
          isSent: true,
          isTyping: false,
          isDone: true
        }
      })
      await this.newConvoMsg(this.activeConvo)

      this.chatMsg = ''
    }
  },
  created () {
    this.msgrName = this.authedUser.displayName
    this.userId = this.authedUser.id
    this.avatar = this.authedUser.photoURL
  }
}
</script>