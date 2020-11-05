
<script>
import { authSecondary } from 'boot/firebase'

export default {
  computed: {
    collectionUrl () {
      return `/admin/pages/${this.id}/admin-database/${this.userTypeMeta}`
    },
    userTypeMeta () {
      return this.$route.meta.name === 'user'
    }
  },
  methods: {
    async createNewUser () {
      const {
        firstName,
        lastName,
        displayName,
        email,
        photoURL,
        collaborators,
        followers,
        userType,
        mobile,
        address
      } = this
      const userCommon = {
        firstName,
        lastName,
        displayName,
        collaborators,
        followers,
        email,
        photoURL,
        mobile,
        userType,
        address,
        conversations: [],
        deliveries: [],
        cart: [],
        wishlist: [],
        orders: []
      }

      const userDefaults = {
        admin: {},
        revyber: {
          projects: [],
          products: [],
          services: [],
          revybees: []
        },
        revybee: {
          projectsBacked: [],
          productsPurchased: [],
          servicesAvailed: []
        }
      }

      // to do (PASSWORD AUTO GENERATE), (MAIL THE CREDENTIALS TO EMAIL)
      await authSecondary
        .createUserWithEmailAndPassword(email, 'revybe123')
        .then(async () => {
          const user = authSecondary.currentUser
          await authSecondary.currentUser
            .updateProfile({ displayName, photoURL })
            .then(async () => {
              await this.createUser({
                id: user.uid,
                data: {
                  ...userCommon
                },
                specifics: userDefaults[userType]
              }).then(() => {
                console.log('User Created')
              })
            })
          let teamsAdded = this.teamsSelected.filter((team) => !this.teamsSelectedBefore.includes(team))
          console.log(teamsAdded)
          teamsAdded.forEach(async (teamId) => {
            await this.retrieveTeam(teamId)
            let newTeamMembers = [...this.team.members]
            console.log("TEAMS BEFORE", newTeamMembers)
            newTeamMembers.push(user.uid)
            console.log("TEAMS AFTER ADD", newTeamMembers)
            console.log({ teamId, newTeamMembers })
            await this.updateTeamFields({
              id: teamId,
              data: {
                members: newTeamMembers
              }
            })
          })
        })
    }
  }
}
</script>

<style>
</style>