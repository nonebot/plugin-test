<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="@/assets/logo.png"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title><h2>NoneBot</h2></v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-toolbar dense flat>
        <v-toolbar-title>分组</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon small @click="pushEmpty">
          <v-icon small>fa-file-medical</v-icon>
        </v-btn>
        <v-btn icon small @click="openNewGroupModal()">
          <v-icon small>fa-folder-plus</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list dense shaped expand subheader>
        <v-list-group
          v-model="group.expand"
          class="group"
          color="#d12e2e"
          v-for="(group, index) in groups"
          :key="index"
        >
          <template v-slot:activator>
            <v-list-item-title>{{ group.name }}</v-list-item-title>
            <v-list-item-icon>
              <v-btn icon small
                ><v-icon small @click.stop="moveUpGroup(index)"
                  >fa-chevron-up</v-icon
                ></v-btn
              ></v-list-item-icon
            >
            <v-list-item-icon>
              <v-btn icon small
                ><v-icon small @click.stop="moveDownGroup(index)"
                  >fa-chevron-down</v-icon
                ></v-btn
              ></v-list-item-icon
            >
            <v-list-item-icon v-if="group.editable">
              <v-btn icon small @click.stop="openGroupModal(index)"
                ><v-icon small>fa-edit</v-icon></v-btn
              ></v-list-item-icon
            >
            <v-list-item-icon v-if="group.removable">
              <v-btn icon small @click.stop="deleteGroup(index)"
                ><v-icon small>fa-trash-alt</v-icon></v-btn
              ></v-list-item-icon
            >
          </template>
          <template v-slot:appendIcon>
            <v-icon small class="ml-4">fa-caret-up</v-icon>
          </template>

          <draggable
            v-model="group.tests"
            group="group"
            draggable=".item"
            @change="onDragChange"
          >
            <!-- <transition-group> -->
            <v-subheader v-show="group.tests.length == 0" slot="header" inset
              >Nothing here...</v-subheader
            >
            <v-list-item
              class="item"
              color="#d12e2e"
              v-for="(item, itemIndex) in group.tests"
              :key="item.created_at"
              link
              exact
              :to="{
                name: 'frontend-restore',
                params: { groupName: group.name, testName: item.name },
              }"
              @click="pushHistory(group.name, item.name, item.data)"
            >
              <v-list-item-avatar :size="28">
                <v-icon small>fa-grip-vertical</v-icon>
              </v-list-item-avatar>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-icon>
                <v-btn
                  icon
                  small
                  @click.prevent="openTestModal(index, itemIndex)"
                  ><v-icon small>fa-edit</v-icon></v-btn
                >
              </v-list-item-icon>
              <v-list-item-icon>
                <v-btn icon small @click.prevent="deleteTest(index, itemIndex)"
                  ><v-icon small>fa-trash-alt</v-icon></v-btn
                >
              </v-list-item-icon>
            </v-list-item>
            <!-- </transition-group> -->
          </draggable>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-dialog v-model="newGroupModal" max-width="350">
      <v-card>
        <v-card-title class="headline">新建分组</v-card-title>
        <v-card-text>
          <v-form
            ref="newGroupForm"
            v-model="newGroupValid"
            lazy-validation
            @submit.prevent="appendGroup()"
          >
            <v-text-field
              label="分组名"
              v-model="newGroupName"
              :rules="[required]"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="newGroupModal = false">取消</v-btn>
          <v-btn
            text
            color="primary"
            :disabled="!newGroupValid"
            @click="appendGroup()"
            >确定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="groupModal" max-width="350">
      <v-card>
        <v-card-title class="headline">修改分组</v-card-title>
        <v-card-text>
          <v-form
            ref="groupForm"
            v-model="groupValid"
            lazy-validation
            @submit.prevent="changeGroup()"
          >
            <v-text-field
              label="分组名"
              v-model="groupName"
              :rules="[required]"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="groupModal = false">取消</v-btn>
          <v-btn
            text
            color="primary"
            :disabled="!groupValid"
            @click="changeGroup()"
            >确定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="itemModal" max-width="350">
      <v-card>
        <v-card-title class="headline">修改名称</v-card-title>
        <v-card-text>
          <v-form
            ref="itemForm"
            v-model="itemValid"
            lazy-validation
            @submit.prevent="changeTest()"
          >
            <v-text-field
              label="名称"
              v-model="itemName"
              :rules="[required]"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="itemModal = false">取消</v-btn>
          <v-btn
            text
            color="primary"
            :disabled="!itemValid"
            @click="changeTest()"
            >确定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-app-bar app color="white" flat>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <!-- <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo.png"
          transition="scale-transition"
          width="40"
        />
        <v-toolbar-title class="hidden-sm-and-down">NoneBot</v-toolbar-title>
      </div>-->

      <v-spacer></v-spacer>

      <v-btn href="https://nonebot.cqp.moe/" target="_blank" text>
        <span class="mr-2">NoneBot</span>
        <v-icon small>fa-external-link-alt</v-icon>
      </v-btn>

      <v-btn href="https://github.com/nonebot" target="_blank" text>
        <span class="mr-2">GitHub</span>
        <v-icon small>fa-external-link-alt</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view
          :groupName="currentGroup"
          :testName="currentTest"
          :testData="currentTestData"
        ></router-view>
      </v-container>
    </v-main>

    <v-footer app color="white" padless>
      <v-container class="pa-0">
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="auto">
            <span>
              <v-icon small left>$gratipay</v-icon>Disigned by yanyongyu
            </span>
          </v-col>
          <v-col class="text-center" cols="auto">
            <span> <v-icon small left>fa-copyright</v-icon>NoneBot </span>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "App",
  components: {
    draggable,
  },
  data: () => ({
    drawer: true,

    // groups: this.$store.state.groups,
    groups: [],
    currentGroup: "",
    currentTest: "",
    currentTestData: {},

    required: (v) => !!v || "分组名不能为空！",
    newGroupName: "",
    newGroupModal: false,
    newGroupValid: true,
    groupName: "",
    groupIndex: 0,
    groupModal: false,
    groupValid: true,
    itemName: "",
    itemIndex: 0,
    itemModal: false,
    itemValid: true,
  }),
  watch: {
    groups: {
      deep: true,
      handler: function (value) {
        this.$store.dispatch("updateGroups", value);
      },
    },
  },
  methods: {
    pushEmpty() {
      if (this.$route.name !== "frontend") {
        this.$router.push({ name: "frontend" });
      }
    },
    pushHistory(currentGroup, currentTest, currentTestData) {
      this.currentGroup = currentGroup;
      this.currentTest = currentTest;
      this.currentTestData = currentTestData;
    },
    onDragChange(change) {
      if (change.removed) {
        if (change.removed.element.name === this.currentTest) {
          this.$router.replace({ name: "frontend" });
        }
      }
    },
    openNewGroupModal(groupName) {
      this.newGroupName = groupName || "";
      this.newGroupModal = true;
    },
    openGroupModal(groupIndex) {
      this.groupIndex = groupIndex;
      this.groupName = this.groups[groupIndex].name;
      this.groupModal = true;
    },
    openTestModal(groupIndex, itemIndex) {
      this.groupIndex = groupIndex;
      this.itemIndex = itemIndex;
      this.itemName = this.groups[groupIndex].tests[itemIndex].name;
      this.itemModal = true;
    },
    appendGroup() {
      if (this.$refs.newGroupForm.validate()) {
        this.groups.push({
          name: this.newGroupName,
          expand: true,
          editable: true,
          removable: true,
          tests: [],
        });
        this.newGroupModal = false;
      }
    },
    changeGroup() {
      if (this.$refs.groupForm.validate()) {
        const oldGroupName = this.groups[this.groupIndex].name;
        this.groups[this.groupIndex].name = this.groupName;
        this.groupModal = false;
        if (
          this.$route.name === "frontend-restore" &&
          this.$route.params.groupName === oldGroupName
        ) {
          this.$router.replace({
            name: "frontend-restore",
            params: {
              groupName: this.groupName,
              testName: this.$route.params.testName,
            },
          });
        }
      }
    },
    deleteGroup(index) {
      // TODO: alert user
      const oldGroupName = this.groups[index].name;
      this.groups.splice(index, 1);
      if (
        this.$route.name === "frontend-restore" &&
        this.$route.params.groupName === oldGroupName
      ) {
        this.$router.replace({ name: "frontend" });
      }
    },
    moveUpGroup(index) {
      if (index !== 0) {
        this.groups[index] = this.groups.splice(
          index - 1,
          1,
          this.groups[index]
        )[0];
      }
    },
    moveDownGroup(index) {
      if (index !== this.groups.length - 1) {
        this.groups[index] = this.groups.splice(
          index + 1,
          1,
          this.groups[index]
        )[0];
      }
    },
    changeTest() {
      if (this.$refs.itemForm.validate()) {
        const oldItemName = this.groups[this.groupIndex].tests[this.itemIndex]
          .name;
        this.groups[this.groupIndex].tests[this.itemIndex].name = this.itemName;
        this.itemModal = false;
        if (
          this.$route.name === "frontend-restore" &&
          this.$route.params.testName === oldItemName
        ) {
          this.$router.replace({
            name: "frontend-restore",
            params: {
              groupName: this.$route.params.groupName,
              testName: this.itemName,
            },
          });
        }
      }
    },
    deleteTest(groupIndex, itemIndex) {
      // TODO: alert user
      const item = this.groups[groupIndex].tests.splice(itemIndex, 1);
      if (
        this.$route.name == "frontend-restore" &&
        this.$route.params.testName == item[0].name
      ) {
        this.$router.replace({ name: "frontend" });
      }
    },
  },
  mounted() {
    // restore groups from localstorage or use default value.
    let restoreValue = null;
    try {
      restoreValue = JSON.parse(localStorage.getItem("nonebot-groups"));
    } catch (error) {
      console.error(`[*]无法从本地存储恢复数据！Error: ${error}`);
    }
    this.groups = restoreValue || [
      {
        name: "默认分组",
        expand: true,
        editable: false,
        removable: false,
        tests: [],
      },
    ];
  },
};
</script>

<style scoped>
footer span {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
