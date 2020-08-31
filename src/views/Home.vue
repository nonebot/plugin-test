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
    // },
    matchers: {},

    // flowchart
    loading: true,
    config: {
      x: 0,
      y: 0,
      "line-width": 2,
      "line-length": 50,
      "text-margin": 10,
      "font-size": 14,
      "font-color": "#8DA1AC",
      "line-color": "#8DA1AC",
      "element-color": "black",
      fill: "white",
      "yes-text": "yes",
      "no-text": "no",
      "arrow-end": "block",
      scale: 1,
      symbols: {
        start: {
          class: "start-element",
          "font-color": "white",
          fill: "#2F495F",
          "line-width": "0px",
        },
        end: {
          class: "end-element",
          "font-color": "white",
          fill: "#2F495F",
          "line-width": "0px",
        },
        operation: {
          class: "operation-element",
          "font-color": "white",
          fill: "#00BC7D",
          "line-width": "0px",
        },
        inputoutput: {
          class: "inputoutput-element",
          "font-color": "white",
          fill: "#EB4D5D",
          "line-width": "0px",
        },
        subroutine: {
          class: "subroutine-element",
          "font-color": "white",
          fill: "#937AC4",
          "element-color": "#fff",
          "line-color": "red",
        },
        condition: {
          class: "condition-element",
          "font-color": "white",
          fill: "#FFB500",
          "line-width": "0px",
        },
        parallel: {
          class: "parallel-element",
          "font-color": "white",
          fill: "#2F495F",
          "line-width": "0px",
        },
      },
    },
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
          this.$toastr.error("", "Could not get loaded matchers: ", err);
          console.log("[!] Could not get loaded matchers: ", err);
        });
    },
    // flowchart.js
    // drawFlowChart() {
    //   // Generate flowchart
    //   let nodeTemplate = "st=>start: Event\ne=>end: Done\n";
    //   let linkTemplate = "";
    //   let currentNode = "st";
    //   let sorted = Object.keys(this.matchers).sort();
    //   for (let i in sorted) {
    //     let priority = sorted[i];
    //     if (i === "0") {
    //       nodeTemplate += `pri${priority}=>operation: ${priority}`;
    //       linkTemplate += `\nst(bottom)->pri${priority}(top)`;
    //     } else {
    //       nodeTemplate += `\ncond${priority}=>condition: Block?`;
    //       linkTemplate += `\ncond${priority}(yes, bottom)->e`;
    //       linkTemplate += `\n${currentNode}(right)->cond${priority}(top)`;
    //       nodeTemplate += `\npri${priority}=>operation: ${priority}`;
    //       linkTemplate += `\ncond${priority}(no, left)->pri${priority}(top)`;
    //     }
    //     nodeTemplate += `\nmatcher${priority}=>operation: `;
    //     for (let j in this.matchers[priority]) {
    //       const matcher = this.matchers[priority][j];
    //       nodeTemplate += `${matcher.type} matcher from ${matcher.module} handlers: ${matcher.handlers}\n`;
    //     }
    //     linkTemplate += `\npri${priority}(right)->matcher${priority}(left)`;
    //     currentNode = `matcher${priority}`;
    //   }
    //   linkTemplate += `\n${currentNode}(right)->e`;
    //   let template = `${nodeTemplate}\n${linkTemplate}`;
    //   console.log(template);

    //   const delay = () => new Promise((resolve) => setTimeout(resolve, 500));
    //   Promise.all([
    //     import(/* webpackChunkName: "flowchart" */ "flowchart.js"),
    //     delay(),
    //   ]).then(([flowchart]) => {
    //     const { parse } = flowchart.default;
    //     const svg = parse(template);
    //     svg.drawSVG("flowchart", this.config);
    //     this.loading = false;
    //   });
    // },
    drawFlowChart() {
      const delay = () => new Promise((resolve) => setTimeout(resolve, 500));
      Promise.all([
        import(/* webpackChunkName: "jointjs" */ "jointjs"),
        delay(),
      ]).then(([joint]) => {
        let graph = new joint.dia.Graph();

        let paper = new joint.dia.Paper({
          el: document.getElementById("flowchart"),
          model: graph,
          width: "100%",
          height: "200px",
          gridSize: 10,
          drawGrid: true,
          background: {
            color: "white",
          },
        });

        let start = new joint.shapes.basic.Rect({
          position: { x: 70, y: 15 },
          size: { width: 50, height: 30 },
          attrs: {
            rect: {
              fill: "#2F495F",
              "stroke-width": "0px",
              rx: 30,
              ry: 30,
            },
            text: {
              text: "Event",
              fill: "white",
            },
          },
        });
        start.addTo(graph);

        function end(x, y) {
          let endCell = new joint.shapes.basic.Rect({
            position: { x, y },
            size: { width: 50, height: 30 },
            attrs: {
              rect: {
                fill: "#2F495F",
                "stroke-width": "0px",
                rx: 30,
                ry: 30,
              },
              text: {
                text: "Done",
                fill: "white",
              },
            },
          });
          endCell.addTo(graph);
          return endCell;
        }

        function link(source, target, breakpoints) {
          var cell = new joint.shapes.devs.Link({
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
          });
          graph.addCell(cell);
          return cell;
        }

        if (Object.keys(this.matchers).length === 0) {
          let endCell = end(70, 100);
          link(start, endCell);
        }
      });
    },
  },
  mounted() {
    this.getProject();
    this.getPlugins();
    this.getMatchers();
    this.drawFlowChart();
  },
};
</script>

<style>
.flowchart {
  overflow: scroll;
  text-align: center;
  font-size: 0px;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 1s;
  padding: 10px;
}
.flowchart.loading {
  background-color: #f3f6f8;
}
.flowchart > svg {
  max-width: 100%;
  height: auto;
}
/* .operation-elment .parallel-element {
  rx: 5px;
  ry: 5px;
} */

.flowchart-loading-icon {
  width: 40px;
  height: 40px;
  fill: #3eaf7c;
}
</style>
