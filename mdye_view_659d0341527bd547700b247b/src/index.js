import { config, api, utils, env } from "mdye";
import "./style.less";
const { appId, worksheetId, projectId, viewId, controls, worksheetInfo, currentAccount } = config;
let { filters = {} } = config;
const { getFilterRows, getFilterRowsTotalNum, getRowDetail, getRowRelationRows, addaddWorksheetRow, updateWorksheetRow, deleteWorksheetRow } = api;
const { openRecordInfo, openNewRecord, selectUsers, selectDepartments, selectOrgRole, selectRecord, selectLocation } = utils;

import icon from "./icon.svg";

let word1 = "登天路"
let word2 = "踏歌行"
let word3 = "弹指遮天"

function renderMain() {
  document.querySelector("#app").innerHTML = `<div class="brand flex-1">
  <div class="logo">
    <img src=${icon} />
    <div class="bg"></div>
  </div>
  <div class="hello">${word1} ${word2} ${word3}!</div>
  <div class="edit">编辑项目下的 src/index.js 开始开发吧</div>
  <div class="records-count"></div>
</div>
<div class="playground flex-1">
  <div class="con">
    <div class="block">
      <div class="header"> env 映射信息</div>
      这里动态环境信息
      <div class="content env"> </div> 
    </div>
    <div class="block">
      <div class="header"> config 视图信息</div>
      这里动态appId,worksheetId,viewId
      <div class="content variables"> </div> 
    </div>
    <div class="operate-title">
      <span class="prefix">❯</span>组件调用
    </div>
    <div>
      <div
        class="button"
        id="newRecord"
      >
        新建记录
      </div>
      <div
        class="button"
        id="openRecordInfo"
      >
        打开记录
      </div>
      <div
        class="button"
        id="selectRecord"
      >
        选择记录
      </div>
    </div>
    <div>
      <div
        class="button"
        id="selectUser"
      >
        选择人员
      </div>
      <div
        class="button"
        id="selectDepartment"
      >
        选择部门
      </div>
      <div
        class="button"
        id="selectOrg"
      >
        选择组织角色
      </div>
      <div
        class="button"
        id="selectLocation"
      >
        选择地图定位
      </div>
    </div>
    <div class="block mt10 log">
      <div class="content">
        <div class="base"> ~/mingdao.com/mdye </div>
        这里是动态文字
        <div class="log-list"></div>
      </div>
    </div>
    <div class="block">
      <div class="header">测试API区域 get*4()</div>
      <div class="content env" id="get_msg">get()</div>
    </div>

    <div class="block">
      <div class="header">测试API区域 add*1()</div>
      <div class="content env" id="add_msg">add()</div>
    </div>
  
    <div class="block">
      <div class="header">测试API区域 update*1()</div>
      <div class="content env" id="up_msg">update()</div>
    </div>

    <div class="block">
      <div class="header">测试API区域 delete*1()</div>
      <div class="content env" id="del_msg">delete()</div>
    </div>

  </div>
</div>`;
}

function renderVariables() {
  document.querySelector("#app .variables").innerText = JSON.stringify(
    { appId, worksheetId, viewId },
    null,
    2
  );
}

function renderCount(count) {
  document.querySelector("#app .records-count").innerHTML = `当前视图共 <b>${typeof count !== "undefined" ? count : "?"
    }</b> 条记录`;
}

async function loadRecordsCount() {
  try {
    addLog("正在获取记录数量...");
    const getFilterRowsTotalNum_res = await getFilterRowsTotalNum({/* 2.API 获取工作表行记录数 */
      worksheetId,
      viewId,
      ...filters,
    }).finally(() => {
    });
    console.log("2.getFilterRowsTotalNum_res = ", getFilterRowsTotalNum_res);
    addLog(`当前视图共${getFilterRowsTotalNum_res}条记录`);
    renderCount(getFilterRowsTotalNum_res);
  } catch (err) {
    console.log(err);
  }
}

async function openFirstRecordInfo() {
  const { appId, worksheetId, viewId } = config;
  const res = await getFilterRows({ worksheetId, viewId });
  if (res.data.length === 0) {
    utils.alert("当前视图没有记录", 3);
    return;
  }
  openRecordInfo({
    appId,
    worksheetId,
    recordId: res.data[0].rowid,
    viewId,
    onClose: () => {
      console.log("关闭了");
    },
    updateRows: (...args) => {
      console.log("更新了", args);
    },
  });
}

function renderEnv() {
  document.querySelector("#app .env").innerText =
    Object.keys(env).length > 0 ? JSON.stringify(env, null, 2) : "没有配置";
}

let logs = [
  {
    time: new Date(),
    content: "hello world!",
  },
];

