## 基于 CNN 的红河学院正方教务系统验证码识别的 Tampermonkey 运用
### 使用说明
1. 在 Python 环境下运行基于 Flask 搭建的微型服务器（app.py），
   目的为脚本提供训练参数支持（也可自行搭建服务器）
2. 将 /script/ZF_Captcha_Recognition.js 导入 Tampermonkey 中，
   注意修改登录参数
   
> 代码及模型参数来自: [https://github.com/yswift/ZF_Verify](https://github.com/yswift/ZF_Verify)