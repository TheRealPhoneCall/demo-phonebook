<template>
  <div class="col">
    <div class="row q-mb-lg">
      <div class="text-h5 text-weight-bold">
        Teams
      </div>
      <q-space></q-space>
      <q-btn
        color="primary"
        fab-mini
        icon="add"
        :to="{
            name: `admin-page-admin-database-team-crud`,
            params: {
              id,
              operation: 'create',
            }
          }"
      >
        <q-tooltip>Add a Team</q-tooltip>
      </q-btn>
    </div>
    <div class="row">
      <div
        class=" col-md-4 col-sm-6 col-xs-12 col-lg-4 q-px-sm q-my-lg"
        v-for="team in teams"
        :key="team.id"
      >

        <q-card
          class="my-card"
          style="height: 300px; opacity: 1; "
          square
        >

          <q-card-section
            style=""
            class="text-white bg-primary"
          >
            <q-avatar
              class="absolute"
              style="top: 0; left: 12px; transform: translateY(-50%);"
            >
              <img :src="team.photoMain.url || 'https://cdn.quasar.dev/img/boy-avatar.png'">
            </q-avatar>
            <q-btn
              flat
              color="white"
              icon="dehaze"
              class="absolute"
              size="md"
              style="top: 0px; right: 0px; transform: translateY(0);"
            >
              <q-menu>
                <q-list class="">
                  <q-btn
                    class="full-width"
                    icon="edit"
                    size="md"
                    text-color="primary"
                    v-close-popup
                    :to="{
                      name: `admin-page-admin-database-team-crud`,
                      params: {
                        id,
                        operation: 'edit',
                        itemId: team.id
                      }
                    }"
                  />
                  <q-separator inset></q-separator>
                  <q-btn
                    class="full-width"
                    icon="delete"
                    text-color="primary"
                    size="md"
                    v-close-popup
                    :to="{
                      name: `admin-page-admin-database-team-crud`,
                      params: {
                        id,
                        operation: 'delete',
                        itemId: team.id
                      }
                    }"
                  />
                </q-list>
              </q-menu>
            </q-btn>

            <div class="row no-wrap items-center q-mt-lg">
              <div class="col">
                <span class=" text-h6 text-weight-bold">
                  {{team.title}}
                </span>
                <br>
                <span class="text-caption text-capitalize text-white">
                  {{team.type}}
                </span>
              </div>
            </div>

          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="">
            <div class="row q-mb-sm">
              <div class="col-3 text-right text-caption text-grey q-mr-md">No. of Members</div>
              <div class="col-auto text-caption">{{team.members.length || '0'}}</div>
            </div>
            <div class="row q-mb-sm">
              <div class="col-3 text-right text-caption text-grey q-mr-md">Privacy</div>
              <div class="col-auto text-caption">{{team.privacy || 'N/A'}}</div>
            </div>
            <div class="row q-mb-sm">
              <div class="col-3 text-right text-caption text-grey q-mr-md">Status</div>
              <div class="col-auto text-caption">{{team.status || 'N/A'}}</div>
            </div>
          </q-card-section>

        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Team',
  props: {
    id: {
      type: String
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters('teams', ['teams'])
  },
  methods: {
    ...mapActions('teams', ['retrieveAllTeams'])
  },
  async created () {
    await this.retrieveAllTeams()
    console.log('ADMIN PAGE CREATED', this.teams)
  }
  // name: 'PageName',
}
</script>
