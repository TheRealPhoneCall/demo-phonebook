<template>
  <div class="col">
    <div class="row q-mb-lg">
      <div class="text-h5 text-weight-bold">
        Revybers
      </div>
      <q-space></q-space>
      <q-btn
        color="primary"
        fab-mini
        :to="{
          name: `admin-page-admin-database-revyber-crud`,
          params: {
            id,
            operation: 'create'
          }
        }"
        icon="add"
      >
        <q-tooltip>Add a Revyber</q-tooltip>
      </q-btn>
    </div>
    <div class="row">
      <div
        class=" col-md-4 col-sm-6 col-xs-12 col-lg-4 q-px-sm q-my-lg"
        v-for="revyber in revybers"
        :key="revyber.id"
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
              <img :src="revyber.photoURL || 'https://cdn.quasar.dev/img/boy-avatar.png'">
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
                    icon="create"
                    size="md"
                    text-color="primary"
                    v-close-popup
                    :to="{
                      name: `admin-page-admin-database-revyber-crud`,
                      params: {
                        id,
                        operation: 'edit',
                        itemId: revyber.id
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
                  />
                </q-list>
              </q-menu>
            </q-btn>

            <div class="row no-wrap items-center q-mt-lg">
              <div class="col">
                <span class=" text-h6 text-weight-bold">
                  {{revyber.displayName}}
                </span>
                <br>
                <span class="text-caption text-capitalize text-white">
                  {{revyber.userType}}
                </span>
              </div>
            </div>

          </q-card-section>
          <q-separator></q-separator>
          <q-card-section class="">
            <div class="row q-mb-sm">
              <div class="col-3 text-right text-caption text-grey q-mr-md">First Name</div>
              <div class="col-auto text-caption">{{revyber.firstName || 'N/A'}}</div>
            </div>
            <div class="row q-mb-sm">
              <div class="col-3 text-right text-caption text-grey q-mr-md">Last Name</div>
              <div class="col-auto text-caption">{{revyber.lastName || 'N/A'}}</div>
            </div>
            <div class="row q-mb-sm">
              <div class="col-3 text-right text-caption text-grey q-mr-md">Email</div>
              <div class="col-auto text-caption">{{revyber.email || 'N/A'}}</div>
            </div>
          </q-card-section>

        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    id: {
      type: String
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters('users', ['users']),
    revybers () {
      return this.users.filter((user) => user.userType === 'revyber')
    }
  },
  created () {
    console.log('ADMIN PAGE CREATED', this.users)
  }
  // name: 'PageName',
}
</script>
