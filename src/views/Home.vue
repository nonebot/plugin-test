<template>
  <v-container fluid class="home">
    <v-row dense>
      <v-col cols="auto">
        <!-- <v-img src="@/assets/logo.png" width="200"></v-img> -->
        <div
          class="text-h3 text-capitalize grey--text text--darken-2 font-weight-medium"
        >
          {{ projectInfo.name }}
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <p>Working Directory: {{ projectInfo.dir }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-expansion-panels multiple :value="[0, 1]">
          <!-- Plugin Panel -->
          <v-expansion-panel>
            <v-expansion-panel-header>Plugin Overview</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="3"
                    v-for="(plugin, index) in plugins"
                    :key="index"
                  >
                    <v-card color="#f3f6fc" :id="plugin.name">
                      <v-card-title class="py-2">
                        <div class="text-h5">
                          {{ plugin.name }}
                        </div>
                      </v-card-title>
                      <v-list-item dense two-line>
                        <v-list-item-content>
                          <v-list-item-title>Module Path</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ plugin.module }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item dense>
                        <v-list-item-content>
                          <v-list-item-title>
                            Matcher
                            <v-badge
                              inline
                              class="mt-0"
                              :content="plugin.matcher"
                            ></v-badge>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-- TODO: Matcher Panel -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              Matcher Overview
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div
                class="flowchart"
                :class="{ loading: loading }"
                id="flowchart"
                ref="flowchart"
              >
                <Loading
                  class="flowchart-loading-icon"
                  v-if="loading"
                ></Loading>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as joint from "jointjs";
import "jointjs/dist/joint.css";
import Loading from "@/components/Loading";

