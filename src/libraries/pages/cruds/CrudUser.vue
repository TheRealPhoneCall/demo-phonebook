<template>
  <div
    class="col"
    id="module-info"
  >
    <q-form
      ref="userForm"
      @submit="onSubmit"
      v-if="!loading"
    >
      <q-card flat>
        <q-card-section class="row items-center q-pa-none q-mb-lg">
          <div class="text-h5 text-weight-bold ">{{ operationText }}<span class="text-capitalize">{{userTypeText}}</span> User</div>
          <q-space />
          <q-btn
            color="primary"
            fab-mini
            :to="{
                  name: `admin-page-admin-database-${this.$route.meta.name}s`,
                  params: id
                }"
            icon="keyboard_backspace"
          >
            <q-tooltip>Back</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <div id="user_info" class="text-h6">User Info</div> <br/>
          <q-input
            filled
            v-model="firstName"
            :debounce="500"
            label="First Name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please input first name' ]"
          />
          <q-input
            filled
            v-model="lastName"
            :debounce="500"
            label="Last Name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please input last name' ]"
          />
          <q-select
            v-if="!userTypeText"
            filled
            v-model="userType"
            :options="userTypeOptions"
            label="User Type"
            :rules="[ val => val && val.length > 0 || 'Please select the user\'s type']"
          />
          <q-separator class="q-my-sm"></q-separator>
          <div id="media" class="text-h6">Media</div> <br/>
          <div class="row">
            <dw-photo-field
              label="Main Photo"
              class="col q-pa-md"
              filled
              v-model="userAvatar"
              :rules="[ val => val && val.url !== '' || 'Please select an image']"
            />
            <dw-photo-field-multi
              label="Photos"
              class="col q-pa-md"
              filled
              v-model="photos"
              :rules="[ val => val && val.url !== '' || 'Please select an image']"
            />
          </div>

          <q-separator class="q-my-sm"></q-separator>
          <div id="user_info" class="text-h6">Contact Info</div> <br/>
          <q-input
            filled
            v-model="email"
            :readonly="this.operation !== 'create'"
            :debounce="500"
            label="Email"
            lazy-rules
            bottom-slots
            :rules="[ val => val && val.length > 0 || 'Please enter email address.']"
          />
          <q-input
            filled
            v-model="mobile"
            :debounce="500"
            label="Contact Number"
            bottom-slots
            lazy-rules
          />
          <q-input
            filled
            v-model="address"
            :debounce="500"
            label="Address"
            lazy-rules
            bottom-slots
          />

          <div>
          <q-separator class="q-my-sm"></q-separator>
            <div
              class="text-h6"
              id="followers-and-collaborators"
            >Followers and Collaborators</div> <br />

            <div class="row">
              <dw-related-field-multi
                class="col-6 q-pr-md"
                label="Collaborators"
                filled
                type="chips"
                id-only
                v-model="collaborators"
                :options="revybersList"
              />

              <dw-related-field-multi
                class="col-6"
                label="Followers"
                filled
                type="chips"
                id-only
                v-model="followers"
                :options="revybeesList"
              />
            </div>
          </div>

          <div v-if="this.$route.meta.name !== 'revybee'">
            <q-separator class="q-my-sm"></q-separator>
            <div
              class="text-h6"
              id="user-teams"
            >Teams</div> <br />
            <dw-related-field-multi
              class="col"
              label="Teams"
              filled
              type="chips"
              id-only
              v-model="teamsSelected"
              :options="teamsList"
            />
          </div>

          <div v-if="operation === 'delete'">
            <div class="text-body1">
              Are you sure you want to delete this user? This operation is irreversible!
            </div>
            <q-field
              ref="toggle"
              :value="acceptDelete"
              :rules="[ val => val || 'Please confirm that you want to delete this user']"
              borderless
              dense
            >
              <template v-slot:control>
                <q-checkbox
                  v-model="acceptDelete"
                  label="Accept delete"
                  color="negative"
                />
              </template>
            </q-field>
          </div>

        </q-card-section>
        <br />
        <br />
        <q-card-section class="q-pa-none">
          <div v-if="operation === 'delete'">
            <q-btn
              label="Delete"
              color="negative"
              :loading="loading"
              @click="onDelete"
            />
            <q-btn
              label="Cancel"
              color="primary"
              flat
              :to="collectionUrl"
            />
          </div>
          <div
            v-else
            style="width: 100%;"
          >
            <q-btn
              label="Submit"
              type="submit"
              color="primary"
              :loading="loading"
            />
            <q-btn
              label="Cancel"
              color="primary"
              flat
              :to="collectionUrl"
            />
          </div>
        </q-card-section>

      </q-card>

    </q-form>

    <q-inner-loading :showing="loading">
      <q-spinner-gears
        size="150px"
        color="primary"
      />
    </q-inner-loading>
  </div>
