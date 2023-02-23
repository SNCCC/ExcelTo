
let isDebug = true;

if (!isDebug) {
    setInterval(() => { debugger }, 100);
}

function setToAndCopyData() {
    setExcelToJson();
    copyJsonData();
}

function setToAndDownData() {
    setExcelToJson();
    downJsonData();
}

function copyJsonData() {
    let data = document.getElementById("EditboxJsonData").value;
    copyText(data);
}

function downJsonData() {
    let data = document.getElementById("EditboxJsonData").value;
    downFlie("json" + (new Date().getTime()), data);
}

function setExcelToJson() {
    let data = document.getElementById("EditboxExcelData").value;
    if (data.length == 0) {
        log("data");
        return;
    }
    let newData = getExcelToJson(data);
    document.getElementById("EditboxJsonData").value = newData;
}

function getExcelToJson(excelData) {

    let str = excelData;
    log(str);

    let f = ",{a" + Math.floor(Math.random() * 10000000) + "/*z},";
    let d = "{d" + Math.floor(Math.random() * 10000000) + "e/r}";
    log(f);

    log("开始转换");
    str = str.replace(/,/g, d);

    str = str.replace(/\n/g, f);
    str = str.replace(/\s+/g, ",");

    let strs = str.split(",");

    // 移除空字符串元素
    for (let i = 0; i < strs.length; i++) {
        if (strs[i].length == 0) {
            strs.splice(i, 1);
        }
    }

    log(strs);

    let index = -1;
    let ft = f.replace(/,/g, "");
    for (let i = 0; i < strs.length; i++) {
        let t = strs[i];
        if (t == ft) {
            if (index == -1) {
                index = i;
            }
            i = strs.length;
        }
    }
    log("ft: " + index);

    if (index == -1) {
        alert("数据转换错误");
        log("数据转换错误");
        return undefined;
    }

    let keys = [];
    for (let i = 0; i < index; i++) {
        keys.push(strs[i]);
    }
    log(keys);

    for (let i = 0; i < strs.length; i++) {
        if (strs[i] == ft) {
            strs.splice(i, 1);
        }
    }

    log("strs: ", strs);

    log("strsLeng:" + strs.length, "keysLeng:" + keys.length);
    let line = Math.floor((strs.length / keys.length) - 1);
    log("line: " + line);

    let datas = [];
    let count = keys.length;
    for (let i = 0; i < line; i++) {
        datas.push([]);
        for (let j = count; j < keys.length + count; j++) {
            let value = strs[j];
            if (isNaN(Number(value))) {
                value = value.replace(RegExp(d, "g"), ",");
            }
            datas[datas.length - 1].push(value);
        }
        count += keys.length;
    }

    log(datas);

    let files = [];
    for (let i = 0; i < datas.length; i++) {
        files.push({});
        for (let j = 0; j < keys.length; j++) {
            let value = datas[i][j];
            // 是否输出全字符串
            if (document.getElementById("CheckboxToAllStr").checked) {
                files[files.length - 1][keys[j]] = value;
            } else {
                if (isNaN(Number(value))) {
                    files[files.length - 1][keys[j]] = value;
                } else {
                    files[files.length - 1][keys[j]] = Number(value);
                }
            }
        }
    }

    log(files);

    let fileData = JSON.stringify(files);
    return fileData;
}

function downFlie(name, data) {
    // 创建a标签
    var elementA = document.createElement('a');

    //文件的名称为时间戳加文件名后缀
    elementA.download = name + ".json";
    elementA.style.display = 'none';

    //生成一个blob二进制数据，内容为json数据
    var blob = new Blob([data]);

    //生成一个指向blob的URL地址，并赋值给a标签的href属性
    elementA.href = URL.createObjectURL(blob);
    document.body.appendChild(elementA);
    elementA.click();
    document.body.removeChild(elementA);
}

function copyText(text) {
    let tag = document.createElement('input');
    tag.setAttribute('id', 'cp_hgz_input');
    tag.value = text;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById('cp_hgz_input').select();
    document.execCommand('copy');
    document.getElementById('cp_hgz_input').remove();
}

function log(...message) {
    if (isDebug) {
        console.log(...message);
    }
}
