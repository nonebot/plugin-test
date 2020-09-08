const required = (v) => !!v || "该项必填";

function CQArray2Text(array) {
  if (!(array instanceof Array)) {
    return "";
  }
  let text = "";
  for (let segment of array) {
    if (segment.type === "text") {
      text += segment.data.text;
    } else {
      text += "[CQ:" + segment.type;
      for (key of Object.keys(segment.data)) {
        text += key + "=" + segment.data[key];
      }
    }
  }
  return text;
}

const templates = {
  CQHTTP: {
    events: {
      message_private: {
        text: "私聊消息",
        value: "message_private",
        fields: [
          {
            type: "select",
            label: "消息子类型",
            model: "sub_type",
            options: ["friend", "group", "discuss", "other"],
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "发送人QQ",
            model: "user_id",
            rules: [required],
          },
          {
            type: "textarea",
            label: "消息内容",
            model: "message",
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "字体",
            model: "font",
          },
        ],
        data: {
          sub_type: null,
          user_id: null,
          message: null,
          font: 0,
        },
        template: {
          self_id: "{{ self_id }}",
          time: "{{ current_time }}",
          post_type: "message",
          message_type: "private",
          sub_type: "{{ sub_type }}",
          message_id: "{{ message_id }}",
          user_id: "{{ parseInt(user_id) }}",
          message: "{{ message }}",
          raw_message: "{{ message }}",
          font: "{{ parseInt(font) }}",
          sender:
            "{{ senders[user_id] ? senders[user_id] : { user_id: -1, nickname: '请在设置中填写信息' } }}",
        },
        action: (vue, data) => {
          vue.$store.dispatch("appendMessage", {
            position: "right",
            msg: data.message,
          });
        },
      },
      message_group: {
        text: "群消息",
        value: "message_group",
        fields: [
          {
            type: "select",
            label: "消息子类型",
            model: "sub_type",
            options: ["normal", "anonymous", "notice"],
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "群号",
            model: "group_id",
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "发送人QQ",
            model: "user_id",
            rules: [required],
          },
          {
            type: "textarea",
            label: "消息内容",
            model: "message",
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "字体",
            model: "font",
          },
          {
            type: "input",
            subType: "number",
            label: "匿名用户ID",
            model: "anonymous_id",
          },
          {
            type: "input",
            subType: "text",
            label: "匿名用户名",
            model: "anonymous_name",
          },
          {
            type: "input",
            subType: "text",
            label: "匿名用户flag",
            model: "anonymous_flag",
          },
        ],
        data: {
          sub_type: null,
          group_id: null,
          user_id: null,
          message: null,
          font: 0,
          anonymous_id: null,
          anonymous_name: "",
          anonymous_flag: null,
        },
        template: {
          self_id: "{{ self_id }}",
          time: "{{ current_time }}",
          post_type: "message",
          message_type: "group",
          sub_type: "{{ sub_type }}",
          message_id: "{{ message_id }}",
          group_id: "{{ parseInt(group_id) }}",
          user_id: "{{ parseInt(user_id) }}",
          anonymous:
            "{{ sub_type == 'anonymous' ? { id: parseInt(anonymous_id), name: anonymous_name, flag: anonymous_flag } : null }}",
          message: "{{ message }}",
          raw_message: "{{ message }}",
          font: "{{ parseInt(font) }}",
          sender:
            "{{ senders[user_id] ? senders[user_id] : { user_id: -1, nickname: '请在设置中填写信息' } }}",
        },
        action: (vue, data) => {
          vue.$store.dispatch("appendMessage", {
            position: "right",
            msg: data.message,
          });
        },
      },
      notice_group_upload: {
        text: "群文件上传",
        value: "notice_group_upload",
        fields: [
          {
            type: "input",
            subType: "number",
            label: "群号",
            model: "group_id",
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "发送人QQ",
            model: "user_id",
            rules: [required],
          },
          {
            type: "input",
            subType: "text",
            label: "文件ID",
            model: "file_id",
          },
          {
            type: "input",
            subType: "text",
            label: "文件名",
            model: "file_name",
          },
          {
            type: "input",
            subType: "number",
            label: "文件大小",
            model: "file_size",
          },
          {
            type: "input",
            subType: "number",
            label: "busid",
            model: "file_busid",
          },
        ],
        data: {
          group_id: null,
          user_id: null,
          file_id: null,
          file_name: "",
          file_size: null,
          file_busid: null,
        },
        template: {
          self_id: "{{ self_id }}",
          time: "{{ current_time }}",
          post_type: "notice",
          notice_type: "group_upload",
          group_id: "{{ parseInt(group_id) }}",
          user_id: "{{ parseInt(user_id) }}",
          file: {
            id: "{{ file_id }}",
            name: "{{ file_name }}",
            size: "{{ parseInt(file_size) }}",
            busid: "{{ parseInt(file_busid) }}",
          },
        },
        action: (vue, data) => {
          vue.$store.dispatch("appendMessage", {
            position: "center",
            msg: "群文件上传",
          });
        },
      },
      notice_group_admin: {
        text: "群管理员变动",
        value: "notice_group_admin",
        fields: [
          {
            type: "select",
            label: "事件子类型",
            model: "sub_type",
            options: ["set", "unset"],
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "群号",
            model: "group_id",
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "管理员QQ",
            model: "user_id",
            rules: [required],
          },
        ],
        data: {
          sub_type: null,
          group_id: null,
          user_id: null,
        },
        template: {
          self_id: "{{ self_id }}",
          time: "{{ current_time }}",
          post_type: "notice",
          notice_type: "group_admin",
          sub_type: "{{ sub_type }}",
          group_id: "{{ parseInt(group_id) }}",
          user_id: "{{ parseInt(user_id) }}",
        },
        action: (vue, data) => {
          vue.$store.dispatch("appendMessage", {
            position: "center",
            msg: "群管理员变动",
          });
        },
      },
      notice_group_decrease: {
        text: "群成员减少",
        value: "notice_group_decrease",
        fields: [
          {
            type: "select",
            label: "事件子类型",
            model: "sub_type",
            options: ["leave", "kick", "kick_me"],
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "群号",
            model: "group_id",
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "操作人QQ",
            model: "operator_id",
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "离开人QQ",
            model: "user_id",
            rules: [required],
          },
        ],
        data: {
          sub_type: null,
          group_id: null,
          operator_id: null,
          user_id: null,
        },
        template: {
          self_id: "{{ self_id }}",
          time: "{{ current_time }}",
          post_type: "notice",
          notice_type: "group_decrease",
          sub_type: "{{ sub_type }}",
          group_id: "{{ parseInt(group_id) }}",
          operator_id: "{{ parseInt(operator_id) }}",
          user_id: "{{ parseInt(user_id) }}",
        },
        action: (vue, data) => {
          vue.$store.dispatch("appendMessage", {
            position: "center",
            msg: `${data.user_id}离开了群聊`,
          });
        },
      },
      notice_group_increase: {
        text: "群成员增加",
        value: "notice_group_increase",
        fields: [
          {
            type: "select",
            label: "事件子类型",
            model: "sub_type",
            options: ["approve", "invite"],
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "群号",
            model: "group_id",
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "操作人QQ",
            model: "operator_id",
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "加入人QQ",
            model: "user_id",
            rules: [required],
          },
        ],
        data: {
          sub_type: null,
          group_id: null,
          operator_id: null,
          user_id: null,
        },
        template: {
          self_id: "{{ self_id }}",
          time: "{{ current_time }}",
          post_type: "notice",
          notice_type: "group_increase",
          sub_type: "{{ sub_type }}",
          group_id: "{{ parseInt(group_id) }}",
          operator_id: "{{ parseInt(operator_id) }}",
          user_id: "{{ parseInt(user_id) }}",
        },
        action: (vue, data) => {
          vue.$store.dispatch("appendMessage", {
            position: "center",
            msg: `${data.user_id}加入了本群`,
          });
        },
      },
      notice_group_ban: {
        text: "群禁言",
        value: "notice_group_ban",
        fields: [
          {
            type: "select",
            label: "事件子类型",
            model: "sub_type",
            options: ["ban", "lift_ban"],
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "群号",
            model: "group_id",
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "操作人QQ",
            model: "operator_id",
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "被禁言人QQ",
            model: "user_id",
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "禁言时间",
            model: "duration",
            rules: [required],
          },
        ],
        data: {
          sub_type: null,
          group_id: null,
          operator_id: null,
          user_id: null,
          duration: null,
        },
        template: {
          self_id: "{{ self_id }}",
          time: "{{ current_time }}",
          post_type: "notice",
          notice_type: "group_ban",
          sub_type: "{{ sub_type }}",
          group_id: "{{ parseInt(group_id) }}",
          operator_id: "{{ parseInt(operator_id) }}",
          user_id: "{{ parseInt(user_id) }}",
          duration: "{{ duration }}",
        },
        action: (vue, data) => {
          vue.$store.dispatch("appendMessage", {
            position: "center",
            msg: `${data.user_id}被管理员禁言`,
          });
        },
      },
      notice_friend_add: {
        text: "好友添加",
        value: "notice_friend_add",
        fields: [
          {
            type: "input",
            subType: "number",
            label: "添加人QQ",
            model: "user_id",
            rules: [required],
          },
        ],
        data: {
          user_id: null,
        },
        template: {
          self_id: "{{ self_id }}",
          time: "{{ current_time }}",
          post_type: "notice",
          notice_type: "friend_add",
          user_id: "{{ parseInt(user_id) }}",
        },
        action: (vue, data) => {
          vue.$store.dispatch("appendMessage", {
            position: "center",
            msg: `你与${data.user_id}成为了好友`,
          });
        },
      },
      request_friend: {
        text: "加好友请求",
        value: "request_friend",
        fields: [
          {
            type: "input",
            subType: "number",
            label: "添加人QQ",
            model: "user_id",
            rules: [required],
          },
          {
            type: "textarea",
            label: "验证信息",
            model: "comment",
          },
          {
            type: "input",
            label: "flag",
            model: "flag",
            rules: [required],
          },
        ],
        data: {
          user_id: null,
          comment: "",
          flag: null,
        },
        template: {
          self_id: "{{ self_id }}",
          time: "{{ current_time }}",
          post_type: "request",
          request_type: "friend",
          user_id: "{{ parseInt(user_id) }}",
          comment: "{{ comment }}",
          flag: "{{ flag }}",
        },
        action: (vue, data) => {
          vue.$store.dispatch("appendMessage", {
            position: "center",
            msg: `${data.user_id}申请添加你为好友`,
          });
        },
      },
      request_group: {
        text: "加群请求/邀请",
        value: "request_group",
        fields: [
          {
            type: "select",
            label: "请求子类型",
            model: "sub_type",
            options: ["add", "invite"],
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "群号",
            model: "group_id",
            rules: [required],
          },
          {
            type: "input",
            subType: "number",
            label: "添加人QQ",
            model: "user_id",
            rules: [required],
          },
          {
            type: "textarea",
            label: "验证信息",
            model: "comment",
          },
          {
            type: "input",
            label: "flag",
            model: "flag",
            rules: [required],
          },
        ],
        data: {
          sub_type: null,
          group_id: null,
          user_id: null,
          comment: "",
          flag: null,
        },
        template: {
          self_id: "{{ self_id }}",
          time: "{{ current_time }}",
          post_type: "request",
          request_type: "group",
          sub_type: "{{ sub_type }}",
          group_id: "{{ parseInt(group_id) }}",
          user_id: "{{ parseInt(user_id) }}",
          comment: "{{ comment }}",
          flag: "{{ flag }}",
        },
        action: (vue, data) => {
          vue.$store.dispatch("appendMessage", {
            position: "center",
            msg: `${data.user_id}申请/邀请你加入群聊${data.group_id}`,
          });
        },
      },
      meta_lifecycle: {
        text: "生命周期",
        value: "meta_lifecycle",
        fields: [
          {
            type: "select",
            label: "事件子类型",
            model: "sub_type",
            options: ["enable", "disable", "connect"],
            rules: [required],
          },
        ],
        data: {
          sub_type: null,
        },
        template: {
          self_id: "{{ self_id }}",
          time: "{{ current_time }}",
          post_type: "meta_event",
          meta_event_type: "lifecycle",
          sub_type: "{{ sub_type }}",
        },
      },
      meta_heartbeat: {
        text: "心跳",
        value: "meta_heartbeat",
        fields: [
          {
            type: "switch",
            label: "QQ在线",
            model: "online",
          },
          {
            type: "input",
            subType: "number",
            label: "心跳间隔",
            model: "interval",
            rules: [required],
          },
        ],
        data: {
          online: true,
          interval: null,
        },
        template: {
          self_id: "{{ self_id }}",
          time: "{{ current_time }}",
          post_type: "meta_event",
          meta_event_type: "heartbeat",
          status: {
            app_initialized: true,
            app_enabled: true,
            plugins_good: null,
            app_good: true,
            online: "{{ online }}",
            good: "{{ online }}",
          },
          interval: "{{ parseInt(interval) }}",
        },
      },
    },
    apis: {
      send_private_msg(vue, data) {
        vue.$store.dispatch("appendMessage", {
          position: "left",
          msg:
            typeof data.params.message === "string"
              ? data.params.message
              : CQArray2Text(data.params.message),
        });
        vue.$socket.emit("event", [
          "CQHTTP",
          {
            status: "success",
            retcode: 1200,
            data: {
              message_id: vue.$store.state.messages.length,
            },
            echo: data.echo,
          },
        ]);
      },
      send_group_msg(vue, data) {
        vue.$store.dispatch("appendMessage", {
          position: "left",
          msg:
            typeof data.params.message === "string"
              ? data.params.message
              : CQArray2Text(data.params.message),
        });
        vue.$socket.emit("event", [
          "CQHTTP",
          {
            status: "success",
            retcode: 1200,
            data: {
              message_id: vue.$store.state.messages.length,
            },
            echo: data.echo,
          },
        ]);
      },
      send_msg(vue, data) {
        vue.$store.dispatch("appendMessage", {
          position: "left",
          msg:
            typeof data.params.message === "string"
              ? data.params.message
              : CQArray2Text(data.params.message),
        });
        vue.$socket.emit("event", [
          "CQHTTP",
          {
            status: "success",
            retcode: 1200,
            data: {
              message_id: vue.$store.state.messages.length,
            },
            echo: data.echo,
          },
        ]);
      },
    },
  },
  // Mirai: {},
};

export default templates;