</template>

<script>
import { QSpinnerGears } from 'quasar'
import { mapActions, mapGetters, mapMutations } from 'vuex'

import { mapGettersSetters, mapListConverters } from 'src/store/helpers/helpers'
import { userMeta } from 'src/services/data/data'

import crudBase from './CrudBase'
import userMixin from './CrudUserMixin'

import DwPhotoField from 'src/components/cruds/DwPhotoField'
import DwPhotoFieldMulti from 'src/components/cruds/DwPhotoFieldMulti'
import DwRelatedFieldMulti from 'src/components/cruds/DwRelatedFieldMulti'
// import DwFileFieldMulti from 'src/components/cruds/DwFileFieldMulti'

export default {
  name: 'Team',
  components: {
    DwPhotoField,
    DwPhotoFieldMulti,
    DwRelatedFieldMulti
    // DwFileFieldMulti
  },
  data () {
    return {
      formName: 'userForm',
      teamsSelected: [],
      teamsSelectedBefore: [],
      userAvatarData: {
        url: '',
        id: ''
      },
      userTypeOptions: [
        'Revyber',
        'Revybee',
        'Admin'
      ],
      userOpened: {}
    }
  },
  props: ['id', 'operation', 'itemId'],
  mixins: [crudBase, userMixin],
  computed: {
    ...mapGetters('userAuth', ['userType']),
    ...mapGetters('users', ['loading', 'error', 'user', 'users', 'docName']),
    ...mapGetters('teams', ['teams', 'team']),
    ...mapGetters('revybers', ['revybers']),
    ...mapGetters('revybees', ['revybees']),
    userTypeText () {
      return this.$route.meta.name === 'user' ? '' : ` ${this.$route.meta.name}`
    },
    userAvatar: {
      get () {
        return this.userAvatarData
      },
      set (val) {
        this.userAvatarData = val
      }
    },
    ...mapListConverters({
      revybersList: { list: 'revybers', id: 'id', label: 'displayName', icon: 'photoURL' },
      revybeesList: { list: 'revybees', id: 'id', label: 'displayName', icon: 'photoURL' },
      teamsList: { list: 'teams', id: 'id', label: 'title', caption: 'type', icon: 'url' }
    }),
    ...mapGettersSetters(
      userMeta.getMapObject('users/user', 'users/setDoc')
    )
  },
  methods: {
    ...mapActions('users', {
      createDoc: 'createDoc',
      retrieveDoc: 'retrieveDoc',
      retrieveModule: 'retrieveUser',
      deleteDoc: 'deleteDoc',
      updateDocModified: 'updateDocModified'
    }),
    ...mapActions('teams', {
      updateTeamFields: 'updateDocFields',
      retrieveTeam: 'retrieveTeam'
    }),
    ...mapActions('users', ['createUser']),
    ...mapActions('revybers', ['retrieveAllRevybersInfo']),
    ...mapActions('revybees', ['retrieveAllRevybeesInfo']),
    ...mapActions('teams', ['retrieveAllTeams']),
    ...mapActions('categories', ['retrieveAllCategories']),
    ...mapMutations('users', ['setDoc', 'setLoading', 'backupDoc', 'initModule']),
    async onSubmit () {
      if (this.isFormValidated) {
        this.displayName = `${this.firstName} ${this.lastName}`
        this.photoURL = this.userAvatarData.url
        switch (this.operation) {
          case 'create':
            this.$q.loading.show({
              message: `Creating User ${this.email}<br/>Please Wait...`,
              spinner: QSpinnerGears,
              spinnerColor: 'primary'
            })
            if (!this.crudMeta) {
              this.userType = this.$route.meta.name
            }
            await this.createNewUser()
            break
          case 'edit':
            this.$q.loading.show({
              message: `Updating User ${this.email}<br/>Please Wait...`,
              spinner: QSpinnerGears,
              spinnerColor: 'primary'
            })
            console.log(this.teamsSelected, this.teamsSelectedBefore)
            let teamsAdded = this.teamsSelected.filter((team) => !this.teamsSelectedBefore.includes(team))
            let teamsDeleted = this.teamsSelectedBefore.filter((team) => !this.teamsSelected.includes(team))
            console.log(teamsAdded, teamsDeleted)
            teamsAdded.forEach(async (teamId) => {
              await this.retrieveTeam(teamId)
              let newTeamMembers = [...this.team.members]
              console.log("TEAMS BEFORE", newTeamMembers)
              newTeamMembers.push(this.itemId)
              console.log("TEAMS AFTER ADD", newTeamMembers)
              console.log({ teamId, newTeamMembers })
              await this.updateTeamFields({
                id: teamId,
                data: {
                  members: newTeamMembers
                }
              })
            })
            teamsDeleted.forEach(async (teamId) => {
              await this.retrieveTeam(teamId)
              let newTeamMembers = [...this.team.members]
              console.log("TEAMS BEFORE", newTeamMembers)
              const index = newTeamMembers.indexOf(this.itemId)
              if (index > -1) {
                newTeamMembers.splice(index, 1)
              }
              console.log("TEAMS AFTER", newTeamMembers)
              await this.updateTeamFields({
                id: teamId,
                data: {
                  members: newTeamMembers
                }
              })
            })
            await this.updateDocModified({
              id: this.itemId,
              data: userMeta.getDataPayload(this)
            })
            break
        }
        this.$q.loading.hide()
        this.$router.push(`/admin/pages/${this.id}/admin-database/${this.$route.meta.name}`)
        // this.submitPayload({
        //   id: this.itemId,
        //   data: userMeta.getDataPayload(this)
        // })
      }
    }
  },
  async created () {
    console.log(this.$route.params)
    console.log(this.$route.path, this.$route, this.operation, this.id)

    // must be ran first - in order for fields to react properly
    // this.initModule()
    await this.initFormData(userMeta.getDefaults())
    Object.assign(this.userOpened, this.user)

    // run next
    await this.retrieveAllRevybersInfo()
    await this.retrieveAllRevybeesInfo()
    await this.retrieveAllTeams()
    this.setDoc(this.userOpened)
    this.userAvatarData.url = this.user.photoURL
    if (this.$route.meta.name !== 'user') {
      this.userType = this.$route.meta.name
    }
    console.log(this.teams, this.itemId)
    this.teams.forEach((team) => {
      if (team.members.includes(this.itemId) || team.owner.id === this.itemId) {
        this.teamsSelected.push(team.id)
      }
    })
    this.teamsSelectedBefore = [...this.teamsSelected]
    console.log(this.teamsSelected)
    console.log('user', this.user)
    console.log('teams', this.teams)
    console.log('revybers', this.revybers)
    console.log('revybees', this.revybees)
  }
}
</script>
