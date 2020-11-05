<template>
  <div>
    <q-input
      class="gt-sm"
      v-model="filter"
      label="Type to start searching..."
      :debounce="100"
      ref="qinput"
      dark
      standout
      clearable
      dense
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <q-menu fit anchor="bottom left" self="top left" ref="qmenu" square no-focus>
        <q-card v-if="!filter">
          <q-card-section>
            <div class="text-grey-6 text-center">No recent searches.</div>
          </q-card-section>
        </q-card>
        <q-card v-else-if="filter && !filteredResults.length">
          <q-card-section>
            <div class="text-grey-6 text-center">No matching entries found.</div>
          </q-card-section>
        </q-card>
        <q-card v-else>
          <q-card-section
            v-for="(section, id) of filteredResults"
            :key="`section-${id}`"
            class="q-pa-none"
          >
            <div class="bg-grey-10 text-white text-center q-pa-xs">{{ section.title }}</div>
            <q-list>
              <q-item
                v-for="(item, id) of section.items"
                :key="`item-${id}`"
                class="row"
                @click="filter=null; $refs.qmenu.hide(); $refs.qinput.blur()"
              >
                <!-- v-close-popup -->
                <!-- clickable -->
                <!-- :to="''" -->
                <q-item-section class="col">
                  <q-item-label class="row">
                    {{ item.displayName }}
                    <q-space></q-space>
                    <q-btn
                      v-for="btn in btnActions(section.title)"
                      :key="btn.id"
                      :color="btn.color"
                      :icon="btn.icon"
                      size="xs"
                      dense
                      @click="filter=null; $refs.qmenu.hide(); $refs.qinput.blur();routeTo(userType, btn.form, btn.link, item.displayName, '')"
                    />
                  </q-item-label>
                  <q-item-label
                    v-for="(match, id) in item.matches"
                    class="row"
                    :key="`match-${id}`"
                    caption
                    lines="2"
                  >
                    {{ match.key }}:
                    <span v-html="match.value" />
                    <q-space></q-space>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
        <!-- <q-item clickable>
              <q-item-section>New tab</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>New incognito tab</q-item-section>
        </q-item>-->
      </q-menu>
    </q-input>
    <q-btn class="lt-md" icon="search" @click="searchModal=!searchModal" flat round>
      <q-dialog v-model="searchModal">
        <q-card class="column no-wrap" style="width: 30rem; max-height: 30rem">
          <q-card-section>
            <q-input
              v-model="filter"
              label="Type to start searching..."
              :debounce="500"
              ref="qinput"
              clearable
              filled
              dense
            />
          </q-card-section>
          <q-card-section v-if="filteredResults.length" class="col scroll q-py-none">
            <div v-for="(section, id) of filteredResults" :key="`section-${id}`" class="q-pa-none">
              <div class="bg-grey-10 text-white text-center q-pa-xs">{{ section.title }}</div>
              <q-list>
                <q-item
                  v-for="(item, id) of section.items"
                  :key="`item-${id}`"
                  class="row"
                  @click="filter=null; $refs.qmenu.hide(); $refs.qinput.blur()"
                >
                  <!-- v-close-popup -->
                  <!-- clickable -->
                  <!-- :to="''" -->
                  <q-item-section class="col">
                    <q-item-label class="row">
                      {{ item.displayName }}
                      <q-space></q-space>
                      <q-btn
                        v-for="btn in btnActions(section.title)"
                        :key="btn.id"
                        :color="btn.color"
                        :icon="btn.icon"
                        size="xs"
                        dense
                        @click="filter=null; $refs.qmenu.hide(); $refs.qinput.blur();routeTo(userType, btn.form, btn.link, item.displayName, '')"
                      />
                    </q-item-label>
                    <q-item-label
                      v-for="(match, id) in item.matches"
                      class="row"
                      :key="`match-${id}`"
                      caption
                      lines="2"
                    >
                      {{ match.key }}:
                      <span v-html="match.value" />
                      <q-space></q-space>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
          <q-card-section v-else class="flex flex-center text-grey-6 text-weight-regular text-center">
            <div v-if="!filter">Type something to start searching</div>
            <div v-else>
              No matching entries found for
              <b>{{ filter }}</b>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DwSearchBar',
  data: () => ({
    filter: null,
    isLoading: true,
    searchModal: false
  }),
  methods: {
    routeTo (userType, form, link, soaId, name) {
      console.log(userType, form, link, soaId, name)
      if (form === 'debt-review-order') {
        return this.$router.push(
          `/${userType}/debt-review/order/${soaId}/${link}`
        )
      } else if (form !== 'soa' && form !== 'debt-review') {
        console.log(`/${userType}/soa/${form}/${soaId}/${link}`)
        return this.$router.push(`/${userType}/soa/${form}/${soaId}/${link}`)
      } else {
        return this.$router.push(`/${userType}/${form}/${soaId}/${link}`)
      }
    },
    btnActions (title) {
      return this.dashboard.sections.filter(section => {
        return section.title === title
      })[0].btnActions
    }
  },
  computed: {
    ...mapGetters('soas', ['dashboard']),
    ...mapGetters('userAuth', ['userType']),
    filteredResults () {
      if (!this.dashboard || !this.dashboard.sections) return []
      if (!this.filter) return []

      let filtered = []

      for (const section of this.dashboard.sections) {
        const { filter } = this
        const fltr = filter.toLowerCase()
        const { title } = section
        const items = section.items
          .filter(item =>
            JSON.stringify(item)
              .toLowerCase()
              .includes(fltr)
          )
          .map(item => {
            let matches = []
            for (const key of Object.keys(item)) {
              const testStr = String(item[key])
              const testStrLower = testStr.toLowerCase()
              if (testStrLower.includes(fltr)) {
                const index = testStrLower.indexOf(fltr)
                const filterMatch = testStr.substring(
                  index,
                  index + fltr.length
                )
                const value = testStr.replace(
                  filterMatch,
                  `<span class="text-weight-bold">${filterMatch}</span>`
                )
                matches.push({ key, value })
              }
            }
            return {
              displayName: item.soaId,
              link: `/${this.userType}/soa/order/${item.soaId}/retrieve`,
              matches
            }
          })
        if (!items.length) continue
        const t = { title, items }
        filtered.push(t)
      }
      console.log(filtered, this.dashboard)
      return filtered
    }
  },
  created () {
    console.log(this.dashboard)
  }
}
</script>
