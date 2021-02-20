// ==UserScript==
// @name     ZF Captcha Recognition
// @include  http://jwgl.uoh.edu.cn/
// @include  http://jwgl.uoh.edu.cn/default2.aspx
// @include  http://10.10.10.71/default2.aspx
// @require  https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @version  1
// @grant    none
// ==/UserScript==

var student_num = ''  // 学号
var password = ''  // 登录密码
var auto_login = true  // 是否自动登录
var role = 'student';  // 角色选择，值：student/teacher

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function img2Tensor(imgData) {
    let tensor = tf.browser.fromPixels(imgData, numChannels=1);
    //resize to 12 x 23
    //const resized = tf.image.resizeBilinear(tensor, [12, 23]).toFloat();
    // Normalize the image
    const offset = tf.scalar(255.0);
    //const normalized = tf.scalar(1.0).sub(tensor.div(offset));
    const normalized = tensor.div(offset);
    return tensor.reshape([12, 23, 1]);
}

function getImages() {
    var canvas = document.createElement("canvas");
    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    var img = document.getElementById("icode");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    // 分割图像
    var sw = [5, 17, 28, 41];
    var imgs = [];
    for (var i = 0; i < sw.length; i++) {
        var d = ctx.getImageData(sw[i], 0, 12, 23);
        imgs.push(img2Tensor(d));
    }

    // 合并到一个张量中
    return tf.stack([imgs[0], imgs[1], imgs[2], imgs[3]]);
}

async function detect() {
    tf.enableProdMode();
    var labels = "012345678abcdefghijklmnpqrstuvwxy";
    var model = await tf.loadLayersModel('http://localhost/model.json');
    var data = getImages();
    console.log("data = " + data);
    var idx = await model.predict(data).argMax([-1]).dataSync();
    var code = "";
    for (var i = 0; i < idx.length; i++) {
        code += labels[idx[i]];
    }

    return code;
}

async function verify() {
    if (student_num == '' || password == '') { alert("请将配置填写完整！\n请将配置填写完整！\n请将配置填写完整！"); }
    $("#txtUserName").val(student_num);
    $("#TextBox2").val(password);
    txtSecretCode.value = "识别...";

    if (role == 'teacher') {
        $("#RadioButtonList1_1").attr("checked", "checked");
    } else {
        $("#RadioButtonList1_2").attr("checked", "checked");
    }

    $("#txtSecretCode").val(await detect());
    if (auto_login) { $("#Button1").click(); }
}

$(function() {
	verify();
});