const required = (v) => !!v || "该项必填";

const templates = {
  CoolQ: {
    message_private: {
      text: "私聊消息",
      value: "message_private",
      fields: [
        {
          type: "select",
          label: "sub_type",
          options: ["friend", "group", "discuss", "other"],
          rules: [required],
        },
        {
          type: "textarea",
          label: "message",
          rules: [required],
        },
        {
          type: "input",
          subType: "number",
          label: "user_id",
          rules: [required],
        },
        {
          type: "input",
          subType: "number",
          label: "font",
        },
      ],
      data: {
        sub_type: null,
        message: null,
        user_id: null,
        font: null,
      },
      template: `
      {
        "post_type": "message",
        "message_type": "private",
        "sub_type": "{{ sub_type }}",
        "message_id": 10000,
        "user_id": {{ user_id }},
        "message": "{{ message }}",
        "raw_message": "{{ message }}",
        "font": {{ font }},
        "sender": {{
          senders.user_id
          ？ senders.user_id
          : JSON.stringify({ user_id: user_id })
        }}
      }`,
    },
    message_group: {
      text: "群消息",
    },
    message_discuss: {
      text: "讨论组消息",
    },
    notice_group_upload: {
      text: "群文件上传",
    },
    notice_group_admin: {
      text: "群管理员变动",
    },
    notice_group_decrease: {
      text: "群成员减少",
    },
    notice_group_increase: {
      text: "群成员增加",
    },
    notice_group_ban: {
      text: "群禁言",
    },
    notice_friend_add: {
      text: "好友添加",
    },
    request_friend: {
      text: "加好友群求",
    },
    request_group: {
      text: "加群请求/邀请",
    },
    meta_lifecycle: {
      text: "生命周期",
    },
    meta_heartbeat: {
      text: "心跳",
    },
  },
  Mirai: {},
};

export default templates;
