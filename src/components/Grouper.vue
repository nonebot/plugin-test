<template>
  <div>
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
        v-model="groups[groupId].expand"
        class="group"
        color="#d12e2e"
        v-for="(groupId, index) in groupIndex"
        :key="groupId"
      >
        <template v-slot:activator>
          <v-list-item-title>{{ groups[groupId].name }}</v-list-item-title>
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
          <v-list-item-icon v-if="groups[groupId].editable">
            <v-btn icon small @click.stop="openGroupModal(groupId)"
              ><v-icon small>fa-edit</v-icon></v-btn
            ></v-list-item-icon
          >
          <v-list-item-icon v-if="groups[groupId].removable">
            <v-btn icon small @click.stop="deleteGroup(index)"
              ><v-icon small>fa-trash-alt</v-icon></v-btn
            ></v-list-item-icon
          >
        </template>
        <template v-slot:appendIcon>
          <v-icon small class="ml-4">fa-caret-up</v-icon>
        </template>

        <draggable
          v-model="groups[groupId].tests"
          group="group"
          draggable=".item"
        >
          <!-- <transition-group> -->
          <v-subheader
            v-show="groups[groupId].tests.length == 0"
            slot="header"
            inset
            >Nothing here...</v-subheader
          >
          <v-list-item
            class="item"
            color="#d12e2e"
            v-for="(testId, testIndex) in groups[groupId].tests"
            :key="testId"
            link
            exact
            :to="{
              name: 'frontend-restore',
              params: { testId },
            }"
          >
            <v-list-item-avatar :size="28">
              <v-icon small>fa-grip-vertical</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>{{ tests[testId].name }}</v-list-item-title>
            <v-list-item-icon>
              <v-btn icon small @click.prevent="openTestModal(testId)"
                ><v-icon small>fa-edit</v-icon></v-btn
              >
            </v-list-item-icon>
            <v-list-item-icon>
              <v-btn icon small @click.prevent="deleteTest(groupId, testIndex)"
                ><v-icon small>fa-trash-alt</v-icon></v-btn
              >
            </v-list-item-icon>
          </v-list-item>
          <!-- </transition-group> -->
        </draggable>
      </v-list-group>
    </v-list>

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

    <v-dialog v-model="testModal" max-width="350">
      <v-card>
        <v-card-title class="headline">修改名称</v-card-title>
        <v-card-text>
          <v-form
            ref="itemForm"
            v-model="testValid"
            lazy-validation
            @submit.prevent="changeTest()"
          >
            <v-text-field
              label="名称"
              v-model="testName"
              :rules="[required]"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="testModal = false">取消</v-btn>
          <v-btn
            text
            color="primary"
            :disabled="!testValid"
            @click="changeTest()"
            >确定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { v1 as uuidv1 } from "uuid";
import draggable from "vuedraggable";

export default {
  name: "Grouper",
  components: {
    draggable,
  },
  data: () => ({
    groups: {},
    tests: {},
    groupIndex: [],

    required: (v) => !!v || "名称不能为空！",
    newGroupName: "",
    newGroupModal: false,
    newGroupValid: true,
    groupId: "",
    groupName: "",
    groupModal: false,
    groupValid: true,
    testId: "",
    testName: "",
    testModal: false,
    testValid: true,
  }),
  watch: {
    groups: {
      deep: true,
      handler: function (value) {
        console.log("[i] Update group");
        this.$store.dispatch("updateGroups", value);
      },
    },
    tests: {
      deep: true,
      handler: function (value) {
        console.log("[i] Update test");
        this.$store.dispatch("updateTests", value);
      },
    },
    groupIndex: {
      deep: true,
      handler: function (value) {
        console.log("[i] Update index");
        this.$store.dispatch("updateGroupIndex", value);
      },
    },
  },
  methods: {
    pushEmpty() {
      if (this.$route.name !== "frontend") {
        this.$router.push({ name: "frontend" });
      }
    },
    openNewGroupModal(groupName) {
      this.newGroupName = groupName || "";
      this.newGroupModal = true;
    },
    openGroupModal(groupId) {
      this.groupId = groupId;
      this.groupName = this.groups[groupId].name;
      this.groupModal = true;
    },
    openTestModal(testId) {
      this.testId = testId;
      this.testName = this.tests[this.testId].name;
      this.testModal = true;
    },
    appendGroup() {
      if (this.$refs.newGroupForm.validate()) {
        const id = uuidv1();
        this.$set(this.groups, id, {
          id: id,
          name: this.newGroupName,
          expand: true,
          editable: true,
          removable: true,
          tests: [],
        });
        this.groupIndex.push(id);
        this.newGroupModal = false;
      }
    },
    changeGroup() {
      if (this.$refs.groupForm.validate()) {
        this.groups[this.groupId].name = this.groupName;
        this.groupModal = false;
      }
    },
    deleteGroup(groupIndex) {
      // TODO: alert user
      const groupId = this.groupIndex.splice(groupIndex, 1)[0];
      for (let i = 0; i < this.groups[groupId].tests.length; i++) {
        const testId = this.groups[groupId].tests[i];
        if (
          this.$route.name === "frontend-restore" &&
          this.$route.params.testId === testId
        ) {
          this.$router.replace({ name: "frontend" });
        }
        console.log(`[i] Delete test ${testId}`);
        this.$delete(this.tests, testId);
      }
      console.log(`[i] Delete group ${groupId}`);
      this.$delete(this.groups, groupId);
    },
    moveUpGroup(index) {
      if (index !== 0) {
        this.groupIndex[index] = this.groupIndex.splice(
          index - 1,
          1,
          this.groupIndex[index]
        )[0];
      }
    },
    moveDownGroup(index) {
      if (index !== this.groupIndex.length - 1) {
        this.groupIndex[index] = this.groupIndex.splice(
          index + 1,
          1,
          this.groupIndex[index]
        )[0];
      }
    },
    changeTest() {
      if (this.$refs.itemForm.validate()) {
        this.tests[this.testId].name = this.testName;
        this.testModal = false;
      }
    },
    deleteTest(groupId, testIndex) {
      // TODO: alert user
      const testId = this.groups[groupId].tests.splice(testIndex, 1);
      if (
        this.$route.name == "frontend-restore" &&
        this.$route.params.testId == testId
      ) {
        this.$router.replace({ name: "frontend" });
      }
      console.log(`[i] Delete test ${testId}`);
      this.$delete(this.tests, testId);
    },
  },
  mounted() {
    this.groups = this.$store.state.groups;
    this.tests = this.$store.state.tests;
    this.groupIndex = this.$store.state.groupIndex;
  },
};
</script>