function renderLogs() {
  document.querySelector("#app .log-list").innerHTML = logs
    .map(
      (log, i) =>
        `<div class="log-item" key={i}><span class="time">[${[
          log.time.getHours(),
          log.time.getMinutes(),
          log.time.getSeconds(),
        ]
          .map((num) => String(num).padStart(2, 0))
          .join(":")}]
</span>
${log.content}
  </div>`
    )
    .join("")
    .replace(/\n/g, "");
}

function addLog(content) {
  logs.push({
    time: new Date(),
    content,
  });
  renderLogs();
  document.querySelector("#app .log").scrollTop = 10000;
}

renderMain();
renderEnv();
renderVariables();
renderCount();
loadRecordsCount();
renderLogs();

document.querySelector("#newRecord").onclick = () => {
  addLog("打开新建记录弹窗");
  utils
    .openNewRecord({
      worksheetId,
    })
    .then((row) => {
      addLog("创建成功，新纪录 id 是" + row.rowid);
    });
};

document.querySelector("#openRecordInfo").onclick = () => {
  utils
    .selectRecord({
      relateSheetId: worksheetId,
    })
    .then((records) => {
      utils
        .openRecordInfo({
          appId,
          worksheetId,
          recordId: records[0].rowid,
        })
        .then((updatedRow) => {
          console.log({ updatedRow });
        });
    });
};

document.querySelector("#selectRecord").onclick = () => {
  utils
    .selectRecord({
      relateSheetId: worksheetId,
      multiple: true,
    })
    .then((records) => {
      addLog("已选择记录 " + records.map((r) => r.rowid));
    });
};

document.querySelector("#selectUser").onclick = async () => {
  addLog("打开选择人员弹窗");
  const users = await utils.selectUsers();
  console.log(users);
  addLog("已选择人员 " + users.map((u) => u.fullname));
};
document.querySelector("#selectDepartment").onclick = () => {
  addLog("打开选择部门弹窗");
  utils.selectDepartments().then((departments) => {
    addLog("已选择部门 " + departments.map((d) => d.departmentName));
  });
};
document.querySelector("#selectOrg").onclick = () => {
  addLog("打开选择组织角色弹窗");
  utils.selectOrgRole().then((orgs) => {
    addLog("已选择组织角色 " + orgs.map((o) => o.organizeName));
  });
};
document.querySelector("#selectLocation").onclick = () => {
  addLog("打开选择选择地图定位弹窗");
  utils
    .selectLocation({
      closeAfterSelect: true,
    })
    .then((location) => {
      console.log(location);
      addLog("已选择地图定位 " + (location.name || location.address));
    });
};

window.addEventListener("message", (e) => {
  if (e.data.from !== "widget-container") return;
  if (e.data.action === "filters-update") {
    filters = e.data.value;
    renderCount("?");
    loadRecordsCount();
  }
  if (e.data.action === "new-record") {
    console.log(e.data);
  }
});

/* 自用打印接口返回数据格式 */
/* 自用打印接口返回数据格式 */
/* 自用打印接口返回数据格式 */
/* 自用打印接口返回数据格式 */