export default {
  name: "Home",
  components: {
    Loading,
  },
  data: () => ({
    projectInfo: {
      name: "",
      dir: "",
    },
    plugins: [],
    // matchers: {
    //   0: [
    //     {
    //       type: "message",
    //       module: "test_package",
    //       handlers: 1,
    //       priority: 0,
    //       temp: true,
    //       block: true,
    //     },
    //     {
    //       type: "message",
    //       module: "test_package",
    //       handlers: 1,
    //       priority: 0,
    //       temp: true,
    //       block: true,
    //     },
    //   ],
    //   1: [
    //     {
    //       type: "message",
    //       module: "test_package",
    //       handlers: 1,
    //       priority: 0,
    //       temp: true,
    //       block: true,
    //     },
    //   ],
    //   2: [
    //     {
    //       type: "message",
    //       module: "test_package",
    //       handlers: 1,
    //       priority: 0,
    //       temp: true,
    //       block: true,
    //     },
    //   ],
    // },
    matchers: {},

    // flowchart
    loading: true,
    paper: null,
    graph: null,
  }),
  methods: {
    getProject() {
      this.$axios
        .get("/info")
        .then((res) => {
          if (res.data.status === 200) {
            this.projectInfo = res.data.data || {
              name: "NoneBot",
              dir: "Unknown",
            };
          } else {
            this.$toastr.error("", "Could not get project info");
            console.log("[!] Could not get project info: ", res.data);
            this.projectInfo = { name: "NoneBot", dir: "Unknown" };
          }
        })
        .catch((err) => {
          this.$toastr.error("", "Could not get project info");
          console.log("[!] Could not get project info: ", err);
          this.projectInfo = { name: "NoneBot", dir: "Unknown" };
        });
    },
    getPlugins() {
      this.$axios
        .get("/plugins")
        .then((res) => {
          if (res.data.status === 200) {
            this.plugins = res.data.data;
          } else {
            this.$toastr.error("", "Could not get loaded plugins");
            console.log("[!] Could not get loaded plugins: ", res.data);
          }
        })
        .catch((err) => {
          this.$toastr.error("", "Could not get loaded plugins");
          console.log("[!] Could not get loaded plugins: ", err);
        });
    },
    getMatchers() {
      this.$axios
        .get("/matchers")
        .then((res) => {
          if (res.data.status === 200) {
            this.matchers = res.data.data;
            this.drawFlowChart();
          } else {
            this.$toastr.error("", "Could not get loaded matchers");
            console.log("[!] Could not get loaded matchers: ", res.data);
          }
        })
        .catch((err) => {
          this.$toastr.error("", "Could not get loaded matchers");
          console.log("[!] Could not get loaded matchers: ", err);
        });
    },
    drawFlowChart() {
      this.graph = new joint.dia.Graph();

      this.paper = new joint.dia.Paper({
        el: this.$refs.flowchart,
        model: this.graph,
        width: "100%",
        height: "200px",
        // gridSize: 10,
        // drawGrid: true,
        background: {
          color: "#f3f6f8",
        },
      });

      var that = this;
      var dragStartPosition = null;
      this.paper.on("blank:pointerdown", function (event, x, y) {
        dragStartPosition = { x: x, y: y };
      });
      this.paper.on("cell:pointerup blank:pointerup", function (
        cellView,
        x,
        y
      ) {
        dragStartPosition = null;
      });
      this.$refs.flowchart.onmousemove = function (event) {
        if (dragStartPosition)
          that.paper.translate(
            event.offsetX - dragStartPosition.x,
            event.offsetY - dragStartPosition.y
          );
      };
      this.$refs.flowchart.ontouchmove = function (event) {
        if (dragStartPosition)
          that.paper.translate(
            event.touches[0].clientX - dragStartPosition.x,
            event.touches[0].cilentY - dragStartPosition.y
          );
      };

      let start = this.drawRect(
        70,
        15,
        50,
        30,
        "Event",
        "#2F495F",
        "30px",
        "30px"
      );

      if (Object.keys(this.matchers).length === 0) {
        let end = this.drawRect(
          70,
          100,
          50,
          30,
          "Done",
          "#2F495F",
          "30px",
          "30px"
        );
        this.drawLink(start, end);
        return;
      }

      let Y = 70;
      let nodes = [];
      let conds = [];
      let priorities = Object.keys(this.matchers).sort();
      for (let priority of priorities) {
        if (nodes.length === 0) {
          nodes = this.drawPriority(
            Y,
            priority,
            this.matchers[priority],
            start,
            []
          );
        } else {
          let cond = this.drawCondition(Y - 60, nodes);
          conds.push(cond);
          nodes = this.drawPriority(
            Y,
            priority,
            this.matchers[priority],
            cond,
            [{ x: 95, y: Y - 40 }]
          );
        }
        Y += 40 * this.matchers[priority].length + 60;
      }

      let end = this.drawRect(
        660,
        Y - 30,
        50,
        30,
        "Done",
        "#2F495F",
        "30px",
        "30px"
      );
      for (let cell of [...nodes, ...conds]) {
        this.drawLink(cell, end, [
          {
            x: 685,
            y: cell.attributes.position.y + cell.attributes.size.height / 2,
          },
        ]);
      }

      this.paper.fitToContent({
        minWidth: "100%",
        padding: 30,
      });
      this.loading = false;
    },
    drawRect(x, y, width, height, text, color, rx, ry) {
      let cell = new joint.shapes.basic.Rect({
        position: { x, y },
        size: { width, height },
        attrs: {
          rect: {
            fill: color,
            "stroke-width": "0px",
            rx,
            ry,
          },
          text: {
            text: text,
            fill: "white",
          },
        },
      });
      this.graph.addCell(cell);
      return cell;
    },
    drawPolygon(x, y, points, text, color) {
      let cell = new joint.shapes.basic.Polygon({
        position: { x, y },
        attrs: {
          polygon: {
            points,
            fill: color,
            strokeWidth: "0px",
          },
          text: {
            text: text,
            fill: "white",
            refY: "-40",
            textVerticalAnchor: "start",
          },
        },
      });
      this.graph.addCell(cell);
      return cell;
    },
    drawLink(source, target, breakpoints) {
      let cell = new joint.shapes.devs.Link({
        source: { id: source.id },
        target: { id: target.id },
        vertices: breakpoints,
        attrs: {
          ".connection": {
            fill: "none",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            stroke: "#8DA1AC",
          },
        },
        connector: { name: "rounded", args: { radius: 10 } },
      });
      this.graph.addCell(cell);
      return cell;
    },
    drawPriority(y, priority, matchers, source, breakpoints) {
      let y_ = y;
      let nodes = [];
      let priCell = this.drawRect(
        80,
        y_,
        30,
        30,
        priority,
        "#00BC7D",
        "15px",
        "15px"
      );
      this.drawLink(source, priCell, breakpoints);
      for (let m of matchers) {
        let matchCell = this.drawRect(
          200,
          y_,
          350,
          30,
          `${m.type} matcher from ${m.module}, temp: ${m.temp}`,
          "#4285F4",
          "2px",
          "15px"
        );
        this.drawLink(priCell, matchCell, [
          { x: 160, y: y + 15 },
          { x: 160, y: y_ + 15 },
        ]);
        y_ += 40;
        nodes.push(matchCell);
      }
      return nodes;
    },
    drawCondition(y, nodes) {
      let cell = this.drawPolygon(
        600,
        y,
        "30,0 0,20 30,40 60,20",
        "Block?",
        "#FFB500"
      );
      for (let node of nodes) {
        this.drawLink(node, cell, [
          { x: 630, y: node.attributes.position.y + 15 },
        ]);
      }
      return cell;
    },
  },
  mounted() {
    this.getProject();
    this.getPlugins();
    this.getMatchers();
  },
};
</script>

<style>
.flowchart {
  position: relative;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 1s;
}
.flowchart.loading {
  background-color: #f3f6f8;
}
.flowchart > svg {
  z-index: 1;
}

.flowchart-loading-icon {
  width: 40px;
  height: 40px;
  fill: #3eaf7c;
}
</style>
