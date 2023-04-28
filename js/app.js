
// 转为二维数组
function btnStartToArr() {
    let d = excelToData();

    let arr = dataToArr(d.datas, d.keyCount);
    document.getElementById("EditboxJsonData").value = JSON.stringify(arr);
}

// 转为json数据
function btnStartToJson() {
    let d = excelToData();

    let arr = dataToArr(d.datas, d.keyCount);
    let jsonArr = dataToJson(arr);
    document.getElementById("EditboxJsonData").value = JSON.stringify(jsonArr);
}

function btnStartToObject() {
    let d = excelToData();

    let arr = dataToArr(d.datas, d.keyCount);
    let jsonArr = dataToJson(arr);

    let keyName = document.getElementById("EditBoxKeyName").value;
    if (keyName.length == 0) {
        keyName = Object.keys(jsonArr[0])[0];
    }
    console.log(keyName);

    let isRemoveKey = document.getElementById("ChecBoxIsRemoveKey").checked;

    let object = {};
    for (let json of jsonArr) {
        object[json[keyName]] = json;
        if (isRemoveKey) {
            delete object[json[keyName]][keyName];
        }
    }

    console.log(object);

    document.getElementById("EditboxJsonData").value = JSON.stringify(object);
}

// 复制数据
function btnCopyData() {
    copyText(document.getElementById("EditboxJsonData").value);
}

// 导出数据为文件
function btnDownData() {
    downFlie("json-" + (new Date().getTime()), document.getElementById("EditboxJsonData").value);
}

// excel数据处理
function excelToData() {

    let editboxExcelData = document.getElementById("EditboxExcelData");
    // 获取excel数据
    let excelData = editboxExcelData.value;
    console.log(excelData);

    // 键计数 默认1 遍历若是制表符+1 若是换行符结束遍历
    let keyCount = 1;
    for (let str of excelData) {
        if (str == "\t") {
            keyCount++;
        }
        if (str == "\n") {
            break;
        }
    }
    console.log(keyCount);

    let newData = excelData.replace(/\t/g, ",");
    newData = newData.replace(/\n/g, ",");
    console.log(newData);

    let datas = newData.split(",");
    // 这里是因为在excel表格中全选数据复制会多复制一个制表符 所以做了判断是否多了并移除
    if (datas[datas.length - 1].length == 0) {
        datas.pop();
    }
    console.log(datas);

    return { datas: datas, keyCount: keyCount };
}

function dataToArr(datas, keyCount) {
    // 转成二位数组
    let dataArr = [];

    // 添加计数
    let c = 0;
    for (let data of datas) {
        // 为0 添加新的数组
        if (c == 0) {
            dataArr.push([]);
        }
        // 向最后一个数组添加数据
        dataArr[dataArr.length - 1].push(data);
        c++;
        // 计数为keyCount长度归零 重新计数
        if (c == keyCount) {
            c = 0;
        }
    }

    console.log(dataArr);

    return dataArr;
}

function dataToJson(arr) {

    // 转成json数据
    let dataJson = [];

    // key名称列表
    let keyNames = arr[0];
    // key数量
    let keyCount = keyNames.length;
    console.log(keyNames);

    // 0是key名称列表 所有从1开始遍历arr
    for (let i = 1; i < arr.length; i++) {
        let json = {};

        // 新的数据对象
        for (let j = 0; j < keyNames.length; j++) {
            json[keyNames[j]] = arr[i][j];
        }

        dataJson.push(json);
    }

    console.log(dataJson);
    return dataJson;
}

// 下载文件
function downFlie(name, data) {
    // 创建a标签
    var a = document.createElement('a');

    //文件的名称为时间戳加文件名后缀
    a.download = name + ".json";
    a.style.display = 'none';

    //生成一个blob二进制数据，内容为json数据
    var blob = new Blob([data]);

    //生成一个指向blob的URL地址，并赋值给a标签的href属性
    a.href = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 复制数据
function copyText(text) {
    let tag = document.createElement('input');
    tag.setAttribute('id', 'cp_hgz_input');
    tag.value = text;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById('cp_hgz_input').select();
    document.execCommand('copy');
    document.getElementById('cp_hgz_input').remove();
}