function get_log() {

  async function func_getFilterRows() {
    /* 1.API 获取工作表行记录数据 */
    const getFilterRows_res = await getFilterRows({
      worksheetId,
      viewId,
      controls,
      worksheetInfo,
      currentAccount
    })
    if (getFilterRows_res.length === 0) {
      console.log("getFilterRows_res : Error");
    } else {
      console.log("1.getFilterRows_res = ", getFilterRows_res);
      /* 
      {
        "resultCode": 1,
          "isSingleRow": false,
            "data": [
              {
                "_id": "6594fa239d4f3d6c16cdf2a8",
                "wsid": "64a28136c1750a6ef0e6e60d",
                "rowid": "7c73d11c-c3e7-40db-b545-113a5ad11d5a",
                "ctime": "2024-01-03 14:09:39",
                "caid": "[{\"accountId\":\"64bbece3-5596-4ad5-baf4-2708f58fa102\",\"fullname\":\"乐悠扬\",\"avatar\":\"https://p1.mingdaoyun.cn/UserAvatar/7P7TbOdLbScf0naB4s5g8acz6k0Acddg2Y7bflbY4C7Abr1wa93186d16S0m7Jcz.jpg?imageView2/1/w/48/h/48/q/90\",\"status\":1}]",
                "uaid": "[{\"accountId\":\"64bbece3-5596-4ad5-baf4-2708f58fa102\",\"fullname\":\"乐悠扬\",\"avatar\":\"https://p1.mingdaoyun.cn/UserAvatar/7P7TbOdLbScf0naB4s5g8acz6k0Acddg2Y7bflbY4C7Abr1wa93186d16S0m7Jcz.jpg?imageView2/1/w/48/h/48/q/90\",\"status\":1}]",
                "ownerid": "[{\"accountId\":\"64bbece3-5596-4ad5-baf4-2708f58fa102\",\"fullname\":\"乐悠扬\",\"avatar\":\"https://p1.mingdaoyun.cn/UserAvatar/7P7TbOdLbScf0naB4s5g8acz6k0Acddg2Y7bflbY4C7Abr1wa93186d16S0m7Jcz.jpg?imageView2/1/w/48/h/48/q/90\",\"status\":1}]",
                "utime": "2024-01-03 14:56:13",
                "64a28136c1750a6ef0e6e60e": "订单1",
                "656ecef9ea7e74b97207f453": 3,
                "64a281433d4edc73f2a6a94f": "[{\"type\":0,\"sid\":\"a8001699-9c45-4e27-9e10-0e9541718e11\",\"sidext\":\"\",\"accountId\":\"\",\"fullname\":\"\",\"avatar\":\"\",\"name\":\"第一关联记录Nick\",\"ext1\":\"\",\"ext2\":\"\",\"link\":\"/worksheet/64a281173d4edc73f2a6a8bd/row/a8001699-9c45-4e27-9e10-0e9541718e11\",\"projectId\":\"\",\"sourcevalue\":\"{\\\"_id\\\":\\\"658aad5366331d81dbfbae13\\\",\\\"wsid\\\":\\\"64a281173d4edc73f2a6a8bd\\\",\\\"rowid\\\":\\\"a8001699-9c45-4e27-9e10-0e9541718e11\\\",\\\"status\\\":1,\\\"64a281183d4edc73f2a6a8be\\\":\\\"第一关联记录Nick\\\",\\\"64a281183d4edc73f2a6a8bf\\\":\\\"第一关联记录Nick详情\\\",\\\"656d93c07855e7320904d2c5\\\":\\\"2023.00\\\",\\\"discussunreads\\\":false,\\\"autoid\\\":1,\\\"allowedit\\\":false,\\\"allowdelete\\\":false,\\\"controlpermissions\\\":\\\"\\\",\\\"unreads\\\":false}\"}]",
                "discussunreads": false,
                "autoid": 0,
                "6595004fd350581690ad26bd": 1,
                "allowedit": true,
                "allowdelete": true,
                "controlpermissions": "",
                "wfftime": "",
                "rq656ecef9ea7e74b97207f453": 3,
                "rq6595004fd350581690ad26bd": 1,
                "6571663dcc7207685c94cd90": "{\"wsid\":\"64d0ce691515c2c1ae488aa8\",\"reportid\":\"65716632923e1752ad794745\",\"type\":0}",
                "unreads": false
              }
            ],
              "count": 1
      }
       */
    }
    for (let i = 0; i < getFilterRows_res.data.length; i++) {
      // 抛出 rowId
      return getFilterRows_res.data[i].rowid
    }

  }

  async function getRowId() {
    try {
      const rowId = await func_getFilterRows();

      /* 3.API 获取行记录详情 */
      const getRowDetail_res = await getRowDetail({
        appId,
        worksheetId,
        viewId,
        rowId
      })
      console.log("3.getRowDetail_res = ", getRowDetail_res);

      /* 4.API 获取关联记录 */
      const getRowRelationRows_res = await getRowRelationRows({
        controlId: env.subfield[0],
        rowId,
        worksheetId,
      });
      console.log("4.getRowRelationRows_res =", getRowRelationRows_res);


    } catch (error) {
      console.error(error);
    }

  }
  getRowId();
}
document.querySelector("#get_msg").onclick = () => {
  get_log()
}

/* delete_api */
function del_log() {

  async function func_getFilterRows_rowIds() {// func_getFilterRows

    /* API 获取工作表行记录数据 */
    const getFilterRows_res = await getFilterRows({// 获取工作表行记录数据的传入参数
      worksheetId,
      viewId,
      controls,
      worksheetInfo,
      currentAccount
    })
    if (getFilterRows_res.length === 0) {
      console.log("getFilterRows_res : Error2");
    } else { // 抛出 rowIds    
      let rowIdsList = []
      for (let i = 0; i < getFilterRows_res.data.length; i++) {
        rowIdsList.push(getFilterRows_res.data[i].rowid)
      }
      return rowIdsList
    }

  }

  async function getRowIds() {// get rowId
    try {
      const rowIds = await func_getFilterRows_rowIds();
      /* API 删除全部行记录 */
      const deleteWorksheetRow_res = await deleteWorksheetRow({
        worksheetId,
        rowIds,
        currentAccount
      }
      );
      console.log("7.deleteWorksheetRow_res = ", deleteWorksheetRow_res);
    } catch (error) {
      console.error(error);
    }

  }
  getRowIds();

}
document.querySelector("#del_msg").onclick = () => {
  del_log()
}
